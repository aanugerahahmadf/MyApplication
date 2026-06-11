import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Image, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      if (!loading) {
        if (token) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/welcome');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, token]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2855/2855146.png' }}
          style={styles.logo}
        />
        <ActivityIndicator size="large" color="#ca8a04" style={{ marginTop: 20 }} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  }
});
