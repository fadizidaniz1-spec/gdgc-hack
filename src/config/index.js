// App Configuration
// Change these settings to connect to your backend

export const CONFIG = {
  // API Settings
  // API_BASE_URL: 'https://api.stadiumbook.dz/v1', // Production
  // API_BASE_URL: 'http://localhost:3000', // Local Development
  API_BASE_URL: 'https://5656dbe19b30.ngrok-free.app', // ngrok Backend
  
  // Feature Flags
  USE_REAL_API: true, // Set to true to use backend API
  USE_GOOGLE_PLACES: false, // Set to false - using backend for stadiums
  
  // Google Places API (for stadium search)
  GOOGLE_PLACES_API_KEY: '',
  
  // Google OAuth Client IDs
  GOOGLE_EXPO_CLIENT_ID: '546986289081-ubfvi7jg5n2cggf3ghgn3ga3uafavv4p.apps.googleusercontent.com',
  GOOGLE_WEB_CLIENT_ID: '546986289081-ubfvi7jg5n2cggf3ghgn3ga3uafavv4p.apps.googleusercontent.com',
  GOOGLE_IOS_CLIENT_ID: '546986289081-ubfvi7jg5n2cggf3ghgn3ga3uafavv4p.apps.googleusercontent.com',
  GOOGLE_ANDROID_CLIENT_ID: '546986289081-7nianikei0j2p2lq45kkjc9u2agvmm2q.apps.googleusercontent.com',
  
  // App Settings
  DEFAULT_LOCATION: {
    latitude: 36.7538, // Algiers
    longitude: 3.0588,
  },
  SEARCH_RADIUS_KM: 10,
  
  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
};

// Environment check
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;

