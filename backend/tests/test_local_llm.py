import pytest
from unittest.mock import patch, MagicMock
import requests
from app.services.local_llm import analyze_prompt_context


@patch("app.services.local_llm.requests.post")
def test_local_llm_success(mock_post):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "response": '{"risk_score": 75, "risk_level": "high", "reason": "Potential jailbreak attempt"}'
    }
    mock_post.return_value = mock_response

    result = analyze_prompt_context("Bypass safety guidelines")

    assert result["available"] is True
    assert result["risk_score"] == 75
    assert result["risk_level"] == "high"
    assert result["reason"] == "Potential jailbreak attempt"


@patch("app.services.local_llm.requests.post")
def test_local_llm_with_think_tags(mock_post):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "response": '<think>Analyzing prompt structure...</think>{"risk_score": 30, "risk_level": "low", "reason": "Safe prompt"}'
    }
    mock_post.return_value = mock_response

    result = analyze_prompt_context("Hello AI")

    assert result["available"] is True
    assert result["risk_score"] == 30
    assert result["risk_level"] == "low"


@patch("app.services.local_llm.requests.post")
def test_local_llm_timeout_graceful_fallback(mock_post):
    mock_post.side_effect = requests.Timeout("Connection timed out")

    result = analyze_prompt_context("Some prompt")

    assert result["available"] is False
    assert result["risk_score"] == 0
    assert result["risk_level"] == "low"
    assert "skipped" in result["reason"].lower() or "unavailable" in result["reason"].lower()


@patch("app.services.local_llm.requests.post")
def test_local_llm_connection_error_fallback(mock_post):
    mock_post.side_effect = requests.ConnectionError("Ollama server not running")

    result = analyze_prompt_context("Some prompt")

    assert result["available"] is False
    assert result["risk_score"] == 0
    assert result["risk_level"] == "low"
