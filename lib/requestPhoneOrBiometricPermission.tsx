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

// Request biometric authentication (Expo)
const requestBiometricAuthentication = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    Alert.alert("Not Supported", "Your device does not support Face ID or Touch ID.");
    return false;
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    Alert.alert("Not Available", "No Face ID or Touch ID found. Please set it up first.");
    return false;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to enable this feature",
  });

  if (!result.success) {
    Alert.alert("Authentication Failed", "Biometric authentication is required.");
    return false;
  }

  return true;
};

export default requestBiometricAuthentication;
export { requestLocationPermissions };

