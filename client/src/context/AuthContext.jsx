/**
 * PrepPilot - Auth Context & Provider
 * Manages global authentication state, token persistence, and login/register/logout actions.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, loginUser, registerUser, logoutUser } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('preppilot_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('preppilot_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('preppilot_token');
      if (storedToken) {
        try {
          const res = await getMe();
          if (res.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('preppilot_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, clearing credentials.');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('preppilot_token', res.data.token);
      localStorage.setItem('preppilot_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await registerUser(name, email, password);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('preppilot_token', res.data.token);
      localStorage.setItem('preppilot_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
    localStorage.removeItem('preppilot_token');
    localStorage.removeItem('preppilot_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
