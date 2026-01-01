import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES } from '../../constants';
import { Button } from '../../components/common';
import { DatePicker } from '../../components/booking';
import { TimeSlotPicker } from '../../components/stadium';
import { useBookingStore } from '../../store';

export const BookingScreen = ({ route, navigation }) => {
  const { stadium } = route.params;
  const { colors } = useTheme();
  const { t } = useLanguage();
  const today = new Date().toISOString().split('T')[0];
  
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { createBooking, isLoading } = useBookingStore();

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      Alert.alert(t('error'), t('selectTimeSlot'));
      return;
    }

    try {
      const booking = await createBooking({
        stadiumId: stadium.id,
        stadiumName: stadium.name,
        stadiumImage: stadium.image,
        date: selectedDate,
        startTime: selectedSlot,
        endTime: `${parseInt(selectedSlot.split(':')[0]) + 1}:00`,
        duration: 1,
        totalPrice: stadium.pricePerHour,
      });

      Alert.alert(
        t('bookingCreated'),
        `${stadium.name} - ${selectedDate} ${selectedSlot}`,
        [
          {
            text: t('payNow'),
            onPress: () => navigation.navigate('Payment', { booking }),
          },
          {
            text: t('payLater'),
            onPress: () => navigation.navigate('MainTabs', { screen: 'MyBookings' }),
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('error'), error.message || t('unexpectedError'));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Stadium Info Card */}
        <View style={[styles.stadiumCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.stadiumName, { color: colors.text }]}>{stadium.name}</Text>
          <View style={styles.stadiumInfo}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.stadiumAddress, { color: colors.textSecondary }]}>{stadium.address}</Text>
          </View>
          <View style={styles.stadiumMeta}>
            <Text style={[styles.fieldSize, { color: colors.primary }]}>{stadium.fieldSize}</Text>
            <Text style={[styles.price, { color: colors.primary }]}>{stadium.pricePerHour} DA/{t('hour')}</Text>
          </View>
        </View>

        <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <TimeSlotPicker
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          bookedSlots={[]}
        />

        {selectedSlot && (
          <View style={[styles.summary, { backgroundColor: colors.surface }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>{t('bookingSummary')}</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('date')}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedDate}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('time')}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedSlot}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{t('duration')}</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>1 {t('hour')}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>{t('total')}</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>{stadium.pricePerHour} DA</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button
          title={t('confirmBooking')}
          onPress={handleConfirmBooking}
          disabled={!selectedSlot}
          loading={isLoading}
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SIZES.md },
  stadiumCard: { padding: SIZES.md, borderRadius: SIZES.radius, marginBottom: SIZES.md },
  stadiumName: { fontSize: FONT_SIZES.lg, fontWeight: FONTS.semiBold },
  stadiumInfo: { flexDirection: 'row', alignItems: 'center', gap: SIZES.xs, marginTop: SIZES.xs },
  stadiumAddress: { fontSize: FONT_SIZES.sm },
  stadiumMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SIZES.sm },
  fieldSize: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  price: { fontSize: FONT_SIZES.md, fontWeight: FONTS.bold },
  summary: { padding: SIZES.md, borderRadius: SIZES.radius, marginTop: SIZES.md },
  summaryTitle: { fontSize: FONT_SIZES.lg, marginBottom: SIZES.sm, fontWeight: FONTS.semiBold },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SIZES.xs },
  summaryLabel: { fontSize: FONT_SIZES.sm },
  summaryValue: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  totalRow: { borderTopWidth: 1, marginTop: SIZES.sm, paddingTop: SIZES.sm },
  totalLabel: { fontSize: FONT_SIZES.md, fontWeight: FONTS.semiBold },
  totalValue: { fontSize: FONT_SIZES.lg, fontWeight: FONTS.bold },
  footer: { padding: SIZES.md, borderTopWidth: 1 },
});
