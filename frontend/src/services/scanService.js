const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const scanPrompt = async (promptText) => {
  if (!promptText || !promptText.trim()) {
    return {
      riskLevel: 'Low',
      riskScore: 0,
      findings: [],
      redactedPrompt: '',
      originalPrompt: promptText,
      action: 'allow',
      message: 'Prompt is empty.',
      status: 'Allowed',
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: promptText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Scan request failed' }));
      throw new Error(errorData.detail || `Server returned ${response.status}`);
    }

    const data = await response.json();

    const formatSeverity = (sev) => {
      if (!sev) return 'Low';
      return sev.charAt(0).toUpperCase() + sev.slice(1).toLowerCase();
    };

    const mappedFindings = (data.findings || []).map((item, index) => ({
      id: `finding-${index}-${Date.now()}`,
      category: item.type || 'Sensitive Data',
      severity: formatSeverity(item.severity),
      affectedText: item.type,
      explanation: item.reason,
    }));

    const rawLevel = data.risk_level || 'low';
    const riskLevel = rawLevel.charAt(0).toUpperCase() + rawLevel.slice(1).toLowerCase();

    const actionStatus = data.action === 'block' ? 'Blocked' : data.action === 'redact' ? 'Redacted' : 'Allowed';

    return {
      riskLevel,
      riskScore: data.risk_score,
      findings: mappedFindings,
      redactedPrompt: data.modified_prompt,
      originalPrompt: promptText,
      action: data.action,
      message: data.message,
      status: actionStatus,
      timestamp: new Date().toISOString(),
      isLiveBackend: true,
    };
  } catch (error) {
    console.warn("Real backend unavailable, using mock scanner fallback:", error);
    return mockScanPrompt(promptText);
  }
};

export const mockScanPrompt = async (promptText) => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      if (!promptText.trim()) {
        resolve({ riskLevel: 'Low', riskScore: 0, findings: [], redactedPrompt: '' });
        return;
      }

      const findings = [];
      let redactedPrompt = promptText;
      let riskScore = 0;

      // Simple regex based patterns for mock detection
      const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
      const phoneRegex = /(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;
      const keyRegex = /(api[_-]?key|secret|password|token)[\s:=]+([a-zA-Z0-9]{8,})/gi;

      // Check emails
      let match;
      while ((match = emailRegex.exec(promptText)) !== null) {
        findings.push({
          id: Math.random().toString(36).substr(2, 9),
          category: 'PII',
          severity: 'Medium',
          affectedText: match[0],
          explanation: 'Email address detected. PII should not be shared with external LLMs.'
        });
        redactedPrompt = redactedPrompt.replace(match[0], '[EMAIL_REDACTED]');
        riskScore += 30;
      }

      // Check phones (rudimentary)
      const phoneMatches = promptText.match(phoneRegex);
      if (phoneMatches) {
        phoneMatches.forEach(m => {
          if (m.replace(/\D/g, '').length >= 10) {
            findings.push({
              id: Math.random().toString(36).substr(2, 9),
              category: 'PII',
              severity: 'Medium',
              affectedText: m,
              explanation: 'Phone number detected. Protect user privacy.'
            });
            redactedPrompt = redactedPrompt.replace(m, '[PHONE_REDACTED]');
            riskScore += 30;
          }
        });
      }

      // Check secrets
      while ((match = keyRegex.exec(promptText)) !== null) {
        findings.push({
          id: Math.random().toString(36).substr(2, 9),
          category: 'Credential',
          severity: 'Critical',
          affectedText: match[0],
          explanation: 'Potential API key or secret detected. Critical security risk.'
        });
        redactedPrompt = redactedPrompt.replace(match[2], '[SECRET_REDACTED]');
        riskScore += 60;
      }

      riskScore = Math.min(riskScore, 100);

      let riskLevel = 'Low';
      if (riskScore > 0) riskLevel = 'Medium';
      if (riskScore >= 60) riskLevel = 'High';
      if (riskScore >= 90) riskLevel = 'Critical';

      resolve({
        riskLevel,
        riskScore,
        findings,
        redactedPrompt,
        originalPrompt: promptText,
        action: riskScore >= 90 ? 'block' : riskScore > 0 ? 'redact' : 'allow',
        message: riskScore >= 90 ? 'Prompt blocked due to high risk.' : 'Prompt processed.',
        status: findings.length > 0 ? 'Blocked/Redacted' : 'Allowed',
        timestamp: new Date().toISOString(),
        isLiveBackend: false,
      });
    }, 800);
  });
};
