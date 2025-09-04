import * as LocalAuthentication from "expo-local-authentication";
import * as Location from "expo-location";
import { Alert } from "react-native";

// Request location (Expo)
const requestLocationPermissions = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission Required", "Location permission is required for this feature.");
    return false;
  }
  return true;
};

// Request biometric authentication (Expo) - Optimized for Face ID on iOS
const requestBiometricAuthentication = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    Alert.alert("Not Supported", "Your device does not support biometric authentication.");
    return false;
  }

  // Get supported authentication types
  const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
  const hasFaceId = supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  const hasFingerprint = supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    const biometricType = hasFaceId ? "Face ID" : hasFingerprint ? "Touch ID" : "biometric authentication";
    Alert.alert("Not Available", `No ${biometricType} found. Please set it up in your device settings first.`);
    return false;
  }

  // Determine the biometric type for the prompt
  const biometricType = hasFaceId ? "Face ID" : hasFingerprint ? "Touch ID" : "biometric authentication";

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: `Use ${biometricType} to enable this feature`,
    fallbackLabel: "Use Passcode",
    cancelLabel: "Cancel",
    disableDeviceFallback: false,
  });

  if (!result.success) {
    if (result.error === "user_cancel") {
      Alert.alert("Cancelled", `${biometricType} authentication was cancelled.`);
    } else if (result.error === "user_fallback") {
      Alert.alert("Authentication Failed", "Please use your device passcode to authenticate.");
    } else {
      Alert.alert("Authentication Failed", `${biometricType} authentication failed. Please try again.`);
    }
    return false;
  }

  return true;
};

export default requestBiometricAuthentication;
export { requestLocationPermissions };

