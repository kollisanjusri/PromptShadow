import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, login as authServiceLogin, logout as authServiceLogout } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    const user = await authServiceLogin(username, password, role);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    authServiceLogout();
    setCurrentUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
