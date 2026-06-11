import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Dimensions,
  RefreshControl
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Heart, Star, ShoppingCart } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');
const columnWidth = (width - 32) / 2;

export default function WishlistScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await apiClient.get('/wishlist');
      if (response.data.status === 'success') {
        setItems(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWishlist();
  };

  const handleToggleWishlist = async (id: number) => {
    try {
      await apiClient.post('/wishlist/toggle', { package_id: id }); // Assuming package_id for now as per api.php
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to toggle wishlist', err);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const detail = item.package || item.product || item;
    const type = item.package ? 'package' : 'product';
    const catName = detail.category?.name || 'Category';

    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/details', params: { id: detail.id, type } })}
        style={styles.gridItem}
        activeOpacity={0.9}
      >
        <Card style={styles.catalogCard}>
          <View style={[styles.imageWrapper, { backgroundColor: colors.backgroundSelected }]}>
            <Image source={{ uri: detail.image_url }} style={styles.itemImage} resizeMode="cover" />
            <TouchableOpacity
              style={styles.wishlistBtn}
              onPress={() => handleToggleWishlist(detail.id)}
            >
              <Heart size={18} fill={colors.danger} color={colors.danger} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>{catName}</Text>
            <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>{detail.name}</Text>
            <Text style={[styles.priceText, { color: colors.primary }]}>
              Rp {(detail.discount_price || detail.price).toLocaleString('id-ID')}
            </Text>

            <View style={styles.footerRow}>
              <View style={styles.ratingBox}>
                <Star size={10} fill="#facc15" color="#facc15" />
                <Text style={styles.ratingText}>{detail.rating || '5.0'}</Text>
              </View>
              <TouchableOpacity style={[styles.cartBtn, { backgroundColor: colors.primary }]}>
                <ShoppingCart size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <Stack.Screen options={{ title: 'My Wishlist' }} />
      {loading && !refreshing ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Heart size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Your wishlist is empty</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/home')} style={{ marginTop: 12 }}>
                <Text style={{ color: colors.primary, fontWeight: '700' }}>Explore Decorations</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: columnWidth,
    marginBottom: 8,
  },
  catalogCard: {
    padding: 0,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 6,
    borderRadius: 20,
  },
  infoContainer: {
    padding: 8,
    gap: 2,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    height: 32,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  cartBtn: {
    padding: 6,
    borderRadius: 6,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});
