import pytest
from app.services.redaction import redact_sensitive_data


def test_redact_password_bugfix():
    prompt = "My password is DemoPass123"
    redacted = redact_sensitive_data(prompt)
    assert redacted == "My password is [REDACTED]"


def test_redact_password_colon():
    prompt = "password: DemoPass123"
    redacted = redact_sensitive_data(prompt)
    assert redacted == "password: [REDACTED]"


def test_redact_api_key():
    prompt = "and api_key: DEMO_KEY_123"
    redacted = redact_sensitive_data(prompt)
    assert redacted == "and api_key: [REDACTED]"


def test_redact_email():
    prompt = "My email is navya@example.com"
    redacted = redact_sensitive_data(prompt)
    assert redacted == "My email is [REDACTED_EMAIL]"


def test_redact_phone():
    prompt = "my phone is 9876543210"
    redacted = redact_sensitive_data(prompt)
    assert redacted == "my phone is [REDACTED_PHONE]"


def test_redact_combined_prompt():
    prompt = "My email is navya@example.com, my password is DemoPass123, my phone is 9876543210, and api_key: DEMO_KEY_123"
    redacted = redact_sensitive_data(prompt)
    assert "navya@example.com" not in redacted
    assert "DemoPass123" not in redacted
    assert "9876543210" not in redacted
    assert "DEMO_KEY_123" not in redacted
    assert redacted == "My email is [REDACTED_EMAIL], my password is [REDACTED], my phone is [REDACTED_PHONE], and api_key: [REDACTED]"


def test_redact_harmless_prompt():
    prompt = "Explain quantum computing in simple terms."
    assert redact_sensitive_data(prompt) == prompt
