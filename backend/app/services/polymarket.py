import re
import json
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

from app.core.config import settings


def extract_slug(value: str) -> str:
    text = value.strip()
    if "polymarket.com" not in text:
        return text
    match = re.search(r"/(?:event|market)/([^/?#]+)", text)
    return match.group(1) if match else text.rstrip("/").split("/")[-1]


async def find_market(value: str) -> dict[str, Any]:
    query = extract_slug(value)
    async with httpx.AsyncClient(timeout=20) as client:
        by_slug = await _gamma(client, {"slug": query, "limit": 1, "active": "true"})
        markets = _as_list(by_slug)
        if not markets:
            searched = await _gamma(client, {"search": query, "limit": 1, "active": "true"})
            markets = _as_list(searched)
    return normalize_market(markets[0] if markets else _fallback_market(query))


async def live_edges(limit: int = 20) -> list[dict[str, Any]]:
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            payload = await _gamma(
                client,
                {"active": "true", "closed": "false", "limit": 100},
            )
        rows = [row for row in _as_list(payload) if _usable_market(row)]
        normalized = [normalize_market(row) for row in rows]
        normalized.sort(key=lambda row: row["volume"], reverse=True)
        return normalized[:limit]
    except Exception:
        return []


async def _gamma(client: httpx.AsyncClient, params: dict[str, Any]) -> Any:
    response = await client.get(f"{settings.polymarket_gamma_url}/markets", params=params)
    response.raise_for_status()
    return response.json()


def _as_list(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if isinstance(payload, dict):
        for key in ("markets", "data", "results"):
            value = payload.get(key)
            if isinstance(value, list):
                return [item for item in value if isinstance(item, dict)]
    return []


def normalize_market(row: dict[str, Any]) -> dict[str, Any]:
    question = str(row.get("question") or row.get("title") or row.get("name") or "Polymarket market")
    slug = str(row.get("slug") or row.get("id") or re.sub(r"[^a-z0-9]+", "-", question.lower()).strip("-"))
    volume = _float_or_none(row.get("volumeNum") or row.get("volume") or row.get("liquidityNum")) or 0
    probability = _probability(row)
    ends_at = row.get("endDate") or row.get("end_date") or row.get("endDateIso")
    outcomes = [str(item) for item in _json_list(row.get("outcomes"))]
    outcome_prices = [_float_or_none(item) for item in _json_list(row.get("outcomePrices"))]
    yes_price = outcome_prices[0] if outcome_prices and outcome_prices[0] is not None else probability
    no_price = outcome_prices[1] if len(outcome_prices) > 1 and outcome_prices[1] is not None else 1 - yes_price
    return {
        "id": str(row.get("id") or slug),
        "slug": slug,
        "question": question,
        "category": str(row.get("category") or row.get("groupItemTitle") or "market").lower(),
        "market_probability": yes_price,
        "no_probability": max(0.01, min(0.99, no_price)),
        "volume": volume,
        "liquidity": _float_or_none(row.get("liquidityNum") or row.get("liquidity")) or 0,
        "volume_24h": _float_or_none(row.get("volume24hr") or row.get("volume24hrClob")) or 0,
        "volume_1w": _float_or_none(row.get("volume1wk") or row.get("volume1wkClob")) or 0,
        "best_bid": _float_or_none(row.get("bestBid")),
        "best_ask": _float_or_none(row.get("bestAsk")),
        "last_trade_price": _float_or_none(row.get("lastTradePrice")),
        "one_day_price_change": _float_or_none(row.get("oneDayPriceChange")),
        "one_week_price_change": _float_or_none(row.get("oneWeekPriceChange")),
        "outcomes": outcomes or ["Yes", "No"],
        "resolves_at": ends_at or (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
        "polymarket_url": f"https://polymarket.com/event/{slug}",
        "rules": str(row.get("description") or row.get("resolutionSource") or ""),
    }


def _probability(row: dict[str, Any]) -> float:
    value = row.get("lastTradePrice") or row.get("bestAsk") or row.get("bestBid")
    if value is not None:
        try:
            return max(0.01, min(0.99, float(value)))
        except ValueError:
            pass
    outcomes = _json_list(row.get("outcomePrices")) or _json_list(row.get("outcomes"))
    if outcomes:
        try:
            return max(0.01, min(0.99, float(outcomes[0])))
        except (TypeError, ValueError):
            pass
    return 0.5


def _json_list(value: Any) -> list[Any]:
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            return []
    return []


def _float_or_none(value: Any) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _usable_market(row: dict[str, Any]) -> bool:
    if (_float_or_none(row.get("volumeNum") or row.get("volume")) or 0) < 10_000:
        return False
    text = " ".join(
        str(row.get(key) or "")
        for key in ("question", "category", "groupItemTitle", "slug")
    ).lower()
    sports_terms = (
        " vs ",
        " v. ",
        "fifa",
        "nba",
        "nfl",
        "mlb",
        "nhl",
        "ucl",
        "soccer",
        "basketball",
        "football",
        "baseball",
        "tennis",
        "corners",
    )
    return not any(term in text for term in sports_terms)


def _fallback_market(query: str) -> dict[str, Any]:
    slug = re.sub(r"[^a-z0-9]+", "-", query.lower()).strip("-") or "requested-market"
    return {
        "id": slug,
        "slug": slug,
        "question": query if len(query) > 8 else "Requested Polymarket market",
        "category": "market",
        "market_probability": 0.5,
        "volume": 0,
        "resolves_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
        "polymarket_url": f"https://polymarket.com/event/{slug}",
        "rules": "",
    }
