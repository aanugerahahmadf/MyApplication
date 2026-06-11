import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Dimensions,
  SafeAreaView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { LogIn, UserPlus } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();

  const handleGoogleLogin = () => {
    console.log('Google Login pressed');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.mainCard, {
          backgroundColor: colors.backgroundElement,
          borderColor: colors.border
        }]}>

          <View style={styles.textSection}>
            <Text style={[styles.title, { color: colors.text }]}>
              Welcome To Dekorasi Bunga Pernikahan
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Manage your decoration needs efficiently with our comprehensive system.
            </Text>

            <View style={styles.listContainer}>
              {/* List Item 1 */}
              <View style={styles.listItem}>
                <View style={styles.listDecorator}>
                  <View style={[styles.line, styles.lineTop, { borderColor: colors.border }]} />
                  <View style={[styles.dotContainer, {
                    backgroundColor: colors.backgroundElement,
                    borderColor: colors.border
                  }]}>
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  </View>
                </View>
                <Text style={[styles.listText, { color: colors.text }]}>Explore Packages & Portfolio</Text>
              </View>

              {/* List Item 2 */}
              <View style={styles.listItem}>
                <View style={styles.listDecorator}>
                  <View style={[styles.line, styles.lineBottom, { borderColor: colors.border }]} />
                  <View style={[styles.dotContainer, {
                    backgroundColor: colors.backgroundElement,
                    borderColor: colors.border
                  }]}>
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                  </View>
                </View>
                <Text style={[styles.listText, { color: colors.text }]}>Track Orders & Booking Details</Text>
              </View>
            </View>

            <View style={styles.buttonGroup}>
              {/* Masuk Button */}
              <TouchableOpacity
                style={[styles.bladeButton, {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                }]}
                onPress={() => router.push('/(auth)/login')}
              >
                <LogIn size={20} color={colors.primaryForeground} />
                <Text style={[styles.bladeButtonText, { color: colors.primaryForeground }]}>Masuk</Text>
              </TouchableOpacity>

              {/* Daftar Button */}
              <TouchableOpacity
                style={[styles.bladeButton, {
                  backgroundColor: colors.backgroundSelected,
                  borderColor: colors.border
                }]}
                onPress={() => router.push('/(auth)/register')}
              >
                <UserPlus size={20} color={colors.text} />
                <Text style={[styles.bladeButtonText, { color: colors.text }]}>Daftar</Text>
              </TouchableOpacity>

              {/* Google Button */}
              <TouchableOpacity
                style={[styles.bladeButton, {
                  backgroundColor: colors.backgroundSelected,
                  borderColor: colors.border
                }]}
                onPress={handleGoogleLogin}
              >
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png' }}
                  style={styles.googleIcon}
                />
                <Text style={[styles.bladeButtonText, { color: colors.text }]}>Masuk Dengan Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.imageSection, {
            borderColor: colors.border
          }]}>
            <Image
              source={require('../../assets/images/article/article-4.png')}
              style={styles.mainImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    width: '100%',
    maxWidth: 335,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textSection: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontFamily: Platform.select({ ios: 'InstrumentSans-SemiBold', android: 'InstrumentSans_600SemiBold', default: 'sans-serif' }),
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Platform.select({ ios: 'InstrumentSans-Regular', android: 'InstrumentSans_400Regular', default: 'sans-serif' }),
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
  },
  listContainer: {
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: 40,
  },
  listDecorator: {
    width: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  line: {
    position: 'absolute',
    borderLeftWidth: 1,
    left: 6.5,
  },
  lineTop: {
    top: '50%',
    bottom: 0,
  },
  lineBottom: {
    top: 0,
    bottom: '50%',
  },
  dotContainer: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  listText: {
    fontFamily: Platform.select({ ios: 'InstrumentSans-Medium', android: 'InstrumentSans_500Medium', default: 'sans-serif' }),
    fontSize: 13,
    fontWeight: '500',
  },
  buttonGroup: {
    gap: 12,
    marginTop: 12,
  },
  bladeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: 20,
    gap: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  bladeButtonText: {
    fontFamily: Platform.select({ ios: 'InstrumentSans-SemiBold', android: 'InstrumentSans_600SemiBold', default: 'sans-serif' }),
    fontSize: 14,
    fontWeight: '600',
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  imageSection: {
    width: '100%',
    aspectRatio: 335/376,
    borderTopWidth: 1,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
});
