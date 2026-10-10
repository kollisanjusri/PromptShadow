
from app.services.detection import detect_sensitive_data

test_prompt = (
    "Please check this account: "
    "email navya@example.com, "
    "password: DemoPass123, "
    "phone 9876543210, "
    "api_key: DEMO_KEY_123"
)

findings = detect_sensitive_data(test_prompt)

print("Detection Results:")

for finding in findings:
    print(finding)