from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import account, auth, dives, edges, markets, payments, reports, track_record
from app.core.config import settings
from app.db.database import engine
from app.db.models import Base


app = FastAPI(title="NeuroMind API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.get("/health")
async def health():
    return {"ok": True}


app.include_router(auth.router, prefix="/api")
app.include_router(edges.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(dives.router, prefix="/api")
app.include_router(track_record.router, prefix="/api")
app.include_router(account.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(markets.router, prefix="/api")

