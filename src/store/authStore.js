import { create } from 'zustand';
import { authService } from '../services';
import { CONFIG } from '../config';

const USE_API = CONFIG.USE_REAL_API;

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Sign up with email and password
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const response = await authService.signup(userData);
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, user: response.user };
      }
      
      // Mock signup
      const mockUser = {
        id: Date.now().toString(),
        ...userData,
        profileComplete: true,
        createdAt: new Date().toISOString(),
      };
      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, user: mockUser };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Login with email and password
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      if (USE_API) {
        const response = await authService.login(email, password);
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, user: response.user };
      }
      
      // Mock login
      const mockUser = {
        id: Date.now().toString(),
        email,
        name: 'مستخدم تجريبي',
        profileComplete: true,
      };
      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
      return { success: true, user: mockUser };
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Legacy OTP methods (for backward compatibility with existing screens)
  sendOtp: async (phoneNumber) => {
    set({ isLoading: true, error: null });
    try {
      // OTP not supported - just return success for UI flow
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return false;
    }
  },

  // Logout
  logout: async () => {
    const userId = get().user?.id;
    try {
      if (USE_API && userId) {
        await authService.logout(userId);
      }
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      // Update local state
      set((state) => ({
        user: { ...state.user, ...profileData, profileComplete: true },
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      return false;
    }
  },

  // Load user from token (app startup)
  loadUser: async () => {
    if (!USE_API) return;
    
    set({ isLoading: true });
    try {
      const response = await authService.getCurrentUser();
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
