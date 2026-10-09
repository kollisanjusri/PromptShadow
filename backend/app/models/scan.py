from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.models.base import Base

class ScanHistory(Base):
    __tablename__ = "scan_history"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, index=True) # Mock FK since users might not exist yet
    employee_name = Column(String) # For demo purposes
    timestamp = Column(DateTime, default=datetime.utcnow)
    risk_score = Column(Integer)
    risk_level = Column(String) # High, Medium, Low, Critical
    action_taken = Column(String) # Allowed, Blocked, Redacted

    findings = relationship("Finding", back_populates="scan")

class Finding(Base):
    __tablename__ = "findings"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    scan_id = Column(String, ForeignKey("scan_history.id"))
    category = Column(String)
    count = Column(Integer, default=1)

    scan = relationship("ScanHistory", back_populates="findings")
