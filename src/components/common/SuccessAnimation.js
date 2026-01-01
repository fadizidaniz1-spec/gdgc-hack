import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES } from '../../constants';

export const SuccessAnimation = ({
  visible,
  title = 'Success!',
  message,
  onAnimationEnd,
  duration = 2000,
}) => {
  const { colors } = useTheme();
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset values
      scaleValue.setValue(0);
      opacityValue.setValue(0);
      checkScale.setValue(0);
      ringScale.setValue(0);

      // Animation sequence
      Animated.sequence([
        // Fade in and scale up container
        Animated.parallel([
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(scaleValue, {
            toValue: 1,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
          }),
        ]),
        // Ring animation
        Animated.timing(ringScale, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        // Checkmark bounce
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 3,
          tension: 150,
          useNativeDriver: true,
        }),
        // Hold
        Animated.delay(duration - 800),
        // Fade out
        Animated.parallel([
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        { backgroundColor: colors.overlay },
        { opacity: opacityValue },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: colors.surface },
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        <View style={styles.iconWrapper}>
          {/* Animated ring */}
          <Animated.View
            style={[
              styles.ring,
              { borderColor: colors.success },
              {
                transform: [{ scale: ringScale }],
                opacity: ringScale,
              },
            ]}
          />
          
          {/* Checkmark icon */}
          <Animated.View
            style={[
              styles.checkContainer,
              { backgroundColor: colors.success },
              { transform: [{ scale: checkScale }] },
            ]}
          >
            <Ionicons name="checkmark" size={40} color={colors.textLight} />
          </Animated.View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        
        {message && (
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {message}
          </Text>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    padding: SIZES.xxl,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
    minWidth: 250,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  ring: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
  checkContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONTS.bold,
    marginBottom: SIZES.xs,
  },
  message: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
});
