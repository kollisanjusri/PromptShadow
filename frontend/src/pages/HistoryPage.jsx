import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminDashboardData } from '../services/adminService';
import { RefreshCw, History } from 'lucide-react';

const HistoryPage = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getAdminDashboardData('All Time');
        // Filter out events specific to this employee based on their actual mock user name or ID
        const userEvents = data.events.filter(e => e.employee === currentUser.name);
        setEvents(userEvents);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [currentUser]);

  if (loading) {
    return (
      <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw className="animate-spin" /> Loading your history...
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h1 className="page-title">My Scan History</h1>
        <p className="page-subtitle">Review your past prompt assessments and redactions.</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Viewing history for <strong>{currentUser.name}</strong> ({currentUser.department})
        </p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <History size={20} />
            Recent Scan Activity
          </div>
        </div>

        {events.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
            You have no scan history yet.
          </div>
        ) : (
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
                {events.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>
                      <span className={`risk-badge risk-${item.risk}`} style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem' }}>
                        {item.risk}
                      </span>
                    </td>
                    <td>{item.category !== 'None' ? 1 : 0}</td>
                    <td>{item.action}</td>
                    <td>
                      <span style={{ 
                        color: item.action === 'Allowed' ? 'var(--accent-safe)' : 'var(--accent-danger)',
                        fontWeight: 500 
                      }}>
                        {item.action === 'Allowed' ? 'Allowed' : 'Blocked'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default HistoryPage;
