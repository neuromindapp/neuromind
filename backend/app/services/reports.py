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
        "resolution_risk",
        "volume",
        "last_scanned_at",
        "polymarket_url",
        "preview",
        "direction",
        "yes_label",
        "no_label",
    ]
    return {key: report.get(key) for key in keys if key in report}


def _market_summary(market: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": market["slug"],
        "market_id": market["id"],
        "question": market["question"],
        "category": market["category"],
        "market_probability": market["market_probability"],
        "research_probability": market["market_probability"],
        "edge_pts": 0,
        "confidence": "pending",
        "resolution_risk": 5,
        "volume": market["volume"],
        "last_scanned_at": datetime.now(timezone.utc).isoformat(),
        "polymarket_url": market["polymarket_url"],
        "preview": "Unlock this market to run a fresh NeuroMind analysis.",
        "direction": "YES",
        "yes_label": "Yes",
        "no_label": "No",
    }


def _prompt(market: dict[str, Any]) -> str:
    context = _market_context(market)
    return f"""
Return strict JSON for a NeuroMind Polymarket report.

You are evaluating a prediction market as a research analyst, not writing marketing copy.
Use the market stats packet below as hard context. Treat missing/null fields as unknown, not as zero evidence.

Market stats packet:
{json.dumps(context, indent=2)}

Analysis requirements:
- Estimate the probability of the YES outcome only.
- Compare your probability against the live YES market probability.
- Use base rates, incentives, current odds, liquidity/volume, time to resolution, and market rules.
- Mention what evidence would change the estimate.
- Separate probability risk from resolution/wording risk.
- Do not claim certainty. If data is weak, lower confidence.
- Keep reasoning concise but concrete; avoid generic "could go either way" language.

JSON shape:
{{
  "research_probability": number between 0.01 and 0.99,
  "confidence": "high" | "medium" | "low",
  "resolution_risk": integer 1-10,
  "resolution_risk_notes": string explaining the exact wording/settlement risk,
  "reasoning": string with 4 short labeled sections: Estimate, Market gap, Key drivers, What could break it,
  "sources": [{{"title": string, "url": string}}]
}}
"""


def _normalize_ai(ai: dict[str, Any], market: dict[str, Any]) -> dict[str, Any]:
    market_prob = _safe_probability(market["market_probability"], 0.5)
    research = _safe_probability(ai.get("research_probability"), market_prob)
    confidence = str(ai.get("confidence") or "medium").lower()
    if confidence not in {"high", "medium", "low"}:
        confidence = "medium"
    return {
        "research_probability": research,
        "market_probability": market_prob,
        "edge_pts": round(abs(research - market_prob) * 100),
        "confidence": confidence,
        "resolution_risk": _safe_int(ai.get("resolution_risk"), 5, 1, 10),
        "resolution_risk_notes": str(ai.get("resolution_risk_notes") or "Review the market wording before acting."),
        "reasoning": str(ai.get("reasoning") or "NeuroMind generated a report for this market, but the reasoning was brief."),
        "sources": _sources(ai.get("sources"), market),
    }


def _market_context(market: dict[str, Any]) -> dict[str, Any]:
    market_probability = _safe_probability(market["market_probability"], 0.5)
    no_probability = _safe_probability(market.get("no_probability"), 1 - market_probability)
    best_bid = market.get("best_bid")
    best_ask = market.get("best_ask")
    spread = None
    if isinstance(best_bid, (int, float)) and isinstance(best_ask, (int, float)):
        spread = round(max(0, best_ask - best_bid), 4)

    return {
        "question": market["question"],
        "category": market["category"],
        "url": market["polymarket_url"],
        "outcomes": market.get("outcomes", ["Yes", "No"]),
        "yes_market_probability": round(market_probability, 4),
        "no_market_probability": round(no_probability, 4),
        "yes_price_cents": round(market_probability * 100, 2),
        "no_price_cents": round(no_probability * 100, 2),
        "best_bid": best_bid,
        "best_ask": best_ask,
        "bid_ask_spread": spread,
        "last_trade_price": market.get("last_trade_price"),
        "one_day_price_change": market.get("one_day_price_change"),
        "one_week_price_change": market.get("one_week_price_change"),
        "volume_total_usd": round(_safe_float(market.get("volume"), 0), 2),
        "volume_24h_usd": round(_safe_float(market.get("volume_24h"), 0), 2),
        "volume_1w_usd": round(_safe_float(market.get("volume_1w"), 0), 2),
        "liquidity_usd": round(_safe_float(market.get("liquidity"), 0), 2),
        "resolves_at": market.get("resolves_at"),
        "days_to_resolution": _days_to_resolution(market.get("resolves_at")),
        "market_depth_signal": _depth_signal(_safe_float(market.get("volume"), 0), _safe_float(market.get("liquidity"), 0)),
        "rules": market.get("rules") or "No detailed rules were returned by the market API.",
    }


def _days_to_resolution(value: str | None) -> int | None:
    parsed = _parse_dt(value)
    if not parsed:
        return None
    delta = parsed - datetime.now(timezone.utc)
    return max(0, delta.days)


def _depth_signal(volume: float, liquidity: float) -> str:
    if volume >= 1_000_000 and liquidity >= 100_000:
        return "high-volume liquid market; require stronger evidence for a large edge"
    if volume >= 100_000:
        return "moderate market depth; price may still be researchable"
    if volume > 0:
        return "thin market; odds may be noisy and easier to move"
    return "unknown or unavailable market depth"


def _sources(value: Any, market: dict[str, Any]) -> list[dict[str, str]]:
    sources = value if isinstance(value, list) else []
    cleaned = [s for s in sources if isinstance(s, dict) and s.get("url") and s.get("title")]
    if not cleaned:
        cleaned = [{"title": "Polymarket market", "url": market["polymarket_url"]}]
    return cleaned[:8]


def _key_drivers(reasoning: str) -> list[str]:
    sentences = [part.strip() for part in reasoning.replace("\n", " ").split(".") if part.strip()]
    return [f"{sentence}." for sentence in sentences[:3]] or ["NeuroMind produced a probability estimate for this market."]


def _parse_dt(value: str | None):
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)
    except ValueError:
        return None


def _clamp(value: float) -> float:
    return max(0.01, min(0.99, value))


def _safe_probability(value: Any, default: float) -> float:
    parsed = _safe_float(value, default)
    if parsed > 1:
        parsed = parsed / 100
    return _clamp(parsed)


def _safe_float(value: Any, default: float) -> float:
    try:
        if isinstance(value, str):
            value = value.strip().rstrip("%")
        return float(value)
