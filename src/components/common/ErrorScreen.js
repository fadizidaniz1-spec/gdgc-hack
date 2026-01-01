import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES } from '../../constants';
import { Button } from './Button';

// Error types with icons and messages
const ERROR_CONFIG = {
  network: {
    icon: 'wifi-outline',
    title: 'لا يوجد اتصال بالإنترنت',
    titleEn: 'No Internet Connection',
    message: 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى',
    messageEn: 'Check your internet connection and try again',
  },
  server: {
    icon: 'server-outline',
    title: 'خطأ في الخادم',
    titleEn: 'Server Error',
    message: 'حدث خطأ ما. يرجى المحاولة لاحقاً',
    messageEn: 'Something went wrong. Please try again later',
  },
  notFound: {
    icon: 'search-outline',
    title: 'لم يتم العثور على نتائج',
    titleEn: 'No Results Found',
    message: 'جرب تغيير معايير البحث',
    messageEn: 'Try changing your search criteria',
  },
  booking: {
    icon: 'calendar-outline',
    title: 'فشل الحجز',
    titleEn: 'Booking Failed',
    message: 'لم نتمكن من إتمام حجزك. يرجى المحاولة مرة أخرى',
    messageEn: 'We could not complete your booking. Please try again',
  },
  payment: {
    icon: 'card-outline',
    title: 'فشل الدفع',
    titleEn: 'Payment Failed',
    message: 'لم تتم عملية الدفع. تحقق من بيانات الدفع وحاول مرة أخرى',
    messageEn: 'Payment was not processed. Check your payment details and try again',
  },
  auth: {
    icon: 'lock-closed-outline',
    title: 'خطأ في المصادقة',
    titleEn: 'Authentication Error',
    message: 'يرجى تسجيل الدخول مرة أخرى',
    messageEn: 'Please log in again',
  },
  generic: {
    icon: 'alert-circle-outline',
    title: 'حدث خطأ',
    titleEn: 'An Error Occurred',
    message: 'يرجى المحاولة مرة أخرى',
    messageEn: 'Please try again',
  },
};

export const ErrorScreen = ({
  type = 'generic',
  title,
  message,
  onRetry,
  retryText = 'حاول مرة أخرى',
  showRetry = true,
  style,
}) => {
  const { colors } = useTheme();
  const config = ERROR_CONFIG[type] || ERROR_CONFIG.generic;

  const displayTitle = title || config.titleEn;
  const displayMessage = message || config.messageEn;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceVariant }]}>
        <Ionicons name={config.icon} size={64} color={colors.error} />
      </View>
      
      <Text style={[styles.title, { color: colors.text }]}>
        {displayTitle}
      </Text>
      
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {displayMessage}
      </Text>
      
      {showRetry && onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          variant="primary"
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONTS.bold,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  message: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SIZES.xl,
  },
  retryButton: {
    minWidth: 200,
  },
});
