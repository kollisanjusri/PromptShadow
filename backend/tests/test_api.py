import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app
from app.config import MAX_PROMPT_LENGTH

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ollama_status" in data


@patch("app.services.local_llm.requests.post")
def test_scan_password_prompt_returns_block(mock_post):
    # Mock Ollama returning low risk so we verify policy blocks password deterministically
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        "response": '{"risk_score": 10, "risk_level": "low", "reason": "Low risk"}'
    }

    payload = {"prompt": "Explain this code. My password is DemoPass123"}
    response = client.post("/api/scan", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["action"] == "block"
    assert data["risk_score"] >= 90
    assert data["risk_level"] == "critical"
    assert data["modified_prompt"] == "Explain this code. My password is [REDACTED]"
    assert len(data["findings"]) >= 1
    assert data["findings"][0]["type"] == "PASSWORD"
    # Ensure raw password is NOT in findings reason or message
    assert "DemoPass123" not in str(data["findings"])
    assert "DemoPass123" not in data["message"]


@patch("app.services.local_llm.requests.post")
def test_scan_email_prompt_returns_redact(mock_post):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        "response": '{"risk_score": 20, "risk_level": "low", "reason": "Email present"}'
    }

    payload = {"prompt": "Send details to navya@example.com"}
    response = client.post("/api/scan", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["action"] == "redact"
    assert data["modified_prompt"] == "Send details to [REDACTED_EMAIL]"


@patch("app.services.local_llm.requests.post")
def test_scan_harmless_prompt_returns_allow(mock_post):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        "response": '{"risk_score": 0, "risk_level": "low", "reason": "Safe code prompt"}'
    }

    payload = {"prompt": "Write a python function to compute factorial"}
    response = client.post("/api/scan", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["action"] == "allow"
    assert data["risk_level"] == "low"
    assert data["modified_prompt"] == "Write a python function to compute factorial"


def test_scan_empty_prompt_returns_400():
    response = client.post("/api/scan", json={"prompt": ""})
    assert response.status_code == 400


def test_scan_whitespace_prompt_returns_400():
    response = client.post("/api/scan", json={"prompt": "   \n\t  "})
    assert response.status_code == 400


def test_scan_overlength_prompt_returns_400():
    long_prompt = "a" * (MAX_PROMPT_LENGTH + 10)
    response = client.post("/api/scan", json={"prompt": long_prompt})
    assert response.status_code == 400


@patch("app.services.local_llm.requests.post")
def test_scan_ollama_failure_graceful_fallback(mock_post):
    mock_post.side_effect = Exception("Ollama connection timed out")

    payload = {"prompt": "My password is DemoPass123"}
    response = client.post("/api/scan", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["action"] == "block"
    assert data["modified_prompt"] == "My password is [REDACTED]"
