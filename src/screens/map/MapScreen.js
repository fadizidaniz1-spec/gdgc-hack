import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '../../context';
import { useStadiumStore } from '../../store';
import { SIZES, FONTS, FONT_SIZES } from '../../constants';
import { CONFIG } from '../../config';

export const MapScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef(null);
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // Get stadiums from store (already loaded from API)
  const stadiums = useStadiumStore((state) => state.stadiums);
  const filteredStadiums = useStadiumStore((state) => state.filteredStadiums);
  const userLocationFromStore = useStadiumStore((state) => state.userLocation);

  const apiKey = CONFIG.GOOGLE_PLACES_API_KEY;

  // Stadiums to display - from store only (loaded from your API)
  const stadiumsToShow = stadiums.length > 0 ? stadiums : filteredStadiums;

  useEffect(() => {
    console.log('=== MapScreen Loaded ===');
    console.log('Stadiums from store:', stadiumsToShow.length);
    if (stadiumsToShow.length > 0) {
      console.log('Stadium names:', stadiumsToShow.map(s => s.name).join(', '));
    }
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      // Use store location if available
      if (userLocationFromStore) {
        console.log('Using location from store:', userLocationFromStore);
        setCurrentLocation(userLocationFromStore);
        setLoading(false);
        return;
      }

      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const result = await Location.requestForegroundPermissionsAsync();
        status = result.status;
      }
      
      if (status !== 'granted') {
        setCurrentLocation(CONFIG.DEFAULT_LOCATION);
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Location error:', error);
      setCurrentLocation(CONFIG.DEFAULT_LOCATION);
    } finally {
      setLoading(false);
    }
  };

  // Generate clean map HTML with NO Google POIs
  const generateMapHTML = () => {
    if (!currentLocation) return '<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;"><p>Loading...</p></body></html>';

    const userLat = currentLocation.latitude;
    const userLng = currentLocation.longitude;

    // Create markers ONLY for our stadiums from API
    const markersJS = stadiumsToShow.map((stadium, index) => `
      var marker${index} = new google.maps.Marker({
        position: { lat: ${stadium.latitude}, lng: ${stadium.longitude} },
        map: map,
        title: "${(stadium.name || 'ملعب').replace(/"/g, '\\"')}",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: '#22c55e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        }
      });
      marker${index}.addListener('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'markerClick',
          stadium: ${JSON.stringify({
            id: stadium.id,
            name: stadium.name || 'ملعب',
            address: stadium.address || '',
            fieldSize: stadium.fieldSize || '5v5',
            pricePerHour: stadium.pricePerHour || 0,
            rating: stadium.rating || 0,
            latitude: stadium.latitude,
            longitude: stadium.longitude,
          })}
        }));
      });
    `).join('\n');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    function initMap() {
      // Map styles to HIDE ALL POIs completely
      var hideAllPOIs = [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "poi.attraction", stylers: [{ visibility: "off" }] },
        { featureType: "poi.business", stylers: [{ visibility: "off" }] },
        { featureType: "poi.government", stylers: [{ visibility: "off" }] },
        { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
        { featureType: "poi.park", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "poi.place_of_worship", stylers: [{ visibility: "off" }] },
        { featureType: "poi.school", stylers: [{ visibility: "off" }] },
        { featureType: "poi.sports_complex", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] }
      ];

      var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: ${userLat}, lng: ${userLng} },
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
        styles: hideAllPOIs
      });

      // User location marker (blue)
      new google.maps.Marker({
        position: { lat: ${userLat}, lng: ${userLng} },
        map: map,
        title: "موقعي",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        zIndex: 999
      });

      // Stadium markers from YOUR API only
      ${markersJS}

      // Make map globally accessible
      window.myMap = map;
    }

    function centerOnUser() {
      if (window.myMap) {
        window.myMap.panTo({ lat: ${userLat}, lng: ${userLng} });
        window.myMap.setZoom(14);
      }
    }
  </script>
  <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap" async defer></script>
</body>
</html>`;
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerClick') {
        setSelectedStadium(data.stadium);
      }
    } catch (e) {}
  };

  const openGoogleMapsNavigation = (stadium) => {
    const url = Platform.select({
      ios: `comgooglemaps://?daddr=${stadium.latitude},${stadium.longitude}&directionsmode=driving`,
      android: `google.navigation:q=${stadium.latitude},${stadium.longitude}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${stadium.latitude},${stadium.longitude}`,
    });

    Linking.canOpenURL(url).then((supported) => {
      Linking.openURL(supported ? url : `https://www.google.com/maps/dir/?api=1&destination=${stadium.latitude},${stadium.longitude}`);
    });
  };

  const goToStadiumDetail = () => {
    if (selectedStadium) {
      const fullStadium = stadiumsToShow.find(s => s.id === selectedStadium.id) || selectedStadium;
      navigation.navigate('StadiumDetail', { stadium: fullStadium });
    }
  };

  const centerOnUser = () => {
    webViewRef.current?.injectJavaScript('centerOnUser(); true;');
  };

  if (loading || !currentLocation) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>جاري تحميل الخريطة...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>خريطة الملاعب</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {stadiumsToShow.length} ملعب من قاعدة البيانات
          </Text>
        </View>
        <TouchableOpacity onPress={getCurrentLocation} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {stadiumsToShow.length === 0 && (
        <View style={[styles.noStadiumsBanner, { backgroundColor: colors.warning + '20' }]}>
          <Ionicons name="warning" size={18} color={colors.warning} />
          <Text style={[styles.bannerText, { color: colors.warning }]}>
            لا توجد ملاعب محملة. ارجع لصفحة الملاعب واضغط على زر الكرة الأرضية.
          </Text>
        </View>
      )}

      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: generateMapHTML() }}
          style={styles.map}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />

        <TouchableOpacity style={[styles.myLocationBtn, { backgroundColor: colors.surface }]} onPress={centerOnUser}>
          <Ionicons name="locate" size={24} color={colors.primary} />
        </TouchableOpacity>

        <View style={[styles.legend, { backgroundColor: colors.surface }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>موقعك</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>ملعب</Text>
          </View>
        </View>
      </View>

      {selectedStadium && (
        <View style={[styles.stadiumCard, { backgroundColor: colors.surface, bottom: insets.bottom + 80 }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={[styles.stadiumName, { color: colors.text }]}>{selectedStadium.name}</Text>
              <Text style={[styles.stadiumAddress, { color: colors.textSecondary }]} numberOfLines={1}>
                {selectedStadium.address}
              </Text>
              <View style={styles.cardDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="football-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>{selectedStadium.fieldSize}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={14} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>{selectedStadium.pricePerHour} DA/h</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSelectedStadium(null)}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardActions}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={() => openGoogleMapsNavigation(selectedStadium)}>
              <Ionicons name="navigate" size={18} color="#fff" />
              <Text style={styles.actionText}>التنقل</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]} onPress={goToStadiumDetail}>
              <Ionicons name="information-circle" size={18} color="#fff" />
              <Text style={styles.actionText}>التفاصيل</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: SIZES.md, fontSize: FONT_SIZES.md },
  header: { padding: SIZES.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: FONT_SIZES.xl, fontWeight: FONTS.bold },
  subtitle: { fontSize: FONT_SIZES.xs, marginTop: 2 },
  refreshBtn: { padding: 8 },
  noStadiumsBanner: { flexDirection: 'row', alignItems: 'center', padding: SIZES.sm, marginHorizontal: SIZES.md, marginTop: SIZES.sm, borderRadius: SIZES.radiusSm, gap: SIZES.xs },
  bannerText: { fontSize: FONT_SIZES.sm, flex: 1 },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  myLocationBtn: { position: 'absolute', top: SIZES.md, right: SIZES.md, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  legend: { position: 'absolute', top: SIZES.md, left: SIZES.md, padding: 8, borderRadius: 8, elevation: 3 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendText: { fontSize: 11 },
  stadiumCard: { position: 'absolute', left: SIZES.md, right: SIZES.md, padding: SIZES.md, borderRadius: SIZES.radius, elevation: 5 },
  cardHeader: { flexDirection: 'row', marginBottom: SIZES.md },
  cardInfo: { flex: 1 },
  stadiumName: { fontSize: FONT_SIZES.lg, fontWeight: FONTS.bold },
  stadiumAddress: { fontSize: FONT_SIZES.sm, marginTop: 2 },
  cardDetails: { flexDirection: 'row', gap: SIZES.md, marginTop: SIZES.xs },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: FONT_SIZES.sm },
  cardActions: { flexDirection: 'row', gap: SIZES.sm },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SIZES.xs, paddingVertical: SIZES.sm, borderRadius: SIZES.radiusSm },
  actionText: { fontSize: FONT_SIZES.md, fontWeight: FONTS.semiBold, color: '#fff' },
});
