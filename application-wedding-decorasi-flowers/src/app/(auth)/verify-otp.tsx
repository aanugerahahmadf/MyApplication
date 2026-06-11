import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldCheck, Mail } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import apiClient from '@/api/client';

export default function VerifyOtpScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const { email, type } = useLocalSearchParams<{ email: string; type?: string }>();
  const { showToast } = useToast();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 6) {
      showToast('Please enter the 6-digit code', 'error');
      return;
    }

    setLoading(true);
    try {
      const endpoint = '/auth/verify-otp';
      const response = await apiClient.post(endpoint, { email, otp });

      if (response.data.status === 'success') {
        showToast('Verification successful!', 'success');
        if (type === 'password-reset') {
          router.push({
            pathname: '/(auth)/otp-reset-password',
            params: { email, otp }
          });
        } else {
          router.replace('/(auth)/login');
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await apiClient.post('/auth/send-otp', { email });
      showToast('New OTP sent to your email', 'success');
    } catch (err: any) {
      showToast('Failed to resend OTP', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
          <Mail size={40} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>OTP Verification</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={{ fontWeight: '800', color: colors.text }}>{email}</Text>
        </Text>
      </View>

      <Card style={styles.card}>
        <Input
          label="6-Digit Verification Code"
          placeholder="000000"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
          inputStyle={{ fontSize: 28, letterSpacing: 10, fontWeight: '900', height: 60 }}
        />

        <Button
          title="Verify Code"
          onPress={handleVerify}
          loading={loading}
          icon={<ShieldCheck size={20} color="#fff" />}
          style={styles.button}
        />

        <View style={styles.resendContainer}>
          <Text style={{ color: colors.textSecondary }}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={resending}>
            {resending ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={{ color: colors.primary, fontWeight: '800' }}>Resend OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </Card>

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Back to login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
  },
  button: {
    width: '100%',
    height: 54,
    borderRadius: 12,
    marginTop: 10,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    alignItems: 'center',
  },
  backBtn: {
    marginTop: 40,
    alignItems: 'center',
  }
});
