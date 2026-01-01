import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, Modal, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useLanguage } from '../../context';
import { useMatchStore, useAuthStore, useStadiumStore } from '../../store';
import { SIZES, FONTS, FONT_SIZES, SKILL_LEVELS, SHADOWS, GRADIENTS } from '../../constants';
import { Button, Input } from '../../components/common';

const FIELD_SIZES = [
  { id: '5v5', label: '5v5', maxPlayers: 10 },
  { id: '7v7', label: '7v7', maxPlayers: 14 },
  { id: '11v11', label: '11v11', maxPlayers: 22 },
];

// Generate time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let h = 8; h <= 23; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

// Generate dates for next 30 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return dates;
};

const DATES = generateDates();

export const CreateMatchScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { addMatch } = useMatchStore();
  const { stadiums } = useStadiumStore();
  const { user } = useAuthStore();
  
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [showStadiumPicker, setShowStadiumPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [fieldSize, setFieldSize] = useState('7v7');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [slotsNeeded, setSlotsNeeded] = useState('');
  const [pricePerPlayer, setPricePerPlayer] = useState('');
  const [notes, setNotes] = useState('');

  const selectedFieldSize = FIELD_SIZES.find((f) => f.id === fieldSize);
  const maxSlots = selectedFieldSize?.maxPlayers || 14;

  // Sort stadiums by distance (nearest first)
  const sortedStadiums = [...stadiums].sort((a, b) => a.distance - b.distance);

  const handleCreate = () => {
    if (!selectedStadium || !selectedDate || !selectedTime || !pricePerPlayer || !slotsNeeded) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    const slots = parseInt(slotsNeeded, 10);
    if (slots < 1 || slots > maxSlots) {
      Alert.alert(t('error'), `${t('playersMustBeBetween')} 1 ${t('and')} ${maxSlots}`);
      return;
    }

    addMatch({
      stadiumId: selectedStadium.id,
      stadiumName: selectedStadium.name,
      stadiumImage: selectedStadium.image,
      stadiumAddress: selectedStadium.address,
      date: selectedDate,
      time: selectedTime,
      fieldSize,
      skillLevel,
      slotsNeeded: slots,
      pricePerPlayer: parseInt(pricePerPlayer, 10),
      notes,
      organizerName: user?.name || user?.username || t('organizer'),
      matchType: 'player', // Individual player match
    });

    Alert.alert(t('matchCreated'), t('matchCreatedSuccess'), [
      { text: t('ok'), onPress: () => navigation.goBack() },
    ]);
  };

  const getSkillColor = (level) => colors[level] || colors.primary;

  const renderStadiumItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.stadiumItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => {
        setSelectedStadium(item);
        setShowStadiumPicker(false);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.stadiumImage} />
      <View style={styles.stadiumInfo}>
        <Text style={[styles.stadiumName, { color: colors.text }]}>{item.name}</Text>
        <View style={styles.stadiumMeta}>
          <Ionicons name="location" size={14} color={colors.textSecondary} />
          <Text style={[styles.stadiumAddress, { color: colors.textSecondary }]}>{item.address}</Text>
        </View>
        <View style={styles.stadiumMeta}>
          <Ionicons name="navigate" size={14} color={colors.primary} />
          <Text style={[styles.stadiumDistance, { color: colors.primary }]}>{item.distance} {t('kmAway')}</Text>
        </View>
      </View>
      <View style={[styles.ratingBadge, { backgroundColor: colors.secondary + '20' }]}>
        <Ionicons name="star" size={12} color={colors.secondary} />
        <Text style={[styles.ratingText, { color: colors.secondary }]}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDateItem = ({ item }) => {
    const isSelected = selectedDate === item.date;
    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          { backgroundColor: isSelected ? colors.primary : colors.surface, borderColor: colors.border },
        ]}
        onPress={() => {
          setSelectedDate(item.date);
          setShowDatePicker(false);
        }}
      >
        <Text style={[styles.dateDay, { color: isSelected ? '#fff' : colors.textSecondary }]}>{item.day}</Text>
        <Text style={[styles.dateDayNum, { color: isSelected ? '#fff' : colors.text }]}>{item.dayNum}</Text>
        <Text style={[styles.dateMonth, { color: isSelected ? '#fff' : colors.textSecondary }]}>{item.month}</Text>
      </TouchableOpacity>
    );
  };

  const renderTimeItem = ({ item }) => {
    const isSelected = selectedTime === item;
    return (
      <TouchableOpacity
        style={[
          styles.timeItem,
          { backgroundColor: isSelected ? colors.primary : colors.surface, borderColor: colors.border },
        ]}
        onPress={() => {
          setSelectedTime(item);
          setShowTimePicker(false);
        }}
      >
        <Ionicons name="time-outline" size={16} color={isSelected ? '#fff' : colors.textSecondary} />
        <Text style={[styles.timeText, { color: isSelected ? '#fff' : colors.text }]}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const getSelectedDateDisplay = () => {
    if (!selectedDate) return t('selectDate');
    const dateObj = DATES.find(d => d.date === selectedDate);
    return dateObj ? `${dateObj.day}, ${dateObj.dayNum} ${dateObj.month}` : selectedDate;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('createMatch')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stadium Selection */}
        <Text style={[styles.label, { color: colors.text }]}>{t('selectStadium')}</Text>
        <TouchableOpacity
          style={[styles.stadiumSelector, { backgroundColor: colors.surface, borderColor: colors.border }, SHADOWS.small]}
          onPress={() => setShowStadiumPicker(true)}
        >
          {selectedStadium ? (
            <View style={styles.selectedStadium}>
              <Image source={{ uri: selectedStadium.image }} style={styles.selectedImage} />
              <View style={styles.selectedInfo}>
                <Text style={[styles.selectedName, { color: colors.text }]}>{selectedStadium.name}</Text>
                <Text style={[styles.selectedAddress, { color: colors.textSecondary }]}>{selectedStadium.address}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderRow}>
              <Ionicons name="location-outline" size={24} color={colors.textSecondary} />
              <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
                {t('chooseNearestStadium')}
              </Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Date & Time Selection */}
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={[styles.label, { color: colors.text }]}>{t('date')}</Text>
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              <Text style={[styles.pickerText, { color: selectedDate ? colors.text : colors.textSecondary }]}>
                {getSelectedDateDisplay()}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.halfInput}>
            <Text style={[styles.label, { color: colors.text }]}>{t('time')}</Text>
            <TouchableOpacity
              style={[styles.pickerButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.pickerText, { color: selectedTime ? colors.text : colors.textSecondary }]}>
                {selectedTime || t('selectTime')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Field Size Selection */}
        <Text style={[styles.label, { color: colors.text }]}>{t('fieldSize')}</Text>
        <View style={styles.optionsRow}>
          {FIELD_SIZES.map((size) => (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.optionChip,
                { backgroundColor: fieldSize === size.id ? colors.primary : colors.surfaceVariant },
              ]}
              onPress={() => setFieldSize(size.id)}
            >
              <Text style={[styles.optionText, { color: fieldSize === size.id ? colors.textLight : colors.text }]}>
                {size.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skill Level Selection */}
        <Text style={[styles.label, { color: colors.text }]}>{t('skillLevel')}</Text>
        <View style={styles.optionsRow}>
          {SKILL_LEVELS.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              style={[
                styles.optionChip,
                { backgroundColor: skillLevel === skill.id ? getSkillColor(skill.id) : colors.surfaceVariant },
              ]}
              onPress={() => setSkillLevel(skill.id)}
            >
              <Text style={[styles.optionText, { color: skillLevel === skill.id ? colors.textLight : colors.text }]}>
                {t(skill.id)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label={t('playersNeeded')}
          placeholder={`1-${maxSlots}`}
          value={slotsNeeded}
          onChangeText={setSlotsNeeded}
          keyboardType="numeric"
          leftIcon="people-outline"
        />

        <Input
          label={`${t('price')} (DA)`}
          placeholder="500"
          value={pricePerPlayer}
          onChangeText={setPricePerPlayer}
          keyboardType="numeric"
          leftIcon="cash-outline"
        />

        <Input
          label={t('notesOptional')}
          placeholder={t('anyAdditionalInfo')}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />

        {/* Summary */}
        <View style={[styles.summary, { backgroundColor: colors.surface }, SHADOWS.small]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>{t('matchSummary')}</Text>
          {selectedStadium && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('stadium')}:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedStadium.name}</Text>
            </View>
          )}
          {selectedDate && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('date')}:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{getSelectedDateDisplay()}</Text>
            </View>
          )}
          {selectedTime && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('time')}:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedTime}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('playersNeeded')}:</Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>{slotsNeeded || 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('fieldSize')}:</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>{fieldSize}</Text>
          </View>
        </View>

        <Button title={t('createMatch')} onPress={handleCreate} style={styles.createButton} />
      </ScrollView>

      {/* Stadium Picker Modal */}
      <Modal visible={showStadiumPicker} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('selectStadium')}</Text>
              <TouchableOpacity onPress={() => setShowStadiumPicker(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              {t('sortedByDistance')}
            </Text>
            <FlatList
              data={sortedStadiums}
              keyExtractor={(item) => item.id}
              renderItem={renderStadiumItem}
              contentContainerStyle={styles.stadiumList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContentSmall, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('selectDate')}</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={DATES}
              keyExtractor={(item) => item.date}
              renderItem={renderDateItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateList}
            />
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{t('selectTime')}</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={TIME_SLOTS}
              keyExtractor={(item) => item}
              renderItem={renderTimeItem}
              numColumns={4}
              contentContainerStyle={styles.timeList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  backButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FONT_SIZES.xl, fontWeight: FONTS.bold },
  placeholder: { width: 44 },
  content: { flex: 1, paddingHorizontal: SIZES.md },
  label: { fontSize: FONT_SIZES.md, fontWeight: FONTS.medium, marginBottom: SIZES.xs, marginTop: SIZES.sm },
  stadiumSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.sm,
  },
  selectedStadium: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  selectedImage: { width: 50, height: 50, borderRadius: SIZES.radiusSm },
  selectedInfo: { flex: 1, marginLeft: SIZES.sm },
  selectedName: { fontSize: FONT_SIZES.md, fontWeight: FONTS.semiBold },
  selectedAddress: { fontSize: FONT_SIZES.sm },
  placeholderRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SIZES.sm },
  placeholderText: { fontSize: FONT_SIZES.md },
  row: { flexDirection: 'row', gap: SIZES.md },
  halfInput: { flex: 1 },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    gap: SIZES.sm,
  },
  pickerText: { fontSize: FONT_SIZES.md, flex: 1 },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.xs, marginBottom: SIZES.sm },
  optionChip: { paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: SIZES.radiusFull },
  optionText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  summary: { borderRadius: SIZES.radius, padding: SIZES.md, marginTop: SIZES.lg },
  summaryTitle: { fontSize: FONT_SIZES.lg, fontWeight: FONTS.semiBold, marginBottom: SIZES.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.xs },
  summaryLabel: { fontSize: FONT_SIZES.md },
  summaryValue: { fontSize: FONT_SIZES.md, fontWeight: FONTS.medium },
  createButton: { marginTop: SIZES.xl, marginBottom: SIZES.xxxl },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalContent: { height: '80%', borderTopLeftRadius: SIZES.radiusXl, borderTopRightRadius: SIZES.radiusXl, padding: SIZES.md },
  modalContentSmall: { borderTopLeftRadius: SIZES.radiusXl, borderTopRightRadius: SIZES.radiusXl, padding: SIZES.md, paddingBottom: SIZES.xl },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.xs },
  modalTitle: { fontSize: FONT_SIZES.xl, fontWeight: FONTS.bold },
  modalSubtitle: { fontSize: FONT_SIZES.sm, marginBottom: SIZES.md },
  stadiumList: { paddingBottom: SIZES.xl },
  stadiumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.sm,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginBottom: SIZES.sm,
  },
  stadiumImage: { width: 70, height: 70, borderRadius: SIZES.radiusSm },
  stadiumInfo: { flex: 1, marginLeft: SIZES.sm },
  stadiumName: { fontSize: FONT_SIZES.md, fontWeight: FONTS.semiBold },
  stadiumMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  stadiumAddress: { fontSize: FONT_SIZES.xs },
  stadiumDistance: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.medium },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: SIZES.xs, paddingVertical: 2, borderRadius: SIZES.radiusSm },
  ratingText: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.semiBold },
  dateList: { paddingVertical: SIZES.md },
  dateItem: {
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    marginRight: SIZES.sm,
    minWidth: 70,
  },
  dateDay: { fontSize: FONT_SIZES.xs, fontWeight: FONTS.medium },
  dateDayNum: { fontSize: FONT_SIZES.xl, fontWeight: FONTS.bold, marginVertical: 4 },
  dateMonth: { fontSize: FONT_SIZES.xs },
  timeList: { paddingBottom: SIZES.xl },
  timeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.sm,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    margin: 4,
    gap: 4,
  },
  timeText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
});
