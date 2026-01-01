import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, SHADOWS } from '../../constants';

const LANGUAGES = [
  { id: 'ar', label: 'العربية', labelEn: 'Arabic', flag: '🇩🇿' },
  { id: 'en', label: 'English', labelEn: 'English', flag: '🇬🇧' },
  { id: 'fr', label: 'Français', labelEn: 'French', flag: '🇫🇷' },
];

export const LanguageScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  const handleSelect = async (langId) => {
    if (langId === language) return;
    
    await changeLanguage(langId);
    Alert.alert(
      langId === 'ar' ? 'تم' : langId === 'fr' ? 'Succès' : 'Success',
      langId === 'ar' ? 'تم تغيير اللغة بنجاح' : 
      langId === 'fr' ? 'Langue changée avec succès' : 
      'Language changed successfully',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('language')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.small]}>
          {LANGUAGES.map((lang, index) => (
            <TouchableOpacity
              key={lang.id}
              style={[
                styles.langItem,
                { borderBottomColor: colors.border },
                index === LANGUAGES.length - 1 && { borderBottomWidth: 0 },
                language === lang.id && { backgroundColor: colors.primary + '10' },
              ]}
              onPress={() => handleSelect(lang.id)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <View style={styles.langInfo}>
                <Text style={[styles.langLabel, { color: colors.text }]}>{lang.label}</Text>
                <Text style={[styles.langLabelEn, { color: colors.textSecondary }]}>{lang.labelEn}</Text>
              </View>
              {language === lang.id && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.note, { color: colors.textTertiary }]}>
          {language === 'ar' ? 'سيتم تطبيق التغييرات فوراً' :
           language === 'fr' ? 'Les changements seront appliqués immédiatement' :
           'Changes will be applied immediately'}
        </Text>
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
  content: { flex: 1, padding: SIZES.md },
  card: { borderRadius: SIZES.radius, overflow: 'hidden' },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
  },
  flag: { fontSize: 28 },
  langInfo: { flex: 1, marginLeft: SIZES.sm },
  langLabel: { fontSize: FONT_SIZES.md, fontWeight: FONTS.medium },
  langLabelEn: { fontSize: FONT_SIZES.sm, marginTop: 2 },
  note: { fontSize: FONT_SIZES.sm, textAlign: 'center', marginTop: SIZES.lg },
});
