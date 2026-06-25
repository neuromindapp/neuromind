import json
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Market, QuotaUsage, Report, User
from app.services.ai import generate_deep_dive
from app.services.polymarket import find_market
from app.services.sample_data import FULL_REPORTS


async def user_has_report(db: AsyncSession, user: User | None, report_id: str) -> bool:
    if not user:
        return False
    parsed = _uuid_or_none(report_id)
    if not parsed:
        return False
