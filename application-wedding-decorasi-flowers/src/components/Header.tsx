import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
  Platform
} from 'react-native';
import { Search, Camera, Image as ImageIcon } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export const Header: React.FC = () => {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      router.push({
        pathname: '/cbir',
        params: { imageUri: result.assets[0].uri }
      });
    }
  };

  const handleGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Gallery permission is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      router.push({
        pathname: '/cbir',
        params: { imageUri: result.assets[0].uri }
      });
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/cbir',
        params: { query: searchQuery }
      });
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      <View style={styles.container}>
        {/* Filament Style Search Wrapper */}
        <View style={[
          styles.fiInputWrp,
          {
            backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
            borderColor: colors.border,
          }
        ]}>
          {/* Prefix Icon */}
          <View style={styles.prefixIcon}>
            <Search size={18} color={theme === 'dark' ? '#9ca3af' : '#9ca3af'} />
          </View>

          {/* Input Field */}
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Search..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoComplete="off"
            returnKeyType="search"
          />

          {/* CBIR Buttons with Divider */}
          <View style={[styles.actionButtons, { borderLeftColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
            <TouchableOpacity
              onPress={handleCamera}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Camera size={18} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGallery}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <ImageIcon size={18} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  fiInputWrp: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  prefixIcon: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
    paddingVertical: 0,
    outlineStyle: 'none', // for web if needed
  } as any,
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
    paddingHorizontal: 6,
    gap: 2,
    height: '60%', // Matches Filament's partial divider
  },
  iconButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
});
