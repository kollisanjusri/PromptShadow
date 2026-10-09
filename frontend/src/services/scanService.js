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
          // simple filter to avoid matching normal small numbers
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
        status: findings.length > 0 ? 'Blocked/Redacted' : 'Allowed',
        timestamp: new Date().toISOString(),
      });
    }, 800);
  });
};
