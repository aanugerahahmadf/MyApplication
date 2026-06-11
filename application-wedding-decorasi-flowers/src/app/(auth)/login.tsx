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
import { Mail, Lock, LogIn, Chrome, CheckCircle2, ChevronRight, X, ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import apiClient from '@/api/client';

export default function LoginScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  const isFormValid = remember && agreement;

  const handleLogin = async () => {
    if (!isFormValid) {
      showToast('Please check Remember Me and Agree to Terms', 'error');
      return;
    }
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/login', { email, password, remember });
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        await login(token, user);
        showToast(`Welcome back, ${user.name}!`, 'success');
        router.replace('/(tabs)/home');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Check your credentials.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!isFormValid) {
      showToast('Please check Remember Me and Agree to Terms', 'error');
      return;
    }
    showToast('Redirecting to Google...', 'info');
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
          <Text style={[styles.title, { color: colors.text }]}>Sign in</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to your account
          </Text>
        </View>

        <Card style={styles.card}>
          {/* Social Button - Match Filament Top Position */}
          <Button
            title="Sign in with Google"
            onPress={handleGoogleLogin}
            variant="secondary"
            icon={<Chrome size={20} color={colors.text} />}
            style={[styles.googleButton, !isFormValid && styles.disabledBtn]}
            disabled={!isFormValid}
          />

          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.textSecondary} />}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={colors.textSecondary} />}
          />

          <View style={styles.passwordActions}>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 13 }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filament Checkboxes */}
          <View style={styles.checkboxContainer}>
            <View style={styles.checkItem}>
              <Switch
                value={remember}
                onValueChange={setRemember}
                trackColor={{ false: '#d1d5db', true: colors.primary }}
              />
              <Text style={[styles.checkLabel, { color: colors.textSecondary }]}>Remember me</Text>
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
                  Agree to{' '}
                  <Text
                    style={{ color: colors.primary, fontWeight: '700' }}
                    onPress={() => { setModalStep(1); setModalVisible(true); }}
                  >Terms</Text> &{' '}
                  <Text
                    style={{ color: colors.primary, fontWeight: '700' }}
                    onPress={() => { setModalStep(2); setModalVisible(true); }}
                  >Privacy</Text>
                </Text>
              </View>
            </View>
          </View>

          <Button
            title="Sign in"
            onPress={handleLogin}
            loading={loading}
            icon={<LogIn size={20} color="#fff" />}
            style={[styles.loginButton, !isFormValid && styles.disabledBtn]}
            disabled={!isFormValid}
          />
        </Card>

        <View style={styles.footer}>
          <Text style={{ color: colors.textSecondary }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={{ color: colors.primary, fontWeight: '800' }}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Agreement Modal - Match Filament Modal Wizard */}
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
                  {modalStep === 1 ? 'User Agreement' : 'Privacy Policy'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
                  <X size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <Text style={[styles.modalStepText, { color: colors.textSecondary }]}>
                  Step {modalStep} of 2
                </Text>
                <Text style={[styles.policyContent, { color: colors.text }]}>
                  {modalStep === 1 ? (
                    "Please review the Terms of Service. These terms govern your use of the application and its features."
                  ) : (
                    "Your privacy is important. Our Privacy Policy explains how we collect and use your data to provide our services."
                  )}
                </Text>
              </ScrollView>

              <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
                {modalStep === 1 ? (
                  <Button
                    title="Continue"
                    onPress={() => setModalStep(2)}
                    style={{ flex: 1 }}
                  />
                ) : (
                  <Button
                    title="I Understand & Agree"
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
  checkboxContainer: {
    gap: 12,
    marginBottom: 24,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  agreementTextWrapper: {
    flex: 1,
  },
  loginButton: {
    height: 54,
    borderRadius: 12,
    marginBottom: 8,
  },
  passwordActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -8,
    marginBottom: 20,
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
