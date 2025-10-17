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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Match } from '../../types';
import * as api from '../../services/api';

type MatchesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MatchesScreen = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<MatchesNavigationProp>();

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMatches();
    });
    return unsubscribe;
  }, [navigation]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getMatches();
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches', error);
      Alert.alert('Error', 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (match: Match) => {
    navigation.navigate('Chat', {
      matchId: match.id,
      matchName: match.user.profile.firstName,
    });
  };

  const renderMatchItem = ({ item }: { item: Match }) => {
    const photo = item.user.profile.photos[0];

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => handleChatPress(item)}
      >
        {photo ? (
          <Image
            source={{ uri: api.getImageUrl(photo.url) }}
            style={styles.matchPhoto}
          />
        ) : (
          <View style={[styles.matchPhoto, styles.noPhoto]}>
            <Ionicons name="person" size={40} color="#ccc" />
          </View>
        )}
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.user.profile.firstName}</Text>
          {item.lastMessage ? (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage.content}
            </Text>
          ) : (
            <Text style={styles.startChat}>Start chatting!</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
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
      {matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptySubtitle}>
            Keep swiping to find your perfect match!
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatchItem}
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
  list: {
    padding: 15,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  matchPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  noPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchInfo: {
    flex: 1,
    marginLeft: 12,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  startChat: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#666',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default MatchesScreen;

