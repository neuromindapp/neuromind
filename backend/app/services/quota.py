from datetime import datetime, timezone
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.db.models import QuotaUsage, User


def holder_daily_available(user: User) -> bool:
    if not user.holder_daily_used_at:
        return True
    last = user.holder_daily_used_at.astimezone(timezone.utc).date()
    return last != datetime.now(timezone.utc).date()


async def holder_balance(wallet: str) -> float:
    if not settings.helius_rpc_url or not settings.neuromind_token_mint:
        return 0
    payload = {
        "jsonrpc": "2.0",
        "id": "neuromind-holder-check",
        "method": "getTokenAccountsByOwner",
        "params": [
            wallet,
            {"mint": settings.neuromind_token_mint},
            {"encoding": "jsonParsed"},
        ],
    }
    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(settings.helius_rpc_url, json=payload)
        response.raise_for_status()
    accounts = response.json().get("result", {}).get("value", [])
    total = 0.0
    for account in accounts:
        amount = account.get("account", {}).get("data", {}).get("parsed", {}).get("info", {}).get("tokenAmount", {})
        total += float(amount.get("uiAmount") or 0)
    return total


async def is_holder_10k(wallet: str) -> bool:
    return await holder_balance(wallet) >= 10000


async def available_quota_source(user: User) -> str | None:
    if await is_holder_10k(user.wallet_pubkey) and holder_daily_available(user):
        return "holder_daily"
    if user.free_tries_left > 0:
        return "free_trial"
    if user.credits > 0:
        return "paid"
    return None


async def consume_quota(db: AsyncSession, user: User, report_id=None) -> str | None:
    if await is_holder_10k(user.wallet_pubkey) and holder_daily_available(user):
        user.holder_daily_used_at = datetime.now(timezone.utc)
        source = "holder_daily"
    elif user.free_tries_left > 0:
        user.free_tries_left -= 1
        source = "free_trial"
    elif user.credits > 0:
        user.credits -= 1
        source = "paid"
    else:
        return None

    db.add(QuotaUsage(wallet=user.wallet_pubkey, report_id=report_id, source=source))
    await db.commit()
    await db.refresh(user)
    return source
