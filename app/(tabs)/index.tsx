import Matches from '@/components/Matches';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleMatchRequest = (matchId: number) => {
    console.log(`Match request sent for match ID: ${matchId}`);
    // Here you would typically send the match request to your backend
  };

  const handleMatchPass = (matchId: number) => {
    console.log(`Match passed for match ID: ${matchId}`);
    // Here you would typically log the pass action
  };

  const handleLogoPress = () => {
    setIsDrawerOpen(true);
    
    // Slide animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Fade overlay animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const handleEditProfile = () => {
    closeDrawer();
    Alert.alert('Edit Profile', 'Edit Profile option selected');
    // Here you would navigate to edit profile screen
  };

  const handleChat = () => {
    closeDrawer();
    Alert.alert('Chat', 'Chat option selected');
    // Here you would navigate to chat screen
  };

  const closeDrawer = () => {
    // Fade out overlay
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Slide out animation
    Animated.timing(slideAnim, {
      toValue: -280,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsDrawerOpen(false);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
          <Image
            source={require('@/assets/images/clik.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover Matches</Text>
      </View>

      <Matches 
        onMatchRequest={handleMatchRequest}
        onMatchPass={handleMatchPass}
      />

      {/* Drawer Modal */}
      <Modal
        visible={isDrawerOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View 
            style={[
              styles.drawer,
              {
                transform: [{ translateX: slideAnim }]
              }
            ]}
          >
            <View style={styles.drawerHeader}>
              <View style={styles.headerContent}>
                <Image
                  source={require('@/assets/images/clik.png')}
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
                <Text style={styles.drawerHeaderText}>Menu</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.drawerItem} onPress={handleEditProfile}>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuIcon}>
                    <Text style={styles.iconText}>👤</Text>
                  </View>
                  <Text style={styles.drawerItemText}>Edit Profile</Text>
                </View>
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={handleChat}>
                <View style={styles.menuItemContent}>
                  <View style={styles.menuIcon}>
                    <Text style={styles.iconText}>💬</Text>
                  </View>
                  <Text style={styles.drawerItemText}>Chat</Text>
                </View>
                <Text style={styles.arrowText}>›</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <TouchableOpacity style={styles.overlayTouch} onPress={closeDrawer} />
        </Animated.View>
      </Modal>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    left: 20,
    top: 60,
    zIndex: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  drawer: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    width: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#F8F9FA',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6C757D',
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  arrowText: {
    fontSize: 18,
    color: '#BDC3C7',
    fontWeight: 'bold',
  },
  overlayTouch: {
    position: 'absolute',
    top: 0,
    left: 280,
    right: 0,
    bottom: 0,
  },
});
