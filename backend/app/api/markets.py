from fastapi import APIRouter

from app.services.polymarket import find_market, live_edges
from app.services.sample_data import SAMPLE_EDGES


router = APIRouter(prefix="/markets", tags=["markets"])


@router.get("/search")
async def search_markets(q: str):
    query = q.strip()
    if len(query) < 3:
        return {"markets": []}
    try:
        market = await find_market(query)
        related = await live_edges(limit=5)
        markets = [market] + [item for item in related if item["id"] != market["id"]]
        return {"markets": markets[:5]}
    except Exception:
        query_lower = query.lower()
        matches = [edge for edge in SAMPLE_EDGES if query_lower in edge["question"].lower()]
        return {"markets": matches[:5]}
