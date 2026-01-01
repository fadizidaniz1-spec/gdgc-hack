import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context';
import { SIZES, FONTS, FONT_SIZES, SHADOWS } from '../../constants';

export const NotificationsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [settings, setSettings] = useState({
    bookingUpdates: true,
    matchInvites: true,
    promotions: false,
    reminders: true,
    chatMessages: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    { key: 'bookingUpdates', icon: 'calendar', label: 'Booking Updates', desc: 'Get notified about your bookings' },
    { key: 'matchInvites', icon: 'people', label: 'Match Invites', desc: 'Receive match invitations' },
    { key: 'reminders', icon: 'alarm', label: 'Reminders', desc: 'Match and booking reminders' },
    { key: 'chatMessages', icon: 'chatbubble', label: 'Chat Messages', desc: 'New message notifications' },
    { key: 'promotions', icon: 'megaphone', label: 'Promotions', desc: 'Deals and special offers' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface }, SHADOWS.small]}>
          {notificationItems.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.settingItem,
                { borderBottomColor: colors.border },
                index === notificationItems.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>{item.desc}</Text>
              </View>
              <Switch
                value={settings[item.key]}
                onValueChange={() => toggleSetting(item.key)}
                trackColor={{ false: colors.border, true: colors.primary + '50' }}
                thumbColor={settings[item.key] ? colors.primary : colors.textSecondary}
              />
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
  card: { borderRadius: SIZES.radius, overflow: 'hidden' },
  settingItem: {
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
  settingInfo: { flex: 1, marginLeft: SIZES.sm },
  settingLabel: { fontSize: FONT_SIZES.md, fontWeight: FONTS.medium },
  settingDesc: { fontSize: FONT_SIZES.sm, marginTop: 2 },
});
