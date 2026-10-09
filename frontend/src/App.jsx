import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import EmployeePage from './pages/EmployeePage';
import AdminDashboard from './pages/AdminDashboard';
import HistoryPage from './pages/HistoryPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const [theme, setTheme] = useState('dark');
  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {!isLoginPage && currentUser && (
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      )}
      
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage theme={theme} toggleTheme={toggleTheme} />} 
        />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <EmployeePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/history" 
          element={
            <ProtectedRoute allowedRoles={['Employee']}>
              <HistoryPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
