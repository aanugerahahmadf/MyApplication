import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import {
  ShoppingCart,
  CreditCard,
  MessageCircle,
  Heart,
  Tag,
  FileText,
  Star,
  Share2,
  ChevronLeft
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { TextEntry, ImageEntry } from '@/components/filament/Entry';
import { FilamentSection } from '@/components/filament/Section';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function DetailsScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id, type]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const endpoint = type === 'package' ? `/packages/${id}` : `/products/${id}`;
      const response = await apiClient.get(endpoint);
      if (response.data.status === 'success') {
        setRecord(response.data.data);
      }
    } catch (err) {
      showToast('Could not load item details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await apiClient.post('/cart/add', {
        product_id: type === 'product' ? id : null,
        package_id: type === 'package' ? id : null,
        quantity: 1
      });
      if (response.data.status === 'success') {
        showToast('Successfully added to cart!', 'success');
      }
    } catch (err) {
      showToast('Failed to add to cart', 'error');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${record.name} on Wedding Flowers App! Only Rp ${record.price.toLocaleString()}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.backgroundElement }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!record) {
    return (
      <View style={[styles.center, { backgroundColor: colors.backgroundElement }]}>
        <Text style={{ color: colors.textSecondary }}>Item not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: 20 }} />
      </View>
    );
  }

  const finalPrice = record.discount_price > 0 ? record.discount_price : record.price;
  const rating = record.rating || "5.0";

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundElement }}>
      <Stack.Screen options={{
        headerShown: true,
        headerTitle: 'Detail Info',
        headerRight: () => (
          <TouchableOpacity onPress={handleShare} style={{ marginRight: 10 }}>
            <Share2 size={20} color={colors.primary} />
          </TouchableOpacity>
        )
      }} />

      <ScrollView contentContainerStyle={styles.container}>
        <ImageEntry url={record.image_url} height={350} />

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <TextEntry
              value={record.category?.name || (type === 'package' ? 'Wedding Package' : 'Fresh Flower')}
              badge
              color="info"
              icon={<Tag size={12} color="#fff" />}
            />
            <View style={styles.ratingBadge}>
              <Star size={14} fill="#facc15" color="#facc15" />
              <Text style={[styles.ratingText, { color: colors.text }]}>{rating}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 11 }}>(24 reviews)</Text>
            </View>
          </View>

          <Text style={[styles.mainTitle, { color: colors.text }]}>{record.name}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.finalPrice, { color: colors.primary }]}>
              Rp {finalPrice.toLocaleString('id-ID')}
            </Text>
            {record.discount_price > 0 && (
              <Text style={styles.oldPrice}>
                Rp {record.price.toLocaleString('id-ID')}
              </Text>
            )}
          </View>

          <FilamentSection title="Description" icon={<FileText size={18} color={colors.primary} />}>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              {record.description || 'No detailed description available for this item. Please contact our support for more information.'}
            </Text>
          </FilamentSection>

          {type === 'package' && (
            <FilamentSection title="What's Included" icon={<Tag size={18} color={colors.primary} />}>
              <View style={styles.featureList}>
                {['Free consultation', 'Setup & Dismantle', 'Professional florist', 'Transportation included'].map((f, i) => (
                  <View key={i} style={styles.featureItem}>
                    <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{f}</Text>
                  </View>
                ))}
              </View>
            </FilamentSection>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Action Bar (Shopee/Tokopedia Style) */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.bottomIconBtn}
          onPress={() => router.push('/(tabs)/chat')}
        >
          <MessageCircle size={22} color={colors.primary} />
          <Text style={[styles.iconLabel, { color: colors.textSecondary }]}>Chat</Text>
        </TouchableOpacity>

        <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          style={styles.bottomIconBtn}
          onPress={() => {
            setWishlisted(!wishlisted);
            showToast(wishlisted ? 'Removed from Wishlist' : 'Added to Wishlist', 'info');
          }}
        >
          <Heart size={22} color={wishlisted ? colors.danger : colors.textSecondary} fill={wishlisted ? colors.danger : 'transparent'} />
          <Text style={[styles.iconLabel, { color: colors.textSecondary }]}>Wishlist</Text>
        </TouchableOpacity>

        <Button
          title="Add to Cart"
          variant="secondary"
          onPress={handleAddToCart}
          style={styles.cartBtn}
          textStyle={{ fontSize: 14 }}
        />

        <Button
          title="Book Now"
          onPress={() => router.push({ pathname: '/checkout', params: { id: record.id, type } })}
          style={styles.bookBtn}
          textStyle={{ fontSize: 14 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '900',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 20,
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: '900',
  },
  oldPrice: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 30, // For notch devices
    borderTopWidth: 1,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bottomIconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 8,
  },
  cartBtn: {
    flex: 1.5,
    height: 48,
    marginRight: 8,
    borderRadius: 10,
  },
  bookBtn: {
    flex: 2,
    height: 48,
    borderRadius: 10,
  }
});
