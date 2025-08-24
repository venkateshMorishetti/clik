import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ProfileSetupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [extractedName, setExtractedName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [height, setHeight] = useState('');
  const [email, setEmail] = useState('');
  const [aboutYourself, setAboutYourself] = useState('');
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleHeightChange = (text: string) => {
    // Only allow numbers, feet (') and inches (") symbols, and cm
    const cleanedText = text.replace(/[^0-9'"]/g, '');
    
    // Limit length to prevent overly long inputs
    if (cleanedText.length <= 10) {
      setHeight(cleanedText);
    }
  };

  const validateHeight = (heightText: string) => {
    // Check if height contains valid format
    const hasFeetInches = /^\d+['"]?\d*["]?$/.test(heightText); // e.g., 5'8" or 5'8
    const hasCm = /^\d+$/.test(heightText) && heightText.length <= 3; // e.g., 172
    
    return hasFeetInches || hasCm;
  };

  const handleDateChange = (text: string) => {
    // Only allow numbers and hyphens
    const cleanedText = text.replace(/[^0-9-]/g, '');
    
    // Enforce YYYY-MM-DD format
    if (cleanedText.length <= 10) {
      let formattedText = cleanedText;
      
      // Auto-add hyphens at correct positions
      if (cleanedText.length >= 4 && !cleanedText.includes('-')) {
        formattedText = cleanedText.slice(0, 4) + '-' + cleanedText.slice(4);
      }
      if (cleanedText.length >= 7 && formattedText.split('-').length === 2) {
        formattedText = formattedText.slice(0, 7) + '-' + formattedText.slice(7);
      }
      
      setDateOfBirth(formattedText);
    }
  };

  const handlePhotoUpload = () => {
    Alert.alert(
      'Photo Upload',
      'In a real app, this would open gallery to select a photo.',
      [
        {
          text: 'Simulate Upload',
          onPress: () => {
            setUserPhoto('uploaded');
            setExtractedName('John Doe'); // Simulated extracted name
            setCurrentStep(2);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleTakeSelfie = () => {
    Alert.alert(
      'Take Selfie',
      'In a real app, this would open the front camera to take a selfie.',
      [
        {
          text: 'Simulate Selfie',
          onPress: () => {
            setUserPhoto('selfie');
            setExtractedName('John Doe'); // Simulated extracted name
            setCurrentStep(2);
          }
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleAddLanguage = () => {
    if (currentLanguage.trim()) {
      setLanguages([...languages, currentLanguage.trim()]);
      setCurrentLanguage('');
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    setLanguages(newLanguages);
  };

  const handleComplete = async () => {
    if (!extractedName.trim() || !dateOfBirth.trim() || !height.trim() || !gender.trim() || !email.trim() || !lookingFor.trim() || !aboutYourself.trim() || languages.length === 0) {
      Alert.alert('Error', 'Please fill in all fields including telling us about yourself and at least one language');
      return;
    }

    if (!validateHeight(height)) {
      Alert.alert('Error', 'Please enter a valid height format (e.g., 5\'8" or 172)');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would save the profile data to your backend
      // For demo purposes, we'll navigate to partner preferences
      setTimeout(() => {
        router.replace('/partner-preferences');
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Add Your Photo</Text>
      <Text style={styles.stepDescription}>
        Please add a photo of yourself. You can either upload an existing photo or take a new selfie.
      </Text>
      
      <View style={styles.photoOptions}>
        <TouchableOpacity
          style={[styles.photoOption, { borderColor: '#007AFF' }]}
          onPress={handlePhotoUpload}
        >
          <Text style={[styles.photoOptionText, { color: '#007AFF' }]}>
            📷 Upload Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.photoOption, { borderColor: '#007AFF' }]}
          onPress={handleTakeSelfie}
        >
          <Text style={[styles.photoOptionText, { color: '#007AFF' }]}>
            🤳 Take Selfie
          </Text>
        </TouchableOpacity>
      </View>

      {userPhoto && (
        <View style={styles.uploadedInfo}>
          <Text style={styles.uploadedText}>✓ Photo successfully added</Text>
          <Text style={styles.extractedName}>Name: {extractedName}</Text>
        </View>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Complete Your Profile</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={extractedName}
          onChangeText={setExtractedName}
          placeholder="Your name"
          placeholderTextColor="#999999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={dateOfBirth}
          onChangeText={handleDateChange}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999999"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Height</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={handleHeightChange}
          placeholder="e.g., 5'8 or 172 cm"
          placeholderTextColor="#999999"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Gender</Text>
        <View style={styles.genderOptions}>
          {['Male', 'Female'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderOption,
                {
                  backgroundColor: gender === option ? '#007AFF' : '#FFFFFF',
                  borderColor: gender === option ? '#007AFF' : '#E1E5E9',
                }
              ]}
              onPress={() => setGender(option)}
            >
              <Text style={[
                styles.genderOptionText,
                { color: gender === option ? '#FFFFFF' : '#333333' }
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="your.email@example.com"
          placeholderTextColor="#999999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Languages You Know</Text>
        <View style={styles.languageInputContainer}>
          <TextInput
            style={styles.languageInput}
            value={currentLanguage}
            onChangeText={setCurrentLanguage}
            placeholder="Enter language (e.g., English, Spanish)"
            placeholderTextColor="#999999"
          />
          <TouchableOpacity
            style={styles.languageArrowButton}
            onPress={handleAddLanguage}
            disabled={!currentLanguage.trim()}
          >
            <Text style={styles.languageArrowText}>→</Text>
          </TouchableOpacity>
        </View>
        
        {languages.length > 0 && (
          <View style={styles.languagesList}>
            {languages.map((language, index) => (
              <View key={index} style={styles.languageTag}>
                <Text style={styles.languageTagText}>{language}</Text>
                <TouchableOpacity
                  style={styles.removeLanguageButton}
                  onPress={() => handleRemoveLanguage(index)}
                >
                  <Text style={styles.removeLanguageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>What are you looking for?</Text>
        <View style={styles.lookingForOptions}>
          {['Fun and Casual', 'Long Term', 'Not Sure', 'Friendship'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.lookingForOption,
                {
                  backgroundColor: lookingFor === option ? '#007AFF' : '#FFFFFF',
                  borderColor: lookingFor === option ? '#007AFF' : '#E1E5E9',
                }
              ]}
              onPress={() => setLookingFor(option)}
            >
              <Text style={[
                styles.lookingForOptionText,
                { color: lookingFor === option ? '#FFFFFF' : '#333333' }
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tell me about yourself more</Text>
        <Text style={styles.fieldDescription}>
          Share your hobbies, interests, sports, or anything that makes you unique. Based on this, we'll generate a personalized anime avatar and name that will be shown to potential partners until you choose to reveal your real identity.
        </Text>
        <TextInput
          style={styles.aboutInput}
          value={aboutYourself}
          onChangeText={setAboutYourself}
          placeholder="e.g., I love playing basketball, reading sci-fi books, hiking on weekends, and trying new cuisines..."
          placeholderTextColor="#999999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Complete Your Profile
        </Text>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: currentStep === 1 ? '50%' : '100%' }
              ]} 
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep === 1 ? (
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: '#007AFF' }]}
            onPress={() => setCurrentStep(2)}
            disabled={!userPhoto}
          >
            <Text style={styles.nextButtonText}>Next Step</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: '#007AFF' }]}
            onPress={handleComplete}
            disabled={isLoading}
          >
            <Text style={styles.completeButtonText}>
              {isLoading ? 'Completing...' : 'Complete Profile'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E1E5E9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF3B30',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  stepDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    color: '#666666',
  },
  photoOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  photoOption: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '45%', // Adjust as needed
  },
  photoOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  uploadedInfo: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  uploadedText: {
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 8,
  },
  extractedName: {
    color: '#2E7D32',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  datePlaceholder: {
    fontSize: 16,
    color: '#999999',
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lookingForOptions: {
    gap: 12,
  },
  lookingForOption: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lookingForOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  languageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  languageInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 14,
  },
  languageArrowButton: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  languageArrowText: {
    fontSize: 20,
    color: '#007AFF',
  },
  languagesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  languageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1E5E9',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  languageTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  removeLanguageButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeLanguageText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  aboutInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  fieldDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  completeButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 32,
    color: '#000000',
    fontWeight: 'bold',
  },
});
