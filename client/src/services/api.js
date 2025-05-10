import axios from 'axios';
import config from '../config';

/**
 * API client configuration
 * This sets up a consistent way to interact with the backend API
 */

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication if needed
api.interceptors.request.use((config) => {
  // You can add auth token here if needed
  // const token = localStorage.getItem('auth_token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors or perform logging
    if (error.response) {
      // Server responded with error status (outside of 2xx range)
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Request Error:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default api; 