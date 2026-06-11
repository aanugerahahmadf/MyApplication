import React from 'react';
import { View, Text, StyleSheet, Image, useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

interface EntryProps {
  label?: string;
  value?: string | number | null;
  children?: React.ReactNode;
  badge?: boolean;
  color?: 'primary' | 'success' | 'danger' | 'info' | 'gray' | 'warning';
  weight?: 'normal' | 'bold' | 'black';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  icon?: React.ReactNode;
}

export const TextEntry: React.FC<EntryProps> = ({
  label,
  value,
  badge,
  color = 'gray',
  weight = 'normal',
  size = 'md',
  icon
}) => {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const getTextColor = () => {
    if (badge) return '#fff';
    switch (color) {
      case 'primary': return colors.primary;
      case 'success': return colors.success;
      case 'danger': return colors.danger;
      case 'info': return colors.info;
      case 'warning': return colors.warning;
      default: return colors.text;
    }
  };

  const getBadgeBg = () => {
    switch (color) {
      case 'primary': return colors.primary;
      case 'success': return colors.success;
      case 'danger': return colors.danger;
      case 'info': return colors.info;
      case 'warning': return colors.warning;
      default: return colors.backgroundSelected;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'xs': return 10;
      case 'sm': return 12;
      case 'lg': return 18;
      case 'xl': return 20;
      case '2xl': return 24;
      default: return 14;
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <View style={[
        styles.valueWrapper,
        badge && [styles.badge, { backgroundColor: getBadgeBg() }]
      ]}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[
          styles.value,
          {
            color: getTextColor(),
            fontSize: getFontSize(),
            fontWeight: weight === 'black' ? '900' : (weight === 'bold' ? '700' : '400')
          }
        ]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export const ImageEntry: React.FC<{ label?: string; url: string; height?: number }> = ({ label, url, height = 200 }) => {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <View style={[styles.imageContainer, { backgroundColor: colors.backgroundElement, borderColor: colors.border, height }]}>
        <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    lineHeight: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  icon: {
    marginRight: 6,
  },
  imageContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
