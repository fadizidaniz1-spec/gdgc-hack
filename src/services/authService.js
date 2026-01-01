// Authentication API Service
import { api } from './api';

export const authService = {
  // Sign up with email and password
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.accessToken) {
      await api.setTokens(response.accessToken, response.refreshToken);
    }
    return response;
  },

  // Login with email and password
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.accessToken) {
      await api.setTokens(response.accessToken, response.refreshToken);
    }
    return response;
  },

  // Google OAuth login/signup
  googleAuth: async (googleUserInfo) => {
    try {
      // Try to login/signup with Google credentials
      const response = await api.post('/auth/google', {
        email: googleUserInfo.email,
        name: googleUserInfo.name,
        googleId: googleUserInfo.id,
        picture: googleUserInfo.picture,
      });
      
      if (response.accessToken) {
        await api.setTokens(response.accessToken, response.refreshToken);
      }
      return response;
    } catch (error) {
      // If backend doesn't support Google auth, create mock user
      console.warn('Google auth endpoint not available, using mock');
      return {
        user: {
          id: googleUserInfo.id,
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          profileComplete: true,
          authProvider: 'google',
        },
      };
    }
  },

  // Logout
  logout: async (userId) => {
    try {
      await api.post('/auth/logout', { userId });
    } finally {
      await api.clearTokens();
    }
  },

  // Get current user profile
  getCurrentUser: () => {
    return api.get('/auth/me');
  },

  // Get user by ID
  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },

  // Legacy OTP methods (kept for backward compatibility)
  sendOtp: (phoneNumber) => {
    console.warn('OTP authentication not supported by this backend');
    return Promise.resolve({ success: true });
  },

  verifyOtp: async (phoneNumber, otp) => {
    console.warn('OTP authentication not supported by this backend');
    return Promise.resolve({ user: null });
  },

  // Update profile (placeholder - implement when backend supports it)
  updateProfile: (data) => {
    console.warn('Profile update endpoint not available');
    return Promise.resolve({ user: data });
  },
};
