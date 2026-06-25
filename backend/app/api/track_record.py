from fastapi import APIRouter
from app.services.sample_data import RESOLVED_CALLS


router = APIRouter(prefix="/track-record", tags=["track-record"])


@router.get("")
async def track_record():
    total = len(RESOLVED_CALLS)
    wins = sum(1 for row in RESOLVED_CALLS if row["correct"])
    high = [row for row in RESOLVED_CALLS if row["confidence"] == "high"]
    high_wins = sum(1 for row in high if row["correct"])
    winners = [row["edge_pts"] for row in RESOLVED_CALLS if row["correct"]]
    losers = [row["edge_pts"] for row in RESOLVED_CALLS if not row["correct"]]
    simulated_pnl = sum(row["edge_pts"] if row["correct"] else -10 for row in RESOLVED_CALLS)

    return {
        "stats": {
            "resolved_calls": total,
            "hit_rate": round(wins / total, 3) if total else 0,
            "high_confidence_hit_rate": round(high_wins / len(high), 3) if high else 0,
            "simulated_pnl": round(simulated_pnl, 1),
            "avg_edge_winners": round(sum(winners) / len(winners), 1) if winners else 0,
            "avg_edge_losers": round(sum(losers) / len(losers), 1) if losers else 0,
        },
        "calls": RESOLVED_CALLS,
    }
