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
  RefreshControl,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Star, Heart } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');

export default function PackageCatalogScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();

  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await apiClient.get('/packages');
      if (response.data.status === 'success') {
        setPackages(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load packages', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPackages();
  };

  const renderItem = ({ item }: { item: any }) => {
    const finalPrice = item.discount_price > 0 ? item.discount_price : item.price;
    const originalPrice = item.price;
    const discountPct = item.discount_price > 0 ? Math.round((originalPrice - finalPrice) / originalPrice * 100) : null;

    const rating = item.rating || "5.0";

    // Filament Style Category Color
    const catName = item.category?.name;
    const catColors = ['#f87171','#fb923c','#fbbf24','#34d399','#38bdf8','#818cf8','#e879f9','#f472b6','#a3e635','#2dd4bf'];
    const catColor = catName ? catColors[Math.abs(catName.split('').reduce((a:any,b:any)=>a+b.charCodeAt(0),0)) % catColors.length] : colors.textSecondary;

    const stock = item.stock ?? 0;
    const stockLabel = stock <= 0 ? 'Out' : `${stock} Left`;
    const stockColor = stock <= 0 ? '#ef4444' : (stock <= 3 ? '#f59e0b' : '#10b981');

    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/details', params: { id: item.id, type: 'package' } })}
        style={styles.gridItem}
        activeOpacity={0.9}
      >
        <Card style={styles.catalogCard}>
          <View style={[styles.imageWrapper, { backgroundColor: theme === 'light' ? '#f3f4f6' : '#111827' }]}>
            <Image source={{ uri: item.image_url }} style={styles.itemImage} resizeMode="cover" />
            {discountPct && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discountPct}%</Text>
              </View>
            )}
            <TouchableOpacity style={styles.wishlistBtnMini}>
              <Heart
                size={14}
                color={item.is_wishlist ? colors.danger : colors.textSecondary}
                fill={item.is_wishlist ? colors.danger : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.catWrapper}>
              {catName && (
                <Text style={[styles.catalogCat, { borderLeftColor: catColor, color: catColor }]}>
                  {catName}
                </Text>
              )}
            </View>

            <View style={styles.nameWrapper}>
              <Text style={[styles.itemTitle, { color: theme === 'dark' ? '#e5e7eb' : '#111827' }]} numberOfLines={2}>
                {item.name}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={[styles.priceText, { color: theme === 'dark' ? '#eab308' : '#d97706' }]}>
                Rp {finalPrice?.toLocaleString('id-ID')}
              </Text>
              {discountPct && (originalPrice > 0) && (
                <Text style={[styles.originalPriceText, { color: colors.textSecondary }]}>
                  Rp {originalPrice.toLocaleString('id-ID')}
                </Text>
              )}
            </View>

            <View style={styles.footerRow}>
              <View style={styles.ratingBox}>
                <Star size={10} fill="#facc15" color="#facc15" />
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{rating}</Text>
              </View>
              <Text style={[styles.stockLabel, { color: stockColor }]}>
                {stockLabel}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <Stack.Screen options={{ title: 'Package Catalog', headerShown: true }} />
      {loading && !refreshing ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={packages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>No packages found</Text>
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
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 32) / 2,
    marginBottom: 12,
  },
  catalogCard: {
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.08)',
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
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
  discountBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: '#eab308',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    zIndex: 10,
  },
  discountText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '900',
  },
  wishlistBtnMini: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 6,
    paddingBottom: 8,
    gap: 2,
  },
  catWrapper: {
    height: 18,
    overflow: 'hidden',
    marginBottom: 2,
    justifyContent: 'center',
  },
  catalogCat: {
    fontSize: 9,
    fontWeight: '700',
    paddingLeft: 4,
    borderLeftWidth: 2,
  },
  nameWrapper: {
    height: 36,
    overflow: 'hidden',
    marginBottom: 3,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 13,
  },
  priceRow: {
    height: 32,
    justifyContent: 'flex-start',
    marginBottom: 3,
  },
  priceText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  originalPriceText: {
    fontSize: 9,
    textDecorationLine: 'line-through',
    lineHeight: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 9,
    fontWeight: '600',
  },
  stockLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
});
