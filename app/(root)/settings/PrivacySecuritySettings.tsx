import Toast from '@/components/Toast';
import requestBiometricAuthentication, {
  requestLocationPermissions,
} from '@/lib/requestPhoneOrBiometricPermission';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacySecuritySettings = () => {
  const router = useRouter();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      // Check location permission status
      const locationStatus = await Location.getForegroundPermissionsAsync();
      setLocationEnabled(locationStatus.status === 'granted');

      // Check biometric support
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setBiometricsSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricsEnabled(enrolled);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const handleLocationPermission = async () => {
    setLoading(true);
    try {
      const granted = await requestLocationPermissions();
      setLocationEnabled(granted);
      setToast({
        visible: true,
        message: granted
          ? 'Location permission granted'
          : 'Location permission denied',
        type: granted ? 'success' : 'error',
      });
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setToast({
        visible: true,
        message: 'Failed to request location permission',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricPermission = async () => {
    setLoading(true);
    try {
      const granted = await requestBiometricAuthentication();
      setBiometricsEnabled(granted);
      setToast({
        visible: true,
        message: granted
          ? 'Biometric authentication enabled'
          : 'Biometric authentication failed',
        type: granted ? 'success' : 'error',
      });
    } catch (error) {
      console.error('Error requesting biometric permission:', error);
      setToast({
        visible: true,
        message: 'Failed to enable biometric authentication',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPermissionSection = (
    title: string,
    description: string,
    enabled: boolean,
    onPress: () => void,
    iconName: keyof typeof Ionicons.glyphMap,
    disabled = false
  ) => (
    <View className="bg-white rounded-3xl p-6 mb-6 border border-white/50">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-blue-500 rounded-2xl items-center justify-center mr-4">
            <Ionicons name={iconName} size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-rubik-bold text-slate-900 mb-1">
              {title}
            </Text>
            <Text className="text-sm text-slate-600 font-rubik">
              {description}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className={`px-6 py-3 rounded-2xl ${
            enabled ? 'bg-emerald-600' : 'bg-blue-500'
          }`}
          onPress={onPress}
          disabled={disabled || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-white font-rubik-bold">
              {enabled ? 'Enabled' : 'Enable'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Modern Header */}
      <View className="bg-white/80 backdrop-blur-lg border-b border-white/20">
        <View className="flex-row items-center justify-between px-6 py-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 rounded-2xl items-center justify-center"
          >
            <Ionicons name="chevron-back" size={22} color="#475569" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-xl font-rubik-bold text-slate-900">
              Privacy & Security
            </Text>
            <Text className="text-sm text-slate-500 font-rubik mt-1">
              Manage your privacy settings
            </Text>
          </View>
          <View className="w-12" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Permissions Section */}
        <View className="mb-8">
          <View className="flex-row items-center mb-6">
            <View className="w-10 h-10 bg-teal-600 rounded-2xl items-center justify-center mr-3">
              <Ionicons name="shield-checkmark" size={20} color="white" />
            </View>
            <Text className="text-lg font-rubik-bold text-slate-900">
              Permissions
            </Text>
          </View>

          {renderPermissionSection(
            'Location Services',
            'Allow access to your location for better matching and features',
            locationEnabled,
            handleLocationPermission,
            'location'
          )}

          {biometricsSupported ? (
            renderPermissionSection(
              'Biometric Authentication',
              'Use Face ID or Touch ID for secure access',
              biometricsEnabled,
              handleBiometricPermission,
              'finger-print'
            )
          ) : (
            <View className="bg-white rounded-3xl p-6 mb-6 border border-white/50">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="finger-print" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-bold text-slate-900 mb-1">
                    Biometric Authentication
                  </Text>
                  <Text className="text-sm text-slate-500 font-rubik">
                    Not supported on this device
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Privacy Settings Section */}
        <View className="mb-8">
          <View className="flex-row items-center mb-6">
            <View className="w-10 h-10 bg-red-400 rounded-2xl items-center justify-center mr-3">
              <Ionicons name="eye-off" size={20} color="white" />
            </View>
            <Text className="text-lg font-rubik-bold text-slate-900">
              Privacy Settings
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-6 mb-6 border border-white/50">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-emerald-500 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="eye-off" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-bold text-slate-900 mb-1">
                    Profile Visibility
                  </Text>
                  <Text className="text-sm text-slate-600 font-rubik">
                    Control who can see your profile
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="px-6 py-3 bg-blue-500 rounded-2xl"
                onPress={() => {
                  setToast({
                    visible: true,
                    message: 'Profile visibility settings coming soon',
                    type: 'info',
                  });
                }}
              >
                <Text className="text-white font-rubik-bold">Manage</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-white rounded-3xl p-6 mb-6 border border-white/50">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-emerald-500 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="share-social" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-bold text-slate-900 mb-1">
                    Data Sharing
                  </Text>
                  <Text className="text-sm text-slate-600 font-rubik">
                    Manage how your data is shared
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="px-6 py-3 bg-blue-500 rounded-2xl"
                onPress={() => {
                  setToast({
                    visible: true,
                    message: 'Data sharing settings coming soon',
                    type: 'info',
                  });
                }}
              >
                <Text className="text-white font-rubik-bold">Manage</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Security Settings Section */}
        <View className="mb-8">
          <View className="flex-row items-center mb-6">
            <View className="w-10 h-10 bg-red-700 rounded-2xl items-center justify-center mr-3">
              <Ionicons name="lock-closed" size={20} color="white" />
            </View>
            <Text className="text-lg font-rubik-bold text-slate-900">
              Security Settings
            </Text>
          </View>

          <View className="bg-white rounded-3xl p-6 mb-6 border border-white/50">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-red-500 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="lock-open" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-bold text-slate-900 mb-1">
                    Change Password
                  </Text>
                  <Text className="text-sm text-slate-600 font-rubik">
                    Update your account password
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="px-6 py-3 bg-blue-500 rounded-2xl"
                onPress={() => {
                  setToast({
                    visible: true,
                    message: 'Password change feature coming soon',
                    type: 'info',
                  });
                }}
              >
                <Text className="text-white font-rubik-bold">Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-white rounded-3xl p-6 mb-6 border border-white/50">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-amber-500 rounded-2xl items-center justify-center mr-4">
                  <Ionicons name="shield-checkmark" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-bold text-slate-900 mb-1">
                    Two-Factor Authentication
                  </Text>
                  <Text className="text-sm text-slate-600 font-rubik">
                    Add an extra layer of security
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="px-6 py-3 bg-blue-500 rounded-2xl"
                onPress={() => {
                  setToast({
                    visible: true,
                    message: '2FA setup coming soon',
                    type: 'info',
                  });
                }}
              >
                <Text className="text-white font-rubik-bold">Setup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </SafeAreaView>
  );
};

export default PrivacySecuritySettings;
