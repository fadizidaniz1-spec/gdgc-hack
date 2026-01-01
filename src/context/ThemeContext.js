import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS } from '../constants/theme';

// Default context value to prevent errors
const defaultContextValue = {
  isDarkMode: false,
  isSystemTheme: true,
  colors: LIGHT_COLORS,
  toggleTheme: () => {},
  setTheme: () => {},
};

const ThemeContext = createContext(defaultContextValue);

const THEME_STORAGE_KEY = '@stadium_booking_theme';

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update theme when system theme changes (if using system theme)
  useEffect(() => {
    if (isSystemTheme && isReady) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isSystemTheme, isReady]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const { isDark, useSystem } = JSON.parse(savedTheme);
        setIsSystemTheme(useSystem);
        if (!useSystem) {
          setIsDarkMode(isDark);
        } else {
          setIsDarkMode(systemColorScheme === 'dark');
        }
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    } finally {
      setIsReady(true);
    }
  };

  const saveThemePreference = async (isDark, useSystem) => {
    try {
      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({ isDark, useSystem })
      );
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    setIsSystemTheme(false);
    saveThemePreference(newIsDark, false);
  };

  const setTheme = (mode) => {
    if (mode === 'system') {
      setIsSystemTheme(true);
      setIsDarkMode(systemColorScheme === 'dark');
      saveThemePreference(systemColorScheme === 'dark', true);
    } else {
      const isDark = mode === 'dark';
      setIsDarkMode(isDark);
      setIsSystemTheme(false);
      saveThemePreference(isDark, false);
    }
  };

  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const value = {
    isDarkMode,
    isSystemTheme,
    colors,
    toggleTheme,
    setTheme,
  };

  // Show loading screen while theme is being loaded
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: LIGHT_COLORS.background }}>
        <ActivityIndicator size="large" color={LIGHT_COLORS.primary} />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  // Return default value if context is not available
  return context || defaultContextValue;
};

export default ThemeContext;
