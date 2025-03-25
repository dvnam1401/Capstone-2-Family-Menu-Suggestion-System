
// src/services/authService.js
import api from './api';
import jwtDecode from 'jwt-decode';

const authService = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;
      
      // Store tokens in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  
  // Register new user
  register: async (name, email, phone, password) => {
    try {
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        phone, 
        password 
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  
  // Logout
  logout: async () => {
    try {
      // Call logout endpoint to invalidate refresh token
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Remove tokens from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return null;
      }
      
      // Check if token is expired
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token is expired, try to refresh
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            throw new Error('No refresh token');
          }
          
          const response = await api.post('/auth/refresh-token', { refreshToken });
          const { token: newToken } = response.data;
          
          localStorage.setItem('token', newToken);
        } catch (error) {
          // Refresh failed, clear storage and return null
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          return null;
        }
      }
      
      // Get user profile with the (potentially refreshed) token
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },
  
  // Login with Google
  loginWithGoogle: async () => {
    try {
      // In a real app, this would likely open a popup window for OAuth
      // For now, we'll just simulate with an API call
      const response = await api.post('/auth/google');
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Google login failed');
    }
  },
  
  // Login with Facebook
  loginWithFacebook: async () => {
    try {
      // Similar to Google login
      const response = await api.post('/auth/facebook');
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Facebook login failed');
    }
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  },
  
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', { 
        currentPassword, 
        newPassword 
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  },
  
  // Reset password (request reset link)
  resetPassword: async (email) => {
    try {
      await api.post('/auth/reset-password', { email });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  },
  
  // Verify email
  verifyEmail: async (token) => {
    try {
      await api.post('/auth/verify-email', { token });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  }
};

export default authService;
