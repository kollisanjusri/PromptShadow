from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SummaryMetrics(BaseModel):
    totalScans: int
    highRisk: int
    redacted: int
    blocked: int

class RiskDistributionItem(BaseModel):
    label: str
    count: int
    color: str
    percentage: int

class CategoryItem(BaseModel):
    label: str
    count: int
    percentage: int

class SecurityEvent(BaseModel):
    id: str
    date: str
    employee: str
    risk: str
    category: str
    action: str

class AdminDashboardResponse(BaseModel):
    summary: SummaryMetrics
    riskDistribution: List[RiskDistributionItem]
    categories: List[CategoryItem]
    events: List[SecurityEvent]
    employees: List[str]
