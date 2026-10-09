
from app.services.redaction import redact_sensitive_data

test_prompt = (
    "My email is navya@example.com, "
    "my password is DemoPass123, "
    "my phone is 9876543210, "
    "and api_key: DEMO_KEY_123"
)

result = redact_sensitive_data(test_prompt)

print("Original prompt:")
print(test_prompt)

print("\nRedacted prompt:")
print(result)