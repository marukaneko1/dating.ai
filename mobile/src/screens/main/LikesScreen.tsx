import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Like } from '../../types';
import * as api from '../../services/api';

const LikesScreen = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [sentLikes, setSentLikes] = useState<Like[]>([]);
  const [receivedLikes, setReceivedLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    let mounted = true;

    const loadInitialLikes = async () => {
      setLoading(true);
      try {
        const [sent, received] = await Promise.all([
          api.getSentLikes(),
          api.getReceivedLikes(),
        ]);
        if (mounted) {
          setSentLikes(sent);
          setReceivedLikes(received);
        }
      } catch (error) {
        console.error('Failed to load likes', error);
        if (mounted) {
          Alert.alert('Error', 'Failed to load likes');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInitialLikes();

    return () => {
      mounted = false;
    };
  }, []);

  const loadLikes = async () => {
    setLoading(true);
    try {
      const [sent, received] = await Promise.all([
        api.getSentLikes(),
        api.getReceivedLikes(),
      ]);
      setSentLikes(sent);
      setReceivedLikes(received);
    } catch (error) {
      console.error('Failed to load likes', error);
      Alert.alert('Error', 'Failed to load likes');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBack = async (like: Like) => {
    try {
      const result = await api.createLike({
        toUserId: like.fromUserId,
        type: 'PROFILE',
      });

      if (result.match) {
        Alert.alert("It's a Match! 🎉", 'You can now start chatting!');
      }
      
      loadLikes();
    } catch (error) {
      console.error('Failed to like back', error);
      Alert.alert('Error', 'Failed to send like');
    }
  };

  const likes = activeTab === 'sent' ? sentLikes : receivedLikes;

  const renderLikeItem = ({ item }: { item: Like }) => {
    const user = activeTab === 'sent' ? item.toUser : item.fromUser;
    if (!user || !user.profile) return null;

    const photo = user.profile.photos[0];

    return (
      <View style={styles.likeCard}>
        {photo ? (
          <Image
            source={{ uri: api.getImageUrl(photo.url) }}
            style={styles.likePhoto}
          />
        ) : (
          <View style={[styles.likePhoto, styles.noPhoto]}>
            <Ionicons name="person" size={40} color="#ccc" />
          </View>
        )}
        <View style={styles.likeInfo}>
          <Text style={styles.likeName}>
            {user.profile.firstName}, {user.profile.age}
          </Text>
          {user.profile.location && (
            <Text style={styles.likeLocation}>📍 {user.profile.location}</Text>
          )}
          {item.comment && (
            <View style={styles.commentBox}>
              <Text style={styles.commentText}>"{item.comment}"</Text>
            </View>
          )}
          <Text style={styles.likeType}>
            {item.type === 'PHOTO'
              ? '❤️ Liked your photo'
              : item.type === 'PROMPT'
              ? '❤️ Liked your prompt'
              : '❤️ Liked your profile'}
          </Text>
          {activeTab === 'received' && (
            <TouchableOpacity
              style={styles.likeBackButton}
              onPress={() => handleLikeBack(item)}
            >
              <Text style={styles.likeBackText}>❤️ Like Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'received' && styles.tabActive]}
          onPress={() => setActiveTab('received')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'received' && styles.tabTextActive,
            ]}
          >
            Received ({receivedLikes.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.tabActive]}
          onPress={() => setActiveTab('sent')}
        >
          <Text
            style={[styles.tabText, activeTab === 'sent' && styles.tabTextActive]}
          >
            Sent ({sentLikes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Likes List */}
      {likes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            {activeTab === 'sent'
              ? "You haven't liked anyone yet"
              : "No one has liked you yet"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={likes}
          renderItem={renderLikeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextActive: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  likeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  likePhoto: {
    width: 100,
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  noPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeInfo: {
    flex: 1,
    padding: 12,
  },
  likeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  likeLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  commentBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 13,
    color: '#333',
    fontStyle: 'italic',
  },
  likeType: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  likeBackButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  likeBackText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});

export default LikesScreen;

