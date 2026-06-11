import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Bell,
  Shield,
  CircleHelp,
  Info,
  ChevronRight,
  Moon,
  Languages,
  Lock,
  Eye,
  Trash2
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import * as SecureStore from 'expo-secure-store';
import { useToast } from '@/components/ui/Toast';

export default function SettingsScreen() {
  const router = useRouter();
  const systemTheme = useColorScheme() ?? 'light';
  const colors = Colors[systemTheme];
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [language, setLanguage] = useState('English');
  const [themeMode, setThemeMode] = useState('System');

  // Load saved settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedNotifs = await SecureStore.getItemAsync('settings_notifications');
    const savedBio = await SecureStore.getItemAsync('settings_biometrics');
    const savedLang = await SecureStore.getItemAsync('settings_language');
    const savedTheme = await SecureStore.getItemAsync('settings_theme');

    if (savedNotifs !== null) setNotifications(savedNotifs === 'true');
    if (savedBio !== null) setBiometrics(savedBio === 'true');
    if (savedLang !== null) setLanguage(savedLang);
    if (savedTheme !== null) setThemeMode(savedTheme);
  };

  const toggleNotifications = async (val: boolean) => {
    setNotifications(val);
    await SecureStore.setItemAsync('settings_notifications', val.toString());
    showToast(`Notifications ${val ? 'enabled' : 'disabled'}`, 'info');
  };

  const toggleBiometrics = async (val: boolean) => {
    setBiometrics(val);
    await SecureStore.setItemAsync('settings_biometrics', val.toString());
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Change Language',
      'Select your preferred language',
      [
        { text: 'English', onPress: () => updateLanguage('English') },
        { text: 'Bahasa Indonesia', onPress: () => updateLanguage('Bahasa Indonesia') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const updateLanguage = async (lang: string) => {
    setLanguage(lang);
    await SecureStore.setItemAsync('settings_language', lang);
    showToast(`Language changed to ${lang}`, 'success');
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Appearance',
      'Choose how the app looks',
      [
        { text: 'System', onPress: () => updateTheme('System') },
        { text: 'Light', onPress: () => updateTheme('Light') },
        { text: 'Dark', onPress: () => updateTheme('Dark') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const updateTheme = async (mode: string) => {
    setThemeMode(mode);
    await SecureStore.setItemAsync('settings_theme', mode);
    showToast(`Theme set to ${mode}`, 'info');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => showToast('Request sent to admin', 'info')
        }
      ]
    );
  };

  const SettingItem = ({ icon, label, subLabel, value, type = 'link', onPress, disabled = false }: any) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={type === 'switch' || disabled}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '10' }]}>
          {icon}
        </View>
        <View style={styles.textWrp}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          {subLabel && <Text style={[styles.subLabel, { color: colors.textSecondary }]}>{subLabel}</Text>}
        </View>
      </View>

      {type === 'link' ? (
        <View style={styles.itemRight}>
          {value && <Text style={[styles.valueText, { color: colors.primary }]}>{value}</Text>}
          <ChevronRight size={18} color={colors.textSecondary} />
        </View>
      ) : type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#d1d5db', true: colors.primary }}
          thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundElement }]} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: 'Settings', headerShown: true }} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>General</Text>
        <Card style={styles.card}>
          <SettingItem
            icon={<Bell size={18} color={colors.primary} />}
            label="Push Notifications"
            subLabel="Receive alerts about your orders"
            type="switch"
            value={notifications}
            onPress={toggleNotifications}
          />
          <SettingItem
            icon={<Languages size={18} color={colors.primary} />}
            label="Language"
            value={language}
            onPress={handleLanguageChange}
          />
          <SettingItem
            icon={<Moon size={18} color={colors.primary} />}
            label="Appearance"
            value={themeMode}
            onPress={handleThemeChange}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Security & Account</Text>
        <Card style={styles.card}>
          <SettingItem
            icon={<Lock size={18} color={colors.primary} />}
            label="Change Password"
            onPress={() => router.push('/profile/edit')}
          />
          <SettingItem
            icon={<Shield size={18} color={colors.primary} />}
            label="Biometric Login"
            subLabel="Use Fingerprint or FaceID"
            type="switch"
            value={biometrics}
            onPress={toggleBiometrics}
          />
          <SettingItem
            icon={<Trash2 size={18} color={colors.danger} />}
            label="Delete Account"
            onPress={handleDeleteAccount}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Information</Text>
        <Card style={styles.card}>
          <SettingItem
            icon={<CircleHelp size={18} color={colors.primary} />}
            label="Help Center"
            onPress={() => router.push('/profile/settings/help')}
          />
          <SettingItem
            icon={<Eye size={18} color={colors.primary} />}
            label="Privacy Policy"
            onPress={() => router.push('/profile/settings/privacy')}
          />
          <SettingItem
            icon={<Info size={18} color={colors.primary} />}
            label="About WeddingApp"
            onPress={() => router.push('/profile/settings/about')}
          />
        </Card>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          Wedding Flowers Organizer
        </Text>
        <Text style={[styles.versionText, { color: colors.textSecondary, marginTop: 2 }]}>
          Version 1.2.4 (Build 42)
        </Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    paddingLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrp: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 11,
    marginTop: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 13,
    marginRight: 8,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
