import Toast from '@/components/Toast';
import { updateUserProfile } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PreferredLocations = () => {
  const { user, refetch } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ visible: false, message: '', type: 'success' });

  useEffect(() => {
    if (user?.profile?.preferredLocations) {
      setPreferredLocations(user.profile.preferredLocations || []);
    }
  }, [user]);

  const handleAddLocation = () => {
    if (newLocation.trim() && !preferredLocations.includes(newLocation.trim())) {
      setPreferredLocations([...preferredLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (location: string) => {
    setPreferredLocations(preferredLocations.filter(loc => loc !== location));
  };

  const handleSave = async () => {
    if (!user?.userType || !user?.$id) {
      setToast({
        visible: true,
        message: 'User information not available',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(user.$id, user.userType, {
        preferredLocations: preferredLocations,
      });
      // await refetch();
      setIsEditing(false);
      setToast({
        visible: true,
        message: 'Preferred locations updated successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating preferred locations:', error);
      setToast({
        visible: true,
        message: 'Failed to update locations. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderLocationSection = (
    title: string,
    icon: string,
    color: string,
    children: React.ReactNode
  ) => (
    <View className="mb-8">
      <View className="flex-row items-center mb-6">
        <View
          className={`w-10 h-10 bg-${color} rounded-2xl items-center justify-center mr-3`}
        >
          <Ionicons name={icon as any} size={20} color="white" />
        </View>
        <Text className="text-lg font-rubik-bold text-slate-900">{title}</Text>
      </View>
      <View className="bg-white rounded-3xl border border-white/50 overflow-hidden">
        {children}
      </View>
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-slate-500 mt-4 font-rubik">
          Loading user information...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
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
                Preferred Locations
              </Text>
              <Text className="text-sm text-slate-500 font-rubik mt-1">
                Set your preferred job locations
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
          {/* General Settings */}
          {renderLocationSection(
            'General Settings',
            'settings',
            'blue-500',
            <>
              <View className="flex-row items-center justify-between p-6 border-b border-slate-100">
                <View className="flex-1">
                  <Text className="text-base font-rubik-bold text-slate-900 mb-1">
                    Edit Mode
                  </Text>
                  <Text className="text-sm text-slate-600 font-rubik">
                    Enable editing to modify your preferred locations
                  </Text>
                </View>
                <TouchableOpacity
                  className={`px-6 py-3 rounded-2xl ${
                    isEditing ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Text className="text-white font-rubik-bold">
                    {isEditing ? 'Done' : 'Edit'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Current Locations */}
          {renderLocationSection(
            'Your Locations',
            'location',
            'emerald-600',
            <View className="p-6">
              {preferredLocations.length > 0 ? (
                preferredLocations.map((location, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between py-4 px-4 bg-slate-50 rounded-2xl mb-3 border border-slate-200"
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-8 h-8 bg-blue-100 rounded-xl items-center justify-center mr-3">
                        <Ionicons name="location" size={16} color="#3B82F6" />
                      </View>
                      <Text className="text-slate-900 font-rubik-medium flex-1">
                        {location}
                      </Text>
                    </View>
                    {isEditing && (
                      <TouchableOpacity
                        onPress={() => handleRemoveLocation(location)}
                        className="w-8 h-8 bg-red-100 rounded-xl items-center justify-center"
                      >
                        <Ionicons name="trash" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              ) : (
                <View className="py-12 items-center">
                  <View className="w-16 h-16 bg-slate-100 rounded-2xl items-center justify-center mb-4">
                    <Ionicons name="location-outline" size={32} color="#94A3B8" />
                  </View>
                  <Text className="text-slate-500 font-rubik text-center">
                    No preferred locations set.{'\n'}Add some locations to get better job matches.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Add New Location */}
          {isEditing && (
            <View className="mb-8">
              <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 bg-orange-500 rounded-2xl items-center justify-center mr-3">
                  <Ionicons name="add-circle" size={20} color="white" />
                </View>
                <Text className="text-lg font-rubik-bold text-slate-900">
                  Add New Location
                </Text>
              </View>
              <View className="bg-white rounded-3xl border border-white/50 overflow-hidden p-6">
                <View className="flex-row gap-3">
                  <TextInput
                    className="flex-1 border border-slate-300 rounded-2xl px-4 py-4 text-slate-900 font-rubik bg-white"
                    value={newLocation}
                    onChangeText={setNewLocation}
                    placeholder="Enter city, state, or country"
                    placeholderTextColor="#94A3B8"
                  />
                  <TouchableOpacity
                    className="bg-blue-500 rounded-2xl px-6 py-4 items-center justify-center"
                    onPress={handleAddLocation}
                    disabled={!newLocation.trim()}
                  >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <View className="flex-row gap-4 mb-8">
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-3xl py-4 items-center"
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text className="text-white font-rubik-bold text-base ml-2">
                      Save Changes
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-3xl py-4 items-center"
                onPress={() => {
                  setIsEditing(false);
                  setPreferredLocations(user?.profile?.preferredLocations || []);
                  setNewLocation('');
                }}
                disabled={loading}
              >
                <View className="flex-row items-center">
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                  <Text className="text-white font-rubik-bold text-base ml-2">
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ visible: false, message: '', type: 'success' })}
      />
    </SafeAreaView>
  );
};

export default PreferredLocations;
