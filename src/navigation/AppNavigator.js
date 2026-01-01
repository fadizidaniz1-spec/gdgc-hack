import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useLanguage } from '../context';
import { useAuthStore } from '../store';
import { SIZES, SHADOWS, GRADIENTS } from '../constants';
import { ChatBot } from '../components/chat';

// Auth Screens
import { LoginScreen, ProfileSetupScreen } from '../screens/auth';

// Main Screens
import { StadiumListScreen, StadiumDetailScreen } from '../screens/stadium';
import { BookingScreen, MyBookingsScreen, PaymentScreen } from '../screens/booking';
import { EditProfileScreen, NotificationsScreen, LanguageScreen, HelpSupportScreen, AboutScreen } from '../screens/profile';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MatchListScreen, MatchDetailScreen, CreateMatchScreen, CreateTeamMatchScreen } from '../screens/matchmaking';
import { MapScreen } from '../screens/map';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const getTabInfo = (routeName) => {
    switch (routeName) {
      case 'Stadiums':
        return { icon: 'football', label: t('stadiums') || 'Stadiums' };
      case 'Matches':
        return { icon: 'people', label: t('findMatch') || 'Matches' };
      case 'Map':
        return { icon: 'map', label: t('map') || 'Map' };
      case 'MyBookings':
        return { icon: 'calendar', label: t('bookings') || 'Bookings' };
      case 'Profile':
        return { icon: 'person', label: t('profile') || 'Profile' };
      default:
        return { icon: 'ellipse', label: routeName };
    }
  };

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      {isDarkMode ? (
        <View style={[styles.tabBarContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.tabBarInner}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const { icon, label } = getTabInfo(route.name);

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  onPress={onPress}
                  style={styles.tabItem}
                  activeOpacity={0.7}
                >
                  {isFocused ? (
                    <View style={styles.activeTabContainer}>
                      <LinearGradient
                        colors={GRADIENTS.primary}
                        style={styles.activeIconBg}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name={icon} size={22} color="#fff" />
                      </LinearGradient>
                    </View>
                  ) : (
                    <View style={styles.inactiveTabContainer}>
                      <Ionicons 
                        name={`${icon}-outline`} 
                        size={24} 
                        color={colors.textSecondary} 
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <BlurView intensity={80} tint="light" style={styles.tabBarContainer}>
          <View style={[styles.tabBarInner, { backgroundColor: 'rgba(255,255,255,0.85)' }]}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const { icon, label } = getTabInfo(route.name);

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  onPress={onPress}
                  style={styles.tabItem}
                  activeOpacity={0.7}
                >
                  {isFocused ? (
                    <View style={styles.activeTabContainer}>
                      <LinearGradient
                        colors={GRADIENTS.primary}
                        style={styles.activeIconBg}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name={icon} size={22} color="#fff" />
                      </LinearGradient>
                    </View>
                  ) : (
                    <View style={styles.inactiveTabContainer}>
                      <Ionicons 
                        name={`${icon}-outline`} 
                        size={24} 
                        color={colors.textSecondary} 
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarContainer: {
    marginHorizontal: SIZES.md,
    marginBottom: SIZES.sm,
    borderRadius: 28,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  tabBarInner: {
    flexDirection: 'row',
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.xs,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.xs,
  },
  activeTabContainer: {
    alignItems: 'center',
  },
  activeIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glow,
  },
  inactiveTabContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name="Stadiums" component={StadiumListScreen} />
        <Tab.Screen name="Matches" component={MatchListScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="MyBookings" component={MyBookingsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <ChatBot />
    </View>
  );
};

// Auth Stack
const AuthStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

// Main Stack (after authentication)
const MainStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StadiumDetail"
        component={StadiumDetailScreen}
        options={{ title: 'Stadium Details' }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ title: 'Book Stadium' }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: 'Payment' }}
      />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{ title: 'Match Details' }}
      />
      <Stack.Screen
        name="CreateMatch"
        component={CreateMatchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateTeamMatch"
        component={CreateTeamMatchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Profile Setup Stack (for new users)
const ProfileSetupStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    </Stack.Navigator>
  );
};

// Main App Navigator
export const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { colors, isDarkMode } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: isDarkMode,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.secondary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      {!isAuthenticated ? (
        <AuthStack />
      ) : !user?.profileComplete ? (
        <ProfileSetupStack />
      ) : (
        <MainStack />
      )}
    </NavigationContainer>
  );
};
