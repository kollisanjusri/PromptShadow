from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from app.config import MAX_PROMPT_LENGTH
from app.services.detection import detect_sensitive_data
from app.services.local_llm import analyze_prompt_context
from app.services.policy import evaluate_policy

router = APIRouter(prefix="/api", tags=["Scanner"])


class ScanRequest(BaseModel):
    prompt: str = Field(
        ...,
        description="The prompt text to scan for sensitive data and contextual risks."
    )


class FindingItem(BaseModel):
    type: str
    severity: str
    reason: str


class ScanResponse(BaseModel):
    risk_score: int
    risk_level: str
    findings: List[FindingItem]
    action: str
    modified_prompt: str
    message: str


@router.post("/scan", response_model=ScanResponse, status_code=status.HTTP_200_OK)
def scan_prompt(payload: ScanRequest):
    """
    Scan a prompt for sensitive data, run local LLM contextual risk analysis,
    and enforce security risk policies (allow, redact, block).
    """
    raw_prompt = payload.prompt

    if not raw_prompt or not raw_prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty or contain only whitespace."
        )

    if len(raw_prompt) > MAX_PROMPT_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prompt exceeds maximum allowed length of {MAX_PROMPT_LENGTH} characters."
        )

    # 1. Rule-based sensitive data detection
    rule_findings = detect_sensitive_data(raw_prompt)

    # 2. Local LLM contextual analysis (Ollama qwen3:4b with fallback)
    llm_analysis = analyze_prompt_context(raw_prompt)

    # 3. Policy evaluation (calculates score, risk level, action, redacted prompt)
    policy_result = evaluate_policy(raw_prompt, rule_findings, llm_analysis)

    return ScanResponse(**policy_result)
