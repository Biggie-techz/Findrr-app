import Toast from '@/components/Toast';
import requestBiometricAuthentication, { requestLocationPermissions } from '@/lib/requestPhoneOrBiometricPermission';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
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
        message: granted ? 'Location permission granted' : 'Location permission denied',
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
        message: granted ? 'Biometric authentication enabled' : 'Biometric authentication failed',
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
    <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
            <Ionicons name={iconName} size={24} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-rubik-semibold text-gray-900 mb-1">
              {title}
            </Text>
            <Text className="text-sm text-gray-600 font-rubik">
              {description}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg ${
            enabled
              ? 'bg-green-100 border border-green-300'
              : 'bg-blue-500'
          }`}
          onPress={onPress}
          disabled={disabled || loading}
        >
          <Text
            className={`font-rubik-medium ${
              enabled ? 'text-green-700' : 'text-white'
            }`}
          >
            {enabled ? 'Enabled' : 'Enable'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-rubik-bold text-gray-900">
          Privacy & Security
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Permissions Section */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
            Permissions
          </Text>

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
            <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="finger-print" size={24} color="#9CA3AF" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-semibold text-gray-900 mb-1">
                    Biometric Authentication
                  </Text>
                  <Text className="text-sm text-gray-500 font-rubik">
                    Not supported on this device
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Privacy Settings Section */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
            Privacy Settings
          </Text>

          <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="eye-off" size={24} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-semibold text-gray-900 mb-1">
                    Profile Visibility
                  </Text>
                  <Text className="text-sm text-gray-600 font-rubik">
                    Control who can see your profile
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="px-4 py-2 bg-gray-100 rounded-lg"
                onPress={() => {
                  setToast({
                    visible: true,
                    message: 'Profile visibility settings coming soon',
                    type: 'info',
                  });
                }}
              >
                <Text className="text-gray-700 font-rubik-medium">Manage</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="share-social" size={24} color="#8B5CF6" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-semibold text-gray-900 mb-1">
                    Data Sharing
                  </Text>
                  <Text className="text-sm text-gray-600 font-rubik">
                    Manage how your data is shared
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="px-4 py-2 bg-gray-100 rounded-lg"
                onPress={() => {
                  setToast({
                    visible: true,
                    message: 'Data sharing settings coming soon',
                    type: 'info',
                  });
                }}
              >
                <Text className="text-gray-700 font-rubik-medium">Manage</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Security Settings Section */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
            Security Settings
          </Text>

          <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="lock-closed" size={24} color="#EF4444" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-semibold text-gray-900 mb-1">
                    Change Password
                  </Text>
                  <Text className="text-sm text-gray-600 font-rubik">
                    Update your account password
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="px-4 py-2 bg-gray-100 rounded-lg"
                onPress={() => {
                  setToast({
                    visible: true,
                    message: 'Password change feature coming soon',
                    type: 'info',
                  });
                }}
              >
                <Text className="text-gray-700 font-rubik-medium">Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-4">
                  <Ionicons name="shield-checkmark" size={24} color="#F97316" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-rubik-semibold text-gray-900 mb-1">
                    Two-Factor Authentication
                  </Text>
                  <Text className="text-sm text-gray-600 font-rubik">
                    Add an extra layer of security
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="px-4 py-2 bg-gray-100 rounded-lg"
                onPress={() => {
                  setToast({
                    visible: true,
                    message: '2FA setup coming soon',
                    type: 'info',
                  });
                }}
              >
                <Text className="text-gray-700 font-rubik-medium">Setup</Text>
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
