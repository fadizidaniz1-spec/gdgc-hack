import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES, TIME_SLOTS } from '../../constants';

// Time slot picker for booking
export const TimeSlotPicker = ({ selectedSlot, onSelectSlot, bookedSlots = [] }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Select Time Slot</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.slots}>
          {TIME_SLOTS.map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = selectedSlot === slot;

            return (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.slot,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                  isBooked && { backgroundColor: colors.disabled, borderColor: colors.disabled },
                ]}
                onPress={() => !isBooked && onSelectSlot(slot)}
                disabled={isBooked}
              >
                <Text
                  style={[
                    styles.slotText,
                    { color: colors.text },
                    isSelected && { color: colors.textLight },
                    isBooked && { color: colors.textSecondary },
                  ]}
                >
                  {slot}
                </Text>
                {isBooked && <Text style={[styles.bookedLabel, { color: colors.textSecondary }]}>Booked</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.md,
  },
  title: {
    fontSize: FONT_SIZES.md,
    marginBottom: SIZES.sm,
    fontWeight: FONTS.semiBold,
  },
  slots: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  slot: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  slotText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.medium,
  },
  bookedLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});
