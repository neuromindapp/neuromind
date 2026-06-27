from datetime import datetime, timedelta, timezone


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def future_iso(days: int) -> str:
    return (datetime.now(timezone.utc) + timedelta(days=days)).isoformat()


SAMPLE_EDGES = [
    {
        "id": "11111111-1111-4111-8111-111111111111",
        "market_id": "pm-fed-cut-sept",
        "question": "Will the Fed cut rates at the September meeting?",
        "category": "econ",
        "market_probability": 0.42,
        "research_probability": 0.61,
        "edge_pts": 19,
        "confidence": "high",
        "resolution_risk": 3,
        "volume": 8200000,
        "resolves_at": future_iso(74),
        "last_scanned_at": now_iso(),
        "direction": "YES",
        "yes_label": "Yes",
        "no_label": "No",
        "polymarket_url": "https://polymarket.com/event/fed-september-rates",
        "preview": "Labor softness is moving faster than odds imply, while FOMC language is lagging the data.",
    },
    {
        "id": "22222222-2222-4222-8222-222222222222",
        "market_id": "pm-btc-ath-q4",
        "question": "Will Bitcoin make a new all time high before Q4 ends?",
        "category": "crypto",
        "market_probability": 0.54,
        "research_probability": 0.39,
        "edge_pts": 15,
        "confidence": "medium",
        "resolution_risk": 2,
        "volume": 4100000,
        "resolves_at": future_iso(181),
        "last_scanned_at": now_iso(),
        "direction": "NO",
        "yes_label": "Yes",
        "no_label": "No",
        "polymarket_url": "https://polymarket.com/event/bitcoin-ath-q4",
        "preview": "Options positioning looks hot, but spot inflows do not support the implied path yet.",
