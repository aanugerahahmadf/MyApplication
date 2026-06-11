import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import {
  Star,
  Ticket,
  Clock,
  ChevronRight,
  LayoutGrid,
  Heart,
  MapPin,
  ShoppingBag,
  Zap,
  Flame
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useToast } from '@/components/ui/Toast';

const { width } = Dimensions.get('window');
const columnWidth = (width - 32) / 2;

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const { showToast } = useToast();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = async () => {
    try {
      const response = await apiClient.get('/home');
      if (response.data.status === 'success') {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch home data', error);
      showToast('Network error. Please try again later.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const renderCatalogItem = (item: any, type: 'package' | 'product') => {
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
        key={`${type}-${item.id}`}
        onPress={() => router.push({ pathname: '/details', params: { id: item.id, type } })}
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

  const categories = data?.categories?.map((c: any, i: number) => ({
    name: c.name,
    icon: c.icon_url ? <Image source={{ uri: c.icon_url }} style={{ width: 22, height: 22 }} /> : <Star size={22} />,
    color: c.color || ['#fb923c', '#fbbf24', '#34d399', '#38bdf8', '#818cf8', '#e879f9', '#f472b6', '#a3e635', '#2dd4bf'][i % 9]
  })) || [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundElement }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Banner Section - Dynamic from Data */}
        {data?.banners?.length > 0 && (
          <View style={styles.bannerWrapper}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.bannerScroll}
            >
              {data.banners.map((banner: any, idx: number) => (
                <View key={idx} style={styles.bannerSlide}>
                  <Image
                    source={{ uri: banner.image_url }}
                    style={styles.bannerImgLarge}
                  />
                  {(banner.title || banner.subtitle) && (
                    <View style={styles.bannerOverlay}>
                      {banner.title && <Text style={styles.bannerTitleWhite}>{banner.title}</Text>}
                      {banner.subtitle && <Text style={styles.bannerSubWhite}>{banner.subtitle}</Text>}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories Grid - Dynamic from Data */}
        {categories.length > 0 && (
          <View style={[styles.categoryGridContainer, { backgroundColor: colors.background }]}>
            <View style={styles.categoryGrid}>
              {categories.map((cat: any, idx: number) => (
                <TouchableOpacity key={idx} style={styles.categoryGridItem}>
                  <View style={[styles.categoryIconCircle, { backgroundColor: cat.color + '15' }]}>
                    {React.isValidElement(cat.icon) ? React.cloneElement(cat.icon as React.ReactElement, { color: cat.color }) : cat.icon}
                  </View>
                  <Text style={[styles.categoryGridLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingPlaceholder}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* Flash Sale Section */}
            {data?.flash_sale?.length > 0 && (
              <View style={[styles.section, styles.flashSaleContainer]}>
                <View style={styles.flashSaleHeader}>
                  <View style={styles.flashTitleRow}>
                    <Text style={styles.flashSaleTitle}>FLASH SALE</Text>
                    <View style={styles.countdownContainer}>
                      <View style={styles.timeBox}><Text style={styles.timeText}>01</Text></View>
                      <Text style={styles.timeDivider}>:</Text>
                      <View style={styles.timeBox}><Text style={styles.timeText}>24</Text></View>
                      <Text style={styles.timeDivider}>:</Text>
                      <View style={styles.timeBox}><Text style={styles.timeText}>55</Text></View>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => router.push('/profile/package-catalog')}>
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>See All {'>'}</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={data.flash_sale}
                  renderItem={({ item }) => renderCatalogItem(item, 'package')}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalPadding}
                  ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                />
              </View>
            )}

            {/* Recommendations Title */}
            <View style={styles.recHeader}>
              <View style={styles.recLine} />
              <Text style={[styles.recTitle, { color: colors.textSecondary }]}>DAILY DISCOVER</Text>
              <View style={styles.recLine} />
            </View>

            {/* Main Combined Catalog Grid - Exactly matching Filament Style */}
            <View style={styles.gridContainer}>
              {(data?.featured_packages || []).map((item: any) => renderCatalogItem(item, 'package'))}
              {(data?.recent_flowers || []).map((item: any) => renderCatalogItem(item, 'product'))}
            </View>
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Floating Action Button - CBIR Search */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/cbir')}
        activeOpacity={0.8}
      >
        <ShoppingBag color="#fff" size={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerWrapper: {
    height: 180,
    width: width,
  },
  bannerScroll: {
    flex: 1,
  },
  bannerSlide: {
    width: width,
    height: 180,
    position: 'relative',
  },
  bannerImgLarge: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 8,
  },
  bannerTitleWhite: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  bannerSubWhite: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  categoryGridContainer: {
    paddingVertical: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  categoryGridItem: {
    width: width / 5, // 5 items per row
    alignItems: 'center',
    marginVertical: 10,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryGridLabel: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  flashSaleContainer: {
    backgroundColor: '#ee4d2d', // Shopee Orange-Red
    paddingVertical: 12,
  },
  flashSaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  flashTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flashSaleTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  timeBox: {
    backgroundColor: '#000',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timeDivider: {
    color: '#fff',
    fontWeight: 'bold',
  },
  horizontalPadding: {
    paddingHorizontal: 12,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 40,
    gap: 10,
  },
  recLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  recTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    rowGap: 12,
  },
  gridItem: {
    width: (width - 32) / 2, // Precisely (Screen Width - (Padding * 2) - Gap) / 2
  },
  catalogCard: {
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    backgroundColor: theme === 'dark' ? '#1a1a2e' : '#ffffff',
    borderRadius: 8,
    // Ultra-smooth shadow for mobile
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
  loadingPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});
