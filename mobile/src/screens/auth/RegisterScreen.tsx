import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AppNavigator';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen = ({ navigation }: Props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    age: '',
    gender: '',
    interestedIn: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleGenderSelection = (gender: string) => {
    setFormData({ ...formData, gender });
  };

  const handleInterestedInToggle = (gender: string) => {
    const interested = [...formData.interestedIn];
    const index = interested.indexOf(gender);
    
    if (index > -1) {
      interested.splice(index, 1);
    } else {
      interested.push(gender);
    }
    
    setFormData({ ...formData, interestedIn: interested });
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.age || !formData.gender) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.interestedIn.length === 0) {
      Alert.alert('Error', 'Please select at least one gender preference');
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18 || age > 100) {
      Alert.alert('Error', 'Please enter a valid age (18-100)');
      return;
    }

    setLoading(true);
    try {
      await register({
        ...formData,
        age,
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const genders = ['male', 'female', 'non-binary', 'other'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Join Hinge</Text>
            <Text style={styles.subtitle}>Create your account</Text>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry
                placeholderTextColor="#999"
              />

              <TextInput
                style={styles.input}
                placeholder="Age"
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                keyboardType="number-pad"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>I am</Text>
              <View style={styles.optionsRow}>
                {genders.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.optionButton,
                      formData.gender === gender && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleGenderSelection(gender)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        formData.gender === gender && styles.optionTextSelected,
                      ]}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Interested in</Text>
              <View style={styles.optionsRow}>
                {['male', 'female', 'non-binary'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.optionButton,
                      formData.interestedIn.includes(gender) && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleInterestedInToggle(gender)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        formData.interestedIn.includes(gender) && styles.optionTextSelected,
                      ]}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Creating account...' : 'Sign up'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkTextBold}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  optionButtonSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    color: '#666',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#FF6B6B',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;

