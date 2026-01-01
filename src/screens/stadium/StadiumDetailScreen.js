import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, SHADOWS } from '../../constants';
import { Button } from '../../components/common';

const DEFAULT_STADIUM_IMAGE = 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400';

// Stadium detail screen - 2nd click in user journey
export const StadiumDetailScreen = ({ route, navigation }) => {
  const { stadium } = route.params;
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  const imageUri = imageError || !stadium.image || stadium.image.includes('example.com') 
    ? DEFAULT_STADIUM_IMAGE 
    : stadium.image;

  const handleBookNow = () => {
    navigation.navigate('Booking', { stadium });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: imageUri }} 
          style={styles.image} 
          onError={() => setImageError(true)}
        />
        
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.name, { color: colors.text }]}>{stadium.name}</Text>
            <View style={[styles.rating, { backgroundColor: colors.secondary + '20' }]}>
              <Ionicons name="star" size={18} color={colors.secondary} />
              <Text style={[styles.ratingText, { color: colors.secondary }]}>{stadium.rating}</Text>
            </View>
          </View>

          <View style={styles.info}>
            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>{stadium.address}</Text>
          </View>

          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="football-outline" size={16} color={colors.primary} />
              <Text style={[styles.badgeText, { color: colors.text }]}>{stadium.fieldSize}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="navigate-outline" size={16} color={colors.primary} />
              <Text style={[styles.badgeText, { color: colors.text }]}>{stadium.distance} {t('km')}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('description')}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{stadium.description}</Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('amenities')}</Text>
          <View style={styles.amenities}>
            {stadium.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text style={[styles.amenityText, { color: colors.text }]}>{amenity}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.priceContainer, { backgroundColor: colors.surface }, SHADOWS.small]}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>{t('pricePerHour')}</Text>
            <Text style={[styles.price, { color: colors.primary }]}>{stadium.pricePerHour} DA</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA Button - Thumb Zone optimized */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button 
          title={t('bookNow')} 
          onPress={handleBookNow}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
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
  name: {
    fontSize: FONT_SIZES.xxl,
    flex: 1,
    fontWeight: FONTS.bold,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  ratingText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.semiBold,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
    marginBottom: SIZES.md,
  },
  infoText: {
    fontSize: FONT_SIZES.md,
  },
  badges: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.xs,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  badgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.medium,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    marginBottom: SIZES.sm,
    fontWeight: FONTS.semiBold,
  },
  description: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
    marginBottom: SIZES.lg,
  },
  amenities: {
    gap: SIZES.sm,
    marginBottom: SIZES.lg,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  amenityText: {
    fontSize: FONT_SIZES.md,
  },
  priceContainer: {
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: FONT_SIZES.sm,
  },
  price: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONTS.bold,
  },
  footer: {
    padding: SIZES.md,
    borderTopWidth: 1,
  },
});
