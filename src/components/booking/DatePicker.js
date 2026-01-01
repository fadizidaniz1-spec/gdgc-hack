import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES } from '../../constants';

// Simple date picker showing next 7 days
export const DatePicker = ({ selectedDate, onSelectDate }) => {
  const { colors } = useTheme();

  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
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

  const dates = getDates();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Select Date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.dates}>
          {dates.map((item, index) => {
            const isSelected = selectedDate === item.date;
            const isToday = index === 0;

            return (
              <TouchableOpacity
                key={item.date}
                style={[
                  styles.dateItem, 
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => onSelectDate(item.date)}
              >
                <Text style={[
                  styles.dayText, 
                  { color: colors.textSecondary },
                  isSelected && { color: colors.textLight }
                ]}>
                  {isToday ? 'Today' : item.day}
                </Text>
                <Text style={[
                  styles.dayNum, 
                  { color: colors.text },
                  isSelected && { color: colors.textLight }
                ]}>
                  {item.dayNum}
                </Text>
                <Text style={[
                  styles.monthText, 
                  { color: colors.textSecondary },
                  isSelected && { color: colors.textLight }
                ]}>
                  {item.month}
                </Text>
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
  dates: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  dateItem: {
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    minWidth: 65,
  },
  dayText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONTS.medium,
  },
  dayNum: {
    fontSize: FONT_SIZES.xl,
    marginVertical: 2,
    fontWeight: FONTS.bold,
  },
  monthText: {
    fontSize: FONT_SIZES.xs,
  },
});
