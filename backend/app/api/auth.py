from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, verify_privy_token
from app.db.database import get_db
from app.db.models import User


router = APIRouter(prefix="/auth", tags=["auth"])


class VerifyRequest(BaseModel):
    token: str
    wallet_address: str


class UserResponse(BaseModel):
    id: str
    wallet_pubkey: str
    privy_did: str | None = None
    free_tries_left: int
    credits: int


def user_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        wallet_pubkey=user.wallet_pubkey,
        privy_did=user.privy_did,
        free_tries_left=user.free_tries_left,
        credits=user.credits,
    )


@router.post("/verify", response_model=UserResponse)
async def verify_and_register(request: VerifyRequest, db: AsyncSession = Depends(get_db)):
    claims = await verify_privy_token(request.token)
    privy_did = claims.get("sub")
    wallet = request.wallet_address.strip()

    if not privy_did:
        raise HTTPException(status_code=400, detail="Token missing subject claim")
    if not wallet:
        raise HTTPException(status_code=400, detail="wallet_address is required")

    result = await db.execute(select(User).where(User.privy_did == privy_did))
    user = result.scalar_one_or_none()

    if not user:
        result = await db.execute(select(User).where(User.wallet_pubkey == wallet))
        user = result.scalar_one_or_none()
        if user and not user.privy_did:
            user.privy_did = privy_did

    if not user:
        user = User(wallet_pubkey=wallet, privy_did=privy_did)
        db.add(user)

    await db.commit()
    await db.refresh(user)
    return user_response(user)


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return user_response(current_user)

