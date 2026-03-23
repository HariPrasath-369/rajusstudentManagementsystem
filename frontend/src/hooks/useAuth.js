import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Additional custom hook for login form
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};

// Hook for registration
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(userData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
};

// Hook for logout
export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, loading };
};

// Hook for checking user role
export const useRole = () => {
  const { user } = useAuth();
  
  const isPrincipal = user?.role === 'ROLE_PRINCIPAL';
  const isHOD = user?.role === 'ROLE_HOD';
  const isTeacher = user?.role === 'ROLE_TEACHER';
  const isCA = user?.role === 'ROLE_CA';
  const isStudent = user?.role === 'ROLE_STUDENT';
  
  return {
    user,
    role: user?.role,
    isPrincipal,
    isHOD,
    isTeacher,
    isCA,
    isStudent,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles.includes(user?.role),
  };
};