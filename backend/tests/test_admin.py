from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_admin_dashboard():
    response = client.get("/api/admin/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "riskDistribution" in data
    assert "categories" in data
    assert "events" in data
    assert "employees" in data

def test_admin_summary():
    response = client.get("/api/admin/summary")
    assert response.status_code == 200
    data = response.json()
    assert "totalScans" in data
    assert "highRisk" in data
    assert "redacted" in data
    assert "blocked" in data

def test_admin_risk_distribution():
    response = client.get("/api/admin/risk-distribution")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_admin_categories():
    response = client.get("/api/admin/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_admin_events():
    response = client.get("/api/admin/events")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_admin_team_activity():
    response = client.get("/api/admin/team-activity")
    assert response.status_code == 200
    data = response.json()
    assert "employees" in data
