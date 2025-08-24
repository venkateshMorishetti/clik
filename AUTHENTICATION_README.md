# Authentication Flow

This app now includes a complete authentication flow with mobile number login and OTP verification.

## Features

### Login Screen (`/login`)
- Mobile number input with validation
- Proceed button to send OTP
- Responsive design with dark/light theme support
- Loading states and error handling

### OTP Screen (`/otp`)
- 4-digit OTP input with auto-focus
- 30-second countdown timer for resend
- Resend OTP functionality
- Mobile number display
- Back navigation to login

### Authentication Hook (`useAuth`)
- Manages authentication state
- Handles login, OTP verification, and logout
- Prevents authenticated users from accessing login screens
- Provides loading states

## How It Works

1. **Initial Launch**: App starts with login screen
2. **Mobile Input**: User enters mobile number and taps "Proceed"
3. **OTP Screen**: User is redirected to OTP verification
4. **Verification**: User enters 4-digit OTP and taps "Verify"
5. **Success**: Upon successful verification, user is redirected to main app
6. **Logout**: User can logout from the home screen to return to login

## Implementation Details

### Navigation Flow
```
Login → OTP → Main App (Tabs)
  ↑         ↓
  ←── Logout ←──
```

### State Management
- Authentication state is managed in `useAuth` hook
- Conditional rendering in root layout based on auth state
- Persistent state can be added using AsyncStorage

### Validation
- Mobile number must be at least 10 digits
- OTP must be exactly 4 digits
- Loading states prevent multiple submissions

## Customization

### Backend Integration
To integrate with a real backend:

1. Update `useAuth.ts`:
   ```typescript
   const login = async (mobileNumber: string) => {
     // Make API call to send OTP
     const response = await fetch('/api/send-otp', {
       method: 'POST',
       body: JSON.stringify({ mobileNumber })
     });
     // Handle response and navigate to OTP
   };

   const verifyOTP = async (otp: string) => {
     // Make API call to verify OTP
     const response = await fetch('/api/verify-otp', {
       method: 'POST',
       body: JSON.stringify({ mobileNumber, otp })
     });
     // Handle response and set auth state
   };
   ```

2. Add persistent storage:
   ```typescript
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   // Store auth token
   await AsyncStorage.setItem('authToken', token);
   
   // Check auth status on app launch
   const token = await AsyncStorage.getItem('authToken');
   ```

### Styling
- Colors automatically adapt to light/dark theme
- All styles are defined in StyleSheet objects
- Easy to customize colors, fonts, and layouts

## Testing

1. Run the app
2. Enter any mobile number (10+ digits)
3. Enter any 4-digit OTP
4. Verify you're redirected to main app
5. Test logout functionality
6. Verify you return to login screen

## Dependencies

The authentication flow uses these existing dependencies:
- `expo-router` for navigation
- React Native core components
- Existing theme and color system

No additional packages are required for the basic flow.
