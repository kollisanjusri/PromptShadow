# Database Schema

## Tables (Proposed)

### `users`
- id (UUID, PK)
- email (String, Unique)
- hashed_password (String)
- role (Enum: admin, employee)
- tenant_id (FK to tenants)

### `tenants`
- id (UUID, PK)
- name (String)

### `scan_history`
- id (UUID, PK)
- user_id (FK to users)
- timestamp (DateTime)
- risk_score (Integer)
- *Note: Raw prompts will NOT be stored for privacy/security reasons.*

### `findings`
- id (UUID, PK)
- scan_id (FK to scan_history)
- category (String, e.g., PII, API_KEY)
- count (Integer)
