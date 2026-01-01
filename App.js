import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { ThemeProvider, useTheme, LanguageProvider } from './src/context';
import { AppNavigator } from './src/navigation';
import { useStadiumStore } from './src/store';
import { stadiumService } from './src/services';
import { CONFIG } from './src/config';

// Main App with Theme Support
const AppContent = () => {
  const { isDarkMode } = useTheme();
  const setLocationLoading = useStadiumStore((state) => state.setLocationLoading);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setLocationLoading(true);
    
    try {
      // 1. Get user location
      let userCoords = null;

      if (Platform.OS === 'web') {
        userCoords = await getWebLocation();
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          userCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
        }
      }

      const finalLocation = userCoords || CONFIG.DEFAULT_LOCATION;
      console.log('User location:', finalLocation);

      // 2. Fetch ALL stadiums from API (not filtered by location)
      console.log('Fetching all stadiums from API...');
      const response = await stadiumService.getStadiums({});
      const stadiums = response.stadiums || response.data || [];
      console.log('Stadiums from API:', stadiums.length);

      if (stadiums.length > 0) {
        // Calculate distances
        const stadiumsWithDistance = stadiums.map((stadium) => ({
          ...stadium,
          distance: calculateDistance(
            finalLocation.latitude,
            finalLocation.longitude,
            stadium.latitude,
            stadium.longitude
          ),
        }));

        const sorted = stadiumsWithDistance.sort((a, b) => a.distance - b.distance);

        useStadiumStore.setState({
          stadiums: sorted,
          filteredStadiums: sorted,
          userLocation: finalLocation,
          locationLoading: false,
          usingRealData: true,
        });
        console.log('Stadiums loaded from API successfully:', sorted.length);
      } else {
        // No stadiums from API
        useStadiumStore.setState({
          stadiums: [],
          filteredStadiums: [],
          userLocation: finalLocation,
          locationLoading: false,
          usingRealData: false,
          searchError: 'لا توجد ملاعب في قاعدة البيانات',
        });
      }
    } catch (error) {
      console.error('Initialize app error:', error);
      useStadiumStore.setState({
        stadiums: [],
        filteredStadiums: [],
        userLocation: CONFIG.DEFAULT_LOCATION,
        locationLoading: false,
        usingRealData: false,
        searchError: 'تعذر الاتصال بالخادم',
      });
    }
  };

  const getWebLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
        () => resolve(null),
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  };
  
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

// Calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
