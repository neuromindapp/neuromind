from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import get_current_user
from app.db.database import get_db
from app.db.models import Market, Payment, QuotaUsage, Report, User
from app.services.quota import holder_balance, holder_daily_available, is_holder_10k
from app.services.sample_data import FULL_REPORTS


router = APIRouter(prefix="/account", tags=["account"])


@router.get("")
async def account(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    holder = await is_holder_10k(user.wallet_pubkey)
    balance = await holder_balance(user.wallet_pubkey)
    payments = (
        await db.execute(
            select(Payment).where(Payment.wallet == user.wallet_pubkey).order_by(Payment.confirmed_at.desc().nullslast()).limit(8)
        )
    ).scalars().all()
    usage = (
        await db.execute(
            select(QuotaUsage).where(QuotaUsage.wallet == user.wallet_pubkey).order_by(QuotaUsage.used_at.desc()).limit(8)
        )
    ).scalars().all()
    report_ids = [item.report_id for item in usage if item.report_id]
    db_reports = {}
    if report_ids:
        rows = (
            await db.execute(select(Report, Market).join(Market).where(Report.id.in_(report_ids)))
        ).all()
        db_reports = {
            str(report.id): {
                "question": market.question,
                "category": market.category,
                "edge_pts": report.edge_pts,
            }
            for report, market in rows
        }

    return {
        "wallet": user.wallet_pubkey,
        "free_tries_left": user.free_tries_left,
        "credits": user.credits,
        "holder": {
            "is_holder_10k": holder,
            "daily_available": holder and holder_daily_available(user),
            "daily_used": bool(user.holder_daily_used_at and not holder_daily_available(user)),
            "reset_at": datetime.now(timezone.utc).date().isoformat() + "T00:00:00Z",
            "balance": balance,
            "threshold": 10000,
        },
        "credit_packs": [
            {"credits": 3, "sol_amount": 0.075, "label": "Starter"},
            {"credits": 10, "sol_amount": 0.25, "label": "Research desk"},
            {"credits": 25, "sol_amount": 0.625, "label": "Lab"},
        ],
        "payments": [
            {
                "memo": payment.memo,
                "sol_amount": payment.sol_amount,
                "credits_granted": payment.credits_granted,
                "confirmed_at": payment.confirmed_at.isoformat() if payment.confirmed_at else None,
            }
            for payment in payments
        ],
        "usage": [
            {
                "source": item.source,
                "used_at": item.used_at.isoformat(),
                "report_id": str(item.report_id) if item.report_id else None,
                "report_path": f"/report/{item.report_id}" if item.report_id else None,
                "question": _usage_question(item, db_reports),
                "category": _usage_category(item, db_reports),
                "edge_pts": _usage_edge(item, db_reports),
            }
            for item in usage
        ],
    }


def _usage_report(item: QuotaUsage, db_reports: dict) -> dict:
    report_id = str(item.report_id) if item.report_id else ""
    return db_reports.get(report_id) or FULL_REPORTS.get(report_id) or {}


def _usage_question(item: QuotaUsage, db_reports: dict) -> str:
    return str(_usage_report(item, db_reports).get("question") or "Unlocked NeuroMind report")


def _usage_category(item: QuotaUsage, db_reports: dict) -> str:
    return str(_usage_report(item, db_reports).get("category") or "market")


def _usage_edge(item: QuotaUsage, db_reports: dict) -> int | None:
    value = _usage_report(item, db_reports).get("edge_pts")
    return int(value) if value is not None else None
