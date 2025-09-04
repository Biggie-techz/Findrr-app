import { updateUserProfile } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
      Alert.alert('Error', 'User information not available');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(user.$id, user.userType, {
        preferredLocations: preferredLocations,
      });
      await refetch();
      setIsEditing(false);
      Alert.alert('Success', 'Preferred locations updated successfully');
    } catch (error) {
      console.error('Error updating preferred locations:', error);
      Alert.alert('Error', 'Failed to update locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading user information...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-rubik-bold text-gray-900">Preferred Locations</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          {/* Current Locations */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-gray-900 mb-4">Your Preferred Locations</Text>
            {preferredLocations.length > 0 ? (
              preferredLocations.map((location, index) => (
                <View key={index} className="flex-row items-center justify-between py-3 px-4 bg-gray-50 rounded-lg mb-2">
                  <Text className="text-gray-900 font-rubik flex-1">{location}</Text>
                  {isEditing && (
                    <TouchableOpacity
                      onPress={() => handleRemoveLocation(location)}
                      className="p-1"
                    >
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))
            ) : (
              <Text className="text-gray-500 font-rubik text-center py-8">
                No preferred locations set. Add some locations to get better job matches.
              </Text>
            )}
          </View>

          {/* Add New Location */}
          {isEditing && (
            <View className="mb-6">
              <Text className="text-sm font-rubik-medium text-gray-700 mb-2">Add New Location</Text>
              <View className="flex-row gap-2">
                <TextInput
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-rubik h-12"
                  value={newLocation}
                  onChangeText={setNewLocation}
                  placeholder="Enter city, state, or country"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  className="bg-blue-600 rounded-lg px-4 py-3 items-center justify-center"
                  onPress={handleAddLocation}
                  disabled={!newLocation.trim()}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-4 mb-8">
            {isEditing ? (
              <>
                <TouchableOpacity
                  className="flex-1 bg-blue-600 rounded-lg py-4 items-center"
                  onPress={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-white font-rubik-medium">Save Changes</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-gray-300 rounded-lg py-4 items-center"
                  onPress={() => {
                    setIsEditing(false);
                    setPreferredLocations(user?.profile?.preferredLocations || []);
                    setNewLocation('');
                  }}
                  disabled={loading}
                >
                  <Text className="text-gray-700 font-rubik-medium">Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                className="flex-1 bg-blue-600 rounded-lg py-4 items-center"
                onPress={() => setIsEditing(true)}
              >
                <Text className="text-white font-rubik-medium">Edit Locations</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PreferredLocations;
