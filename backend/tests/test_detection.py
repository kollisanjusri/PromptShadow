import pytest
from app.services.detection import detect_sensitive_data


def test_detect_password():
    prompt = "My password is DemoPass123"
    findings = detect_sensitive_data(prompt)
    assert len(findings) == 1
    assert findings[0]["type"] == "PASSWORD"
    assert findings[0]["severity"] == "critical"
    # Ensure raw secret is not in the finding reason
    assert "DemoPass123" not in findings[0]["reason"]


def test_detect_api_key():
    prompt = "Use api_key: DEMO_KEY_123 for auth"
    findings = detect_sensitive_data(prompt)
    types = [f["type"] for f in findings]
    assert "API_KEY" in types


def test_detect_email_and_phone():
    prompt = "Contact navya@example.com or phone 9876543210"
    findings = detect_sensitive_data(prompt)
    types = [f["type"] for f in findings]
    assert "EMAIL" in types
    assert "PHONE" in types


def test_detect_multiple_secrets():
    prompt = "email navya@example.com, password: DemoPass123, phone 9876543210, api_key: DEMO_KEY_123"
    findings = detect_sensitive_data(prompt)
    types = [f["type"] for f in findings]
    assert "EMAIL" in types
    assert "PASSWORD" in types
    assert "PHONE" in types
    assert "API_KEY" in types


def test_detect_harmless_prompt():
    prompt = "How do I implement binary search in Python?"
    findings = detect_sensitive_data(prompt)
    assert len(findings) == 0


def test_detect_empty_prompt():
    assert detect_sensitive_data("") == []
