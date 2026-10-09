import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="nav-logo">
          <Shield color="var(--accent-primary)" />
          PromptShadow
        </div>
        <div className="nav-tagline">Smart Data Leak Prevention for AI Chatbots</div>
      </div>
      
      <div className="nav-links">
        {currentUser.role === 'Employee' && (
          <>
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Prompt Scanner
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My History
            </NavLink>
          </>
        )}
        
        {currentUser.role === 'Admin' && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Admin Dashboard
          </NavLink>
        )}
      </div>

      <div className="nav-right">
        
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="user-profile">
          <div className="avatar">{currentUser.name.charAt(0)}</div>
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-role">{currentUser.role}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="btn btn-secondary" 
          style={{ padding: '0.5rem', marginLeft: '0.5rem' }} 
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
