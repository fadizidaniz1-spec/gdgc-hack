# Stadium Booking App

تطبيق حجز ملاعب كرة القدم في الجزائر مع ميزة البحث عن مباريات.

## Features

- 🏟️ Browse and book football stadiums
- 📍 Location-based stadium search (nearest first)
- ⚽ Find and join matches with players at your skill level
- 📅 Easy booking with date/time selection
- 💳 Multiple payment methods (CIB, Baridi Mob, Cash)
- 🌙 Dark/Light theme support
- 🌐 Multi-language support (Arabic, English, French)

## Tech Stack

- React Native + Expo
- React Navigation
- Zustand (State Management)
- Expo Location
- Google Places API (optional)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Backend Integration

### Quick Setup

1. Open `src/config/index.js`
2. Set your backend URL:
```javascript
API_BASE_URL: 'https://your-api.com/v1',
```
3. Enable API mode:
```javascript
USE_REAL_API: true,
```

### API Documentation

Full API documentation is available at `docs/api-swagger.yaml`

Import it into [Swagger Editor](https://editor.swagger.io/) to view.

### API Endpoints Required

| Module | Endpoints |
|--------|-----------|
| Auth | `/auth/send-otp`, `/auth/verify-otp`, `/auth/refresh-token`, `/auth/logout` |
| Users | `/users/me` (GET, PUT), `/users/me/avatar`, `/users/me/notifications` |
| Stadiums | `/stadiums` (GET), `/stadiums/{id}`, `/stadiums/{id}/availability`, `/stadiums/{id}/reviews` |
| Bookings | `/bookings` (GET, POST), `/bookings/{id}`, `/bookings/{id}/cancel`, `/bookings/{id}/payment` |
| Matches | `/matches` (GET, POST), `/matches/{id}`, `/matches/{id}/join`, `/matches/{id}/leave` |

### Authentication

The app uses JWT Bearer tokens. The API service handles:
- Token storage (SecureStore)
- Automatic token refresh
- Auth header injection

### Google Places API (Optional)

For real stadium search from Google Maps:

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable: Places API, Maps SDK for Android/iOS
3. Add key to `src/config/index.js`:
```javascript
GOOGLE_PLACES_API_KEY: 'your-api-key',
USE_GOOGLE_PLACES: true,
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/         # App configuration
├── constants/      # Theme, sizes, constants
├── context/        # React contexts (Theme)
├── data/           # Mock data
├── navigation/     # React Navigation setup
├── screens/        # App screens
├── services/       # API services
├── store/          # Zustand stores
└── utils/          # Utility functions

docs/
└── api-swagger.yaml  # API documentation
```

## Configuration

All configuration is centralized in `src/config/index.js`:

```javascript
export const CONFIG = {
  API_BASE_URL: 'https://api.stadiumbook.dz/v1',
  USE_REAL_API: false,      // Toggle API/Mock
  USE_GOOGLE_PLACES: false, // Toggle Google Places
  GOOGLE_PLACES_API_KEY: 'your-key',
  DEFAULT_LOCATION: { latitude: 36.7538, longitude: 3.0588 },
  SEARCH_RADIUS_KM: 10,
};
```

## License

MIT
