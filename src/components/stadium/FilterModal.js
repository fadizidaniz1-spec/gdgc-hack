import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES, FIELD_SIZES } from '../../constants';
import { Button } from '../common';

// Filter modal for stadium search
export const FilterModal = ({ visible, onClose, onApply, currentFilters }) => {
  const { colors } = useTheme();
  const [fieldSize, setFieldSize] = useState(currentFilters.fieldSize);
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice);
  const [maxDistance, setMaxDistance] = useState(currentFilters.maxDistance);

  const priceOptions = [2000, 3000, 4000, 5000, 6000, null];
  const distanceOptions = [2, 5, 10, 15, null];

  const handleApply = () => {
    onApply({ fieldSize, maxPrice, maxDistance });
    onClose();
  };

  const handleClear = () => {
    setFieldSize(null);
    setMaxPrice(null);
    setMaxDistance(null);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Field Size</Text>
            <View style={styles.options}>
              {FIELD_SIZES.map((size) => (
                <TouchableOpacity
                  key={size.id}
                  style={[
                    styles.option, 
                    { backgroundColor: colors.background, borderColor: colors.border },
                    fieldSize === size.id && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setFieldSize(fieldSize === size.id ? null : size.id)}
                >
                  <Text style={[
                    styles.optionText, 
                    { color: colors.text },
                    fieldSize === size.id && { color: colors.textLight }
                  ]}>
                    {size.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Max Price (DA/h)</Text>
            <View style={styles.options}>
              {priceOptions.map((price) => (
                <TouchableOpacity
                  key={price || 'any'}
                  style={[
                    styles.option, 
                    { backgroundColor: colors.background, borderColor: colors.border },
                    maxPrice === price && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setMaxPrice(price)}
                >
                  <Text style={[
                    styles.optionText, 
                    { color: colors.text },
                    maxPrice === price && { color: colors.textLight }
                  ]}>
                    {price ? `${price}` : 'Any'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Max Distance (km)</Text>
            <View style={styles.options}>
              {distanceOptions.map((dist) => (
                <TouchableOpacity
                  key={dist || 'any'}
                  style={[
                    styles.option, 
                    { backgroundColor: colors.background, borderColor: colors.border },
                    maxDistance === dist && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setMaxDistance(dist)}
                >
                  <Text style={[
                    styles.optionText, 
                    { color: colors.text },
                    maxDistance === dist && { color: colors.textLight }
                  ]}>
                    {dist ? `${dist} km` : 'Any'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button title="Clear" variant="outline" onPress={handleClear} style={styles.clearBtn} />
            <Button title="Apply Filters" onPress={handleApply} style={styles.applyBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: SIZES.radiusLg,
    borderTopRightRadius: SIZES.radiusLg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONTS.bold,
  },
  content: {
    padding: SIZES.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    marginBottom: SIZES.sm,
    marginTop: SIZES.md,
    fontWeight: FONTS.semiBold,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  option: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
  },
  optionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.medium,
  },
  footer: {
    flexDirection: 'row',
    padding: SIZES.md,
    gap: SIZES.sm,
    borderTopWidth: 1,
  },
  clearBtn: {
    flex: 1,
  },
  applyBtn: {
    flex: 2,
  },
});
