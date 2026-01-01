import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, POSITIONS, SKILL_LEVELS } from '../../constants';
import { Button } from '../../components/common';
import { useAuthStore } from '../../store';

// Profile setup screen for new users - position and skill level only
// Name is already collected during registration
export const ProfileSetupScreen = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [positions, setPositions] = useState([]); // Multiple positions allowed
  const [skillLevel, setSkillLevel] = useState('');
  const [error, setError] = useState('');

  const { updateProfile, user } = useAuthStore();

  // Toggle position selection (allow multiple)
  const togglePosition = (posId) => {
    setPositions(prev => {
      if (prev.includes(posId)) {
        return prev.filter(p => p !== posId);
      } else {
        return [...prev, posId];
      }
    });
  };

  const handleSubmit = () => {
    if (positions.length === 0) {
      setError(t('selectPosition') || 'Please select at least one position');
      return;
    }
    if (!skillLevel) {
      setError(t('selectSkillLevel') || 'Please select your skill level');
      return;
    }

    // Save positions as array, use name from registration
    updateProfile({ 
      position: positions.length === 1 ? positions[0] : positions.join(','),
      positions: positions,
      skillLevel 
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('completeProfile') || 'Complete Your Profile'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('welcomeUser') || `Welcome ${user?.name || ''}! Select your preferences`}
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('preferredPositions') || 'Preferred Positions'}
        </Text>
        <Text style={[styles.hint, { color: colors.textTertiary }]}>
          {t('selectMultiplePositions') || 'You can select multiple positions'}
        </Text>
        <View style={styles.options}>
          {POSITIONS.map((pos) => {
            const isSelected = positions.includes(pos.id);
            return (
              <TouchableOpacity
                key={pos.id}
                style={[
                  styles.option, 
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isSelected && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => togglePosition(pos.id)}
              >
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.textLight} style={styles.checkIcon} />
                )}
                <Text style={[
                  styles.optionText, 
                  { color: colors.text },
                  isSelected && { color: colors.textLight }
                ]}>
                  {t(pos.id) || pos.labelEn}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {t('skillLevel') || 'Skill Level'}
        </Text>
        <View style={styles.options}>
          {SKILL_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.option, 
                { backgroundColor: colors.surface, borderColor: colors.border },
                skillLevel === level.id && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setSkillLevel(level.id)}
            >
              <Text style={[
                styles.optionText, 
                { color: colors.text },
                skillLevel === level.id && { color: colors.textLight }
              ]}>
                {t(level.id) || level.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}

        <Button title={t('continue') || 'Continue'} onPress={handleSubmit} style={styles.button} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SIZES.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONTS.bold,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    marginBottom: SIZES.xl,
    marginTop: SIZES.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    marginTop: SIZES.md,
    marginBottom: SIZES.xs,
    fontWeight: FONTS.semiBold,
  },
  hint: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SIZES.sm,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
  },
  checkIcon: {
    marginRight: 4,
  },
  optionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONTS.medium,
  },
  error: {
    fontSize: FONT_SIZES.sm,
    marginTop: SIZES.md,
    textAlign: 'center',
  },
  button: {
    marginTop: SIZES.xl,
  },
});
