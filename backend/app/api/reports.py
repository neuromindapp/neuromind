import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user, get_optional_user
from app.db.database import get_db
from app.db.models import User
from app.services.quota import available_quota_source, consume_quota
from app.services.reports import create_ai_report, get_any_report, get_unlocked_market_report, locked_summary, user_has_report


router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{report_id}")
async def get_report(
    report_id: str,
    user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        uuid.UUID(report_id)
    except ValueError:
        unlocked = await get_unlocked_market_report(db, user, report_id)
        if unlocked:
            return {"locked": False, "report": unlocked}

    report = await get_any_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    entitled = await user_has_report(db, user, report_id)
    return {"locked": not entitled, "report": report if entitled else locked_summary(report)}


@router.post("/{report_id}/unlock")
async def unlock_report(
    report_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        parsed = uuid.UUID(report_id)
    except ValueError:
        unlocked = await get_unlocked_market_report(db, user, report_id)
        if unlocked:
            return {"locked": False, "report": unlocked, "quota_source": "already_unlocked"}

        if not await available_quota_source(user):
            raise HTTPException(status_code=402, detail="No free dives or credits available")
        try:
            report = await create_ai_report(db, report_id)
        except Exception as exc:
            raise HTTPException(status_code=503, detail=f"Could not generate report right now: {exc}") from exc
        source = await consume_quota(db, user, uuid.UUID(report["id"]))
        if not source:
            raise HTTPException(status_code=402, detail="No free dives or credits available")
        return {"locked": False, "report": report, "quota_source": source}

    report = await get_any_report(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if await user_has_report(db, user, report_id):
        return {"locked": False, "report": report, "quota_source": "already_unlocked"}

    source = await consume_quota(db, user, parsed)
    if not source:
        raise HTTPException(status_code=402, detail="No free dives or credits available")

    return {"locked": False, "report": report, "quota_source": source}
