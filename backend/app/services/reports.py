import json
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Market, QuotaUsage, Report, User
from app.services.ai import generate_deep_dive
from app.services.polymarket import find_market
from app.services.sample_data import FULL_REPORTS


async def user_has_report(db: AsyncSession, user: User | None, report_id: str) -> bool:
    if not user:
        return False
    parsed = _uuid_or_none(report_id)
    if not parsed:
        return False
    result = await db.execute(select(QuotaUsage).where(QuotaUsage.wallet == user.wallet_pubkey, QuotaUsage.report_id == parsed))
    return result.scalar_one_or_none() is not None


async def get_unlocked_market_report(db: AsyncSession, user: User | None, market_query: str) -> dict[str, Any] | None:
    if not user:
        return None
    market = await find_market(market_query)
    result = await db.execute(
        select(Report, Market)
        .join(Market)
        .join(QuotaUsage, QuotaUsage.report_id == Report.id)
        .where(QuotaUsage.wallet == user.wallet_pubkey, Report.market_id == market["id"])
        .order_by(desc(QuotaUsage.used_at))
        .limit(1)
    )
    row = result.first()
    if not row:
        return None
    report, db_market = row
    return serialize_report(report, db_market)


async def get_any_report(db: AsyncSession, report_id: str) -> dict[str, Any] | None:
    if report_id in FULL_REPORTS:
        return FULL_REPORTS[report_id]
    parsed = _uuid_or_none(report_id)
    if not parsed:
        market = await find_market(report_id)
        return _market_summary(market)
    result = await db.execute(select(Report, Market).join(Market).where(Report.id == parsed))
    row = result.first()
    if not row:
        return None
    report, market = row
    return serialize_report(report, market)


async def create_ai_report(db: AsyncSession, market_query: str) -> dict[str, Any]:
