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
  Animated
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Star, Heart, SlidersHorizontal, Info } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

const { width } = Dimensions.get('window');
const columnWidth = (width - 32) / 2;

export default function CBIRScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { imageUri, query } = useLocalSearchParams<{ imageUri?: string; query?: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTime, setSearchTime] = useState<string | null>(null);

  const scrollY = new Animated.Value(0);

  useEffect(() => {
    if (imageUri) {
      searchByImage();
    } else if (query) {
      searchByText(query);
    } else {
      fetchAllItems();
    }
  }, [imageUri, query]);

  const searchByText = async (searchText: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/search?q=${encodeURIComponent(searchText)}`);
      if (response.data.status === 'success') {
        setResults(response.data.data || []);
      }
    } catch (err) {
      setError('Failed to search decorations.');
    } finally {
      setLoading(false);
    }
  };

  const searchByImage = async () => {
    setLoading(true);
    setError('');
    const startTime = Date.now();

    try {
      const formData = new FormData();
      // Handle the URI properly for different platforms
      const localUri = imageUri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', {
        uri: localUri,
        name: filename || 'search.jpg',
        type,
      } as any);

      const response = await apiClient.post('/cbir/search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        setResults(response.data.data || []);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        setSearchTime(duration);
        showToast(`Found ${response.data.data?.length || 0} matches in ${duration}s`, 'success');
      } else {
        setError('No similar decorations found.');
      }
    } catch (err: any) {
      console.error('CBIR Error:', err);
      setError('Visual search service unavailable. Please try again.');
      showToast('AI Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/all-catalog');
      if (response.data.status === 'success') {
        setResults(response.data.data || []);
      }
    } catch (err) {
      setError('Could not load the catalog.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isPackage = item.type === 'package';
    // Label to distinguish between Package and Flower Catalog
    const itemLabel = isPackage ? 'Flower Package' : 'Flower Catalog';
    const finalPrice = item.price;

    return (
      <View style={styles.gridItem}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/details', params: { id: item.id, type: item.type } })}
          activeOpacity={0.9}
        >
          <Card style={styles.catalogCard}>
            <View style={[styles.imageWrapper, { backgroundColor: colors.backgroundSelected }]}>
              <Image source={{ uri: item.image_url }} style={styles.itemImage} />
              <View style={[styles.typeBadge, { backgroundColor: isPackage ? colors.primary : colors.secondary }]}>
                <Text style={styles.typeBadgeText}>{itemLabel}</Text>
              </View>
              {item.similarity && (
                <View style={[styles.matchBadge, { backgroundColor: colors.success }]}>
                  <Text style={styles.matchText}>{Math.round(item.similarity * 100)}% Match</Text>
                </View>
              )}
            </View>

            <View style={styles.infoContainer}>
              <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
              <Text style={[styles.priceText, { color: colors.primary }]}>Rp {finalPrice.toLocaleString('id-ID')}</Text>

              <View style={styles.footerRow}>
                <View style={styles.ratingBox}>
                  <Star size={10} fill="#facc15" color="#facc15" />
                  <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{item.rating || '5.0'}</Text>
                </View>
                <Heart size={14} color={colors.textSecondary} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <Stack.Screen options={{
        title: imageUri ? 'AI Search Results' : (query ? `Results: ${query}` : 'Catalog Explorer'),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 10 }}>
            <SlidersHorizontal size={20} color={colors.primary} />
          </TouchableOpacity>
        )
      }} />

      {imageUri && (
        <View style={[styles.searchSummary, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <View style={styles.summaryLeft}>
            <Image source={{ uri: imageUri }} style={styles.thumbnail} />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Visual Search Active</Text>
              <Text style={[styles.summarySub, { color: colors.textSecondary }]}>
                {loading ? 'Processing with AI...' : `Found ${results.length} decorations`}
              </Text>
            </View>
          </View>
          {!loading && searchTime && (
            <View style={[styles.timeBadge, { backgroundColor: colors.backgroundElement }]}>
              <Info size={12} color={colors.textSecondary} />
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>{searchTime}s</Text>
            </View>
          )}
        </View>
      )}

      {query && !imageUri && (
        <View style={[styles.searchSummary, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
           <Text style={[styles.summaryTitle, { color: colors.text }]}>Searching for: "{query}"</Text>
           <Text style={[styles.summarySub, { color: colors.textSecondary }]}>
             {loading ? 'Searching...' : `${results.length} results found`}
           </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, color: colors.textSecondary, fontWeight: '700' }}>AI is analyzing colors & patterns...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: colors.danger, textAlign: 'center', fontSize: 16 }}>{error}</Text>
          <TouchableOpacity onPress={() => imageUri ? searchByImage() : fetchAllItems()} style={styles.retryBtn}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6134/6134065.png' }}
                style={{ width: 100, height: 100, opacity: 0.5 }}
              />
              <Text style={{ color: colors.textSecondary, marginTop: 20, fontSize: 16 }}>No similar items found</Text>
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
  searchSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  summarySub: {
    fontSize: 11,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ca8a04',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '700',
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
  typeBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  matchText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  infoContainer: {
    padding: 10,
    gap: 2,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    height: 32,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: '#ca8a04',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  }
});
