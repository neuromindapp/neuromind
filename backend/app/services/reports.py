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
    market_data = await find_market(market_query)
    ai = await generate_deep_dive(_prompt(market_data))
    report_data = _normalize_ai(ai, market_data)

    market = await db.get(Market, market_data["id"])
    if not market:
        market = Market(
            polymarket_id=market_data["id"],
            question=market_data["question"],
            rules=market_data["rules"],
            odds={"yes": market_data["market_probability"]},
            volume=market_data["volume"],
            ends_at=_parse_dt(market_data["resolves_at"]),
            category=market_data["category"],
            status="active",
        )
        db.add(market)

    report = Report(
        market_id=market.polymarket_id,
        research_prob=report_data["research_probability"],
        market_prob=report_data["market_probability"],
        edge_pts=report_data["edge_pts"],
        confidence=report_data["confidence"],
        resolution_risk=report_data["resolution_risk"],
        resolution_risk_notes=report_data["resolution_risk_notes"],
        reasoning=report_data["reasoning"],
        sources=report_data["sources"],
        model="NeuroMind research engine",
        polymarket_url=market_data["polymarket_url"],
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return serialize_report(report, market)


def serialize_report(report: Report, market: Market) -> dict[str, Any]:
    return {
        "id": str(report.id),
        "market_id": market.polymarket_id,
        "question": market.question,
        "category": market.category,
        "market_probability": report.market_prob,
        "research_probability": report.research_prob,
        "edge_pts": report.edge_pts,
        "confidence": report.confidence,
        "resolution_risk": report.resolution_risk,
        "volume": market.volume,
        "resolves_at": market.ends_at.isoformat() if market.ends_at else None,
        "last_scanned_at": report.created_at.isoformat(),
        "polymarket_url": report.polymarket_url,
        "preview": report.reasoning[:180],
        "reasoning": report.reasoning,
        "key_drivers": _key_drivers(report.reasoning),
        "resolution_risk_notes": report.resolution_risk_notes,
        "sources": report.sources,
        "model": report.model,
        "created_at": report.created_at.isoformat(),
        "direction": "YES" if report.research_prob >= report.market_prob else "NO",
        "yes_label": "Yes",
        "no_label": "No",
        "odds_moved_toward_research_pts": 0,
        "history": [{"t": "created", "market": report.market_prob, "research": report.research_prob}],
    }


def locked_summary(report: dict[str, Any]) -> dict[str, Any]:
    keys = [
        "id",
        "market_id",
        "question",
        "category",
        "market_probability",
        "research_probability",
        "edge_pts",
        "confidence",
