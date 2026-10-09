// Helper to generate dates relative to today
const getRelativeDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().replace('T', ' ').substring(0, 16);
};

// Mock Data for Admin Dashboard - Expanded with different dates
const generateMockEvents = () => {
  return [
    // Today (0-1 days)
    { id: 101, date: getRelativeDate(0), employee: 'Test User 1', risk: 'High', category: 'API Keys', action: 'Redacted' },
    { id: 102, date: getRelativeDate(1), employee: 'Test User 2', risk: 'Critical', category: 'Passwords', action: 'Blocked' },
    { id: 103, date: getRelativeDate(0), employee: 'Test User 3', risk: 'Medium', category: 'PII', action: 'Redacted' },
    { id: 104, date: getRelativeDate(1), employee: 'Test User 1', risk: 'Low', category: 'None', action: 'Allowed' },
    
    // Last 7 Days (2-6 days)
    { id: 105, date: getRelativeDate(3), employee: 'Test User 2', risk: 'Critical', category: 'API Keys', action: 'Blocked' },
    { id: 106, date: getRelativeDate(5), employee: 'Test User 3', risk: 'High', category: 'Confidential Data', action: 'Redacted' },
    { id: 107, date: getRelativeDate(6), employee: 'Test User 1', risk: 'Low', category: 'None', action: 'Allowed' },
    { id: 108, date: getRelativeDate(4), employee: 'Test User 3', risk: 'Medium', category: 'PII', action: 'Redacted' },
    
    // Last 30 Days (7-29 days)
    { id: 109, date: getRelativeDate(14), employee: 'Test User 2', risk: 'High', category: 'Passwords', action: 'Redacted' },
    { id: 110, date: getRelativeDate(20), employee: 'Test User 1', risk: 'Medium', category: 'PII', action: 'Redacted' },
    { id: 111, date: getRelativeDate(28), employee: 'Test User 3', risk: 'Low', category: 'None', action: 'Allowed' },
    { id: 112, date: getRelativeDate(10), employee: 'Test User 1', risk: 'Critical', category: 'API Keys', action: 'Blocked' },
    
    // Last 90 Days (30-89 days)
    { id: 113, date: getRelativeDate(45), employee: 'Test User 3', risk: 'High', category: 'Confidential Data', action: 'Redacted' },
    { id: 114, date: getRelativeDate(60), employee: 'Test User 2', risk: 'Low', category: 'None', action: 'Allowed' },
    { id: 115, date: getRelativeDate(85), employee: 'Test User 1', risk: 'Critical', category: 'Passwords', action: 'Blocked' },
    
    // Older than 90 Days (90+ days)
    { id: 116, date: getRelativeDate(120), employee: 'Test User 1', risk: 'Medium', category: 'PII', action: 'Redacted' },
    { id: 117, date: getRelativeDate(150), employee: 'Test User 2', risk: 'High', category: 'API Keys', action: 'Redacted' },
  ];
};

export const getAdminDashboardData = async (dateRange = 'All Time') => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      let allEvents = generateMockEvents();
      
      // Filter events by date range
      const now = new Date();
      let cutoffDate = new Date(0); // Epoch for 'All Time'
      
      if (dateRange === 'Last 7 Days') {
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
      } else if (dateRange === 'Last 30 Days') {
        cutoffDate = new Date(now.setDate(now.getDate() - 30));
      } else if (dateRange === 'Last 90 Days') {
        cutoffDate = new Date(now.setDate(now.getDate() - 90));
      }

      const filteredEvents = allEvents.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate >= cutoffDate;
      });

      // Calculate summary metrics dynamically based on filtered events
      const totalScans = filteredEvents.length;
      const highRisk = filteredEvents.filter(e => e.risk === 'High' || e.risk === 'Critical').length;
      const redacted = filteredEvents.filter(e => e.action === 'Redacted').length;
      const blocked = filteredEvents.filter(e => e.action === 'Blocked').length;

      const summary = { totalScans, highRisk, redacted, blocked };

      // Calculate Risk Distribution distribution dynamically
      const riskCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
      filteredEvents.forEach(e => {
        if (riskCounts[e.risk] !== undefined) {
          riskCounts[e.risk]++;
        }
      });
      
      const getPercentage = (count, total) => total > 0 ? Math.round((count / total) * 100) : 0;
      
      const riskDistribution = [
        { label: 'Low', count: riskCounts.Low, color: 'var(--accent-safe)', percentage: getPercentage(riskCounts.Low, totalScans) },
        { label: 'Medium', count: riskCounts.Medium, color: 'var(--accent-warn)', percentage: getPercentage(riskCounts.Medium, totalScans) },
        { label: 'High', count: riskCounts.High, color: 'var(--accent-danger)', percentage: getPercentage(riskCounts.High, totalScans) },
        { label: 'Critical', count: riskCounts.Critical, color: 'var(--accent-danger)', percentage: getPercentage(riskCounts.Critical, totalScans) }
      ];

      // Calculate Categories dynamically
      const categoryCounts = {};
      let totalCategories = 0;
      filteredEvents.forEach(e => {
        if (e.category !== 'None') {
          categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
          totalCategories++;
        }
      });
      
      // Standardize to the requested categories if present
      const getCatCount = (cat) => categoryCounts[cat] || 0;
      
      const categories = [
        { label: 'Personal Information (PII)', count: getCatCount('PII'), percentage: getPercentage(getCatCount('PII'), totalCategories) },
        { label: 'API Keys & Secrets', count: getCatCount('API Keys'), percentage: getPercentage(getCatCount('API Keys'), totalCategories) },
        { label: 'Passwords', count: getCatCount('Passwords'), percentage: getPercentage(getCatCount('Passwords'), totalCategories) },
        { label: 'Confidential Business Data', count: getCatCount('Confidential Data'), percentage: getPercentage(getCatCount('Confidential Data'), totalCategories) }
      ];

      resolve({
        summary,
        riskDistribution,
        categories,
        events: filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date)), // Sort newest first
        employees: ['Test User 1', 'Test User 2', 'Test User 3']
      });
    }, 400);
  });
};
