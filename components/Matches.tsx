import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MatchCard from './MatchCard';

const { width: screenWidth } = Dimensions.get('window');

// Dummy data for matches
const dummyMatches = [
  {
    id: 1,
    name: 'Sarah',
    age: 25,
    image: require('@/assets/images/palceholder_img_boy.jpg'),
    interests: 'Sports, Travel, Photography',
    languages: 'English, Spanish',
  },
  {
    id: 2,
    name: 'Emma',
    age: 28,
    image: require('@/assets/images/palceholder_img_boy.jpg'),
    interests: 'Cooking, Reading, Yoga',
    languages: 'English, French',
  },
  {
    id: 3,
    name: 'Jessica',
    age: 26,
    image: require('@/assets/images/placeholder_img_girl.jpg'),
    interests: 'Dancing, Music, Art',
    languages: 'English, Italian',
  },
  {
    id: 4,
    name: 'Amanda',
    age: 27,
    image: require('@/assets/images/placeholder_img_girl.jpg'),
    interests: 'Hiking, Photography, Cooking',
    languages: 'English, German',
  },
  {
    id: 5,
    name: 'Rachel',
    age: 24,
    image: require('@/assets/images/placeholder_img_girl.jpg'),
    interests: 'Fitness, Travel, Reading',
    languages: 'English, Portuguese',
  },
];

interface MatchesProps {
  onMatchRequest?: (matchId: number) => void;
  onMatchPass?: (matchId: number) => void;
}

export default function Matches({ onMatchRequest, onMatchPass }: MatchesProps) {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matches, setMatches] = useState(dummyMatches);
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const currentMatch = matches[currentMatchIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Send request
      console.log(`Sent request to ${currentMatch.name}`);
      onMatchRequest?.(currentMatch.id);
    } else {
      // Skip
      console.log(`Skipped ${currentMatch.name}`);
      onMatchPass?.(currentMatch.id);
    }

    // Move to next match
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
      translateX.setValue(0);
      scale.setValue(1);
    } else {
      // No more matches
      console.log('No more matches');
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 100) {
          // Swipe right
          Animated.timing(translateX, {
            toValue: screenWidth,
            duration: 300,
            useNativeDriver: false,
          }).start(() => handleSwipe('right'));
        } else if (gestureState.dx < -100) {
          // Swipe left
          Animated.timing(translateX, {
            toValue: -screenWidth,
            duration: 300,
            useNativeDriver: false,
          }).start(() => handleSwipe('left'));
        } else {
          // Return to center
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const cardStyle = {
    transform: [
      { translateX },
      { scale },
    ],
  };

  if (!currentMatch) {
    return (
      <View style={styles.noMatchesContainer}>
        <Text style={styles.noMatchesText}>No more matches for now!</Text>
        <Text style={styles.noMatchesSubtext}>Check back later for new matches</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View 
          style={[styles.card, cardStyle]}
          {...panResponder.panHandlers}
        >
          <MatchCard match={currentMatch} />
        </Animated.View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.passButton]}
          onPress={() => handleSwipe('left')}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.passButtonText}>Pass</Text>
            <Text style={styles.passButtonIcon}>✕</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.matchButton]}
          onPress={() => handleSwipe('right')}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.matchButtonText}>Match</Text>
            <Text style={styles.matchButtonIcon}>♥</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.swipeHint}>Swipe left to pass, right to match</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: screenWidth - 40,
    height: screenWidth - 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  button: {
    width: 120,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF6B6B',
  },
  matchButton: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  passButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginRight: 6,
  },
  matchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 6,
  },
  passButtonIcon: {
    fontSize: 18,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  matchButtonIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  swipeHint: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 14,
    paddingBottom: 20,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMatchesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  noMatchesSubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
