import React, { useState } from 'react';
import { Copy, ShieldCheck, Check } from 'lucide-react';

const ProtectedPrompt = ({ results }) => {
  const [copied, setCopied] = useState(false);

  if (!results || results.findings.length === 0) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(results.redactedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="protected-prompt-section">
      <div className="panel" style={{ backgroundColor: 'var(--bg-tertiary)', borderStyle: 'dashed' }}>
        <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
          <div className="panel-title" style={{ color: 'var(--accent-primary)' }}>
            <ShieldCheck size={20} />
            Protected Prompt Ready
          </div>
          <div className="actions">
            <button className="btn btn-primary" onClick={handleCopy}>
              {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Protected Prompt</>}
            </button>
          </div>
        </div>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Sensitive values have been replaced with placeholders. It is now safer to share this with external AI models.
        </p>

        <div className="two-column" style={{ marginBottom: 0 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
              Original (Blocked)
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--input-bg)', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              opacity: 0.7
            }}>
              {results.originalPrompt}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              Safe Version (Allowed)
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--input-bg)', 
              borderRadius: '8px', 
              border: '2px solid var(--accent-primary)',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap'
            }}>
              {results.redactedPrompt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedPrompt;
