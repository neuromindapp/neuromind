import uuid
from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet_pubkey: Mapped[str] = mapped_column(String(96), unique=True, index=True)
    privy_did: Mapped[str | None] = mapped_column(String(128), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    free_tries_left: Mapped[int] = mapped_column(Integer, default=5)
    credits: Mapped[int] = mapped_column(Integer, default=0)
    holder_daily_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class HolderSnapshot(Base):
    __tablename__ = "holder_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet: Mapped[str] = mapped_column(String(96), index=True)
    balance: Mapped[float] = mapped_column(Float, default=0)
    checked_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Market(Base):
    __tablename__ = "markets"

    polymarket_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    question: Mapped[str] = mapped_column(Text)
    rules: Mapped[str] = mapped_column(Text, default="")
    odds: Mapped[dict] = mapped_column(JSONB, default=dict)
    volume: Mapped[float] = mapped_column(Float, default=0)
    ends_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    category: Mapped[str] = mapped_column(String(64), index=True)
    status: Mapped[str] = mapped_column(String(32), default="active")
    reports: Mapped[list["Report"]] = relationship(back_populates="market")


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    market_id: Mapped[str] = mapped_column(ForeignKey("markets.polymarket_id"), index=True)
    research_prob: Mapped[float] = mapped_column(Float)
    market_prob: Mapped[float] = mapped_column(Float)
    edge_pts: Mapped[int] = mapped_column(Integer)
    confidence: Mapped[str] = mapped_column(String(16))
    resolution_risk: Mapped[int] = mapped_column(Integer)
    resolution_risk_notes: Mapped[str] = mapped_column(Text)
    reasoning: Mapped[str] = mapped_column(Text)
    sources: Mapped[list] = mapped_column(JSONB, default=list)
    model: Mapped[str] = mapped_column(String(64))
    polymarket_url: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    market: Mapped[Market] = relationship(back_populates="reports")


class ReportOutcome(Base):
    __tablename__ = "report_outcomes"

    report_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("reports.id"), primary_key=True)
    resolved_outcome: Mapped[str] = mapped_column(String(64))
    research_correct: Mapped[bool] = mapped_column(Boolean)
    resolved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class QuotaUsage(Base):
    __tablename__ = "quota_usage"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet: Mapped[str] = mapped_column(String(96), index=True)
    report_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    used_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    source: Mapped[str] = mapped_column(String(32))


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet: Mapped[str] = mapped_column(String(96), index=True)
    sol_amount: Mapped[float] = mapped_column(Float)
    tx_sig: Mapped[str | None] = mapped_column(String(128), nullable=True)
    credits_granted: Mapped[int] = mapped_column(Integer)
    memo: Mapped[str] = mapped_column(String(64), unique=True)
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

