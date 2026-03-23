// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
};

// Request Headers
export const HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  MULTIPART: {
    'Content-Type': 'multipart/form-data',
  },
  STREAM: {
    'Content-Type': 'application/octet-stream',
  },
};

// Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Axios Configuration
export const axiosConfig = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: HEADERS.JSON,
  withCredentials: true,
};

// WebSocket Configuration
export const wsConfig = {
  url: API_CONFIG.WS_URL,
  reconnect: true,
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
};

// Cache Configuration
export const cacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  staleWhileRevalidate: true,
};

// Rate Limiting
export const rateLimitConfig = {
  enabled: process.env.NODE_ENV === 'production',
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
};

// Request Interceptor
export const requestInterceptor = (config) => {
  const token = localStorage.getItem('sms_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response Interceptor
export const responseInterceptor = {
  success: (response) => response,
  error: async (error) => {
    const originalRequest = error.config;
    
    // Handle token refresh
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('sms_refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          localStorage.setItem('sms_auth_token', response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Redirect to login on refresh failure
        localStorage.removeItem('sms_auth_token');
        localStorage.removeItem('sms_user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  },
};