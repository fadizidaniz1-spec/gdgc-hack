import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { useMatchStore, useAuthStore } from '../../store';
import { SIZES, FONTS, FONT_SIZES, SKILL_LEVELS, SHADOWS, GRADIENTS } from '../../constants';
import { Button } from '../../components/common';

const { width, height } = Dimensions.get('window');
const FIELD_MAX_PLAYERS = { '5v5': 10, '7v7': 14, '11v11': 22 };

export const MatchDetailScreen = ({ route, navigation }) => {
  const { match: initialMatch } = route.params;
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { matches, joinMatch, fetchMatchDetails } = useMatchStore();
  const { user } = useAuthStore();
  const [isJoining, setIsJoining] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const match = matches.find((m) => m.id === initialMatch.id) || initialMatch;
  const maxPlayers = match.maxPlayers || FIELD_MAX_PLAYERS[match.fieldSize] || 14;
  const actualCurrentPlayers = players.length > 0 ? players.length : (match.currentPlayers || 0);
  const actualSlotsNeeded = maxPlayers - actualCurrentPlayers;
  const isFull = actualSlotsNeeded <= 0;
  const skillLevel = SKILL_LEVELS.find((s) => s.id === match.skillLevel);

  const organizer = players.find(p => p.isOrganizer);
  const organizerName = organizer?.name || 'Loading...';
  const organizerInitial = (organizerName || 'M').charAt(0).toUpperCase();

  useEffect(() => {
    const loadMatchDetails = async () => {
      setIsLoading(true);
      try {
        const result = await fetchMatchDetails(match.id);
        if (result?.players) {
          setPlayers(result.players);
        }
      } catch (error) {
        console.log('Error fetching match details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMatchDetails();
  }, [match.id]);

  const handleJoinMatch = () => {
    Alert.alert(
      t('joinMatch'),
      `${t('joinMatch')} ${match.pricePerPlayer} DA?`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('join'),
          onPress: async () => {
            setIsJoining(true);
            try {
              await joinMatch(match.id, user?.name);
              Alert.alert(t('done'), t('joinedSuccess'), [
                { text: t('ok'), onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert(t('error'), t('joinFailed'));
            } finally {
              setIsJoining(false);
            }
          },
        },
      ]
    );
  };

  const getSkillGradient = (level) => {
    switch(level) {
      case 'beginner': return GRADIENTS.success;
      case 'intermediate': return GRADIENTS.accent;
      case 'advanced': return ['#9C27B0', '#7B1FA2', '#6A1B9A'];
      case 'professional': return GRADIENTS.secondary;
      default: return GRADIENTS.primary;
    }
  };

  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Header Bar */}
      <Animated.View style={[styles.headerBar, { opacity: headerOpacity, backgroundColor: colors.surface }]}>
        <SafeAreaView edges={['top']} style={styles.headerBarContent}>
          <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerBarTitle, { color: colors.text }]} numberOfLines={1}>
            {match.stadium?.name || match.stadiumName || 'Match'}
          </Text>
          <View style={{ width: 40 }} />
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <Animated.View style={[styles.heroContainer, { transform: [{ scale: imageScale }] }]}>
          {match.stadium?.image || match.stadiumImage ? (
            <Image 
              source={{ uri: match.stadium?.image || match.stadiumImage }} 
              style={styles.heroImage} 
            />
          ) : (
            <LinearGradient
              colors={isDarkMode ? GRADIENTS.dark : GRADIENTS.primary}
              style={styles.heroGradient}
            />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroOverlay}
          >
            <SafeAreaView edges={['top']} style={styles.heroContent}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <View style={styles.backButtonBg}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </View>
              </TouchableOpacity>
            </SafeAreaView>
            
            <View style={styles.heroInfo}>
              <View style={styles.skillBadgeContainer}>
                <LinearGradient
                  colors={getSkillGradient(match.skillLevel)}
                  style={styles.skillBadge}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="trophy" size={14} color="#fff" />
                  <Text style={styles.skillText}>{skillLevel?.labelEn || match.skillLevel}</Text>
                </LinearGradient>
              </View>
              <Text style={styles.heroTitle}>{match.stadium?.name || match.stadiumName || 'ملعب'}</Text>
              {(match.stadium?.address || match.stadiumAddress) && (
                <View style={styles.heroAddress}>
                  <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.heroAddressText}>{match.stadium?.address || match.stadiumAddress}</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.content}>
          {/* Quick Info Cards */}
          <View style={styles.quickInfoRow}>
            <View style={[styles.quickInfoCard, { backgroundColor: colors.surface }, SHADOWS.small]}>
              <LinearGradient colors={GRADIENTS.primary} style={styles.quickInfoIcon}>
                <Ionicons name="calendar" size={18} color="#fff" />
              </LinearGradient>
              <Text style={[styles.quickInfoLabel, { color: colors.textSecondary }]}>{t('date')}</Text>
              <Text style={[styles.quickInfoValue, { color: colors.text }]}>{match.date || 'N/A'}</Text>
            </View>
            <View style={[styles.quickInfoCard, { backgroundColor: colors.surface }, SHADOWS.small]}>
              <LinearGradient colors={GRADIENTS.secondary} style={styles.quickInfoIcon}>
                <Ionicons name="time" size={18} color="#fff" />
              </LinearGradient>
              <Text style={[styles.quickInfoLabel, { color: colors.textSecondary }]}>{t('time')}</Text>
              <Text style={[styles.quickInfoValue, { color: colors.text }]}>{match.time || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.quickInfoRow}>
            <View style={[styles.quickInfoCard, { backgroundColor: colors.surface }, SHADOWS.small]}>
              <LinearGradient colors={GRADIENTS.accent} style={styles.quickInfoIcon}>
                <Ionicons name="football" size={18} color="#fff" />
              </LinearGradient>
              <Text style={[styles.quickInfoLabel, { color: colors.textSecondary }]}>{t('format')}</Text>
              <Text style={[styles.quickInfoValue, { color: colors.text }]}>{match.fieldSize || '5v5'}</Text>
            </View>
            <View style={[styles.quickInfoCard, { backgroundColor: colors.surface }, SHADOWS.small]}>
              <LinearGradient colors={GRADIENTS.warning} style={styles.quickInfoIcon}>
                <Ionicons name="cash" size={18} color="#fff" />
              </LinearGradient>
              <Text style={[styles.quickInfoLabel, { color: colors.textSecondary }]}>{t('perPlayer')}</Text>
              <Text style={[styles.quickInfoValue, { color: colors.text }]}>{match.pricePerPlayer || 0} DA</Text>
            </View>
          </View>

          {/* Players Section */}
          <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="people" size={20} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>{t('players')}</Text>
              </View>
              <View style={[styles.countBadge, { backgroundColor: isFull ? colors.error + '15' : colors.success + '15' }]}>
                <Text style={[styles.countText, { color: isFull ? colors.error : colors.success }]}>
                  {actualCurrentPlayers}/{maxPlayers}
                </Text>
              </View>
            </View>
            
            {/* Progress Bar */}
            <View style={[styles.progressBar, { backgroundColor: colors.surfaceVariant }]}>
              <LinearGradient
                colors={isFull ? GRADIENTS.error : GRADIENTS.success}
                style={[styles.progressFill, { width: `${(actualCurrentPlayers / maxPlayers) * 100}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            
            {/* Player Avatars */}
            <View style={styles.playerAvatars}>
              {Array.from({ length: Math.min(maxPlayers, 10) }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.playerAvatar,
                    index < actualCurrentPlayers 
                      ? { backgroundColor: colors.primary } 
                      : { backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
                  ]}
                >
                  <Ionicons
                    name={index < actualCurrentPlayers ? 'person' : 'person-outline'}
                    size={14}
                    color={index < actualCurrentPlayers ? '#fff' : colors.textTertiary}
                  />
                </View>
              ))}
              {maxPlayers > 10 && (
                <View style={[styles.moreAvatar, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={[styles.moreText, { color: colors.textSecondary }]}>+{maxPlayers - 10}</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.slotsText, { color: isFull ? colors.error : colors.success }]}>
              {isFull ? t('matchFull') : `${actualSlotsNeeded} ${t('spotsAvailable')}`}
            </Text>
          </View>

          {/* Organizer Card */}
          <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="person-circle" size={20} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>{t('organizer')}</Text>
              </View>
            </View>
            <View style={styles.organizerRow}>
              {organizer?.avatar ? (
                <Image source={{ uri: organizer.avatar }} style={styles.organizerAvatar} />
              ) : (
                <LinearGradient
                  colors={GRADIENTS.primary}
                  style={styles.organizerAvatar}
                >
                  <Text style={styles.organizerInitial}>{organizerInitial}</Text>
                </LinearGradient>
              )}
              <View style={styles.organizerInfo}>
                <Text style={[styles.organizerName, { color: colors.text }]}>{organizerName}</Text>
                <View style={styles.organizerBadge}>
                  <Ionicons name="shield-checkmark" size={12} color={colors.success} />
                  <Text style={[styles.organizerLabel, { color: colors.success }]}>{t('matchOrganizer')}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.chatButton, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Match Rules */}
          <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="document-text" size={20} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>{t('matchRules')}</Text>
              </View>
            </View>
            <View style={styles.rulesList}>
              {(match.rules || [
                t('beOnTime'),
                t('bringEquipment'),
                t('fairPlay'),
                t('paymentBefore'),
              ]).map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <View style={[styles.ruleIcon, { backgroundColor: colors.success + '15' }]}>
                    <Ionicons name="checkmark" size={14} color={colors.success} />
                  </View>
                  <Text style={[styles.ruleText, { color: colors.textSecondary }]}>{rule}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Notes */}
          {match.notes && (
            <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <Ionicons name="chatbox" size={20} color={colors.primary} />
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{t('notes')}</Text>
                </View>
              </View>
              <Text style={[styles.notesText, { color: colors.textSecondary }]}>{match.notes}</Text>
            </View>
          )}

          {/* Spacer for footer */}
          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface }, SHADOWS.large]}>
        <SafeAreaView edges={['bottom']} style={styles.footerContent}>
          <View style={styles.priceInfo}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>{t('yourShare')}</Text>
            <Text style={[styles.priceValue, { color: colors.primary }]}>
              {match.pricePerPlayer || 0} <Text style={styles.priceCurrency}>DA</Text>
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.joinButton, isFull && styles.joinButtonDisabled]}
            onPress={handleJoinMatch}
            disabled={isFull || isJoining}
          >
            <LinearGradient
              colors={isFull ? [colors.disabled, colors.disabled] : GRADIENTS.primary}
              style={styles.joinGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isJoining ? (
                <Text style={styles.joinText}>{t('joining')}...</Text>
              ) : (
                <>
                  <Ionicons name={isFull ? 'close-circle' : 'add-circle'} size={20} color="#fff" />
                  <Text style={styles.joinText}>{isFull ? t('matchFull') : t('joinMatch')}</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBarTitle: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONTS.semiBold,
    textAlign: 'center',
  },
  heroContainer: {
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  heroContent: {
    paddingHorizontal: SIZES.md,
    paddingTop: SIZES.sm,
  },
  backButton: {},
  backButtonBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroInfo: {
    padding: SIZES.lg,
  },
  skillBadgeContainer: {
    alignSelf: 'flex-start',
    marginBottom: SIZES.sm,
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SIZES.md,
    paddingVertical: 6,
  },
  skillText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.bold,
    color: '#fff',
  },
  heroTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONTS.bold,
    color: '#fff',
    marginBottom: 4,
  },
  heroAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroAddressText: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: SIZES.md,
    marginTop: -20,
  },
  quickInfoRow: {
    flexDirection: 'row',
    gap: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  quickInfoCard: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.radius,
  },
  quickInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  quickInfoLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: 2,
  },
  quickInfoValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.bold,
  },
  card: {
    borderRadius: SIZES.radiusLg,
    padding: SIZES.md,
    marginBottom: SIZES.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONTS.semiBold,
  },
  countBadge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  countText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.bold,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SIZES.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  playerAvatars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.xs,
    marginBottom: SIZES.sm,
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.medium,
  },
  slotsText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.medium,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerInitial: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONTS.bold,
    color: '#fff',
  },
  organizerInfo: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  organizerName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.semiBold,
    marginBottom: 4,
  },
  organizerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  organizerLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.medium,
  },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rulesList: {
    gap: SIZES.sm,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  ruleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleText: {
    fontSize: FONT_SIZES.md,
    flex: 1,
  },
  notesText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: SIZES.radiusLg,
    borderTopRightRadius: SIZES.radiusLg,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    gap: SIZES.md,
  },
  priceInfo: {},
  priceLabel: {
    fontSize: FONT_SIZES.xs,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONTS.bold,
  },
  priceCurrency: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.medium,
  },
  joinButton: {
    flex: 1,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  joinButtonDisabled: {
    opacity: 0.7,
  },
  joinGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.sm,
    paddingVertical: SIZES.md,
  },
  joinText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.bold,
    color: '#fff',
  },
});
