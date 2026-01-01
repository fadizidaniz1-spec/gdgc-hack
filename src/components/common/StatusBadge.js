import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES } from '../../constants';

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
};

// Status badge for booking status display
export const StatusBadge = ({ status }) => {
  const { colors } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return colors.confirmed;
      case BOOKING_STATUS.REJECTED:
        return colors.rejected;
      case BOOKING_STATUS.PENDING:
      default:
        return colors.pending;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case BOOKING_STATUS.CONFIRMED:
        return 'Confirmed';
      case BOOKING_STATUS.REJECTED:
        return 'Rejected';
      case BOOKING_STATUS.PENDING:
      default:
        return 'Pending';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
      <Text style={[styles.text, { color: colors.textLight }]}>{getStatusLabel()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs / 2,
    borderRadius: SIZES.radiusSm,
  },
  text: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.medium,
  },
});
