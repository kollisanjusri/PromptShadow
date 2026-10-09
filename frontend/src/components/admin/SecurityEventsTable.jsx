import React from 'react';

const SecurityEventsTable = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Recent Security Events</div>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          No security events found for this selection.
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">Recent Security Events</div>
        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
          View Full Audit Log
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Employee</th>
              <th>Risk Level</th>
              <th>Category</th>
              <th>Action Taken</th>
            </tr>
          </thead>
          <tbody>
            {events.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td style={{ fontWeight: 500 }}>{item.employee}</td>
                <td>
                  <span className={`risk-badge risk-${item.risk}`} style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem' }}>
                    {item.risk}
                  </span>
                </td>
                <td>
                  {item.category !== 'None' ? (
                     <span style={{ 
                        fontFamily: 'monospace', 
                        backgroundColor: 'var(--bg-tertiary)', 
                        padding: '0.15rem 0.4rem', 
                        borderRadius: '4px',
                        fontSize: '0.8125rem'
                      }}>
                        {item.category}
                      </span>
                  ) : (
                    <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                  )}
                </td>
                <td>
                  <span style={{ 
                    color: item.action === 'Allowed' ? 'var(--accent-safe)' : (item.action === 'Blocked' ? 'var(--accent-danger)' : 'var(--text-primary)'),
                    fontWeight: item.action !== 'Allowed' ? 500 : 400
                  }}>
                    {item.action}
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

export default SecurityEventsTable;
