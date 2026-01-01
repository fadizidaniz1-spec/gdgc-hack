import { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES, SHADOWS } from '../../constants';

const DEFAULT_STADIUM_IMAGE = 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400';

// Premium Stadium card with gradient overlay and glass effects
export const StadiumCard = ({ stadium, onPress, variant = 'default' }) => {
  const { colors, isDarkMode } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [imageError, setImageError] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  const imageUri = imageError || !stadium.image || stadium.image.includes('example.com') 
    ? DEFAULT_STADIUM_IMAGE 
    : stadium.image;

  // Featured card variant (larger, more prominent)
  if (variant === 'featured') {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleValue }] }, styles.featuredContainer]}>
        <TouchableOpacity 
          onPress={onPress} 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={[styles.featuredCard, SHADOWS.large]}>
            <Image 
              source={{ uri: imageUri }} 
              style={styles.featuredImage} 
              onError={() => setImageError(true)}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadges}>
                  <View style={[styles.liveBadge, { backgroundColor: colors.success }]}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>OPEN</Text>
                  </View>
                  <View style={[styles.ratingBadge]}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingTextWhite}>{stadium.rating ?? 0}</Text>
                  </View>
                </View>
                <Text style={styles.featuredName} numberOfLines={1}>{stadium.name}</Text>
                <View style={styles.featuredInfo}>
                  <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.featuredAddress} numberOfLines={1}>{stadium.address}</Text>
                </View>
                <View style={styles.featuredFooter}>
                  <View style={styles.featuredStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="football" size={16} color={colors.primary} />
                      <Text style={styles.statText}>{stadium.fieldSize}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="navigate" size={16} color={colors.accent || colors.info} />
                      <Text style={styles.statText}>{stadium.distance?.toFixed(1) ?? 0} km</Text>
                    </View>
                  </View>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceAmount}>{stadium.pricePerHour}</Text>
                    <Text style={styles.priceCurrency}>DA/h</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Default card variant
  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]} 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.image} 
            onError={() => setImageError(true)}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageOverlay}
          >
            <View style={styles.overlayContent}>
              <View style={[styles.fieldBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="football-outline" size={12} color="#fff" />
                <Text style={styles.fieldBadgeText}>{stadium.fieldSize || '5v5'}</Text>
              </View>
              <View style={styles.distanceBadge}>
                <Ionicons name="navigate" size={12} color="#fff" />
                <Text style={styles.distanceText}>{stadium.distance?.toFixed(1) ?? 0} km</Text>
              </View>
            </View>
          </LinearGradient>
          {/* Rating badge */}
          <View style={[styles.ratingContainer, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.95)' }]}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingValue, { color: colors.text }]}>{stadium.rating ?? 0}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {stadium.name || 'ملعب'}
          </Text>
          
          <View style={styles.addressRow}>
            <Ionicons name="location" size={14} color={colors.textSecondary} />
            <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
              {stadium.address || 'عنوان غير متوفر'}
            </Text>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.amenitiesRow}>
              {stadium.amenities?.slice(0, 3).map((amenity, index) => (
                <View key={index} style={[styles.amenityChip, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={[styles.amenityText, { color: colors.textSecondary }]}>
                    {amenity.length > 8 ? amenity.substring(0, 8) + '...' : amenity}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.primary }]}>{stadium.pricePerHour || 0}</Text>
              <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>DA/h</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Default Card Styles
  card: {
    borderRadius: SIZES.cardRadius || 20,
    marginBottom: SIZES.md,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: '#E0E0E0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    paddingHorizontal: SIZES.sm,
    paddingBottom: SIZES.sm,
  },
  overlayContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    gap: 4,
  },
  fieldBadgeText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.bold,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    gap: 4,
  },
  distanceText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.medium,
  },
  ratingContainer: {
    position: 'absolute',
    top: SIZES.sm,
    right: SIZES.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    gap: 4,
  },
  ratingValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.bold,
  },
  content: {
    padding: SIZES.md,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONTS.bold,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SIZES.sm,
  },
  address: {
    fontSize: FONT_SIZES.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amenitiesRow: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  amenityChip: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSm,
  },
  amenityText: {
    fontSize: FONT_SIZES.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  price: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONTS.bold,
  },
  priceUnit: {
    fontSize: FONT_SIZES.xs,
  },

  // Featured Card Styles
  featuredContainer: {
    marginBottom: SIZES.md,
  },
  featuredCard: {
    borderRadius: SIZES.radiusXl || 24,
    overflow: 'hidden',
    height: 220,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: SIZES.md,
  },
  featuredContent: {},
  featuredBadges: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.bold,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
    gap: 4,
  },
  ratingTextWhite: {
    color: '#fff',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.bold,
  },
  featuredName: {
    color: '#fff',
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONTS.bold,
    marginBottom: 4,
  },
  featuredInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SIZES.sm,
  },
  featuredAddress: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZES.sm,
    flex: 1,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredStats: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#fff',
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.medium,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
  },
  priceAmount: {
    color: '#fff',
    fontSize: FONT_SIZES.lg,
    fontWeight: FONTS.bold,
  },
  priceCurrency: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZES.xs,
    marginLeft: 2,
  },
});
