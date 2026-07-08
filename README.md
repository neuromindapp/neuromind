# NeuroMind

![NeuroMind banner](frontend/public/banner.jpg)

**CA:** `TEZRfLHPRzEQTdSVdxRuAgbuzpKXj9V15KzYYispump`

NeuroMind is a research layer for prediction markets. It scans live Polymarket markets, compares market odds against an independent probability estimate, and turns the disagreement into readable research briefs with source review, rule-risk notes, and a public track record.

The product is intentionally not a trading bot. It does not custody funds, place bets, or automate market execution. It helps users decide which markets deserve closer study before they act elsewhere.

## Why It Exists

Prediction markets are information-dense but easy to misread. A market can look cheap because the crowd is wrong, because the wording is dangerous, because liquidity is thin, or because the outcome source is ambiguous. NeuroMind separates those questions instead of collapsing them into a single score.

The useful workflow is:

1. Find markets where the model and the market disagree.
2. Read the evidence and assumptions behind the estimate.
3. Check resolution risk before trusting the headline edge.
4. Compare resolved calls over time through the track record.

## Product Surfaces

### Landing

A minimal dark entry point with the NeuroMind smoke background, clear concept copy, and direct routes into the app or documentation.

### Edge Board

The research queue. Markets are displayed as compact research cards with:

- live market odds
- research estimate
- edge size
- confidence
- resolution risk
- volume
- locked report preview

### Reports

Each report expands one market into a structured brief:

- market odds versus research estimate
- key drivers
- source review
- rule and settlement risk
- model notes
- Polymarket reference link

### Track Record

Resolved calls remain visible so the research process can be judged by outcomes, not presentation. The page includes hit rate, confidence bands, simulated points, and individual resolved calls.

### Account

Wallet-linked access for report credits, free reports, holder-gated daily access, payment intents, and usage history.

### Docs

Static documentation for methodology, product surfaces, access model, payments, disclaimers, and privacy notes. Docs deliberately avoid video backgrounds and heavy animation.

## Architecture

```text
frontend/     React app served at neuro-mind.app
docs/         React docs app served at docs.neuro-mind.app
backend/      FastAPI API for auth, reports, markets, quota, payments
scanner/      Background market scanner worker
caddy/        Caddy reverse proxy and static asset server
```

Core services:

- React + Vite for the app and docs.
- FastAPI for API routes and report workflows.
- Postgres for users, markets, reports, payments, and quota usage.
- Redis for scanner/runtime coordination.
- Caddy for TLS, static hosting, and `/api` reverse proxying.
- Privy for wallet login.
- Helius for Solana holder checks and payment support.
- Gemini/Anthropic-compatible report generation hooks.

## Local Development

Create an env file from the example:

```bash
cp .env.example server.env
```

Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Install and run docs:

```bash
cd docs
npm install
npm run dev
```

Run the full stack with Docker:

```bash
docker compose --env-file server.env up -d --build
```

## Environment

Important variables:

```text
DOMAIN=neuro-mind.app
API_ORIGINS=https://neuro-mind.app,https://www.neuro-mind.app,https://docs.neuro-mind.app,http://localhost:5173
DATABASE_URL=postgresql+asyncpg://neuromind:neuromind@postgres:5432/neuromind
REDIS_URL=redis://redis:6379/0
PRIVY_APP_ID=
PRIVY_APP_SECRET=
HELIUS_RPC_URL=
NEUROMIND_TOKEN_MINT=
TREASURY_WALLET=
GEMINI_API_KEY=
VITE_API_BASE_URL=/api
VITE_PRIVY_APP_ID=
```

Production secrets should stay in `server.env` on the server and must not be committed.

## Deployment

The production stack is built with Docker Compose:

```bash
docker compose --env-file server.env up -d --build
```

Caddy serves:

- `https://neuro-mind.app`
- `https://www.neuro-mind.app`
- `https://docs.neuro-mind.app`

The frontend build receives:

- `VITE_API_BASE_URL=/api`
- `VITE_PRIVY_APP_ID=${PRIVY_APP_ID}`

## Research Model

NeuroMind treats a market estimate as a research artifact, not a command. Reports should explain:

- what the market is pricing
- what the model estimates
- why the gap exists
- what evidence could break the thesis
- whether the market wording can resolve unexpectedly

The track record is part of the product because probability work should be judged after resolution.

## Safety Boundaries

NeuroMind is research software only.

- It does not provide financial advice.
- It does not guarantee outcomes.
- It does not trade on behalf of users.
- It does not custody market funds.
- It is not affiliated with Polymarket.

Users are responsible for reading the market rules, understanding their jurisdiction, and making their own decisions.
