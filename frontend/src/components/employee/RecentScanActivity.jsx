import React from 'react';
import { History } from 'lucide-react';

const mockHistory = [
  { id: 1, date: '2023-10-25 14:30', risk: 'Medium', findings: 2, action: 'Redacted', status: 'Allowed' },
  { id: 2, date: '2023-10-25 11:15', risk: 'Low', findings: 0, action: 'None', status: 'Allowed' },
  { id: 3, date: '2023-10-24 16:45', risk: 'Critical', findings: 1, action: 'Blocked', status: 'Blocked' },
  { id: 4, date: '2023-10-24 09:20', risk: 'High', findings: 3, action: 'Redacted', status: 'Allowed' },
];

const RecentScanActivity = () => {
  return (
    <div className="panel" style={{ marginTop: '2rem' }}>
      <div className="panel-header">
        <div className="panel-title">
          <History size={20} />
          Recent Scan Activity
        </div>
        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
          View All
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Risk Level</th>
              <th>Findings</th>
              <th>Action Taken</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>
                  <span className={`risk-badge risk-${item.risk}`} style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem' }}>
                    {item.risk}
                  </span>
                </td>
                <td>{item.findings}</td>
                <td>{item.action}</td>
                <td>
                  <span style={{ 
                    color: item.status === 'Allowed' ? 'var(--accent-safe)' : 'var(--accent-danger)',
                    fontWeight: 500 
                  }}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentScanActivity;
