import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function OTPScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { mobileNumber } = useLocalSearchParams<{ mobileNumber: string }>();
  const { verifyOTP } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically verify OTP with your backend
      // For demo purposes, we'll just simulate success and redirect to profile setup
      setTimeout(() => {
        router.replace('/profile-setup');
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
    // Here you would typically resend the OTP
    Alert.alert('Info', 'OTP resent successfully!');
  };

  const formatMobileNumber = (number: string) => {
    if (number.length >= 10) {
      return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`;
    }
    return number;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.squareGrid}>
          <Image
            source={require('@/assets/images/clik.png')}
            style={styles.appImage}
            resizeMode="contain"
          />
          
          <Text style={styles.title}>
            Enter OTP
          </Text>
          <Text style={styles.subtitle}>
            We've sent a 4-digit code to
          </Text>
          <Text style={styles.mobileNumber}>
            {formatMobileNumber(mobileNumber || '')}
          </Text>
          
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                autoFocus={index === 0}
                editable={!isLoading}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton, 
              { 
                backgroundColor: isLoading ? '#999999' : '#007AFF',
                opacity: isLoading ? 0.6 : 1
              }
            ]}
            onPress={handleVerify}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.verifyButtonText}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            {!canResend ? (
              <Text style={styles.timerText}>
                Resend OTP in {timer}s
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={isLoading}>
                <Text style={styles.resendText}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'flex-start',
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  squareGrid: {
    width: 320,
    height: 450,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  appImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
    color: '#666666',
  },
  mobileNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 32,
    color: '#007AFF',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    color: '#333333',
    textAlign: 'center',
  },
  verifyButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resendContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: '#666666',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
