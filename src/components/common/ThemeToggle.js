import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES } from '../../constants';

export const ThemeToggle = ({ showLabel = true, size = 'medium' }) => {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const translateX = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const rotateValue = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: isDarkMode ? 1 : 0,
        useNativeDriver: true,
        friction: 5,
        tension: 100,
      }),
      Animated.timing(rotateValue, {
        toValue: isDarkMode ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDarkMode]);

  const getSize = () => {
    switch (size) {
      case 'small':
        return { track: 44, thumb: 20, icon: 14 };
      case 'large':
        return { track: 64, thumb: 28, icon: 20 };
      default:
        return { track: 54, thumb: 24, icon: 16 };
    }
  };

  const dimensions = getSize();
  const trackWidth = dimensions.track;
  const thumbSize = dimensions.thumb;
  const padding = 3;
  const translateDistance = trackWidth - thumbSize - padding * 2;

  const thumbTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, translateDistance],
  });

  const iconRotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={[styles.label, { color: colors.text }]}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={toggleTheme}
        activeOpacity={0.8}
        accessibilityRole="switch"
        accessibilityState={{ checked: isDarkMode }}
        accessibilityLabel={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <View
          style={[
            styles.track,
            {
              width: trackWidth,
              height: thumbSize + padding * 2,
              backgroundColor: isDarkMode ? colors.primary : colors.border,
              borderRadius: (thumbSize + padding * 2) / 2,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                backgroundColor: colors.surface,
                borderRadius: thumbSize / 2,
                transform: [{ translateX: thumbTranslate }],
              },
            ]}
          >
            <Animated.View style={{ transform: [{ rotate: iconRotate }] }}>
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={dimensions.icon}
                color={isDarkMode ? colors.primary : colors.secondary}
              />
            </Animated.View>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.medium,
  },
  track: {
    justifyContent: 'center',
    padding: 3,
  },
  thumb: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
