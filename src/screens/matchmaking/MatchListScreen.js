import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Image, Dimensions, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { useMatchStore } from '../../store';
import { SIZES, FONTS, FONT_SIZES, SKILL_LEVELS, SHADOWS, GRADIENTS } from '../../constants';

const { width } = Dimensions.get('window');
const FIELD_MAX_PLAYERS = { '5v5': 10, '7v7': 14, '11v11': 22 };

export const MatchListScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { matches, fetchMatches, initializeMatches } = useMatchStore();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => { 
    initializeMatches();
  }, []);

  const filteredMatches = matches.filter((m) => {
    const skillMatch = !selectedSkill || m.skillLevel === selectedSkill;
    const typeMatch = selectedType === 'all' || m.matchType === selectedType || (!m.matchType && selectedType === 'player');
    return skillMatch && typeMatch;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const getSkillColor = (level) => colors[level] || colors.primary;
  
  const getSkillGradient = (level) => {
    switch(level) {
      case 'beginner': return GRADIENTS.success;
      case 'intermediate': return GRADIENTS.accent;
      case 'advanced': return ['#9C27B0', '#7B1FA2', '#6A1B9A'];
      case 'professional': return ['#E91E63', '#C2185B', '#AD1457'];
      default: return GRADIENTS.primary;
    }
  };

  const handleCreatePress = () => setShowCreateModal(true);

  const handleSelectMatchType = (type) => {
    setShowCreateModal(false);
    navigation.navigate(type === 'player' ? 'CreateMatch' : 'CreateTeamMatch');
  };

  const renderMatchCard = ({ item }) => {
    const isTeamMatch = item.matchType === 'team';
    const maxPlayers = item.maxPlayers || FIELD_MAX_PLAYERS[item.fieldSize] || 14;
    const currentPlayers = item.currentPlayers || (maxPlayers - (item.slotsNeeded || 0));
    const isFull = isTeamMatch ? item.slotsNeeded === 0 : (item.slotsNeeded === 0 || currentPlayers >= maxPlayers);
    const stadiumName = item.stadium?.name || item.stadiumName || 'Stadium';
    const stadiumImage = item.stadium?.image || item.stadiumImage;
    const stadiumAddress = item.stadium?.address || item.stadiumAddress;

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.medium]}
        onPress={() => navigation.navigate('MatchDetail', { match: item })}
        activeOpacity={0.9}
      >
        {isTeamMatch && (
          <View style={[styles.matchTypeBadge, { backgroundColor: colors.secondary }]}>
            <Ionicons name="shield" size={12} color="#fff" />
            <Text style={styles.matchTypeBadgeText}>{t('teamMatch')}</Text>
          </View>
        )}

        {stadiumImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: stadiumImage }} style={styles.stadiumImage} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.imageOverlay}>
              <View style={styles.overlayContent}>
                <View style={styles.dateTimeBadge}>
                  <Ionicons name="calendar" size={12} color="#fff" />
                  <Text style={styles.dateTimeText}>{item.date} • {item.time}</Text>
                </View>
                <View style={styles.skillBadgeOverlay}>
                  <LinearGradient colors={getSkillGradient(item.skillLevel)} style={styles.skillGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.skillTextWhite}>{t(item.skillLevel)}</Text>
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
          </View>
        ) : (
          <View style={[styles.noImageHeader, { backgroundColor: isTeamMatch ? colors.secondary + '15' : colors.primary + '15' }]}>
            <View style={styles.dateTimeBadge}>
              <Ionicons name="calendar" size={12} color={isTeamMatch ? colors.secondary : colors.primary} />
              <Text style={[styles.dateTimeText, { color: colors.text }]}>{item.date} • {item.time}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.cardContent}>
          {isTeamMatch && item.teamName && (
            <View style={[styles.teamNameRow, { backgroundColor: colors.secondary + '10' }]}>
              <Ionicons name="shield" size={16} color={colors.secondary} />
              <Text style={[styles.teamNameText, { color: colors.secondary }]}>{item.teamName}</Text>
              <Text style={[styles.vsText, { color: colors.textSecondary }]}>vs ?</Text>
            </View>
          )}

          <View style={styles.cardHeader}>
            <Text style={[styles.stadiumName, { color: colors.text }]} numberOfLines={1}>{stadiumName}</Text>
            {!stadiumImage && (
              <View style={[styles.skillBadge, { backgroundColor: getSkillColor(item.skillLevel) + '20' }]}>
                <Text style={[styles.skillText, { color: getSkillColor(item.skillLevel) }]}>{t(item.skillLevel)}</Text>
              </View>
            )}
          </View>
          
          {stadiumAddress && (
            <View style={styles.addressRow}>
              <Ionicons name="location" size={14} color={colors.textSecondary} />
              <Text style={[styles.addressText, { color: colors.textSecondary }]} numberOfLines={1}>{stadiumAddress}</Text>
            </View>
          )}

          <View style={styles.cardInfo}>
            <View style={[styles.infoChip, { backgroundColor: (isTeamMatch ? colors.secondary : colors.primary) + '10' }]}>
              <Ionicons name="football-outline" size={14} color={isTeamMatch ? colors.secondary : colors.primary} />
              <Text style={[styles.infoText, { color: isTeamMatch ? colors.secondary : colors.primary }]}>{item.fieldSize}</Text>
            </View>
            {!isTeamMatch && (
              <View style={[styles.infoChip, { backgroundColor: colors.primary + '10' }]}>
                <Ionicons name="cash-outline" size={14} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.primary }]}>{item.pricePerPlayer} DA</Text>
              </View>
            )}
          </View>

          {!isTeamMatch && (
            <View style={styles.playersSection}>
              <View style={styles.playersHeader}>
                <Text style={[styles.playersLabel, { color: colors.text }]}>{t('players')}</Text>
                <Text style={[styles.playersCount, { color: isFull ? colors.error : colors.success }]}>{currentPlayers}/{maxPlayers}</Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: colors.surfaceVariant }]}>
                <LinearGradient colors={isFull ? GRADIENTS.error : GRADIENTS.success} style={[styles.progressFill, { width: `${(currentPlayers / maxPlayers) * 100}%` }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
              </View>
              <Text style={[styles.slotsText, { color: isFull ? colors.error : colors.success }]}>
                {isFull ? t('matchFull') : `${item.slotsNeeded || (maxPlayers - currentPlayers)} ${t('spotsLeft')}`}
              </Text>
            </View>
          )}

          {isTeamMatch && (
            <View style={[styles.teamStatusSection, { backgroundColor: colors.secondary + '10' }]}>
              <Ionicons name="search" size={16} color={colors.secondary} />
              <Text style={[styles.teamStatusText, { color: colors.secondary }]}>{isFull ? t('opponentFound') : t('lookingForOpponent')}</Text>
            </View>
          )}

          <View style={styles.cardFooter}>
            {!isFull ? (
              <TouchableOpacity style={styles.joinBtn} onPress={() => navigation.navigate('MatchDetail', { match: item })}>
                <LinearGradient colors={isTeamMatch ? GRADIENTS.secondary : GRADIENTS.primary} style={styles.joinGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.joinText}>{isTeamMatch ? t('challenge') : t('join')}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={[styles.fullBadge, { backgroundColor: colors.error + '15' }]}>
                <Ionicons name="close-circle" size={16} color={colors.error} />
                <Text style={[styles.fullText, { color: colors.error }]}>{t('full')}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={isDarkMode ? GRADIENTS.dark : GRADIENTS.primary} style={styles.headerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <SafeAreaView edges={['top']} style={styles.headerSafe}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerSubtitle}>{t('findYourGame')}</Text>
              <Text style={styles.headerTitle}>{t('findMatch')}</Text>
            </View>
            <TouchableOpacity style={styles.createButton} onPress={handleCreatePress}>
              <LinearGradient colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']} style={styles.createGradient}>
                <Ionicons name="add" size={28} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Type Filter */}
      <View style={styles.typeFilterContainer}>
        {[{ id: 'all', label: t('all'), icon: 'apps' }, { id: 'player', label: t('players'), icon: 'person' }, { id: 'team', label: t('teams'), icon: 'shield' }].map((type) => (
          <TouchableOpacity key={type.id} style={[styles.typeChip, { backgroundColor: selectedType === type.id ? colors.primary : colors.surface, borderColor: selectedType === type.id ? colors.primary : colors.border }]} onPress={() => setSelectedType(type.id)}>
            <Ionicons name={type.icon} size={14} color={selectedType === type.id ? '#fff' : colors.textSecondary} />
            <Text style={[styles.typeChipText, { color: selectedType === type.id ? '#fff' : colors.text }]}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Skill Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
        {[{ id: null, labelEn: t('all') }, ...SKILL_LEVELS].map((item) => (
          <TouchableOpacity 
            key={item.id || 'all'} 
            style={[
              styles.filterChip, 
              { 
                backgroundColor: selectedSkill === item.id ? (item.id ? getSkillColor(item.id) : colors.primary) : colors.surface,
                borderColor: selectedSkill === item.id ? (item.id ? getSkillColor(item.id) : colors.primary) : colors.border 
              }
            ]} 
            onPress={() => setSelectedSkill(item.id)}
          >
            <Text style={[styles.filterText, { color: selectedSkill === item.id ? '#fff' : colors.text }]}>{item.id ? t(item.id) : item.labelEn}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.countContainer}>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>{filteredMatches.length} {t('matchesAvailable')}</Text>
      </View>

      <FlatList data={filteredMatches} keyExtractor={(item) => item.id} renderItem={renderMatchCard} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceVariant }]}><Ionicons name="people-outline" size={48} color={colors.textSecondary} /></View>
            <Text style={[styles.emptyText, { color: colors.text }]}>{t('noMatchesFound')}</Text>
            <TouchableOpacity style={styles.createMatchBtn} onPress={handleCreatePress}>
              <LinearGradient colors={GRADIENTS.primary} style={styles.createMatchGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.createMatchText}>{t('createMatch')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Create Modal */}
      <Modal visible={showCreateModal} animationType="fade" transparent>
        <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: colors.overlay }]} activeOpacity={1} onPress={() => setShowCreateModal(false)}>
          <View style={[styles.createModalContent, { backgroundColor: colors.background }]}>
            <View style={styles.createModalHeader}>
              <Text style={[styles.createModalTitle, { color: colors.text }]}>{t('selectMatchType')}</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}><Ionicons name="close" size={24} color={colors.text} /></TouchableOpacity>
            </View>
            <Text style={[styles.createModalSubtitle, { color: colors.textSecondary }]}>{t('selectMatchTypeDesc')}</Text>
            <TouchableOpacity style={[styles.matchTypeOption, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => handleSelectMatchType('player')}>
              <LinearGradient colors={GRADIENTS.primary} style={styles.matchTypeIcon}><Ionicons name="person" size={28} color="#fff" /></LinearGradient>
              <View style={styles.matchTypeInfo}>
                <Text style={[styles.matchTypeTitle, { color: colors.text }]}>{t('findPlayers')}</Text>
                <Text style={[styles.matchTypeDesc, { color: colors.textSecondary }]}>{t('findPlayersDesc')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.matchTypeOption, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => handleSelectMatchType('team')}>
              <LinearGradient colors={GRADIENTS.secondary} style={styles.matchTypeIcon}><Ionicons name="shield" size={28} color="#fff" /></LinearGradient>
              <View style={styles.matchTypeInfo}>
                <Text style={[styles.matchTypeTitle, { color: colors.text }]}>{t('findTeam')}</Text>
                <Text style={[styles.matchTypeDesc, { color: colors.textSecondary }]}>{t('findTeamDesc')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { paddingBottom: SIZES.lg, overflow: 'hidden' },
  circle1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)', top: -50, right: -50 },
  circle2: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.08)', bottom: -30, left: -30 },
  headerSafe: {},
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.lg, paddingTop: SIZES.sm },
  headerSubtitle: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  headerTitle: { fontSize: FONT_SIZES.xxl, fontWeight: FONTS.bold, color: '#fff' },
  createButton: { borderRadius: 25, overflow: 'hidden' },
  createGradient: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  typeFilterContainer: { flexDirection: 'row', paddingHorizontal: SIZES.md, paddingVertical: SIZES.xs, gap: SIZES.xs },
  typeChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.sm, paddingVertical: 6, borderRadius: SIZES.radiusFull, borderWidth: 1, gap: 4 },
  typeChipText: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.medium },
  filterContainer: { paddingHorizontal: SIZES.md, paddingBottom: SIZES.xs },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.sm, paddingVertical: 6, borderRadius: SIZES.radiusFull, marginRight: SIZES.xs, borderWidth: 1, gap: 4 },
  filterDot: { width: 5, height: 5, borderRadius: 2.5 },
  filterText: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.medium },
  countContainer: { paddingHorizontal: SIZES.lg, paddingBottom: SIZES.sm },
  countText: { fontSize: FONT_SIZES.sm },
  list: { padding: SIZES.md, paddingTop: 0 },
  card: { borderRadius: SIZES.radiusLg, marginBottom: SIZES.md, overflow: 'hidden' },
  matchTypeBadge: { position: 'absolute', top: SIZES.sm, left: SIZES.sm, zIndex: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.sm, paddingVertical: 4, borderRadius: SIZES.radiusFull, gap: 4 },
  matchTypeBadgeText: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.bold, color: '#fff' },
  imageContainer: { position: 'relative' },
  stadiumImage: { width: '100%', height: 140 },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, justifyContent: 'flex-end', padding: SIZES.sm },
  overlayContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateTimeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: SIZES.sm, paddingVertical: 4, borderRadius: SIZES.radiusFull },
  dateTimeText: { fontSize: FONT_SIZES.xs, color: '#fff', fontWeight: FONTS.medium },
  skillBadgeOverlay: { borderRadius: SIZES.radiusFull, overflow: 'hidden' },
  skillGradient: { paddingHorizontal: SIZES.sm, paddingVertical: 4 },
  skillTextWhite: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.bold, color: '#fff' },
  noImageHeader: { padding: SIZES.md },
  cardContent: { padding: SIZES.md },
  teamNameRow: { flexDirection: 'row', alignItems: 'center', padding: SIZES.sm, borderRadius: SIZES.radiusSm, marginBottom: SIZES.sm, gap: SIZES.xs },
  teamNameText: { fontSize: FONT_SIZES.md, fontWeight: FONTS.bold, flex: 1 },
  vsText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.xs },
  stadiumName: { fontSize: FONT_SIZES.lg, fontWeight: FONTS.bold, flex: 1 },
  skillBadge: { paddingHorizontal: SIZES.sm, paddingVertical: 4, borderRadius: SIZES.radiusSm },
  skillText: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.semiBold },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SIZES.sm },
  addressText: { fontSize: FONT_SIZES.xs, flex: 1 },
  cardInfo: { flexDirection: 'row', gap: SIZES.sm, marginBottom: SIZES.md },
  infoChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SIZES.sm, paddingVertical: 4, borderRadius: SIZES.radiusSm },
  infoText: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.medium },
  playersSection: { marginBottom: SIZES.md },
  playersHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.xs },
  playersLabel: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  playersCount: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.bold },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden', marginBottom: SIZES.xs },
  progressFill: { height: '100%', borderRadius: 3 },
  slotsText: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.medium },
  teamStatusSection: { flexDirection: 'row', alignItems: 'center', padding: SIZES.sm, borderRadius: SIZES.radiusSm, marginBottom: SIZES.md, gap: SIZES.xs },
  teamStatusText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  cardFooter: { flexDirection: 'row', justifyContent: 'flex-end' },
  joinBtn: { borderRadius: SIZES.radiusFull, overflow: 'hidden' },
  joinGradient: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: SIZES.lg, paddingVertical: SIZES.sm },
  joinText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.bold, color: '#fff' },
  fullBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: SIZES.radiusFull },
  fullText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.semiBold },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: SIZES.md },
  emptyText: { fontSize: FONT_SIZES.lg, fontWeight: FONTS.semiBold },
  createMatchBtn: { marginTop: SIZES.lg, borderRadius: SIZES.radiusFull, overflow: 'hidden' },
  createMatchGradient: { flexDirection: 'row', alignItems: 'center', gap: SIZES.sm, paddingHorizontal: SIZES.xl, paddingVertical: SIZES.md },
  createMatchText: { fontSize: FONT_SIZES.md, fontWeight: FONTS.bold, color: '#fff' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  createModalContent: { width: width - 40, borderRadius: SIZES.radiusLg, padding: SIZES.lg },
  createModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.xs },
  createModalTitle: { fontSize: FONT_SIZES.xl, fontWeight: FONTS.bold },
  createModalSubtitle: { fontSize: FONT_SIZES.sm, marginBottom: SIZES.lg },
  matchTypeOption: { flexDirection: 'row', alignItems: 'center', padding: SIZES.md, borderRadius: SIZES.radius, borderWidth: 1, marginBottom: SIZES.md },
  matchTypeIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  matchTypeInfo: { flex: 1, marginLeft: SIZES.md },
  matchTypeTitle: { fontSize: FONT_SIZES.md, fontWeight: FONTS.semiBold },
  matchTypeDesc: { fontSize: FONT_SIZES.sm, marginTop: 2 },
});
