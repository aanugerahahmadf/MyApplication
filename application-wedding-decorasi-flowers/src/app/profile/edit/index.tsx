import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  Camera,
  User,
  Mail,
  Save,
  Lock,
  Phone,
  MapPin,
  UserCircle,
  ShieldCheck
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FilamentSection } from '@/components/filament/Section';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '@/api/client';
import { useToast } from '@/components/ui/Toast';

export default function EditProfileScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Form State - Personal Info (PersonalInfoComponent.php)
  const [avatar, setAvatar] = useState<string | null>(user?.avatar_url || null);
  const [fullName, setFullName] = useState(user?.name || ''); // map to full_name in backend
  const [email, setEmail] = useState(user?.email || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [address, setAddress] = useState(user?.address || '');
  const [gender, setGender] = useState(user?.gender || '');

  // Form State - Username (UsernameComponent.php)
  const [username, setUsername] = useState(user?.username || '');

  // Form State - Password (EditPasswordComponent.php)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSavePersonalInfo = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('whatsapp', whatsapp);
      formData.append('address', address);
      formData.append('gender', gender);
      formData.append('username', username);

      if (avatar && avatar.startsWith('file://')) {
        const filename = avatar.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('avatar', {
          uri: avatar,
          name: filename || 'avatar.jpg',
          type,
        } as any);
      }

      const response = await apiClient.post('/profile/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.status === 'success') {
        await refreshUser();
        showToast('Profil berhasil diperbarui!', 'success');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal memperbarui profil';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Mohon lengkapi semua field sandi', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Konfirmasi sandi tidak cocok', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/profile/update-password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });

      if (response.data.status === 'success') {
        showToast('Kata sandi berhasil diperbarui!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal memperbarui kata sandi';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
        <Stack.Screen options={{ title: 'Profil' }} />

        {/* Section Header: Avatar (Part of PersonalInfoComponent) */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
            <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <User size={40} color={colors.textSecondary} />
              )}
            </View>
            <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
              <Camera size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Section: Informasi Profil (PersonalInfoComponent.php) */}
          <FilamentSection
            title="Informasi Profil"
            icon={<UserCircle size={20} color={colors.primary} />}
            compact
          >
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              Perbarui informasi profil dan alamat email akun Anda.
            </Text>

            <Input
              label="Nama Lengkap"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Masukkan nama lengkap"
              leftIcon={<User size={18} color={colors.textSecondary} />}
            />

            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Masukkan username"
              leftIcon={<ShieldCheck size={18} color={colors.textSecondary} />}
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Masukkan email"
              keyboardType="email-address"
              leftIcon={<Mail size={18} color={colors.textSecondary} />}
            />

            <Input
              label="Nomor WhatsApp"
              value={whatsapp}
              onChangeText={setWhatsapp}
              placeholder="Contoh: 08123456789"
              keyboardType="phone-pad"
              leftIcon={<Phone size={18} color={colors.textSecondary} />}
            />

            <View style={styles.genderContainer}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Jenis Kelamin</Text>
              <View style={styles.genderOptions}>
                <TouchableOpacity
                  style={[styles.genderBtn, gender === 'male' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
                  onPress={() => setGender('male')}
                >
                  <Text style={[styles.genderText, gender === 'male' && { color: colors.primary }]}>Laki-laki</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.genderBtn, gender === 'female' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
                  onPress={() => setGender('female')}
                >
                  <Text style={[styles.genderText, gender === 'female' && { color: colors.primary }]}>Perempuan</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Input
              label="Alamat"
              value={address}
              onChangeText={setAddress}
              placeholder="Masukkan alamat lengkap"
              multiline
              numberOfLines={3}
              leftIcon={<MapPin size={18} color={colors.textSecondary} />}
            />

            <Button
              title="Simpan Profil"
              onPress={handleSavePersonalInfo}
              loading={loading}
              icon={<Save size={18} color="#fff" />}
              style={styles.saveBtn}
            />
          </FilamentSection>

          {/* Section: Perbarui Kata Sandi (EditPasswordComponent.php) */}
          <FilamentSection
            title="Perbarui Kata Sandi"
            icon={<Lock size={20} color={colors.primary} />}
            compact
          >
            <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
              Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap aman.
            </Text>

            <Input
              label="Kata sandi saat ini"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="••••••••"
            />

            <Input
              label="Kata sandi baru"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="••••••••"
            />

            <Input
              label="Konfirmasi kata sandi"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="••••••••"
            />

            <Button
              title="Perbarui Sandi"
              variant="secondary"
              onPress={handleUpdatePassword}
              loading={loading}
              icon={<Lock size={18} color={colors.text} />}
              style={styles.saveBtn}
            />
          </FilamentSection>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f4f4f5',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    padding: 16,
  },
  sectionDesc: {
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  genderContainer: {
    marginBottom: 16,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveBtn: {
    marginTop: 8,
    borderRadius: 10,
  },
});
