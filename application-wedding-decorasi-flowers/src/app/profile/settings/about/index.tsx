import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, useColorScheme, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import apiClient from '@/api/client';

export default function AboutScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const response = await apiClient.get('/legal/about');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load about info', err);
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
      <Stack.Screen options={{ title: 'About WeddingApp', headerShown: true }} />
      <View style={styles.header}>
        <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoText}>W</Text>
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>
          {data?.title || 'Wedding Flowers Organizer'}
        </Text>
        <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.2.4 (Build 42)</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={[styles.description, { color: colors.text }]}>
            {data?.content || 'Wedding Flowers Organizer is your ultimate companion for planning the perfect floral decorations for your special day.'}
          </Text>
        </Card>

        {data?.mission && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>OUR MISSION</Text>
            <Text style={[styles.bodyText, { color: colors.text }]}>
              {data.mission}
            </Text>
          </>
        )}

        <View style={styles.footer}>
          <Text style={[styles.copyright, { color: colors.textSecondary }]}>
            © 2026 {data?.owner || 'Wedding Decorasi Flowers'}. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingVertical: 40 },
  logoPlaceholder: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  appName: { fontSize: 20, fontWeight: '900' },
  version: { fontSize: 14, marginTop: 4 },
  content: { padding: 16 },
  card: { padding: 16, marginBottom: 24 },
  description: { fontSize: 15, lineHeight: 24, textAlign: 'center' },
  sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 8, letterSpacing: 1 },
  bodyText: { fontSize: 14, lineHeight: 22 },
  footer: { marginTop: 40, alignItems: 'center', paddingBottom: 20 },
  copyright: { fontSize: 12 }
});
