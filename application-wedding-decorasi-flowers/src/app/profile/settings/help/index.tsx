import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, useColorScheme, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { ChevronRight, MessageCircle, Mail, Phone } from 'lucide-react-native';
import apiClient from '@/api/client';

export default function HelpScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelp();
  }, []);

  const fetchHelp = async () => {
    try {
      const response = await apiClient.get('/legal/help');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load help info', err);
    } finally {
      setLoading(false);
    }
  };

  const ContactItem = ({ icon, label, subLabel, onPress }: any) => (
    <TouchableOpacity style={[styles.contactItem, { borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>{icon}</View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.contactLabel, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.contactSub, { color: colors.textSecondary }]}>{subLabel}</Text>
      </View>
      <ChevronRight size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.backgroundElement }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <Stack.Screen options={{ title: 'Help Center', headerShown: true }} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{data?.title || 'How can we help?'}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{data?.subtitle || 'Our team is ready to assist you'}</Text>

        <Card style={styles.card}>
          {data?.contact_options?.map((item: any, idx: number) => (
            <ContactItem
              key={idx}
              icon={<MessageCircle size={20} color={colors.primary} />}
              label={item.label}
              subLabel={item.subLabel}
              onPress={() => Linking.openURL(item.url)}
            />
          ))}
          {!data?.contact_options && (
            <>
              <ContactItem
                icon={<Mail size={20} color={colors.primary} />}
                label="Email Support"
                subLabel="support@weddingapp.com"
                onPress={() => Linking.openURL('mailto:support@weddingapp.com')}
              />
              <ContactItem
                icon={<Phone size={20} color={colors.primary} />}
                label="Phone Call"
                subLabel="+62 812-3456-7890"
                onPress={() => Linking.openURL('tel:+6281234567890')}
              />
            </>
          )}
        </Card>

        {data?.faqs && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>FREQUENTLY ASKED QUESTIONS</Text>
            {data.faqs.map((faq: any, i: number) => (
              <Card key={i} style={styles.faqCard}>
                <Text style={[styles.faqQ, { color: colors.text }]}>{faq.question}</Text>
                <Text style={[styles.faqA, { color: colors.textSecondary }]}>{faq.answer}</Text>
              </Card>
            ))}
          </>
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '900' },
  subtitle: { fontSize: 14, marginBottom: 24, marginTop: 4 },
  card: { padding: 0, overflow: 'hidden', marginBottom: 32 },
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 15, fontWeight: '700' },
  contactSub: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 11, fontWeight: '800', marginBottom: 12, letterSpacing: 1 },
  faqCard: { padding: 16, marginBottom: 12 },
  faqQ: { fontSize: 14, fontWeight: '800', marginBottom: 6 },
  faqA: { fontSize: 13, lineHeight: 20 }
});
