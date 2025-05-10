/**
 * Application configuration
 * 
 * This file provides configuration for different environments.
 * Edit the production settings before deployment.
 */

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';

// Environment variables (will use these if available)
const ENV_API_URL = process.env.REACT_APP_API_URL;

// Base configuration
const config = {
  // Development settings (default)
  development: {
    apiBaseUrl: ENV_API_URL || 'http://localhost:5000', // Development server URL
    apiTimeout: 15000, // API timeout in milliseconds
    cacheEnabled: true,
    cacheDuration: 3 * 60 * 60 * 1000, // 3 hours
  },
  
  // Production settings
  production: {
    apiBaseUrl: ENV_API_URL || 'https://leetlords-backend.vercel.app', 
    apiTimeout: 30000, // Increased timeout for production
    cacheEnabled: true, 
    cacheDuration: 3 * 60 * 60 * 1000, // 3 hours
  }
};

// Export the configuration based on current environment
export default config[isProduction ? 'production' : 'development']; 