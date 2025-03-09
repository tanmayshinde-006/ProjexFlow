import axios from 'axios';

// Set base URL for all API requests
axios.defaults.baseURL = 'http://localhost:5001';

// Add request interceptor to handle errors globally
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject(error);
  }
);

export default axios;