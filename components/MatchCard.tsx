import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface MatchCardProps {
  match: {
    id: number;
    name: string;
    age: number;
    image: any;
    interests: string;
    languages: string;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <View style={styles.squareGrid}>
      <View style={styles.imageContainer}>
        <Image
          source={match.image}
          style={styles.matchImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
      </View>
      <View style={styles.matchInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.matchName}>{match.name}</Text>
          <Text style={styles.matchAge}>, {match.age}</Text>
        </View>
        <View style={styles.interestsContainer}>
          <Text style={styles.interestsLabel}>Interests</Text>
          <Text style={styles.matchInterests}>{match.interests}</Text>
        </View>
        <View style={styles.languagesContainer}>
          <Text style={styles.languagesLabel}>Languages</Text>
          <Text style={styles.matchLanguages}>{match.languages}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  squareGrid: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '55%',
  },
  matchImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  matchInfo: {
    padding: 20,
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  matchName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  matchAge: {
    fontSize: 22,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  interestsContainer: {
    marginBottom: 8,
  },
  interestsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#95A5A6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  matchInterests: {
    fontSize: 15,
    color: '#34495E',
    fontWeight: '500',
    lineHeight: 20,
  },
  languagesContainer: {
    marginBottom: 4,
  },
  languagesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#95A5A6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  matchLanguages: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
});
