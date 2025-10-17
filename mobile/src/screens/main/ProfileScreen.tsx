import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { Profile } from '../../types';
import * as api from '../../services/api';

const ProfileScreen = () => {
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    age: 0,
    bio: '',
    location: '',
    minAge: 18,
    maxAge: 99,
    maxDistance: 50,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile();
      setProfile(data);
      setFormData({
        firstName: data.firstName,
        age: data.age,
        bio: data.bio || '',
        location: data.location || '',
        minAge: data.minAge,
        maxAge: data.maxAge,
        maxDistance: data.maxDistance,
      });
    } catch (error) {
      console.error('Failed to load profile', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.updateProfile(formData);
      await refreshUser();
      setEditing(false);
      loadProfile();
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handlePhotoUpload = async () => {
    if (!profile) return;

    if (profile.photos.length >= 6) {
      Alert.alert('Maximum photos', 'You can only have 6 photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        await api.uploadPhoto(result.assets[0].uri, profile.photos.length);
        loadProfile();
        Alert.alert('Success', 'Photo uploaded successfully');
      } catch (error) {
        console.error('Failed to upload photo', error);
        Alert.alert('Error', 'Failed to upload photo');
      }
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deletePhoto(photoId);
            loadProfile();
          } catch (error) {
            console.error('Failed to delete photo', error);
            Alert.alert('Error', 'Failed to delete photo');
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Basic Info Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          {!editing ? (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editButtons}>
              <TouchableOpacity
                onPress={() => {
                  setEditing(false);
                  setFormData({
                    firstName: profile.firstName,
                    age: profile.age,
                    bio: profile.bio || '',
                    location: profile.location || '',
                    minAge: profile.minAge,
                    maxAge: profile.maxAge,
                    maxDistance: profile.maxDistance,
                  });
                }}
              >
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveProfile}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {editing ? (
          <View style={styles.form}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              value={formData.age.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, age: parseInt(text) || 0 })
              }
              keyboardType="number-pad"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.textArea}
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />

            <Text style={styles.label}>Age Range: {formData.minAge} - {formData.maxAge}</Text>
            <View style={styles.rangeContainer}>
              <TextInput
                style={[styles.input, styles.rangeInput]}
                value={formData.minAge.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, minAge: parseInt(text) || 18 })
                }
                keyboardType="number-pad"
              />
              <Text style={styles.rangeSeparator}>to</Text>
              <TextInput
                style={[styles.input, styles.rangeInput]}
                value={formData.maxAge.toString()}
                onChangeText={(text) =>
                  setFormData({ ...formData, maxAge: parseInt(text) || 99 })
                }
                keyboardType="number-pad"
              />
            </View>

            <Text style={styles.label}>Max Distance: {formData.maxDistance} miles</Text>
            <TextInput
              style={styles.input}
              value={formData.maxDistance.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, maxDistance: parseInt(text) || 50 })
              }
              keyboardType="number-pad"
            />
          </View>
        ) : (
          <View style={styles.info}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Name:</Text> {profile.firstName}, {profile.age}
            </Text>
            {profile.bio && (
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Bio:</Text> {profile.bio}
              </Text>
            )}
            {profile.location && (
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Location:</Text> {profile.location}
              </Text>
            )}
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Age Preference:</Text> {profile.minAge}-{profile.maxAge}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>Distance:</Text> Within {profile.maxDistance} miles
            </Text>
          </View>
        )}
      </View>

      {/* Photos Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photosGrid}>
          {profile.photos.map((photo) => (
            <View key={photo.id} style={styles.photoContainer}>
              <Image
                source={{ uri: api.getImageUrl(photo.url) }}
                style={styles.photo}
              />
              <TouchableOpacity
                style={styles.deletePhotoButton}
                onPress={() => handleDeletePhoto(photo.id)}
              >
                <Ionicons name="close-circle" size={28} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}
          {profile.photos.length < 6 && (
            <TouchableOpacity style={styles.addPhotoButton} onPress={handlePhotoUpload}>
              <Ionicons name="add" size={48} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Prompts Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prompt Answers</Text>
        {profile.promptAnswers.map((pa) => (
          <View key={pa.id} style={styles.promptCard}>
            <Text style={styles.promptQuestion}>{pa.prompt.text}</Text>
            <Text style={styles.promptAnswer}>{pa.answer}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rangeInput: {
    flex: 1,
  },
  rangeSeparator: {
    fontSize: 16,
    color: '#666',
  },
  info: {
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoLabel: {
    fontWeight: '600',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoContainer: {
    width: '31%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  addPhotoButton: {
    width: '31%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  promptQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  promptAnswer: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});

export default ProfileScreen;

