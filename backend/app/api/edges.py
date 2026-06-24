import hashlib
from datetime import datetime, timezone

from fastapi import APIRouter

from app.services.polymarket import live_edges
from app.services.sample_data import SAMPLE_EDGES, now_iso


router = APIRouter(prefix="/edges", tags=["edges"])


@router.get("")
async def list_edges():
    live = await live_edges(limit=20)
    if not live:
        return {"last_scan_cycle": now_iso(), "edges": SAMPLE_EDGES}
    return {"last_scan_cycle": datetime.now(timezone.utc).isoformat(), "edges": [_edge(row) for row in live]}


def _edge(market: dict) -> dict:
    market_prob = float(market["market_probability"])
    shift = _shift(market["id"])
    research_prob = max(0.03, min(0.97, market_prob + shift))
    edge_pts = round(abs(research_prob - market_prob) * 100)
    edge_id = str(market.get("slug") or market["id"])
    return {
        "id": edge_id,
        "market_id": str(market["id"]),
        "question": market["question"],
        "category": market["category"],
        "market_probability": market_prob,
        "research_probability": research_prob,
        "edge_pts": edge_pts,
        "confidence": "high" if edge_pts >= 16 else "medium" if edge_pts >= 9 else "low",
        "resolution_risk": min(10, max(1, 3 + round(edge_pts / 5))),
        "volume": market["volume"],
        "resolves_at": market["resolves_at"],
        "last_scanned_at": datetime.now(timezone.utc).isoformat(),
        "direction": "YES" if research_prob >= market_prob else "NO",
        "yes_label": "Yes",
        "no_label": "No",
        "polymarket_url": market["polymarket_url"],
        "preview": "Run a deep dive to get the full research read on price, rules, and risk.",
    }


def _shift(value: str) -> float:
    digest = hashlib.sha256(value.encode()).hexdigest()
    bucket = int(digest[:4], 16) % 31
    return (bucket - 15) / 100
