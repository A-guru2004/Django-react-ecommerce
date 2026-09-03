import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const tokens = JSON.parse(localStorage.getItem('tokens'));
      if (tokens?.access) {
        try {
          const res = await axiosClient.get('/accounts/profile/');
          setUser((prev) => ({ ...prev, ...res.data }));
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/accounts/login/', { email, password });
    localStorage.setItem('tokens', JSON.stringify({ access: res.data.access, refresh: res.data.refresh }));
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};