from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import Optional, List, Tuple
from app.models.scan import ScanHistory, Finding

class AdminRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_cutoff_date(self, date_range: str) -> Optional[datetime]:
        if date_range == "Last 7 Days":
            return datetime.utcnow() - timedelta(days=7)
        elif date_range == "Last 30 Days":
            return datetime.utcnow() - timedelta(days=30)
        elif date_range == "Last 90 Days":
            return datetime.utcnow() - timedelta(days=90)
        return None

    def get_base_query(self, date_range: str = "All Time", employee_name: Optional[str] = None):
        query = self.db.query(ScanHistory)
        
        cutoff = self.get_cutoff_date(date_range)
        if cutoff:
            query = query.filter(ScanHistory.timestamp >= cutoff)
            
        if employee_name and employee_name != "All Team Members":
            query = query.filter(ScanHistory.employee_name == employee_name)
            
        return query

    def get_total_scans(self, date_range: str, employee_name: Optional[str] = None) -> int:
        return self.get_base_query(date_range, employee_name).count()

    def get_high_risk_count(self, date_range: str, employee_name: Optional[str] = None) -> int:
        return self.get_base_query(date_range, employee_name)\
            .filter(ScanHistory.risk_level.in_(["High", "Critical"])).count()

    def get_redacted_count(self, date_range: str, employee_name: Optional[str] = None) -> int:
        return self.get_base_query(date_range, employee_name)\
            .filter(ScanHistory.action_taken == "Redacted").count()

    def get_blocked_count(self, date_range: str, employee_name: Optional[str] = None) -> int:
        return self.get_base_query(date_range, employee_name)\
            .filter(ScanHistory.action_taken == "Blocked").count()

    def get_risk_distribution(self, date_range: str, employee_name: Optional[str] = None):
        return self.get_base_query(date_range, employee_name)\
            .with_entities(ScanHistory.risk_level, func.count(ScanHistory.id))\
            .group_by(ScanHistory.risk_level).all()

    def get_categories(self, date_range: str, employee_name: Optional[str] = None):
        query = self.db.query(Finding.category, func.sum(Finding.count))
        cutoff = self.get_cutoff_date(date_range)
        
        # Join with ScanHistory to apply filters
        query = query.join(ScanHistory)
        
        if cutoff:
            query = query.filter(ScanHistory.timestamp >= cutoff)
        if employee_name and employee_name != "All Team Members":
            query = query.filter(ScanHistory.employee_name == employee_name)
            
        return query.group_by(Finding.category).all()

    def get_events(self, date_range: str, employee_name: Optional[str] = None, limit: int = 100):
        query = self.get_base_query(date_range, employee_name)\
            .order_by(desc(ScanHistory.timestamp))\
            .limit(limit)
        return query.all()

    def get_all_employees(self):
        return [row[0] for row in self.db.query(ScanHistory.employee_name).distinct().all() if row[0]]
