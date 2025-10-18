import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import * as api from '../../services/api';
import { Prompt } from '../../types';
import { LIMITS, IMAGE } from '../../config/constants';

type ProfileSetupNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileSetup'>;

const ProfileSetupScreen = () => {
  const navigation = useNavigation<ProfileSetupNavigationProp>();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<
    { prompt: Prompt; answer: string }[]
  >([]);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      await requestPermissions();
      const data = await api.getPrompts();
      if (mounted) {
        setPrompts(data);
      }
    };

    initialize().catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to upload profile pictures');
    }
  };

  const loadPrompts = async () => {
    try {
      const data = await api.getPrompts();
      setPrompts(data);
    } catch (error) {
      console.error('Failed to load prompts', error);
    }
  };

  const pickImage = async () => {
    if (photos.length >= LIMITS.MAX_PHOTOS) {
      Alert.alert('Maximum photos', `You can only upload ${LIMITS.MAX_PHOTOS} photos`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: IMAGE.ASPECT_RATIO,
      quality: IMAGE.QUALITY,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const addPrompt = (prompt: Prompt) => {
    if (selectedPrompts.length < LIMITS.MAX_PROMPTS) {
      setSelectedPrompts([...selectedPrompts, { prompt, answer: '' }]);
    }
  };

  const updateAnswer = (index: number, answer: string) => {
    const updated = [...selectedPrompts];
    updated[index].answer = answer;
    setSelectedPrompts(updated);
  };

  const removePrompt = (index: number) => {
    setSelectedPrompts(selectedPrompts.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Update profile
      await api.updateProfile({ bio, location });

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        await api.uploadPhoto(photos[i], i);
      }

      // Add prompt answers
      for (let i = 0; i < selectedPrompts.length; i++) {
        const { prompt, answer } = selectedPrompts[i];
        await api.addPromptAnswer(prompt.id, answer, i);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('Failed to complete setup', error);
      Alert.alert('Error', 'Failed to complete profile setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availablePrompts = prompts.filter(
    (p) => !selectedPrompts.find((sp) => sp.prompt.id === p.id)
  );

  const canContinueStep1 = photos.length >= LIMITS.MIN_PHOTOS;
  const canContinueStep2 = selectedPrompts.length === LIMITS.MAX_PROMPTS && 
    selectedPrompts.every((sp) => sp.answer.trim().length > 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Step {step} of 3</Text>
        
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
        </View>
      </View>

      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Add Photos</Text>
          <Text style={styles.stepSubtitle}>Add 2-6 photos of yourself</Text>

          <View style={styles.photosGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePhoto(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 6 && (
              <TouchableOpacity style={styles.addPhotoButton} onPress={pickImage}>
                <Text style={styles.addPhotoText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, !canContinueStep1 && styles.buttonDisabled]}
            onPress={() => setStep(2)}
            disabled={!canContinueStep1}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Answer Prompts</Text>
          <Text style={styles.stepSubtitle}>Choose 3 prompts to answer</Text>

          {selectedPrompts.map((sp, index) => (
            <View key={index} style={styles.promptCard}>
              <View style={styles.promptHeader}>
                <Text style={styles.promptText}>{sp.prompt.text}</Text>
                <TouchableOpacity onPress={() => removePrompt(index)}>
                  <Text style={styles.removePromptText}>Remove</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.promptAnswer}
                value={sp.answer}
                onChangeText={(text) => updateAnswer(index, text)}
                placeholder="Your answer..."
                multiline
                numberOfLines={3}
              />
            </View>
          ))}

          {selectedPrompts.length < 3 && (
            <View>
              <Text style={styles.availablePromptsTitle}>Available Prompts:</Text>
              <ScrollView style={styles.promptsList} nestedScrollEnabled>
                {availablePrompts.map((prompt) => (
                  <TouchableOpacity
                    key={prompt.id}
                    style={styles.promptOption}
                    onPress={() => addPrompt(prompt)}
                  >
                    <Text style={styles.promptOptionText}>{prompt.text}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setStep(1)}
            >
              <Text style={styles.buttonSecondaryText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, !canContinueStep2 && styles.buttonDisabled]}
              onPress={() => setStep(3)}
              disabled={!canContinueStep2}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Add Details</Text>

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.textArea}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="City, State"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => setStep(2)}
            >
              <Text style={styles.buttonSecondaryText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Complete</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#FF6B6B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
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
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'rgba(255,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  addPhotoText: {
    fontSize: 48,
    color: '#ccc',
  },
  promptCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  promptText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  removePromptText: {
    color: '#FF6B6B',
    fontSize: 14,
  },
  promptAnswer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  availablePromptsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  promptsList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  promptOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  promptOptionText: {
    fontSize: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonSecondaryText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
});

export default ProfileSetupScreen;

