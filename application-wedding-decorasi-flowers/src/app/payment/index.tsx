import React, { useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function PaymentScreen() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const router = useRouter();
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const webViewRef = useRef<WebView>(null);

  // Handle Deep Linking (GoPay, ShopeePay, Bank Apps, etc.)
  const onShouldStartLoadWithRequest = (request: any) => {
    const { url } = request;

    // Indonesia Payment Schemes & Standard external links
    if (
      url.startsWith('gojek://') ||
      url.startsWith('shopeepay://') ||
      url.startsWith('ulmshoppy://') ||
      url.startsWith('linepay://') ||
      url.startsWith('whatsapp://') ||
      url.startsWith('intent://') || // Android Intent
      url.startsWith('tel:') ||
      url.startsWith('mailto:')
    ) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // If app not installed, we might want to let WebView handle it or show alert
          console.warn('App not installed for URL: ', url);
        }
      });
      return false; // Don't load in WebView
    }
    return true;
  };

  const onNavigationStateChange = (navState: any) => {
    // Detect redirect back to app from Midtrans/Backend
    // Success patterns typically configured in Midtrans Dashboard / Backend
    if (
      navState.url.includes('status=success') ||
      navState.url.includes('status_code=200') ||
      navState.url.includes('/finish') ||
      navState.url.includes('payment-success')
    ) {
      // Redirect to Orders after success
      setTimeout(() => {
        router.replace('/(tabs)/orders');
      }, 1500);
    }

    // Handle failures/cancellation if needed
    if (navState.url.includes('status=error') || navState.url.includes('status=pending')) {
       // Optional: Navigate back or show message
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Pembayaran Aman',
          headerShown: true,
          headerBackTitle: 'Kembali'
        }}
      />
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        renderLoading={() => (
          <View style={[styles.loading, { backgroundColor: colors.backgroundElement }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loading: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
