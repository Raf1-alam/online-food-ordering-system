import React, { createContext, useState, useEffect } from 'react';
import api, { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on initial load
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      // In a real app, you might want to fetch user profile here
      // For now, we decode JWT or just assume authenticated if token exists
      // The backend will validate it anyway on requests
      
      // Temporary hack: Extract role from token payload if possible, or store user object in LS
      const storedUser = localStorage.getItem('ofos_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from local storage", e);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, role, ...userData } = response.data.data;
    
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    const userObj = { ...userData, role };
    localStorage.setItem('ofos_user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { accessToken, refreshToken, role, ...userObj } = response.data.data;
    
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    const fullUser = { ...userObj, role };
    localStorage.setItem('ofos_user', JSON.stringify(fullUser));
    setUser(fullUser);
    return fullUser;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error("Logout failed on server, clearing local storage anyway", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('ofos_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
