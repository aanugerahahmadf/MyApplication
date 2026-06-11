/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#030712', // Gray 950
    background: '#ffffff',
    backgroundElement: '#f9fafb', // Gray 50
    backgroundSelected: '#f3f4f6', // Gray 100
    textSecondary: '#4b5563', // Gray 600
    primary: '#ca8a04', // Filament Amber 600
    primaryForeground: '#ffffff',
    border: '#e5e7eb', // Gray 200
    ring: '#ca8a04',
    danger: '#dc2626', // Red 600
    success: '#16a34a', // Green 600
  },
  dark: {
    text: '#ffffff',
    background: '#030712', // Gray 950
    backgroundElement: '#111827', // Gray 900
    backgroundSelected: '#1f2937', // Gray 800
    textSecondary: '#9ca3af', // Gray 400
    primary: '#eab308', // Filament Amber 500
    primaryForeground: '#030712',
    border: '#1f2937', // Gray 800
    ring: '#eab308',
    danger: '#ef4444', // Red 500
    success: '#22c55e', // Green 500
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
