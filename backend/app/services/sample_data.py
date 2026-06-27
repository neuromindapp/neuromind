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
