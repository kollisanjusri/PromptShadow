# API Contract

## Base URL: `/api`

### Health Check
- **GET** `/health`
- Response: `{"status": "ok", "message": "PromptShadow API is healthy!"}`

### Authentication
- **POST** `/auth/login`
- **POST** `/auth/register`

### Employee Prompts
- **POST** `/prompts/scan`
  - Request: `{"prompt": "string", "tenant_id": "string"}`
  - Response: `{"redacted_prompt": "string", "risk_score": 0, "findings": []}`
- **GET** `/prompts/history`
  - Response: `List of previous scans (no raw prompts)`

### Admin Analytics
- **GET** `/admin/analytics`
- **GET** `/admin/tenants`
- **POST** `/admin/tenants`
