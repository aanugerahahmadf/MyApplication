import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  useColorScheme,
  Dimensions
} from 'react-native';
import {
  User,
  History,
  Package,
  Flower,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  Heart,
  ShoppingBag,
  UserCircle
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const GRID_GAP = 12;
const CARD_WIDTH_HALF = (width - 32 - GRID_GAP) / 2;

export default function ProfileScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();

  React.useEffect(() => {
    refreshUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const StatCard = ({
    label,
    icon: Icon,
    onPress,
    fullWidth = false,
    color = colors.primary
  }: {
    label: string;
    icon: any;
    onPress: () => void;
    fullWidth?: boolean;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.statCardContainer,
        {
          width: fullWidth ? '100%' : CARD_WIDTH_HALF,
          backgroundColor: colors.background,
          borderColor: colors.border
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.statCardContent}>
        <View style={[styles.iconContainer, { backgroundColor: theme === 'light' ? '#fef3c7' : '#451a03' }]}>
          <Icon size={24} color={color} />
        </View>
        <Text style={[styles.statLabel, { color: colors.text }]}>{label}</Text>
      </View>
      <ChevronRight size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.backgroundElement }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header Profile */}
      <View style={[styles.header, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <User size={40} color={colors.textSecondary} />
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'User Name'}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || 'user@example.com'}</Text>
        </View>
      </View>

      {/* Profile Overview Stats - Matching Filament ProfileOverview.php */}
      <View style={styles.gridContainer}>
        {/* Row 1: Edit Profile (Full Width) */}
        <StatCard
          label="Edit Profile"
          icon={UserCircle}
          onPress={() => router.push('/profile/edit')}
          fullWidth
        />

        {/* Row 2: 2 Columns - Katalog Paket | Katalog Bunga */}
        <View style={styles.row}>
          <StatCard
            label="Katalog Paket Bunga"
            icon={Package}
            onPress={() => router.push('/profile/package-catalog')}
          />
          <StatCard
            label="Katalog Bunga"
            icon={ShoppingBag}
            onPress={() => router.push('/profile/product-catalog')}
          />
        </View>

        {/* Row 3: Riwayat (Full Width) */}
        <StatCard
          label="Riwayat"
          icon={History}
          onPress={() => router.push('/(tabs)/orders')}
          fullWidth
        />

        {/* Row 4: Ulasan (Full Width) */}
        <StatCard
          label="Ulasan"
          icon={Star}
          onPress={() => router.push('/profile/reviews')}
          fullWidth
        />

        {/* Additional items not in widget but useful */}
        <View style={styles.row}>
          <StatCard
            label="Wishlist"
            icon={Heart}
            color={colors.danger}
            onPress={() => router.push('/profile/wishlist')}
          />
          <StatCard
            label="Settings"
            icon={Settings}
            color={colors.textSecondary}
            onPress={() => router.push('/profile/settings')}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: colors.danger, backgroundColor: colors.background }]}
        onPress={handleLogout}
      >
        <LogOut size={20} color={colors.danger} />
        <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#f4f4f5',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
  },
  gridContainer: {
    paddingHorizontal: 16,
    gap: GRID_GAP,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: GRID_GAP,
  },
  statCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
