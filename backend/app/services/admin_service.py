from app.repositories.admin_repository import AdminRepository
from app.schemas.admin import SummaryMetrics, RiskDistributionItem, CategoryItem, SecurityEvent, AdminDashboardResponse
from typing import Optional, List

class AdminService:
    def __init__(self, repository: AdminRepository):
        self.repository = repository

    def get_summary_metrics(self, date_range: str, employee_name: Optional[str] = None) -> SummaryMetrics:
        return SummaryMetrics(
            totalScans=self.repository.get_total_scans(date_range, employee_name),
            highRisk=self.repository.get_high_risk_count(date_range, employee_name),
            redacted=self.repository.get_redacted_count(date_range, employee_name),
            blocked=self.repository.get_blocked_count(date_range, employee_name)
        )

    def get_risk_distribution(self, date_range: str, employee_name: Optional[str] = None) -> List[RiskDistributionItem]:
        total = self.repository.get_total_scans(date_range, employee_name)
        raw_data = self.repository.get_risk_distribution(date_range, employee_name)
        
        # Pre-fill defaults
        risk_map = {
            "Low": {"count": 0, "color": "var(--accent-safe)"},
            "Medium": {"count": 0, "color": "var(--accent-warn)"},
            "High": {"count": 0, "color": "var(--accent-danger)"},
            "Critical": {"count": 0, "color": "var(--accent-danger)"}
        }
        
        for risk_level, count in raw_data:
            if risk_level in risk_map:
                risk_map[risk_level]["count"] = count
                
        def get_percentage(count):
            return int((count / total * 100)) if total > 0 else 0

        return [
            RiskDistributionItem(
                label=level,
                count=data["count"],
                color=data["color"],
                percentage=get_percentage(data["count"])
            )
            for level, data in risk_map.items()
        ]

    def get_categories(self, date_range: str, employee_name: Optional[str] = None) -> List[CategoryItem]:
        raw_data = self.repository.get_categories(date_range, employee_name)
        total = sum(count for _, count in raw_data)
        
        cat_map = {
            "PII": "Personal Information (PII)",
            "API Keys": "API Keys & Secrets",
            "Passwords": "Passwords",
            "Confidential Data": "Confidential Business Data"
        }
        
        results = []
        # Pre-fill
        count_map = {k: 0 for k in cat_map.keys()}
        for category, count in raw_data:
            if category in count_map:
                count_map[category] = count

        for key, label in cat_map.items():
            count = count_map[key]
            results.append(CategoryItem(
                label=label,
                count=count,
                percentage=int((count / total * 100)) if total > 0 else 0
            ))
            
        return results

    def get_events(self, date_range: str, employee_name: Optional[str] = None) -> List[SecurityEvent]:
        events = self.repository.get_events(date_range, employee_name)
        results = []
        for e in events:
            # Safely fetch the first finding's category if present, otherwise "None"
            category = "None"
            if e.findings:
                category = e.findings[0].category
                
            results.append(SecurityEvent(
                id=str(e.id),
                date=e.timestamp.strftime("%Y-%m-%d %H:%M"),
                employee=e.employee_name or "Unknown",
                risk=e.risk_level or "Unknown",
                category=category,
                action=e.action_taken or "Unknown"
            ))
        return results

    def get_dashboard_data(self, date_range: str = "All Time", employee_name: Optional[str] = None) -> AdminDashboardResponse:
        employees = self.repository.get_all_employees()
        if not employees:
            # Fallback mock names if empty DB
            employees = ["Test User 1", "Test User 2", "Test User 3"]

        return AdminDashboardResponse(
            summary=self.get_summary_metrics(date_range, employee_name),
            riskDistribution=self.get_risk_distribution(date_range, employee_name),
            categories=self.get_categories(date_range, employee_name),
            events=self.get_events(date_range, employee_name),
            employees=employees
        )
