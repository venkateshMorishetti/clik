import { router } from 'expo-router';
import { useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (mobileNumber: string) => {
    try {
      // Here you would typically make an API call to send OTP
      // For demo purposes, we'll just navigate to OTP screen
      router.push({
        pathname: '/otp',
        params: { mobileNumber }
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      // Here you would typically verify OTP with your backend
      // For demo purposes, we'll just simulate success
      setIsAuthenticated(true);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    isAuthenticated,
    login,
    verifyOTP,
    logout,
  };
}
