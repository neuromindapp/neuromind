import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user
from app.db.database import get_db
from app.db.models import User
from app.services.quota import available_quota_source, consume_quota
from app.services.reports import create_ai_report


router = APIRouter(prefix="/dives", tags=["dives"])


class DiveRequest(BaseModel):
    market_url_or_query: str


@router.post("")
async def run_dive(
    request: DiveRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = request.market_url_or_query.strip()
    if len(query) < 3:
        raise HTTPException(status_code=400, detail="Paste a Polymarket URL or market search")
    if not await available_quota_source(user):
        raise HTTPException(status_code=402, detail="No free dives or credits available")

    try:
        report = await create_ai_report(db, query)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Could not generate report right now: {exc}") from exc

    source = await consume_quota(db, user, uuid.UUID(report["id"]))
    if not source:
        raise HTTPException(status_code=402, detail="No free dives or credits available")

    return {
        "status": "done",
        "quota_source": source,
        "report_id": report["id"],
        "stages": ["researched_market", "read_rules", "estimated_probability", "saved_report"],
        "input": query,
    }
