import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useLanguage } from '../../context';
import { SIZES, FONTS, FONT_SIZES, SHADOWS } from '../../constants';

export const HelpSupportScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  const FAQ_ITEMS = [
    { q: t('howToBook'), a: t('howToBookAnswer') },
    { q: t('canCancelBooking'), a: t('canCancelBookingAnswer') },
    { q: t('howToJoinMatch'), a: t('howToJoinMatchAnswer') },
    { q: t('howPaymentsWork'), a: t('howPaymentsWorkAnswer') },
  ];

  const contactItems = [
    { icon: 'call', label: t('callUs'), value: '+213 555 123 456', action: () => Linking.openURL('tel:+213555123456') },
    { icon: 'mail', label: t('email'), value: 'support@stadiumbook.dz', action: () => Linking.openURL('mailto:support@stadiumbook.dz') },
    { icon: 'logo-whatsapp', label: t('whatsapp'), value: '+213 555 123 456', action: () => Linking.openURL('https://wa.me/213555123456') },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('helpSupport')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('contactUs')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.small]}>
          {contactItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.contactItem,
                { borderBottomColor: colors.border },
                index === contactItems.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={item.action}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.contactValue, { color: colors.textSecondary }]}>{item.value}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('faq')}</Text>
        <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.small]}>
          {FAQ_ITEMS.map((item, index) => (
            <View
              key={index}
              style={[
                styles.faqItem,
                { borderBottomColor: colors.border },
                index === FAQ_ITEMS.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[styles.faqQuestion, { color: colors.text }]}>{item.q}</Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{item.a}</Text>
            </View>
          ))}
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
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: FONTS.semiBold, marginBottom: SIZES.sm, marginTop: SIZES.md },
  card: { borderRadius: SIZES.radius, overflow: 'hidden' },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.md,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: { flex: 1, marginLeft: SIZES.sm },
  contactLabel: { fontSize: FONT_SIZES.md, fontWeight: FONTS.medium },
  contactValue: { fontSize: FONT_SIZES.sm, marginTop: 2 },
  faqItem: { padding: SIZES.md, borderBottomWidth: 1 },
  faqQuestion: { fontSize: FONT_SIZES.md, fontWeight: FONTS.semiBold, marginBottom: SIZES.xs },
  faqAnswer: { fontSize: FONT_SIZES.sm, lineHeight: 20 },
});
