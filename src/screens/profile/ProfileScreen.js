import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, POSITIONS, SKILL_LEVELS, GRADIENTS, SHADOWS } from '../../constants';
import { ThemeToggle } from '../../components/common';
import { useAuthStore } from '../../store';

export const ProfileScreen = ({ navigation }) => {
  const { colors, isDarkMode, setTheme } = useTheme();
  const { t } = useLanguage();
  const { user, logout } = useAuthStore();

  const getPositionInfo = (id) => POSITIONS.find((p) => p.id === id);
  const getSkillLabel = (id) => SKILL_LEVELS.find((s) => s.id === id)?.labelEn || id;

  const getUserPositions = () => {
    if (!user?.position && !user?.positions) return [];
    if (Array.isArray(user?.positions)) return user.positions;
    if (typeof user?.position === 'string' && user.position.includes(',')) {
      return user.position.split(',').map(p => p.trim());
    }
    return user?.position ? [user.position] : [];
  };

  const userPositions = getUserPositions();

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('logout'), onPress: logout, style: 'destructive' },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
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
              <Text style={styles.headerTitle}>{t('profile')}</Text>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatarRing, SHADOWS.glow]}>
                  <LinearGradient colors={['#fff', '#f0f0f0']} style={styles.avatarBg}>
                    <Ionicons name="person" size={45} color={colors.primary} />
                  </LinearGradient>
                </View>
                <View style={styles.onlineIndicator} />
              </View>
              <Text style={styles.userName}>{user?.name || t('player')}</Text>
              <Text style={styles.userEmail}>{user?.email || user?.phoneNumber}</Text>
              <View style={styles.skillBadge}>
                <Ionicons name="trophy" size={14} color="#FFD700" />
                <Text style={styles.skillText}>{t(user?.skillLevel) || getSkillLabel(user?.skillLevel) || 'Player'}</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {userPositions.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]}>
            <View style={styles.cardHeader}>
              <Ionicons name="football" size={20} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>{t('preferredPositions') || 'Positions'}</Text>
            </View>
            <View style={styles.positionsBadges}>
              {userPositions.map((posId) => {
                const posInfo = getPositionInfo(posId);
                return (
                  <View key={posId} style={styles.positionBadge}>
                    <LinearGradient colors={GRADIENTS.primarySoft} style={styles.positionGradient}>
                      <Ionicons name={posInfo?.icon || 'football-outline'} size={16} color={colors.primary} />
                      <Text style={[styles.positionText, { color: colors.primary }]}>{t(posId) || posInfo?.labelEn || posId}</Text>
                    </LinearGradient>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]}>
          <View style={styles.cardHeader}>
            <Ionicons name="color-palette" size={20} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('appearance')}</Text>
          </View>
          <View style={styles.themeRow}>
            <View style={styles.themeInfo}>
              <View style={[styles.themeIconBg, { backgroundColor: isDarkMode ? colors.primary + '20' : colors.warning + '20' }]}>
                <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={20} color={isDarkMode ? colors.primary : colors.warning} />
              </View>
              <Text style={[styles.themeLabel, { color: colors.text }]}>{isDarkMode ? t('darkMode') : t('lightMode')}</Text>
            </View>
            <ThemeToggle showLabel={false} />
          </View>
          <View style={styles.themeOptions}>
            <TouchableOpacity style={[styles.themeOption, { backgroundColor: !isDarkMode ? colors.primary + '15' : colors.surfaceVariant }]} onPress={() => setTheme('light')}>
              <Ionicons name="sunny" size={18} color={!isDarkMode ? colors.primary : colors.textSecondary} />
              <Text style={[styles.themeOptionText, { color: !isDarkMode ? colors.primary : colors.textSecondary }]}>{t('light')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeOption, { backgroundColor: isDarkMode ? colors.primary + '15' : colors.surfaceVariant }]} onPress={() => setTheme('dark')}>
              <Ionicons name="moon" size={18} color={isDarkMode ? colors.primary : colors.textSecondary} />
              <Text style={[styles.themeOptionText, { color: isDarkMode ? colors.primary : colors.textSecondary }]}>{t('dark')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeOption, { backgroundColor: colors.surfaceVariant }]} onPress={() => setTheme('system')}>
              <Ionicons name="phone-portrait" size={18} color={colors.textSecondary} />
              <Text style={[styles.themeOptionText, { color: colors.textSecondary }]}>{t('system')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => navigation.navigate('EditProfile')}>
            <View style={[styles.menuIconBg, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="person-outline" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{t('editProfile')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => navigation.navigate('Notifications')}>
            <View style={[styles.menuIconBg, { backgroundColor: colors.secondary + '15' }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.secondary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{t('notifications')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => navigation.navigate('Language')}>
            <View style={[styles.menuIconBg, { backgroundColor: colors.info + '15' }]}>
              <Ionicons name="language-outline" size={20} color={colors.info} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{t('language')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => navigation.navigate('HelpSupport')}>
            <View style={[styles.menuIconBg, { backgroundColor: colors.warning + '15' }]}>
              <Ionicons name="help-circle-outline" size={20} color={colors.warning} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{t('helpSupport')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => navigation.navigate('About')}>
            <View style={[styles.menuIconBg, { backgroundColor: colors.textSecondary + '15' }]}>
              <Ionicons name="information-circle-outline" size={20} color={colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{t('about')}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.error }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>{t('logout')}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.version, { color: colors.textTertiary }]}>Stadium Booking v1.0.0</Text>
          <Text style={[styles.copyright, { color: colors.textTertiary }]}>Made with ❤️ in Algeria</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { height: 280 },
  headerGradient: { flex: 1, overflow: 'hidden' },
  circle1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)', top: -50, right: -50 },
  circle2: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.08)', bottom: 20, left: -30 },
  headerSafe: { flex: 1 },
  headerContent: { flex: 1, alignItems: 'center', paddingTop: SIZES.md },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: FONTS.semiBold, color: 'rgba(255,255,255,0.9)', marginBottom: SIZES.md },
  avatarContainer: { position: 'relative', marginBottom: SIZES.sm },
  avatarRing: { width: 100, height: 100, borderRadius: 50, padding: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  avatarBg: { flex: 1, borderRadius: 46, justifyContent: 'center', alignItems: 'center' },
  onlineIndicator: { position: 'absolute', bottom: 5, right: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#00E676', borderWidth: 3, borderColor: '#fff' },
  userName: { fontSize: FONT_SIZES.xl, fontWeight: FONTS.bold, color: '#fff', marginBottom: 4 },
  userEmail: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginBottom: SIZES.sm },
  skillBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: SIZES.md, paddingVertical: SIZES.xs, borderRadius: SIZES.radiusFull },
  skillText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.semiBold, color: '#fff' },
  content: { flex: 1, marginTop: -20, paddingHorizontal: SIZES.md },
  card: { borderRadius: SIZES.radiusLg, padding: SIZES.md, marginBottom: SIZES.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SIZES.sm, marginBottom: SIZES.md },
  cardTitle: { fontSize: FONT_SIZES.md, fontWeight: FONTS.semiBold },
  positionsBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm },
  positionBadge: { borderRadius: SIZES.radiusSm, overflow: 'hidden' },
  positionGradient: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm },
  positionText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  themeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.md },
  themeInfo: { flexDirection: 'row', alignItems: 'center', gap: SIZES.sm },
  themeIconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  themeLabel: { fontSize: FONT_SIZES.md, fontWeight: FONTS.medium },
  themeOptions: { flexDirection: 'row', gap: SIZES.sm },
  themeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: SIZES.sm, borderRadius: SIZES.radiusSm },
  themeOptionText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SIZES.md, borderBottomWidth: 1, gap: SIZES.sm },
  menuIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: FONTS.medium },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SIZES.sm, paddingVertical: SIZES.md, borderRadius: SIZES.radius, borderWidth: 1.5, marginBottom: SIZES.md },
  logoutText: { fontSize: FONT_SIZES.md, fontWeight: FONTS.semiBold },
  footer: { alignItems: 'center', paddingVertical: SIZES.xl, paddingBottom: SIZES.xxxl },
  version: { fontSize: FONT_SIZES.sm, marginBottom: 4 },
  copyright: { fontSize: FONT_SIZES.xs },
});
