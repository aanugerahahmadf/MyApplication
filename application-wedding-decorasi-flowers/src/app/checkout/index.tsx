import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Calendar, MapPin, FileText, Ticket, CreditCard, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FilamentSection } from '@/components/filament/Section';
import { useToast } from '@/components/ui/Toast';

export default function CheckoutScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [eventDate, setEventDate] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);

  useEffect(() => {
    if (id && type) {
      fetchItemDetail();
    }
  }, [id, type]);

  const fetchItemDetail = async () => {
    try {
      const endpoint = type === 'package' ? `/packages/${id}` : `/products/${id}`;
      const response = await apiClient.get(endpoint);
      if (response.data.status === 'success') {
        setRecord(response.data.data);
      }
    } catch (err) {
      showToast('Failed to load item info', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!eventDate || !address) {
      showToast('Date and Address are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiClient.post('/orders', {
        package_id: type === 'package' ? id : null,
        product_id: type === 'product' ? id : null,
        event_date: eventDate,
        location_address: address,
        notes: notes,
        voucher_code: isVoucherApplied ? voucherCode : null
      });

      if (response.data.status === 'success') {
        showToast('Order placed successfully!', 'success');
        const orderId = response.data.data.id;

        // Try to get payment URL immediately
        try {
          const payResponse = await apiClient.post(`/orders/${orderId}/pay`);
          if (payResponse.data.status === 'success' && payResponse.data.data.payment_url) {
            router.replace({
              pathname: '/payment',
              params: { url: payResponse.data.data.payment_url }
            });
            return;
          }
        } catch (payErr) {
          console.error('Failed to initiate payment automatically', payErr);
        }

        router.replace('/(tabs)/orders');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Checkout failed. Please check your data.';
      Alert.alert('Checkout Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const applyVoucher = () => {
    if (!voucherCode.trim()) return;
    setIsVoucherApplied(true);
    showToast('Voucher applied!', 'success');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const basePrice = record.discount_price > 0 ? record.discount_price : record.price;
  const discount = isVoucherApplied ? basePrice * 0.1 : 0; // Mock 10% discount
  const subtotal = basePrice - discount;
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={{ flex: 1, backgroundColor: colors.backgroundElement }}>
        <Stack.Screen options={{ title: 'Checkout', headerShown: true }} />
        <ScrollView contentContainerStyle={styles.container}>

          <FilamentSection title="Order Summary" icon={<FileText size={18} color={colors.primary} />}>
            <View style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: colors.text }]}>{record.name}</Text>
                <Text style={[styles.itemCat, { color: colors.textSecondary }]}>{type === 'package' ? 'Premium Package' : 'Fresh Flower'}</Text>
              </View>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>Rp {basePrice.toLocaleString('id-ID')}</Text>
            </View>
          </FilamentSection>

          <FilamentSection title="Booking Information" icon={<Calendar size={18} color={colors.primary} />}>
            <Input
              label="Event Date"
              placeholder="YYYY-MM-DD (e.g. 2026-08-15)"
              value={eventDate}
              onChangeText={setEventDate}
              leftIcon={<Calendar size={20} color={colors.textSecondary} />}
            />
            <Input
              label="Venue Address"
              placeholder="Enter complete address of the wedding venue"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              leftIcon={<MapPin size={20} color={colors.textSecondary} />}
            />
            <Input
              label="Special Instructions"
              placeholder="Any specific requests for the decorator?"
              value={notes}
              onChangeText={setNotes}
              leftIcon={<FileText size={20} color={colors.textSecondary} />}
            />
          </FilamentSection>

          <FilamentSection title="Promo & Voucher" icon={<Ticket size={18} color={colors.primary} />}>
            <View style={styles.voucherRow}>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Voucher Code"
                  value={voucherCode}
                  onChangeText={setVoucherCode}
                  containerStyle={{ marginBottom: 0 }}
                  editable={!isVoucherApplied}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.applyBtn,
                  { backgroundColor: isVoucherApplied ? colors.success : colors.backgroundSelected }
                ]}
                onPress={applyVoucher}
                disabled={isVoucherApplied}
              >
                {isVoucherApplied ? (
                  <CheckCircle2 size={20} color="#fff" />
                ) : (
                  <Text style={{ color: colors.text, fontWeight: '800' }}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
            {isVoucherApplied && (
              <Text style={{ color: colors.success, fontSize: 12, marginTop: 8, fontWeight: '700' }}>
                10% Voucher applied successfully!
              </Text>
            )}
          </FilamentSection>

          <FilamentSection title="Payment Details" icon={<CreditCard size={18} color={colors.primary} />}>
            <View style={styles.paymentRow}>
              <Text style={{ color: colors.textSecondary }}>Item Subtotal</Text>
              <Text style={{ color: colors.text }}>Rp {basePrice.toLocaleString('id-ID')}</Text>
            </View>
            {isVoucherApplied && (
              <View style={styles.paymentRow}>
                <Text style={{ color: colors.success }}>Voucher Discount</Text>
                <Text style={{ color: colors.success }}>- Rp {discount.toLocaleString('id-ID')}</Text>
              </View>
            )}
            <View style={styles.paymentRow}>
              <Text style={{ color: colors.textSecondary }}>Tax (11%)</Text>
              <Text style={{ color: colors.text }}>Rp {tax.toLocaleString('id-ID')}</Text>
            </View>
            <View style={[styles.paymentRow, styles.totalRow, { borderTopColor: colors.border }]}>
              <Text style={{ color: colors.text, fontWeight: '900', fontSize: 16 }}>Grand Total</Text>
              <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 20 }}>Rp {total.toLocaleString('id-ID')}</Text>
            </View>
          </FilamentSection>

          <Button
            title="Confirm & Place Order"
            onPress={handleCheckout}
            loading={submitting}
            size="lg"
            style={styles.placeOrderBtn}
          />

          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
  },
  itemCat: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '900',
  },
  voucherRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  applyBtn: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  placeOrderBtn: {
    marginTop: 8,
    height: 56,
    borderRadius: 14,
  }
});
