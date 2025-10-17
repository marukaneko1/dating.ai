import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../../types';
import * as api from '../../services/api';

const { width, height } = Dimensions.get('window');

const DiscoverScreen = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentType, setCommentType] = useState<{
    type: 'PHOTO' | 'PROMPT';
    id: string;
  } | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadNextProfile();
  }, []);

  const loadNextProfile = async () => {
    setLoading(true);
    setCurrentPhotoIndex(0);
    try {
      const nextProfile = await api.getNextProfile();
      setProfile(nextProfile);
    } catch (error) {
      console.error('Failed to load profile', error);
      Alert.alert('Error', 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (
    type: 'PROFILE' | 'PHOTO' | 'PROMPT',
    itemId?: string
  ) => {
    if (!profile) return;

    try {
      const likeData: any = {
        toUserId: profile.userId,
        type,
      };

      if (type === 'PHOTO' && itemId) {
        likeData.photoId = itemId;
      } else if (type === 'PROMPT' && itemId) {
        likeData.promptAnswerId = itemId;
      }

      if (comment.trim()) {
        likeData.comment = comment.trim();
      }

      const result = await api.createLike(likeData);

      if (result.match) {
        Alert.alert("It's a Match! 🎉", 'You can now start chatting!');
      }

      setShowCommentModal(false);
      setComment('');
      setCommentType(null);
      loadNextProfile();
    } catch (error) {
      console.error('Failed to like', error);
      Alert.alert('Error', 'Failed to send like');
    }
  };

  const openCommentModal = (type: 'PHOTO' | 'PROMPT', id: string) => {
    setCommentType({ type, id });
    setShowCommentModal(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-dislike-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No more profiles</Text>
        <Text style={styles.emptySubtitle}>Check back later!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Photo Section */}
        <View style={styles.photoContainer}>
          {profile.photos.length > 0 ? (
            <>
              <Image
                source={{ uri: api.getImageUrl(profile.photos[currentPhotoIndex].url) }}
                style={styles.photo}
                resizeMode="cover"
              />
              {profile.photos.length > 1 && (
                <>
                  <TouchableOpacity
                    style={[styles.photoNav, styles.photoNavLeft]}
                    onPress={() =>
                      setCurrentPhotoIndex(
                        (currentPhotoIndex - 1 + profile.photos.length) %
                          profile.photos.length
                      )
                    }
                  >
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.photoNav, styles.photoNavRight]}
                    onPress={() =>
                      setCurrentPhotoIndex(
                        (currentPhotoIndex + 1) % profile.photos.length
                      )
                    }
                  >
                    <Ionicons name="chevron-forward" size={24} color="#fff" />
                  </TouchableOpacity>
                  <View style={styles.photoIndicators}>
                    {profile.photos.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.indicator,
                          index === currentPhotoIndex && styles.indicatorActive,
                        ]}
                      />
                    ))}
                  </View>
                </>
              )}
              <TouchableOpacity
                style={styles.likePhotoButton}
                onPress={() =>
                  openCommentModal('PHOTO', profile.photos[currentPhotoIndex].id)
                }
              >
                <Ionicons name="heart" size={20} color="#fff" />
                <Text style={styles.likePhotoText}>Like Photo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.noPhoto}>
              <Ionicons name="person" size={64} color="#ccc" />
            </View>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>
            {profile.firstName}, {profile.age}
          </Text>
          {profile.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.location}>{profile.location}</Text>
            </View>
          )}
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          {/* Prompt Answers */}
          {profile.promptAnswers.map((pa) => (
            <View key={pa.id} style={styles.promptCard}>
              <Text style={styles.promptQuestion}>{pa.prompt.text}</Text>
              <Text style={styles.promptAnswer}>{pa.answer}</Text>
              <TouchableOpacity
                style={styles.likePromptButton}
                onPress={() => openCommentModal('PROMPT', pa.id)}
              >
                <Ionicons name="heart" size={16} color="#FF6B6B" />
                <Text style={styles.likePromptText}>Like & Comment</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.passButton}
          onPress={loadNextProfile}
        >
          <Ionicons name="close" size={32} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => handleLike('PROFILE')}
        >
          <Ionicons name="heart" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCommentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a comment</Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Say something nice..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => {
                  setShowCommentModal(false);
                  setComment('');
                  setCommentType(null);
                }}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>
                  commentType && handleLike(commentType.type, commentType.id)
                }
              >
                <Text style={styles.modalButtonText}>Send Like</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  scrollView: {
    flex: 1,
  },
  photoContainer: {
    width,
    height: height * 0.6,
    backgroundColor: '#f0f0f0',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  noPhoto: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  photoNav: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoNavLeft: {
    left: 10,
  },
  photoNavRight: {
    right: 10,
  },
  photoIndicators: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorActive: {
    backgroundColor: '#fff',
  },
  likePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,107,107,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  likePhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  bio: {
    fontSize: 15,
    color: '#333',
    marginBottom: 20,
    lineHeight: 22,
  },
  promptCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  promptQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  promptAnswer: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  likePromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  likePromptText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonSecondaryText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DiscoverScreen;

