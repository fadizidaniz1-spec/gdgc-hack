import { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, SHADOWS, GRADIENTS } from '../../constants';
import { StatusBadge } from '../common';

// Premium Booking card with gradient accents
export const BookingCard = ({ booking, onPress }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();
  };

  // Handle different API response formats
  const stadiumName = booking.stadium?.name || booking.stadiumName || 'Stadium';
  const stadiumImage = booking.stadium?.image || booking.stadiumImage;
  const timeSlot = booking.timeSlot || `${booking.startTime || ''} - ${booking.endTime || ''}`;
  const isPaid = booking.isPaid || booking.paymentStatus === 'paid';

  const getStatusGradient = (status) => {
    switch(status) {
      case 'confirmed': return GRADIENTS.success;
      case 'pending': return GRADIENTS.warning;
      case 'cancelled':
      case 'rejected': return GRADIENTS.error;
      default: return GRADIENTS.primary;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Image with Gradient Overlay */}
        {stadiumImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: stadiumImage }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.6)']}
              style={styles.imageOverlay}
            >
              <View style={styles.overlayBadges}>
                <View style={styles.statusBadgeContainer}>
                  <LinearGradient
                    colors={getStatusGradient(booking.status)}
                    style={styles.statusGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons 
                      name={booking.status === 'confirmed' ? 'checkmark-circle' : booking.status === 'pending' ? 'time' : 'close-circle'} 
                      size={12} 
                      color="#fff" 
                    />
                    <Text style={styles.statusText}>
                      {t(booking.status) || booking.status}
                    </Text>
                  </LinearGradient>
                </View>
                {isPaid && (
                  <View style={styles.paidBadge}>
                    <Ionicons name="checkmark-circle" size={12} color="#fff" />
                    <Text style={styles.paidText}>{t('paid') || 'Paid'}</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>
        ) : (
          <View style={[styles.noImageHeader, { backgroundColor: colors.primary + '10' }]}>
            <StatusBadge status={booking.status} />
          </View>
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.stadiumName, { color: colors.text }]} numberOfLines={1}>
              {stadiumName}
            </Text>
            {!stadiumImage && isPaid && (
              <View style={[styles.paidChip, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={[styles.paidChipText, { color: colors.success }]}>{t('paid') || 'Paid'}</Text>
              </View>
            )}
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="calendar" size={14} color={colors.primary} />
              </View>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {booking.date || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.secondary + '15' }]}>
                <Ionicons name="time" size={14} color={colors.secondary} />
              </View>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {timeSlot}
              </Text>
            </View>
            {(booking.duration || booking.fieldSize) && (
              <View style={styles.detailRow}>
                <View style={[styles.detailIcon, { backgroundColor: colors.accent + '15' || colors.info + '15' }]}>
                  <Ionicons name="football" size={14} color={colors.accent || colors.info} />
                </View>
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                  {booking.duration ? `${booking.duration} ${t('hours') || 'hour(s)'}` : booking.fieldSize}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <View style={styles.priceContainer}>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>{t('total') || 'Total'}</Text>
              <Text style={[styles.price, { color: colors.primary }]}>
                {booking.totalPrice || 0} <Text style={styles.priceCurrency}>DA</Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radiusLg,
    marginBottom: SIZES.md,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    padding: SIZES.sm,
  },
  overlayBadges: {
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  statusBadgeContainer: {
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  statusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.bold,
    color: '#fff',
    textTransform: 'capitalize',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,200,83,0.9)',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  paidText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.bold,
    color: '#fff',
  },
  noImageHeader: {
    padding: SIZES.md,
    alignItems: 'flex-start',
  },
  content: {
    padding: SIZES.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  stadiumName: {
    fontSize: FONT_SIZES.lg,
    flex: 1,
    fontWeight: FONTS.bold,
    marginRight: SIZES.sm,
  },
  paidChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  paidChipText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.semiBold,
  },
  details: {
    gap: SIZES.sm,
    marginBottom: SIZES.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SIZES.md,
    borderTopWidth: 1,
  },
  priceContainer: {},
  priceLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: 2,
  },
  price: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONTS.bold,
  },
  priceCurrency: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.medium,
  },
  viewBtn: {
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  viewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  viewText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.semiBold,
    color: '#fff',
  },
});
