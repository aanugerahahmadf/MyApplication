import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Home, Receipt, ShoppingCart, MessageSquareText, User } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Header } from '@/components/Header';

export default function TabLayout() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  // Filament active colors from mobile-bottom-nav.blade.php
  const activeColor = theme === 'light' ? '#ca8a04' : '#facc15';
  const inactiveColor = theme === 'light' ? 'rgb(156, 163, 175)' : 'rgb(107, 114, 128)';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: theme === 'light' ? '#ffffff' : 'rgb(17, 24, 39)',
          borderTopColor: theme === 'light' ? 'rgb(229, 231, 235)' : 'rgba(255, 255, 255, 0.1)',
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        header: () => <Header />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <Receipt size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <ShoppingCart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <MessageSquareText size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
