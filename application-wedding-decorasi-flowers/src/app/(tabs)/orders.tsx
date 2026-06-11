import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  useColorScheme,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { Card } from '@/components/ui/Card';
import { ShoppingBag, ChevronRight, Clock, CreditCard } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function OrdersScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paying, setPaying] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders');
      if (response.data.status === 'success') {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handlePayNow = async (orderId: number) => {
    setPaying(orderId);
    try {
      const response = await apiClient.post(`/orders/${orderId}/pay`);
      if (response.data.status === 'success') {
        const { payment_url } = response.data.data;
        if (payment_url) {
          router.push({
            pathname: '/payment',
            params: { url: payment_url }
          });
        }
      }
    } catch (err: any) {
      Alert.alert('Payment Error', err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setPaying(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return colors.success;
      case 'cancelled': return colors.danger;
      case 'pending': return colors.primary;
      default: return colors.textSecondary;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {}} // Navigate to Order Detail if needed
    >
      <Card style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <ShoppingBag size={16} color={colors.primary} />
            <Text style={[styles.orderNumber, { color: colors.textSecondary }]}>#{item.order_number}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Image source={{ uri: item.item?.image_url }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.itemCat, { color: colors.textSecondary }]}>{item.resource_type === 'package' ? 'Package' : 'Flower'}</Text>
            <View style={styles.dateRow}>
              <Clock size={12} color={colors.textSecondary} />
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>{item.event_date}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
          <View>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Price</Text>
            <Text style={[styles.totalAmount, { color: colors.primary }]}>Rp {item.total_price.toLocaleString('id-ID')}</Text>
          </View>
          {item.payment_status === 'unpaid' && item.status !== 'cancelled' && (
            <TouchableOpacity
              style={[styles.payBtn, { backgroundColor: colors.primary }]}
              onPress={() => handlePayNow(item.id)}
              disabled={paying === item.id}
            >
              {paying === item.id ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <CreditCard size={14} color="#fff" />
                  <Text style={styles.payBtnText}>Pay Now</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      {loading && !refreshing ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ShoppingBag size={64} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No orders yet</Text>
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
  orderCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardBody: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  itemCat: {
    fontSize: 11,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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
