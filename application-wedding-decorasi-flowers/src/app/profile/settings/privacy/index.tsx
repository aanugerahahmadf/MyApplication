import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';

export default function PrivacyScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacy();
  }, []);

  const fetchPrivacy = async () => {
    try {
      const response = await apiClient.get('/legal/privacy');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load privacy policy', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.backgroundElement }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <Stack.Screen options={{ title: 'Privacy Policy', headerShown: true }} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{data?.title || 'Privacy Policy'}</Text>
        <Text style={[styles.updated, { color: colors.textSecondary }]}>
          Last Updated: {data?.updated_at || 'June 2026'}
        </Text>

        <Text style={[styles.bodyText, { color: colors.text }]}>
          {data?.content || 'No privacy policy available at the moment.'}
        </Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '900' },
  updated: { fontSize: 13, marginBottom: 24, marginTop: 4 },
  bodyText: { fontSize: 14, lineHeight: 22, opacity: 0.8 }
});
