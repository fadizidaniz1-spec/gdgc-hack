import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, SHADOWS } from '../../constants';

export const AboutScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const links = [
    { icon: 'document-text', label: t('termsOfService'), url: '#' },
    { icon: 'shield-checkmark', label: t('privacyPolicy'), url: '#' },
    { icon: 'star', label: t('rateUs'), url: '#' },
    { icon: 'share-social', label: t('shareApp'), url: '#' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('about')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Info */}
        <View style={[styles.appInfo, { backgroundColor: colors.surface }, SHADOWS.small]}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Ionicons name="football" size={40} color={colors.textLight} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Stadium Booking</Text>
          <Text style={[styles.version, { color: colors.textSecondary }]}>{t('version')} 1.0.0</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t('appDescription')}
          </Text>
        </View>

        {/* Links */}
        <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.small]}>
          {links.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.linkItem,
                { borderBottomColor: colors.border },
                index === links.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => item.url !== '#' && Linking.openURL(item.url)}
            >
              <Ionicons name={item.icon} size={22} color={colors.primary} />
              <Text style={[styles.linkLabel, { color: colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Credits */}
        <View style={styles.credits}>
          <Text style={[styles.creditsText, { color: colors.textTertiary }]}>
            {t('madeWithLove')}
          </Text>
          <Text style={[styles.copyright, { color: colors.textTertiary }]}>
            © 2025 Stadium Booking. {t('allRightsReserved')}.
          </Text>
        </View>
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
  appInfo: {
    alignItems: 'center',
    padding: SIZES.xl,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.lg,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  appName: { fontSize: FONT_SIZES.xxl, fontWeight: FONTS.bold },
  version: { fontSize: FONT_SIZES.sm, marginTop: SIZES.xs },
  description: {
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginTop: SIZES.md,
    lineHeight: 22,
  },
  card: { borderRadius: SIZES.radius, overflow: 'hidden' },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
    gap: SIZES.sm,
  },
  linkLabel: { flex: 1, fontSize: FONT_SIZES.md, fontWeight: FONTS.medium },
  credits: { alignItems: 'center', paddingVertical: SIZES.xxl },
  creditsText: { fontSize: FONT_SIZES.md },
  copyright: { fontSize: FONT_SIZES.sm, marginTop: SIZES.xs },
});
