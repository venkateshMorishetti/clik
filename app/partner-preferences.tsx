import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PartnerPreferencesScreen() {
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [distance, setDistance] = useState('');
  const [partnerLanguages, setPartnerLanguages] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [heightMin, setHeightMin] = useState('');
  const [heightMax, setHeightMax] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleHeightChange = (text: string, setter: (value: string) => void) => {
    // Only allow numbers, feet (') and inches (") symbols
    const cleanedText = text.replace(/[^0-9'"]/g, '');
    
    // Limit length to prevent overly long inputs
    if (cleanedText.length <= 10) {
      setter(cleanedText);
    }
  };

  const validateHeight = (heightText: string) => {
    // Check if height contains valid format
    const hasFeetInches = /^\d+['"]?\d*["]?$/.test(heightText); // e.g., 5'8" or 5'8
    const hasCm = /^\d+$/.test(heightText) && heightText.length <= 3; // e.g., 172
    
    return hasFeetInches || hasCm;
  };

  const handleAddLanguage = () => {
    if (currentLanguage.trim()) {
      setPartnerLanguages([...partnerLanguages, currentLanguage.trim()]);
      setCurrentLanguage('');
    }
  };

  const handleRemoveLanguage = (index: number) => {
    const newLanguages = partnerLanguages.filter((_, i) => i !== index);
    setPartnerLanguages(newLanguages);
  };

  const handleComplete = async () => {
    if (!ageMin || !ageMax || !distance || !heightMin || !heightMax) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success!', 
        'Your partner preferences have been saved. You will now see matches based on your preferences.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partner Preferences</Text>
        <Text style={styles.headerSubtitle}>
          Tell us what you're looking for in a partner
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Age Preference */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Age Range</Text>
          <View style={styles.rangeContainer}>
            <TextInput
              style={styles.rangeInput}
              value={ageMin}
              onChangeText={setAgeMin}
              placeholder="Min Age"
              placeholderTextColor="#999999"
              keyboardType="numeric"
            />
            <Text style={styles.rangeSeparator}>to</Text>
            <TextInput
              style={styles.rangeInput}
              value={ageMax}
              onChangeText={setAgeMax}
              placeholder="Max Age"
              placeholderTextColor="#999999"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Distance Preference */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Show Matches Within</Text>
          <Text style={styles.inputDescription}>
            We'll show you potential matches within this distance range
          </Text>
          <View style={styles.distanceContainer}>
            <TextInput
              style={styles.distanceInput}
              value={distance}
              onChangeText={setDistance}
              placeholder="e.g., 25"
              placeholderTextColor="#999999"
              keyboardType="numeric"
            />
            <Text style={styles.distanceUnit}>miles</Text>
          </View>
        </View>

        {/* Height Preference */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Height Range</Text>
          <View style={styles.rangeContainer}>
            <TextInput
              style={styles.rangeInput}
              value={heightMin}
              onChangeText={(text) => handleHeightChange(text, setHeightMin)}
              placeholder="Min Height"
              placeholderTextColor="#999999"
            />
            <Text style={styles.rangeSeparator}>to</Text>
            <TextInput
              style={styles.rangeInput}
              value={heightMax}
              onChangeText={(text) => handleHeightChange(text, setHeightMax)}
              placeholder="Max Height"
              placeholderTextColor="#999999"
            />
          </View>
          <Text style={styles.helperText}>e.g., 5'2" or 160 cm</Text>
        </View>

        {/* Language Preferences */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Languages Your Partner Should Know</Text>
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
          
          {partnerLanguages.length > 0 && (
            <View style={styles.languagesList}>
              {partnerLanguages.map((language, index) => (
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
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: '#007AFF' }]}
          onPress={handleComplete}
          disabled={isLoading}
        >
          <Text style={styles.completeButtonText}>
            {isLoading ? 'Saving...' : 'Complete Setup'}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 8,
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
  inputDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rangeInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  rangeSeparator: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distanceInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  distanceUnit: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
    minWidth: 50,
  },
  helperText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    fontStyle: 'italic',
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
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
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
