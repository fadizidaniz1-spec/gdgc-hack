import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES } from '../../constants';
import { Button } from '../../components/common';
import { useBookingStore } from '../../store';

export const PaymentScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { booking } = route.params;
  const [selectedMethod, setSelectedMethod] = useState(null);

  const { processPayment, isLoading } = useBookingStore();

  const paymentMethods = [
    { id: 'card', name: 'CIB Card', icon: 'card-outline' },
    { id: 'baridi_mob', name: 'Baridi Mob', icon: 'wallet-outline' },
    { id: 'ccp', name: 'CCP', icon: 'business-outline' },
    { id: 'cash', name: 'Pay at Stadium', icon: 'cash-outline' },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    try {
      const result = await processPayment(booking.id, selectedMethod);

      if (selectedMethod === 'cash') {
        Alert.alert(
          'Booking Confirmed',
          'Please pay at the stadium before your session.',
          [{ text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'MyBookings' }) }]
        );
      } else {
        Alert.alert(
          'Payment Successful',
          `Transaction ID: ${result.transactionId}`,
          [{ text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'MyBookings' }) }]
        );
      }
    } catch (error) {
      Alert.alert('Payment Failed', error.message || 'Please try again');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Stadium</Text>
            <Text style={[styles.value, { color: colors.text }]}>{booking.stadiumName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
            <Text style={[styles.value, { color: colors.text }]}>{booking.date}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Time</Text>
            <Text style={[styles.value, { color: colors.text }]}>{booking.startTime}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>{booking.totalPrice} DA</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Payment Method</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodCard,
              { backgroundColor: colors.surface, borderColor: 'transparent' },
              selectedMethod === method.id && { borderColor: colors.primary },
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Ionicons
              name={method.icon}
              size={24}
              color={selectedMethod === method.id ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.methodName,
                { color: colors.text },
                selectedMethod === method.id && { color: colors.primary },
              ]}
            >
              {method.name}
            </Text>
            {selectedMethod === method.id && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        ))}

        {selectedMethod && selectedMethod !== 'cash' && (
          <Text style={[styles.demoNote, { color: colors.textSecondary }]}>
            Demo: Payment will be simulated
          </Text>
        )}
      </View>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button
          title={selectedMethod === 'cash' ? 'Confirm Booking' : `Pay ${booking.totalPrice} DA`}
          onPress={handlePayment}
          loading={isLoading}
          disabled={!selectedMethod}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: SIZES.md },
  summaryCard: { padding: SIZES.md, borderRadius: SIZES.radius, marginBottom: SIZES.lg },
  summaryTitle: { fontSize: FONT_SIZES.md, marginBottom: SIZES.sm, fontWeight: FONTS.semiBold },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SIZES.xs },
  label: { fontSize: FONT_SIZES.sm },
  value: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  totalRow: { borderTopWidth: 1, marginTop: SIZES.sm, paddingTop: SIZES.sm },
  totalLabel: { fontSize: FONT_SIZES.md, fontWeight: FONTS.semiBold },
  totalValue: { fontSize: FONT_SIZES.lg, fontWeight: FONTS.bold },
  sectionTitle: { fontSize: FONT_SIZES.md, marginBottom: SIZES.sm, fontWeight: FONTS.semiBold },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.sm,
    borderWidth: 2,
    gap: SIZES.sm,
  },
  methodName: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: FONTS.medium },
  demoNote: { fontSize: FONT_SIZES.sm, textAlign: 'center', marginTop: SIZES.md },
  footer: { padding: SIZES.md, borderTopWidth: 1 },
});
