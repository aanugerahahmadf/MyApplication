import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MessageSquare, User, Send, Inbox as InboxIcon } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import apiClient from '@/api/client';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

/**
 * ChatScreen (MessagesPage.php equivalent)
 * In Filament, this page manages conversations (Inboxes).
 * This mobile version matches the logic of MessagesPage.php where it finds/creates
 * a conversation with Super Admin.
 */
export default function ChatScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      // Endpoint /messages/conversations returns list of Inboxes
      const response = await apiClient.get('/messages/conversations');
      if (response.data.status === 'success') {
        setConversations(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  // Logic from MessagesPage.php: Automatically find or create Admin chat
  const handleChatWithAdmin = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/messages/admin-conversation');
      if (response.data.status === 'success') {
        const inboxId = response.data.data.id;
        router.push(`/chat/${inboxId}`);
      }
    } catch (err) {
      console.error('Failed to init admin chat', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const lastMessage = item.last_message;
    const otherUser = item.other_user;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/chat/${item.id}`)}
        activeOpacity={0.7}
      >
        <Card style={styles.chatCard}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.backgroundSelected }]}>
            {otherUser?.avatar_url ? (
              <Image source={{ uri: otherUser.avatar_url }} style={styles.avatar} />
            ) : (
              <User size={24} color={colors.textSecondary} />
            )}
          </View>

          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                {otherUser?.name || 'Customer Service'}
              </Text>
              <Text style={[styles.chatTime, { color: colors.textSecondary }]}>
                {item.updated_at_human}
              </Text>
            </View>

            <View style={styles.chatFooter}>
              <Text style={[styles.lastMessage, { color: colors.textSecondary }]} numberOfLines={1}>
                {lastMessage?.content || 'Belum ada pesan'}
              </Text>
              {item.unread_count > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: colors.danger }]}>
                  <Text style={styles.unreadText}>{item.unread_count}</Text>
                </View>
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundElement }]}>
      <Stack.Screen options={{ title: 'Messages' }} />

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconContainer, { backgroundColor: colors.background }]}>
                <InboxIcon size={48} color={colors.textSecondary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Pesan</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Hubungi Admin untuk konsultasi dekorasi pernikahan Anda.
              </Text>
              <TouchableOpacity
                onPress={handleChatWithAdmin}
                style={[styles.adminBtn, { backgroundColor: colors.primary }]}
              >
                <MessageSquare size={18} color="#fff" />
                <Text style={styles.adminBtnText}>Chat dengan Admin</Text>
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
    padding: 16,
  },
  chatCard: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  chatTime: {
    fontSize: 11,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  adminBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
