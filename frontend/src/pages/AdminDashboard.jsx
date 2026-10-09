import React, { useState, useEffect } from 'react';
import SummaryCards from '../components/admin/SummaryCards';
import RiskDistribution from '../components/admin/RiskDistribution';
import SensitiveDataCategories from '../components/admin/SensitiveDataCategories';
import SecurityEventsTable from '../components/admin/SecurityEventsTable';
import { getAdminDashboardData } from '../services/adminService';
import { RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('All Team Members');
  const [dateRange, setDateRange] = useState('All Time');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const dashboardData = await getAdminDashboardData(dateRange);
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to load admin data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dateRange]);

  if (loading || !data) {
    return (
      <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw className="animate-spin" /> Loading dashboard data...
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Monitor prompt usage and security risks across your team.</p>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-warn)', fontWeight: 600, display: 'inline-block', marginTop: '0.5rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }}>
            DEMO DATA (Local AI mock simulation)
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <select 
            className="btn btn-secondary"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            style={{ appearance: 'auto' }}
          >
            <option value="All Team Members">All Team Members</option>
            {data.employees.map(emp => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>

          <select 
            className="btn btn-secondary" 
            style={{ appearance: 'auto' }}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      <SummaryCards summary={data.summary} />

      <div className="admin-grid panels-2">
        <RiskDistribution riskData={data.riskDistribution} />
        <SensitiveDataCategories categoryData={data.categories} />
      </div>

      <SecurityEventsTable events={selectedEmployee === 'All Team Members' ? data.events : data.events.filter(e => e.employee === selectedEmployee)} />
    </main>
  );
};

export default AdminDashboard;
