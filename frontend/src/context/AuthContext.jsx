import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('sms_auth_token'));
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = authService.getCurrentUser();
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response);
      setToken(response.accessToken);
      showSuccess('Login successful!');
      return response;
    } catch (error) {
      showError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  }, [showSuccess, showError]);

  const register = useCallback(async (userData) => {
    try {
      const response = await authService.register(userData);
      showSuccess('Registration successful! Please login.');
      return response;
    } catch (error) {
      showError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  }, [showSuccess, showError]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      showSuccess('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [showSuccess]);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedUser };
      localStorage.setItem('sms_user', JSON.stringify(newUser));
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser,
    hasRole: (role) => user?.role === role,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};