import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { Stack } from 'expo-router';
import { Star, MessageSquare } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { Card } from '@/components/ui/Card';

export default function ReviewsScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await apiClient.get('/profile/reviews');
      if (response.data.status === 'success') {
        setReviews(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={12}
            fill={s <= rating ? "#facc15" : "transparent"}
            color={s <= rating ? "#facc15" : "#d1d5db"}
          />
        ))}
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.reviewCard}>
      <View style={styles.productInfo}>
        <Image source={{ uri: item.product?.image_url }} style={styles.productThumb} />
        <View style={styles.productDetails}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
            {item.product?.name}
          </Text>
          {renderStars(item.rating)}
        </View>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>{item.date}</Text>
      </View>
      <Text style={[styles.commentText, { color: colors.commentText }]}>{item.comment}</Text>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <Stack.Screen options={{ title: 'My Reviews' }} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MessageSquare size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                You haven't written any reviews yet.
              </Text>
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
    padding: 16,
  },
  reviewCard: {
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  productThumb: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  dateText: {
    fontSize: 11,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
  },
});
