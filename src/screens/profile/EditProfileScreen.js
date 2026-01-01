import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context';
import { useAuthStore } from '../../store';
import { SIZES, FONTS, FONT_SIZES, POSITIONS, SKILL_LEVELS, SHADOWS } from '../../constants';
import { Button, Input } from '../../components/common';

export const EditProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [position, setPosition] = useState(user?.position || 'midfielder');
  const [skillLevel, setSkillLevel] = useState(user?.skillLevel || 'intermediate');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال الاسم');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updateProfile({ name, position, skillLevel });
      setSaving(false);
      Alert.alert('تم', 'تم حفظ التغييرات', [
        { text: 'حسناً', onPress: () => navigation.goBack() },
      ]);
    }, 500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.avatarSection, { backgroundColor: colors.surface }, SHADOWS.small]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={40} color={colors.textLight} />
          </View>
          <TouchableOpacity style={[styles.changePhotoBtn, { backgroundColor: colors.primary }]}>
            <Ionicons name="camera" size={16} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <Input
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          leftIcon="person-outline"
        />

        <Text style={[styles.label, { color: colors.text }]}>Position</Text>
        <View style={styles.optionsGrid}>
          {POSITIONS.map((pos) => (
            <TouchableOpacity
              key={pos.id}
              style={[
                styles.optionCard,
                { backgroundColor: position === pos.id ? colors.primary : colors.surface },
                SHADOWS.small,
              ]}
              onPress={() => setPosition(pos.id)}
            >
              <Ionicons
                name={pos.icon}
                size={24}
                color={position === pos.id ? colors.textLight : colors.primary}
              />
              <Text style={[
                styles.optionLabel,
                { color: position === pos.id ? colors.textLight : colors.text },
              ]}>
                {pos.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.text }]}>Skill Level</Text>
        <View style={styles.skillOptions}>
          {SKILL_LEVELS.map((skill) => (
            <TouchableOpacity
              key={skill.id}
              style={[
                styles.skillChip,
                {
                  backgroundColor: skillLevel === skill.id ? colors[skill.id] : colors.surfaceVariant,
                },
              ]}
              onPress={() => setSkillLevel(skill.id)}
            >
              <Text style={[
                styles.skillText,
                { color: skillLevel === skill.id ? colors.textLight : colors.text },
              ]}>
                {skill.labelEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button title="Save Changes" onPress={handleSave} loading={saving} style={styles.saveBtn} />
      </ScrollView>
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
  avatarSection: {
    alignItems: 'center',
    padding: SIZES.xl,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: SIZES.lg,
    right: '35%',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONTS.medium,
    marginBottom: SIZES.sm,
    marginTop: SIZES.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.sm,
  },
  optionCard: {
    width: '48%',
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    gap: SIZES.xs,
  },
  optionLabel: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  skillOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.xs,
  },
  skillChip: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusFull,
  },
  skillText: { fontSize: FONT_SIZES.sm, fontWeight: FONTS.medium },
  saveBtn: { marginTop: SIZES.xl, marginBottom: SIZES.xxxl },
});
