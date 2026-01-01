import { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, GRADIENTS, SHADOWS } from '../../constants';
import { BookingCard } from '../../components/booking';
import { useBookingStore } from '../../store';

// My bookings screen showing user's reservations
export const MyBookingsScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { bookings, fetchBookings, isLoading } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    fetchBookings();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={isDarkMode ? GRADIENTS.dark : GRADIENTS.primary}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.headerContent}>
            <Text style={styles.headerSubtitle}>{t('yourReservations') || 'Your Reservations'}</Text>
            <Text style={styles.headerTitle}>{t('myBookings')}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Stats Card */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.surface }, SHADOWS.medium]}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <LinearGradient
                colors={GRADIENTS.primary}
                style={styles.statIconBg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
              </LinearGradient>
              <View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {bookings.filter(b => b.status === 'confirmed').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t('confirmed') || 'Confirmed'}
                </Text>
              </View>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <LinearGradient
                colors={GRADIENTS.warning}
                style={styles.statIconBg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="time" size={18} color="#fff" />
              </LinearGradient>
              <View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {bookings.filter(b => b.status === 'pending').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t('pending') || 'Pending'}
                </Text>
              </View>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <LinearGradient
                colors={GRADIENTS.accent}
                style={styles.statIconBg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="calendar" size={18} color="#fff" />
              </LinearGradient>
              <View>
                <Text style={[styles.statValue, { color: colors.text }]}>{bookings.length}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t('total') || 'Total'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={[
          styles.list,
          bookings.length === 0 && styles.emptyList
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={onRefresh} 
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name="calendar-outline" size={48} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              {t('noBookingsYet') || 'لا توجد حجوزات'}
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('bookingsAppearHere') || 'ستظهر حجوزاتك هنا'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: SIZES.xl,
    overflow: 'hidden',
  },
  circle1: { 
    position: 'absolute', 
    width: 200, 
    height: 200, 
    borderRadius: 100, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    top: -50, 
    right: -50 
  },
  circle2: { 
    position: 'absolute', 
    width: 150, 
    height: 150, 
    borderRadius: 75, 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    bottom: -30, 
    left: -30 
  },
  headerSafe: {},
  headerContent: {
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.md,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONTS.bold,
    color: '#fff',
  },
  statsContainer: {
    marginTop: -SIZES.lg,
    paddingHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
  },
  statCard: {
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONTS.bold,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: SIZES.sm,
  },
  list: {
    padding: SIZES.md,
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xxl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONTS.semiBold,
    marginBottom: SIZES.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
});
