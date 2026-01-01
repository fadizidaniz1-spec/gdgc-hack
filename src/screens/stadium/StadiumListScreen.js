import { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, GRADIENTS, SHADOWS } from '../../constants';
import { StadiumCard, FilterModal } from '../../components/stadium';
import { useStadiumStore } from '../../store';
import { stadiumService } from '../../services';
import { calculateDistance } from '../../utils';

const { width } = Dimensions.get('window');

export const StadiumListScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const filteredStadiums = useStadiumStore((state) => state.filteredStadiums);
  const filters = useStadiumStore((state) => state.filters);
  const applyFilters = useStadiumStore((state) => state.applyFilters);
  const locationLoading = useStadiumStore((state) => state.locationLoading);
  const searchError = useStadiumStore((state) => state.searchError);
  const usingRealData = useStadiumStore((state) => state.usingRealData);
  const clearSearchError = useStadiumStore((state) => state.clearSearchError);
  const setLocationLoading = useStadiumStore((state) => state.setLocationLoading);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        return location.coords;
      }
    } catch (error) {
      console.log('Location error:', error);
    }
    return null;
  };

  const fetchAllStadiums = async (location = userLocation) => {
    setLocationLoading(true);
    try {
      const response = await stadiumService.getStadiums({});
      let stadiums = response.stadiums || response.data || [];
      
      if (location) {
        stadiums = stadiums.map(stadium => ({
          ...stadium,
          distance: calculateDistance(
            location.latitude,
            location.longitude,
            stadium.latitude,
            stadium.longitude
          )
        }));
        stadiums.sort((a, b) => a.distance - b.distance);
      }
      
      useStadiumStore.setState({
        stadiums: stadiums,
        filteredStadiums: stadiums,
        locationLoading: false,
        usingRealData: stadiums.length > 0,
      });
    } catch (error) {
      console.error('Fetch all stadiums error:', error);
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const location = await getUserLocation();
      await fetchAllStadiums(location);
    };
    init();
  }, []);

  const handleStadiumPress = (stadium) => navigation.navigate('StadiumDetail', { stadium });

  const onRefresh = async () => {
    setRefreshing(true);
    const location = await getUserLocation();
    await fetchAllStadiums(location);
    setRefreshing(false);
  };

  const nearestStadium = filteredStadiums[0];

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Gradient Header */}
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
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
              <View style={styles.headerTop}>
                <View>
                  <Text style={styles.headerGreeting}>{t('welcome')} 👋</Text>
                  <Text style={styles.headerTitle}>{t('searchStadiums')}</Text>
                </View>
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.headerIconBtn}
                    onPress={() => navigation.navigate('Map')}
                  >
                    <Ionicons name="map-outline" size={22} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.headerIconBtn}
                    onPress={onRefresh}
                  >
                    <Ionicons name="refresh-outline" size={22} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.headerIconBtn} 
                    onPress={() => setShowFilters(true)}
                  >
                    <Ionicons name="options-outline" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }, SHADOWS.medium]}>
            <LinearGradient
              colors={GRADIENTS.primary}
              style={styles.statIconBg}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="football" size={18} color="#fff" />
            </LinearGradient>
            <Text style={[styles.statValue, { color: colors.text }]}>{filteredStadiums.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stadium')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }, SHADOWS.medium]}>
            <LinearGradient
              colors={GRADIENTS.secondary}
              style={styles.statIconBg}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="navigate" size={18} color="#fff" />
            </LinearGradient>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {nearestStadium?.distance != null ? `${Number(nearestStadium.distance).toFixed(1)}` : '--'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('km')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }, SHADOWS.medium]}>
            <LinearGradient
              colors={GRADIENTS.warning}
              style={styles.statIconBg}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="star" size={18} color="#fff" />
            </LinearGradient>
            <Text style={[styles.statValue, { color: colors.text }]}>{nearestStadium?.rating || '--'}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('rating')}</Text>
          </View>
        </View>
      </View>

      {/* Status Banner */}
      <View style={styles.bannerContainer}>
        <View style={[
          styles.banner, 
          { backgroundColor: locationLoading ? colors.primary + '15' : (usingRealData ? colors.success + '15' : colors.warning + '15') }
        ]}>
          {locationLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons 
              name={usingRealData ? 'checkmark-circle' : 'information-circle'} 
              size={18} 
              color={usingRealData ? colors.success : colors.warning} 
            />
          )}
          <Text style={[
            styles.bannerText, 
            { color: locationLoading ? colors.primary : (usingRealData ? colors.success : colors.warning) }
          ]}>
            {locationLoading ? t('searching') : `${t('availableStadiums')} (${filteredStadiums.length})`}
          </Text>
        </View>
      </View>

      {searchError && (
        <TouchableOpacity 
          style={[styles.errorBanner, { backgroundColor: colors.error + '15' }]} 
          onPress={clearSearchError}
        >
          <Ionicons name="alert-circle" size={18} color={colors.error} />
          <Text style={[styles.bannerText, { color: colors.error }]}>{searchError}</Text>
        </TouchableOpacity>
      )}

      {/* Stadium List */}
      <Animated.FlatList
        data={filteredStadiums}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => (
          <View>
            {index === 0 && filteredStadiums.length > 0 && (
              <View style={styles.nearestBadgeContainer}>
                <LinearGradient
                  colors={GRADIENTS.primary}
                  style={styles.nearestBadge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="location" size={14} color="#fff" />
                  <Text style={styles.nearestText}>
                    {t('nearest')} • {item.distance != null ? Number(item.distance).toFixed(1) : '0'} {t('km')}
                  </Text>
                </LinearGradient>
              </View>
            )}
            <StadiumCard 
              stadium={item} 
              onPress={() => handleStadiumPress(item)} 
              variant={index === 0 ? 'featured' : 'default'}
            />
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            {locationLoading ? (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('searching')}</Text>
              </>
            ) : (
              <>
                <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceVariant }]}>
                  <Ionicons name="football-outline" size={48} color={colors.textSecondary} />
                </View>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('noStadiumsFound')}</Text>
                <TouchableOpacity 
                  style={styles.retryBtn} 
                  onPress={onRefresh}
                >
                  <LinearGradient
                    colors={GRADIENTS.primary}
                    style={styles.retryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.retryText}>{t('retry')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
      />

      <FilterModal 
        visible={showFilters} 
        onClose={() => setShowFilters(false)} 
        onApply={applyFilters} 
        currentFilters={filters} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  headerContainer: {
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
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
  headerSafe: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerGreeting: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONTS.bold,
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: SIZES.xs,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    marginTop: -30,
    paddingHorizontal: SIZES.md,
    zIndex: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.radius,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONTS.bold,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    marginTop: 2,
  },
  bannerContainer: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.md,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.radius,
    gap: SIZES.xs,
  },
  bannerText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.medium,
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    marginHorizontal: SIZES.md,
    marginTop: SIZES.xs,
    borderRadius: SIZES.radius,
    gap: SIZES.xs,
  },
  nearestBadgeContainer: {
    marginBottom: SIZES.xs,
  },
  nearestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusFull,
    gap: 4,
  },
  nearestText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.semiBold,
    color: '#fff',
  },
  list: {
    padding: SIZES.md,
    paddingTop: SIZES.sm,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    marginTop: SIZES.md,
  },
  retryBtn: {
    marginTop: SIZES.lg,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.sm,
  },
  retryText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.semiBold,
    color: '#fff',
  },
});
