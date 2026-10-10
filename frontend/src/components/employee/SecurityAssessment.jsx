import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

const SecurityAssessment = ({ results }) => {
  if (!results) {
    return (
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Security Assessment</div>
        </div>
        <div className="empty-state">
          <ShieldAlert size={48} />
          <h3>No scan results yet</h3>
          <p>Enter a prompt and click "Scan Prompt" to check for sensitive data and potential risks.</p>
        </div>
      </div>
    );
  }

  const { riskLevel, riskScore, findings } = results;

  const getRiskIcon = () => {
    if (riskLevel === 'Low') return <CheckCircle color="var(--accent-safe)" />;
    if (riskLevel === 'Medium') return <AlertTriangle color="var(--accent-warn)" />;
    return <AlertTriangle color="var(--accent-danger)" />;
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          Security Assessment
          <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: results?.isLiveBackend ? 'var(--accent-primary, #6366f1)' : 'var(--text-tertiary)', marginLeft: '8px' }}>
            {results?.isLiveBackend ? '(FastAPI + Qwen3 4B Live)' : '(Offline Analysis)'}
          </span>
        </div>
      </div>

      <div className="assessment-results">
        <div className="risk-summary">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {getRiskIcon()}
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Overall Risk</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{riskScore} / 100</div>
            </div>
          </div>
          <div className={`risk-badge risk-${riskLevel}`}>
            {riskLevel} RISK
          </div>
        </div>

        {results.message && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)', fontSize: '0.875rem' }}>
            {results.message}
          </div>
        )}

        {findings.length === 0 ? (
          <div className="empty-state" style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
            <ShieldCheck size={32} color="var(--accent-safe)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Looks Safe!</h4>
            <p style={{ fontSize: '0.875rem' }}>No sensitive data detected in this prompt.</p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Findings ({findings.length})</div>
            <div className="findings-list">
              {findings.map(finding => (
                <div key={finding.id} className="finding-card">
                  <div className="finding-header">
                    <span className="finding-category">{finding.category}</span>
                    <span className={`risk-badge risk-${finding.severity}`} style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem' }}>
                      {finding.severity}
                    </span>
                  </div>
                  <div className="finding-affected">
                    {finding.affectedText}
                  </div>
                  <div className="finding-explanation">
                    {finding.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityAssessment;
