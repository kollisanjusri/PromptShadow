import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginPage = ({ theme, toggleTheme }) => {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect them
  if (currentUser) {
    return <Navigate to={currentUser.role === 'Admin' ? '/admin' : '/'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(username, password, role);
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Simple header for theme toggle */}
      <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Shield size={20} /> : <Shield size={20} />} 
          {/* using sun/moon icon here would be better but we didn't import it in this file, we can just use the toggle via props if we want but it's simpler to just import Sun/Moon */}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="panel" style={{ maxWidth: '420px', width: '100%', padding: '2.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <Shield size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>PromptShadow</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Smart Data Leak Prevention for AI Chatbots
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('Employee')}
                  className="btn"
                  style={{ 
                    backgroundColor: role === 'Employee' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: role === 'Employee' ? '#fff' : 'var(--text-secondary)',
                    border: role === 'Employee' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    justifyContent: 'center'
                  }}
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className="btn"
                  style={{ 
                    backgroundColor: role === 'Admin' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: role === 'Admin' ? '#fff' : 'var(--text-secondary)',
                    border: role === 'Admin' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    justifyContent: 'center'
                  }}
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.9375rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', 
                    backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.9375rem',
                    paddingRight: '2.5rem'
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', marginTop: '0.5rem', fontSize: '1rem' }}
              disabled={isLoading || !username || !password}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
