import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme
} from 'react-native';
import { useRouter } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CartScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await apiClient.get('/cart');
      if (response.data.status === 'success') {
        setItems(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return;
    setUpdating(id);
    try {
      const response = await apiClient.put(`/cart/${id}`, { quantity: newQty });
      if (response.data.status === 'success') {
        setItems(items.map(item => item.id === id ? response.data.data : item));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (id: number) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiClient.delete(`/cart/${id}`);
            setItems(items.filter(item => item.id !== id));
          } catch (err) {
            Alert.alert('Error', 'Failed to remove item');
          }
        }
      }
    ]);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const price = item.package ? (item.package.discount_price || item.package.price) : (item.product.discount_price || item.product.price);
      return sum + (price * item.quantity);
    }, 0);
  };

  const renderItem = ({ item }: { item: any }) => {
    const detail = item.package || item.product;
    const price = detail.discount_price || detail.price;

    return (
      <Card style={styles.itemCard}>
        <Image source={{ uri: detail.image_url }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>{detail.name}</Text>
          <Text style={[styles.itemType, { color: colors.textSecondary }]}>
            {item.package ? 'Package' : 'Flower'}
          </Text>
          <Text style={[styles.itemPrice, { color: colors.primary }]}>
            Rp {price.toLocaleString('id-ID')}
          </Text>

          <View style={styles.quantityRow}>
            <View style={[styles.quantityControl, { borderColor: colors.border }]}>
              <TouchableOpacity
                onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1 || updating === item.id}
              >
                <Minus size={16} color={item.quantity <= 1 ? colors.textSecondary : colors.text} />
              </TouchableOpacity>
              <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                disabled={updating === item.id}
              >
                <Plus size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeBtn}>
              <Trash2 size={18} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      {items.length === 0 ? (
        <View style={styles.center}>
          <ShoppingBag size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Your cart is empty</Text>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/(tabs)/home')}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
          <Card style={[styles.footer, { borderTopColor: colors.border }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total Payment</Text>
              <Text style={[styles.totalAmount, { color: colors.primary }]}>
                Rp {calculateTotal().toLocaleString('id-ID')}
              </Text>
            </View>
            <Button
              title="Checkout Now"
              onPress={() => router.push('/checkout')}
              size="lg"
              style={styles.checkoutBtn}
            />
          </Card>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
  },
  itemType: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 12,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    marginVertical: 0,
    borderRadius: 0,
    borderBottomWidth: 0,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '900',
  },
  checkoutBtn: {
    width: '100%',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  }
});
