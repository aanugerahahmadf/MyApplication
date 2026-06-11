import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const theme = useColorScheme() ?? 'light';

  return (
    <AuthProvider>
      <ToastProvider>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="cbir/index" options={{ headerShown: true, headerTitle: 'AI Visual Search' }} />
          <Stack.Screen name="profile/edit" options={{ headerShown: true, headerTitle: 'Edit Profile' }} />
          <Stack.Screen name="profile/package-catalog" options={{ headerShown: true, headerTitle: 'Packages' }} />
          <Stack.Screen name="profile/product-catalog" options={{ headerShown: true, headerTitle: 'Flowers' }} />
          <Stack.Screen name="profile/reviews" options={{ headerShown: true, headerTitle: 'My Reviews' }} />
          <Stack.Screen name="profile/settings" options={{ headerShown: true, headerTitle: 'Settings' }} />
          <Stack.Screen name="profile/wishlist" options={{ headerShown: true, headerTitle: 'Wishlist' }} />
          <Stack.Screen name="details" options={{ headerShown: true, headerTitle: 'Detail Info' }} />
          <Stack.Screen name="checkout" options={{ headerShown: true, headerTitle: 'Secure Checkout' }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: true, headerTitle: 'Direct Message' }} />
        </Stack>
      </ToastProvider>
    </AuthProvider>
  );
}
