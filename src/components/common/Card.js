import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context';
import { SIZES, SHADOWS } from '../../constants';

// Reusable Card component with theme support
export const Card = ({ children, style, variant = 'default' }) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'elevated':
        return colors.surface;
      case 'outlined':
        return 'transparent';
      default:
        return colors.surface;
    }
  };

  return (
    <View 
      style={[
        styles.card, 
        { backgroundColor: getBackgroundColor() },
        variant === 'outlined' && { borderWidth: 1, borderColor: colors.border },
        variant === 'elevated' && SHADOWS.medium,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.md,
    ...SHADOWS.small,
  },
});
