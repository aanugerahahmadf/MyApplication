import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Image,
  Switch,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Mail,
  Lock,
  User,
  UserPlus,
  Chrome,
  X,
  ArrowLeft,
  UserCircle,
  IdentificationCard,
  Phone,
  MapPin,
  ChevronRight
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import apiClient from '@/api/client';

export default function RegisterScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const { showToast } = useToast();

  // Wizard Step State
  const [formStep, setFormStep] = useState(1); // 1: Akun, 2: Detail Pribadi

  // Form State - Step 1: Akun
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form State - Step 2: Detail Pribadi
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [midName, setMidName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [gender, setGender] = useState(''); // 'male' | 'female'
  const [address, setAddress] = useState('');

  // Checkbox States
  const [remember, setRemember] = useState(false);
  const [agreement, setAgreement] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  const isStep1Valid = username && email && password && password === confirmPassword;
  const isFormValid = remember && agreement && isStep1Valid && fullName;

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    const parts = text.trim().split(' ');
    if (parts.length > 0) {
      const first = parts.shift() || '';
      const last = parts.length > 0 ? parts.pop() || '' : '';
      const mid = parts.length > 0 ? parts.join(' ') : '';
      setFirstName(first);
      setMidName(mid);
      setLastName(last);
    } else {
      setFirstName('');
      setMidName('');
      setLastName('');
    }
  };

  const handleRegister = async () => {
    if (!(remember && agreement)) {
      showToast('Silakan centang opsi Ingat Saya dan Setujui Syarat & Ketentuan untuk melanjutkan.', 'error');
      return;
    }

    if (!isFormValid) {
      showToast('Mohon lengkapi semua field yang wajib diisi', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/register', {
        username,
        email,
        password,
        password_confirmation: confirmPassword,
        full_name: fullName,
        first_name: firstName,
        mid_name: midName,
        last_name: lastName,
        whatsapp,
        gender,
        address,
        agreement,
        remember
      });

      if (response.data.status === 'success') {
        showToast('Pendaftaran Berhasil!', 'success');
        router.push({
          pathname: '/(auth)/verify-otp',
          params: { email }
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Pendaftaran gagal.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!(remember && agreement)) {
      showToast('Silakan centang opsi Ingat Saya dan Setujui Syarat & Ketentuan untuk melanjutkan.', 'error');
      return;
    }
    showToast('Menghubungkan ke Google...', 'info');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.backgroundElement }]}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2855/2855146.png' }}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: colors.text }]}>Daftar Akun Baru</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign up to your account
          </Text>
        </View>

        <Card style={styles.card}>
          {/* Social Login Section */}
          <Button
            title="Masuk Dengan Google"
            onPress={handleGoogleLogin}
            variant="secondary"
            icon={<Chrome size={20} color={colors.text} />}
            style={[styles.googleButton, !(remember && agreement) && styles.disabledBtn]}
            disabled={!(remember && agreement)}
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Wizard UI */}
          <View style={styles.wizardHeader}>
            <View style={styles.wizardStep}>
              <View style={[styles.stepIcon, formStep === 1 ? styles.stepIconActive : { backgroundColor: colors.backgroundSelected }]}>
                <UserCircle size={18} color={formStep === 1 ? '#fff' : colors.textSecondary} />
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepLabel, { color: formStep === 1 ? colors.primary : colors.textSecondary }]}>Akun</Text>
                <Text style={styles.stepDesc}>Info akun dasar</Text>
              </View>
            </View>
            <View style={[styles.stepLine, { backgroundColor: colors.border }]} />
            <View style={styles.wizardStep}>
              <View style={[styles.stepIcon, formStep === 2 ? styles.stepIconActive : { backgroundColor: colors.backgroundSelected }]}>
                <IdentificationCard size={18} color={formStep === 2 ? '#fff' : colors.textSecondary} />
              </View>
              <View style={styles.stepInfo}>
                <Text style={[styles.stepLabel, { color: formStep === 2 ? colors.primary : colors.textSecondary }]}>Detail Pribadi</Text>
                <Text style={styles.stepDesc}>Info kontak Anda</Text>
              </View>
            </View>
          </View>

          {formStep === 1 ? (
            <View style={styles.stepContent}>
              <Input
                label="Username"
                placeholder="Masukkan username"
                value={username}
                onChangeText={setUsername}
                leftIcon={<User size={20} color={colors.textSecondary} />}
              />
              <Input
                label="Alamat Email"
                placeholder="Masukkan alamat email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={colors.textSecondary} />}
              />
              <Input
                label="Kata Sandi"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
              />
              <Input
                label="Konfirmasi Kata Sandi"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
              />
              <Button
                title="Lanjutkan"
                onPress={() => setFormStep(2)}
                disabled={!isStep1Valid}
                variant="primary"
                icon={<ChevronRight size={20} color="#fff" />}
                style={styles.actionButton}
              />
            </View>
          ) : (
            <View style={styles.stepContent}>
              <Input
                label="Nama Lengkap"
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChangeText={handleFullNameChange}
                leftIcon={<User size={20} color={colors.textSecondary} />}
              />
              <Input
                label="Nomor WhatsApp"
                placeholder="Contoh: 08123456789"
                value={whatsapp}
                onChangeText={setWhatsapp}
                keyboardType="phone-pad"
                leftIcon={<Phone size={20} color={colors.textSecondary} />}
              />
              <View style={styles.genderContainer}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Jenis Kelamin</Text>
                <View style={styles.genderOptions}>
                  <TouchableOpacity
                    style={[styles.genderBtn, gender === 'male' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
                    onPress={() => setGender('male')}
                  >
                    <Text style={[styles.genderBtnText, { color: gender === 'male' ? colors.primary : colors.textSecondary }]}>Laki-laki</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.genderBtn, gender === 'female' && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
                    onPress={() => setGender('female')}
                  >
                    <Text style={[styles.genderBtnText, { color: gender === 'female' ? colors.primary : colors.textSecondary }]}>Perempuan</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Input
                label="Alamat"
                placeholder="Masukkan alamat lengkap"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                leftIcon={<MapPin size={20} color={colors.textSecondary} />}
              />

              <View style={styles.wizardActions}>
                <TouchableOpacity onPress={() => setFormStep(1)} style={styles.backButton}>
                   <ArrowLeft size={20} color={colors.textSecondary} />
                   <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Kembali</Text>
                </TouchableOpacity>
              </View>

              {/* Filament Checkboxes Area */}
              <View style={styles.checkboxArea}>
                <View style={styles.checkItem}>
                  <Switch
                    value={remember}
                    onValueChange={setRemember}
                    trackColor={{ false: '#d1d5db', true: colors.primary }}
                  />
                  <Text style={[styles.checkLabel, { color: colors.textSecondary }]}>Ingat Saya</Text>
                </View>

                <View style={styles.checkItem}>
                  <Switch
                    value={agreement}
                    onValueChange={(val) => {
                      setAgreement(val);
                      if (val) {
                        setModalStep(1);
                        setModalVisible(true);
                      }
                    }}
                    trackColor={{ false: '#d1d5db', true: colors.primary }}
                  />
                  <View style={styles.agreementTextWrapper}>
                    <Text style={[styles.checkLabel, { color: colors.textSecondary }]}>
                      Dengan mencentang Setuju & Bergabung atau Lanjutkan, Anda menyetujui{' '}
                      <Text
                        style={{ color: colors.primary, fontWeight: '700' }}
                        onPress={() => { setModalStep(1); setModalVisible(true); }}
                      >Perjanjian Pengguna</Text>,{' '}
                      <Text
                        style={{ color: colors.primary, fontWeight: '700' }}
                        onPress={() => { setModalStep(2); setModalVisible(true); }}
                      >Kebijakan Privasi</Text>
                      {' '}dan Kebijakan Cookie Wedding Organizer.
                    </Text>
                  </View>
                </View>
              </View>

              <Button
                title="Daftar"
                onPress={handleRegister}
                loading={loading}
                icon={<UserPlus size={20} color="#fff" />}
                style={[styles.actionButton, !isFormValid && styles.disabledBtn]}
                disabled={!isFormValid}
              />
            </View>
          )}
        </Card>

        <View style={styles.footer}>
          <Text style={{ color: colors.textSecondary }}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={{ color: colors.primary, fontWeight: '800' }}>Masuk</Text>
          </TouchableOpacity>
        </View>

        {/* Agreement Modal - Match Filament Wizard */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                {modalStep === 2 && (
                  <TouchableOpacity onPress={() => setModalStep(1)} style={styles.modalBack}>
                    <ArrowLeft size={24} color={colors.text} />
                  </TouchableOpacity>
                )}
                <Text style={[styles.modalTitle, { color: colors.primary }]}>
                  {modalStep === 1 ? 'Perjanjian Pengguna' : 'Kebijakan Privasi'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                  <X size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={[styles.modalStepText, { color: colors.textSecondary }]}>
                  Langkah {modalStep} dari 2
                </Text>
                <Text style={[styles.policyContent, { color: colors.text }]}>
                  {modalStep === 1 ? (
                    "Harap tinjau Perjanjian Pengguna. Ketentuan ini mengatur penggunaan Anda atas aplikasi dan fitur-fiturnya."
                  ) : (
                    "Privasi Anda penting bagi kami. Kebijakan Privasi kami menjelaskan bagaimana kami mengumpulkan dan menggunakan data Anda untuk menyediakan layanan kami."
                  )}
                </Text>
              </ScrollView>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                {modalStep === 1 ? (
                  <Button
                    title="Lanjutkan"
                    onPress={() => setModalStep(2)}
                    style={{ flex: 1 }}
                  />
                ) : (
                  <Button
                    title="Saya Mengerti & Setuju"
                    onPress={() => { setAgreement(true); setModalVisible(false); }}
                    style={{ flex: 1 }}
                  />
                )}
              </View>
            </View>
          </View>
        </Modal>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    padding: 24,
    borderRadius: 24,
  },
  googleButton: {
    height: 50,
    borderRadius: 12,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 10,
    fontWeight: '900',
    opacity: 0.6,
  },
  wizardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  wizardStep: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stepIconActive: {
    backgroundColor: '#ca8a04', // Amber 600
  },
  stepInfo: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 10,
    color: '#9ca3af',
  },
  stepLine: {
    width: 20,
    height: 1,
    marginHorizontal: 8,
  },
  stepContent: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
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
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    alignItems: 'center',
  },
  genderBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  wizardActions: {
    marginTop: 8,
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkboxArea: {
    gap: 16,
    marginBottom: 24,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkLabel: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  agreementTextWrapper: {
    flex: 1,
  },
  actionButton: {
    height: 54,
    borderRadius: 12,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalBack: {
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
  },
  modalClose: {
    marginLeft: 12,
  },
  modalBody: {
    padding: 20,
  },
  modalStepText: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
  },
  policyContent: {
    fontSize: 14,
    lineHeight: 22,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
  }
});
