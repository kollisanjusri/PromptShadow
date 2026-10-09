import React from 'react';
import { Shield, AlertTriangle, ShieldCheck, Ban } from 'lucide-react';

const SummaryCards = ({ summary }) => {
  return (
    <div className="admin-grid cards-4">
      <div className="summary-card">
        <div className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} color="var(--text-secondary)" />
          Total Scans
        </div>
        <div className="summary-value">{summary.totalScans}</div>
      </div>
      
      <div className="summary-card">
        <div className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={16} color="var(--accent-danger)" />
          High & Critical Risk
        </div>
        <div className="summary-value" style={{ color: 'var(--accent-danger)' }}>{summary.highRisk}</div>
      </div>

      <div className="summary-card">
        <div className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} color="var(--accent-safe)" />
          Redacted
        </div>
        <div className="summary-value" style={{ color: 'var(--accent-safe)' }}>{summary.redacted}</div>
      </div>

      <div className="summary-card">
        <div className="summary-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ban size={16} color="var(--text-secondary)" />
          Blocked
        </div>
        <div className="summary-value">{summary.blocked}</div>
      </div>
    </div>
  );
};

export default SummaryCards;
