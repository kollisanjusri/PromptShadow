import re
from typing import List, Dict, Any


def detect_sensitive_data(prompt: str) -> List[Dict[str, Any]]:
    """
    Detect rule-based sensitive data in the input prompt.
    Returns a list of finding dictionaries containing type, severity, and reason.
    No raw secrets are returned in the findings.
    """
    if not prompt:
        return []

    findings: List[Dict[str, Any]] = []

    # Regex patterns for sensitive data detection
    # Each entry has: (type, pattern, severity, reason)
    patterns = [
        # Passwords: supports "password is DemoPass123", "password: secret", "password=secret", "pwd: 123"
        (
            "PASSWORD",
            r"(?i)\b(?:password|passwd|passphrase|pwd)\s*(?:is|[:=])?\s*[^\s,.;:!?()\[\]{}]+",
            "critical",
            "Possible password detected"
        ),

        # API Keys & Secret Keys
        (
            "API_KEY",
            r"(?i)\b(?:api[_ -]?key|secret[_ -]?key|client[_ -]?secret)\s*(?:is|[:=])?\s*[^\s,.;:!?()\[\]{}]+",
            "critical",
            "Possible api_key detected"
        ),

        # AWS / Stripe / GitHub Key Formats
        (
            "API_KEY",
            r"\b(?:AKIA[0-9A-Z]{16}|sk_live_[0-9a-zA-Z]{24,}|ghp_[0-9a-zA-Z]{36})\b",
            "critical",
            "Possible api_key detected"
        ),

        # Access Tokens & Auth Tokens / Bearer
        (
            "ACCESS_TOKEN",
            r"(?i)\b(?:access[_ -]?token|auth[_ -]?token|bearer[_ -]?token)\s*(?:is|[:=])?\s*[^\s,.;:!?()\[\]{}]+",
            "critical",
            "Possible access_token detected"
        ),
        (
            "ACCESS_TOKEN",
            r"(?i)\bBearer\s+[A-Za-z0-9\-\._~\+\/]+=*",
            "critical",
            "Possible access_token detected"
        ),

        # Private Keys & RSA Keys
        (
            "PRIVATE_KEY",
            r"-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----",
            "critical",
            "Possible private_key detected"
        ),

        # Database / Credential URIs
        (
            "CREDENTIAL",
            r"(?i)\b(?:postgres|postgresql|mysql|mongodb|redis|amqp|oracle|mssql):\/\/[^\s]+",
            "critical",
            "Possible credential connection string detected"
        ),

        # Email addresses
        (
            "EMAIL",
            r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
            "medium",
            "Possible email detected"
        ),

        # Indian phone numbers (10 digits starting with 6-9, optional +91 prefix)
        (
            "PHONE",
            r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)",
            "medium",
            "Possible phone number detected"
        ),
    ]

    for data_type, pattern, severity, reason in patterns:
        matches = re.findall(pattern, prompt)
        for _ in matches:
            findings.append({
                "type": data_type,
                "severity": severity,
                "reason": reason
            })

    return findings