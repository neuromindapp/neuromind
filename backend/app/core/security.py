import logging
import time
from typing import Optional
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwk, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.db.database import get_db
from app.db.models import User


logger = logging.getLogger("neuromind.security")
bearer_scheme = HTTPBearer(auto_error=False)
_jwks_cache: dict = {}
_jwks_fetched_at = 0.0
_JWKS_TTL = 3600


async def _get_privy_jwks() -> dict:
    global _jwks_cache, _jwks_fetched_at

    if not settings.privy_app_id:
        raise HTTPException(status_code=503, detail="PRIVY_APP_ID is not configured")

    if _jwks_cache and (time.time() - _jwks_fetched_at) < _JWKS_TTL:
        return _jwks_cache

    url = f"https://auth.privy.io/api/v1/apps/{settings.privy_app_id}/jwks.json"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, timeout=10)
        resp.raise_for_status()
        _jwks_cache = resp.json()
        _jwks_fetched_at = time.time()
        logger.info("Fetched Privy JWKS from %s", url)
        return _jwks_cache


def _get_signing_key(jwks: dict, token: str) -> str:
    headers = jwt.get_unverified_headers(token)
    kid = headers.get("kid")

    for key_data in jwks.get("keys", []):
        if key_data.get("kid") == kid:
            return jwk.construct(key_data, algorithm="ES256").to_pem().decode("utf-8")

    if jwks.get("keys"):
        return jwk.construct(jwks["keys"][0], algorithm="ES256").to_pem().decode("utf-8")

    raise ValueError("No signing keys found in Privy JWKS")


async def verify_privy_token(token: str) -> dict:
    try:
        jwks = await _get_privy_jwks()
        signing_key = _get_signing_key(jwks, token)
        return jwt.decode(
            token,
            signing_key,
            algorithms=["ES256"],
            audience=settings.privy_app_id,
            issuer="privy.io",
        )
    except JWTError as exc:
        raise HTTPException(status_code=401, detail=f"Invalid Privy token: {exc}") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail=f"Could not reach Privy: {exc}") from exc


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing")

    claims = await verify_privy_token(credentials.credentials)
    privy_did = claims.get("sub")
    if not privy_did:
        raise HTTPException(status_code=401, detail="Token missing subject claim")

    result = await db.execute(select(User).where(User.privy_did == privy_did))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not registered")
    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User | None:
    if not credentials:
        return None

    try:
        claims = await verify_privy_token(credentials.credentials)
        privy_did = claims.get("sub")
        if not privy_did:
            return None
        result = await db.execute(select(User).where(User.privy_did == privy_did))
        return result.scalar_one_or_none()
    except Exception:
        return None

