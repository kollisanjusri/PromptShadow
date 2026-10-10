from typing import List, Dict, Any, Optional
from app.services.redaction import redact_sensitive_data

# Mandatory secret types that trigger automatic blocking logic
MANDATORY_BLOCK_TYPES = {"PASSWORD", "API_KEY", "ACCESS_TOKEN", "PRIVATE_KEY", "CREDENTIAL"}


def evaluate_policy(
    prompt: str,
    findings: List[Dict[str, Any]],
    llm_analysis: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Risk scoring engine and action policy module.
    Calculates risk score (0-100), classifies risk level (low, medium, high, critical),
    and determines action (allow, redact, block).
    
    Ensures deterministic rule enforcement: LLM analysis can elevate risk but NEVER
    overrides mandatory credential-blocking rules.
    """
    if llm_analysis is None:
        llm_analysis = {}

    has_mandatory_credential = any(
        finding.get("type") in MANDATORY_BLOCK_TYPES for finding in findings
    )

    # 1. Base rule scoring
    rule_score = 0
    if has_mandatory_credential:
        rule_score = 95
    elif len(findings) > 0:
        rule_score = 50

    # 2. Combine with LLM score safely (rule floor cannot be lowered by LLM)
    llm_score = int(llm_analysis.get("risk_score", 0)) if llm_analysis else 0
    llm_score = max(0, min(100, llm_score))

    final_risk_score = max(rule_score, llm_score)

    # Force minimum 90 for mandatory credential findings
    if has_mandatory_credential:
        final_risk_score = max(90, final_risk_score)

    # 3. Classify risk level
    if final_risk_score >= 90:
        risk_level = "critical"
    elif final_risk_score >= 70:
        risk_level = "high"
    elif final_risk_score >= 40:
        risk_level = "medium"
    else:
        risk_level = "low"

    # 4. Action determination
    # Deterministic Override: mandatory credentials ALWAYS trigger 'block'
    if has_mandatory_credential:
        action = "block"
        message = "Prompt contains mandatory credential secrets and has been blocked."
    elif final_risk_score >= 70:
        action = "block"
        message = f"Prompt blocked due to {risk_level} risk score ({final_risk_score})."
    elif len(findings) > 0 or final_risk_score >= 40:
        action = "redact"
        message = "Sensitive data detected and redacted successfully."
    else:
        action = "allow"
        message = "Prompt analyzed successfully: no sensitive data detected."

    # 5. Produce redacted prompt copy
    modified_prompt = redact_sensitive_data(prompt)

    return {
        "risk_score": final_risk_score,
        "risk_level": risk_level,
        "findings": findings,
        "action": action,
        "modified_prompt": modified_prompt,
        "message": message
    }
