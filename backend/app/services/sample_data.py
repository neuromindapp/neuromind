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
        "reasoning": (
            "NeuroMind is below market because the current implied path requires both sustained ETF inflows "
            "and a volatility breakout. Positioning is crowded while spot follow-through has not confirmed "
            "the move, so the YES price is paying for momentum before confirmation."
        ),
        "key_drivers": [
            "ETF flow acceleration is weaker than the options market narrative.",
            "Funding and basis are elevated, which reduces forward return quality.",
            "The ATH definition is straightforward, so probability edge dominates wording risk.",
        ],
        "resolution_risk_notes": "Low risk. The market is likely resolved against widely quoted BTC spot highs, with minimal wording ambiguity.",
        "sources": [
            {"title": "Polymarket market rules", "url": "https://polymarket.com/event/bitcoin-ath-q4"},
            {"title": "Coinbase BTC markets", "url": "https://www.coinbase.com/price/bitcoin"},
        ],
    },
    "33333333-3333-4333-8333-333333333333": {
        "reasoning": (
            "NeuroMind is more bullish than the market because frontier model release cadence has compressed, "
            "and benchmark leadership changes more often than traders price. The main drag is not model "
            "quality; it is whether a release qualifies as public before the resolution deadline."
        ),
        "key_drivers": [
            "Multiple labs have open release windows inside the market period.",
            "Benchmark top slots have become less durable as evaluation coverage broadens.",
            "The market is underweighting a leaderboard update from a smaller lab.",
        ],
        "resolution_risk_notes": "Elevated risk. The phrase public model can create disputes around gated previews, limited rollouts, and leaderboard timing.",
        "sources": [
            {"title": "Polymarket market rules", "url": "https://polymarket.com/event/ai-model-benchmark"},
            {"title": "LMSYS leaderboard", "url": "https://chat.lmsys.org/"},
        ],
    },
    "44444444-4444-4444-8444-444444444444": {
        "reasoning": (
            "NeuroMind sees the Solana ETF approval path as underpriced. The market is focused on public "
            "regulatory caution, but issuer behavior and amended filings point to a higher probability "
            "than 31%. The edge is not that approval is base case; it is that the market price is too low."
        ),
        "key_drivers": [
            "Issuer filing cadence has moved from exploratory to approval-prep behavior.",
            "Comparable crypto ETF timelines suggest the current price discounts too much delay.",
            "Liquidity is concentrated on one side, leaving YES underbid after headline scares.",
        ],
        "resolution_risk_notes": "Medium risk. Approval must match the exact fund type and deadline wording; delayed effective dates can matter.",
        "sources": [
            {"title": "SEC filings search", "url": "https://www.sec.gov/edgar/search/"},
            {"title": "Polymarket market rules", "url": "https://polymarket.com/event/solana-etf-approval"},
        ],
    },
    "55555555-5555-4555-8555-555555555555": {
        "reasoning": (
            "NeuroMind is below market because turnout narratives are extrapolating registration headlines "
            "without adjusting for eligibility, geography, and drop-off. The previous cycle remains a "
            "high bar, and the market is not charging enough for normalization risk."
        ),
        "key_drivers": [
            "Registration strength is uneven across states that drive the aggregate number.",
            "Early enthusiasm data has historically overstated final turnout for comparable cycles.",
            "Resolution depends on final reported turnout, which can lag and create timing risk.",
        ],
        "resolution_risk_notes": "Medium risk. The official source and the definition of turnout versus ballots cast should be checked before sizing.",
        "sources": [
            {"title": "Election Assistance Commission", "url": "https://www.eac.gov/"},
            {"title": "Polymarket market rules", "url": "https://polymarket.com/event/us-election-turnout"},
        ],
    },
}


FULL_REPORTS = {
    edge["id"]: {
        **edge,
        **REPORT_DETAILS[edge["id"]],
        "model": "NeuroMind research engine",
        "created_at": now_iso(),
        "odds_moved_toward_research_pts": max(1, min(7, round(edge["edge_pts"] / 3))),
        "history": [
            {"t": "scan-3", "market": max(0.01, edge["market_probability"] - 0.04), "research": max(0.01, edge["research_probability"] - 0.02)},
            {"t": "scan-2", "market": max(0.01, edge["market_probability"] - 0.02), "research": max(0.01, edge["research_probability"] - 0.01)},
            {"t": "scan-1", "market": edge["market_probability"], "research": edge["research_probability"]},
        ],
    }
    for edge in SAMPLE_EDGES
}


RESOLVED_CALLS = [
    {
        "market": "Will CPI print below consensus?",
        "category": "econ",
        "research_probability": 0.68,
        "market_probability": 0.51,
        "edge_pts": 17,
        "outcome": "YES",
        "correct": True,
