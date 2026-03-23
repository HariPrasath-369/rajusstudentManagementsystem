import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sms_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle different error statuses
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('sms_auth_token');
          localStorage.removeItem('sms_user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error(data.message || 'You don\'t have permission to perform this action');
          break;
        case 404:
          toast.error(data.message || 'Resource not found');
          break;
        case 409:
          toast.error(data.message || 'Conflict occurred');
          break;
        case 422:
          // Validation error
          if (data.errors) {
            Object.values(data.errors).forEach(errorMsg => {
              toast.error(errorMsg);
            });
          } else {
            toast.error(data.message || 'Validation failed');
          }
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      toast.error(error.message || 'Request failed');
    }

    return Promise.reject(error);
  }
);

// Helper function for file uploads
export const uploadFile = async (url, file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  };

  return api.post(url, formData, config);
};

// Helper function for downloads
export const downloadFile = async (url, filename) => {
  const response = await api.get(url, {
    responseType: 'blob',
  });

  const blob = new Blob([response], { type: response.type });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

export default api;