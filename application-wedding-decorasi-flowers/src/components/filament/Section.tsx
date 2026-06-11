import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';

interface SectionProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
}

export const FilamentSection: React.FC<SectionProps> = ({ title, icon, children, compact }) => {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <Card style={[styles.card, compact && styles.compact]}>
      {title && (
        <View style={styles.header}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    marginBottom: 16,
    overflow: 'hidden',
  },
  compact: {
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
});
