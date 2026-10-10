import re


def redact_sensitive_data(prompt: str) -> str:
    """
    Redact sensitive data patterns in the given prompt.
    Fixes password redaction for phrases like 'My password is DemoPass123'.
    Preserves prompt context while masking secret credentials.
    """
    if not prompt:
        return prompt

    patterns = [
        # 1. Private Keys
        (
            r"-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----",
            "[REDACTED_PRIVATE_KEY]"
        ),

        # 2. Passwords: supports "password is DemoPass123", "password: DemoPass123", "password = DemoPass123"
        (
            r"(?i)(\b(?:password|passwd|passphrase|pwd)\s*(?:is|[:=])?\s*)[^\s,.;:!?()\[\]{}]+",
            r"\1[REDACTED]"
        ),

        # 3. API keys and secret keys
        (
            r"(?i)(\b(?:api[_ -]?key|secret[_ -]?key|client[_ -]?secret)\s*(?:is|[:=])?\s*)[^\s,.;:!?()\[\]{}]+",
            r"\1[REDACTED]"
        ),

        # 4. Known key patterns (AWS, Stripe, GitHub)
        (
            r"\b(?:AKIA[0-9A-Z]{16}|sk_live_[0-9a-zA-Z]{24,}|ghp_[0-9a-zA-Z]{36})\b",
            "[REDACTED]"
        ),

        # 5. Access tokens and Bearer tokens
        (
            r"(?i)(\b(?:access[_ -]?token|auth[_ -]?token)\s*(?:is|[:=])?\s*)[^\s,.;:!?()\[\]{}]+",
            r"\1[REDACTED]"
        ),
        (
            r"(?i)(\bBearer\s+)[A-Za-z0-9\-\._~\+\/]+=*",
            r"\1[REDACTED]"
        ),

        # 6. Database URIs / Connection Strings
        (
            r"(?i)\b([a-z0-9]+:\/\/[^:\s]+:)[^@\s]+(@[^:\s]+)",
            r"\1[REDACTED]\2"
        ),

        # 7. Email addresses
        (
            r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
            "[REDACTED_EMAIL]"
        ),

        # 8. Indian mobile numbers
        (
            r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)",
            "[REDACTED_PHONE]"
        ),
    ]

    redacted_prompt = prompt

    for pattern, replacement in patterns:
        redacted_prompt = re.sub(
            pattern,
            replacement,
            redacted_prompt
        )

    return redacted_prompt