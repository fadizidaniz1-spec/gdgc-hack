import { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES, GRADIENTS } from '../../constants';

// Premium Button component with gradients and micro-interactions
export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  gradient = true,
}) => {
  const { colors } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 6,
    }).start();
  };

  const getGradientColors = () => {
    if (disabled) return [colors.disabled, colors.disabled];
    switch (variant) {
      case 'primary':
        return GRADIENTS.primary;
      case 'secondary':
        return GRADIENTS.secondary;
      case 'success':
        return GRADIENTS.success;
      case 'error':
        return GRADIENTS.error;
      case 'accent':
        return GRADIENTS.accent;
      default:
        return GRADIENTS.primary;
    }
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.disabled;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.primary;
      default:
        return colors.textLight;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SIZES.sm,
          paddingHorizontal: SIZES.lg,
          minHeight: 40,
          borderRadius: SIZES.radiusSm,
        };
      case 'large':
        return {
          paddingVertical: SIZES.lg,
          paddingHorizontal: SIZES.xxl,
          minHeight: 60,
          borderRadius: SIZES.radius,
        };
      default:
        return {
          paddingVertical: SIZES.md,
          paddingHorizontal: SIZES.xl,
          minHeight: 52,
          borderRadius: SIZES.radius,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const useGradient = gradient && !['outline', 'ghost'].includes(variant) && !disabled;

  const textStyles = [
    styles.text,
    { color: getTextColor() },
    size === 'small' && { fontSize: FONT_SIZES.sm },
    size === 'large' && { fontSize: FONT_SIZES.lg },
    textStyle,
  ];

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textLight} 
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </>
  );

  return (
    <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
      >
        {useGradient ? (
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, sizeStyles]}
          >
            <ButtonContent />
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.button,
              sizeStyles,
              { backgroundColor: getBackgroundColor() },
              variant === 'outline' && { 
                borderWidth: 2, 
                borderColor: colors.primary,
                backgroundColor: colors.primary + '10',
              },
            ]}
          >
            <ButtonContent />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.bold,
    letterSpacing: 0.5,
  },
  iconLeft: {
    marginRight: SIZES.sm,
  },
  iconRight: {
    marginLeft: SIZES.sm,
  },
});
