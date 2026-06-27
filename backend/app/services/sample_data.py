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
    },
    {
        "id": "33333333-3333-4333-8333-333333333333",
        "market_id": "pm-ai-benchmark",
        "question": "Will a public AI model top the benchmark leaderboard this month?",
        "category": "tech",
        "market_probability": 0.67,
        "research_probability": 0.78,
        "edge_pts": 11,
        "confidence": "medium",
        "resolution_risk": 6,
        "volume": 930000,
        "resolves_at": future_iso(23),
        "last_scanned_at": now_iso(),
        "direction": "YES",
        "yes_label": "Yes",
        "no_label": "No",
        "polymarket_url": "https://polymarket.com/event/ai-model-benchmark",
        "preview": "Release timing is the hidden risk, but model cadence points above current odds.",
    },
    {
        "id": "44444444-4444-4444-8444-444444444444",
        "market_id": "pm-sol-etf-approval",
        "question": "Will a spot Solana ETF be approved before year end?",
        "category": "crypto",
        "market_probability": 0.31,
        "research_probability": 0.47,
        "edge_pts": 16,
        "confidence": "high",
        "resolution_risk": 4,
        "volume": 2700000,
        "resolves_at": future_iso(154),
        "last_scanned_at": now_iso(),
        "direction": "YES",
        "yes_label": "Approved",
        "no_label": "Not approved",
        "polymarket_url": "https://polymarket.com/event/solana-etf-approval",
        "preview": "The market is pricing political headline risk, but underpricing issuer filing progress.",
    },
    {
        "id": "55555555-5555-4555-8555-555555555555",
        "market_id": "pm-election-turnout",
        "question": "Will US election turnout exceed the previous cycle?",
        "category": "politics",
        "market_probability": 0.58,
        "research_probability": 0.44,
        "edge_pts": 14,
        "confidence": "medium",
        "resolution_risk": 5,
        "volume": 1900000,
        "resolves_at": future_iso(126),
        "last_scanned_at": now_iso(),
        "direction": "NO",
        "yes_label": "Above",
        "no_label": "Below",
        "polymarket_url": "https://polymarket.com/event/us-election-turnout",
        "preview": "Registration strength is real, but the market is overextending early-cycle enthusiasm.",
    },
]


REPORT_DETAILS = {
    "11111111-1111-4111-8111-111111111111": {
        "reasoning": (
            "NeuroMind gives the September cut a higher probability because the newest labor and credit data "
            "are weakening faster than public commentary has repriced. The market is anchoring to prior "
            "committee messaging instead of the reaction function implied by the last two data releases."
        ),
        "key_drivers": [
            "Labor trend revisions matter more than the headline unemployment rate in this setup.",
            "Rates-adjacent markets imply a higher cut probability than the Polymarket orderbook.",
            "The book has stale resting liquidity near 40%, making the displayed price slow to move.",
        ],
        "resolution_risk_notes": "Low-to-medium risk. Settlement depends on the official FOMC target range announcement, not intraday futures pricing.",
        "sources": [
            {"title": "Federal Reserve calendar", "url": "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"},
            {"title": "Polymarket market rules", "url": "https://polymarket.com/event/fed-september-rates"},
        ],
    },
    "22222222-2222-4222-8222-222222222222": {
