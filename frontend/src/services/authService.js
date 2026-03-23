import api from './api';

export const authService = {
  // User login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.accessToken) {
      localStorage.setItem('sms_auth_token', response.accessToken);
      localStorage.setItem('sms_user', JSON.stringify(response));
    }
    return response;
  },

  // User registration
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  // Send OTP for password reset
  forgotPassword: async (email) => {
    return await api.post(`/auth/send-otp?email=${email}`);
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    return await api.post('/auth/verify-otp', { email, otp });
  },

  // Reset password
  resetPassword: async (email, otp, newPassword) => {
    return await api.post('/auth/reset-password', { email, otp, newPassword });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('sms_auth_token');
    localStorage.removeItem('sms_user');
  },

  // Get current user from storage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('sms_user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('sms_auth_token');
    return !!token;
  },

  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role;
  },

  // Check if user has specific role
  hasRole: (role) => {
    const userRole = authService.getUserRole();
    return userRole === role;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    if (response) {
      const currentUser = authService.getCurrentUser();
      const updatedUser = { ...currentUser, ...response };
      localStorage.setItem('sms_user', JSON.stringify(updatedUser));
    }
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    return await api.put('/users/change-password', passwordData);
  },
};