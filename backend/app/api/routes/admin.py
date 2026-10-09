from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.repositories.admin_repository import AdminRepository
from app.services.admin_service import AdminService
from app.schemas.admin import AdminDashboardResponse

router = APIRouter(prefix="/admin", tags=["admin"])

def get_admin_service(db: Session = Depends(get_db)) -> AdminService:
    repository = AdminRepository(db)
    return AdminService(repository)

# TODO: Add real authentication dependency here to enforce Admin/Manager access control.
# Currently mocked for hackathon demo. Not production secure!
def mock_admin_auth():
    pass

@router.get("/dashboard", response_model=AdminDashboardResponse, dependencies=[Depends(mock_admin_auth)])
def get_dashboard(
    date_range: str = "All Time", 
    employee_name: Optional[str] = None, 
    service: AdminService = Depends(get_admin_service)
):
    """
    Get all dashboard analytics data in one payload.
    Supports date_range ('All Time', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days') 
    and employee_name filters.
    """
    if employee_name == "All Team Members":
        employee_name = None
        
    return service.get_dashboard_data(date_range, employee_name)

@router.get("/summary", dependencies=[Depends(mock_admin_auth)])
def get_summary(
    date_range: str = "All Time", 
    employee_name: Optional[str] = None, 
    service: AdminService = Depends(get_admin_service)
):
    if employee_name == "All Team Members":
        employee_name = None
    return service.get_summary_metrics(date_range, employee_name)

@router.get("/risk-distribution", dependencies=[Depends(mock_admin_auth)])
def get_risk_distribution(
    date_range: str = "All Time", 
    employee_name: Optional[str] = None, 
    service: AdminService = Depends(get_admin_service)
):
    if employee_name == "All Team Members":
        employee_name = None
    return service.get_risk_distribution(date_range, employee_name)

@router.get("/categories", dependencies=[Depends(mock_admin_auth)])
def get_categories(
    date_range: str = "All Time", 
    employee_name: Optional[str] = None, 
    service: AdminService = Depends(get_admin_service)
):
    if employee_name == "All Team Members":
        employee_name = None
    return service.get_categories(date_range, employee_name)

@router.get("/events", dependencies=[Depends(mock_admin_auth)])
def get_events(
    date_range: str = "All Time", 
    employee_name: Optional[str] = None, 
    service: AdminService = Depends(get_admin_service)
):
    if employee_name == "All Team Members":
        employee_name = None
    return service.get_events(date_range, employee_name)

@router.get("/team-activity", dependencies=[Depends(mock_admin_auth)])
def get_team_activity(
    service: AdminService = Depends(get_admin_service)
):
    employees = service.repository.get_all_employees()
    return {"employees": employees}
