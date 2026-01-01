// API Configuration and Base Service
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { CONFIG } from '../config';

// Simple storage fallback for web
const webStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  deleteItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

class ApiService {
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
  }

  async getToken() {
    try {
      if (Platform.OS === 'web') {
        return webStorage.getItem('accessToken');
      }
      return await SecureStore.getItemAsync('accessToken');
    } catch (error) {
      console.log('Get token error:', error);
      return null;
    }
  }

  async setTokens(accessToken, refreshToken) {
    try {
      if (Platform.OS === 'web') {
        webStorage.setItem('accessToken', accessToken);
        webStorage.setItem('refreshToken', refreshToken);
      } else {
        await SecureStore.setItemAsync('accessToken', accessToken);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
      }
    } catch (error) {
      console.log('Set tokens error:', error);
    }
  }

  async clearTokens() {
    try {
      if (Platform.OS === 'web') {
        webStorage.deleteItem('accessToken');
        webStorage.deleteItem('refreshToken');
      } else {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      }
    } catch (error) {
      console.log('Clear tokens error:', error);
    }
  }

  async request(endpoint, options = {}) {
    const token = await this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      console.log('API Request:', `${this.baseUrl}${endpoint}`, config.method);
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid response from server');
      }

      console.log('API Response:', response.status, data);

      if (!response.ok) {
        // Handle token refresh
        if (response.status === 401) {
          const refreshed = await this.refreshToken();
          if (refreshed) {
            return this.request(endpoint, options);
          }
        }
        throw new Error(data.message || data.error?.message || `Request failed (${response.status})`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await this.setTokens(data.accessToken, data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // GET request
  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  // POST request
  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  // PUT request
  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload(endpoint, file, fieldName = 'file') {
    const token = await this.getToken();
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  }
}

export const api = new ApiService();
