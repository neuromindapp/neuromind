import uuid
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.security import get_current_user
from app.db.database import get_db
from app.db.models import Payment, User


router = APIRouter(prefix="/payments", tags=["payments"])


class PaymentIntentRequest(BaseModel):
    credits: int


@router.post("/intent")
async def create_payment_intent(
    request: PaymentIntentRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    credits = max(1, min(request.credits, 100))
    memo = f"NEUROMIND-{uuid.uuid4().hex[:12].upper()}"
    sol_amount = round(credits * 0.025, 4)
    payment = Payment(wallet=user.wallet_pubkey, sol_amount=sol_amount, credits_granted=credits, memo=memo)
    db.add(payment)
    await db.commit()
    return {
        "treasury_wallet": settings.treasury_wallet,
        "memo": memo,
        "sol_amount": sol_amount,
        "credits": credits,
    }


@router.post("/webhooks/helius")
async def helius_webhook(payload: dict):
    return {"ok": True, "received": bool(payload)}

