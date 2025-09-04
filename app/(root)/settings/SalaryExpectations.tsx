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

const SalaryExpectations = () => {
  const { user, refetch } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ visible: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    minSalary: '',
    maxSalary: '',
    currency: 'USD',
    frequency: 'annual',
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        minSalary: user.profile.minSalary?.toString() || '',
        maxSalary: user.profile.maxSalary?.toString() || '',
        currency: user.profile.currency || 'USD',
        frequency: user.profile.frequency || 'annual',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    // Basic validation
    if (!formData.minSalary || !formData.maxSalary) {
      setToast({
        visible: true,
        message: 'Please fill in both minimum and maximum salary',
        type: 'error',
      });
      return;
    }

    const min = parseFloat(formData.minSalary);
    const max = parseFloat(formData.maxSalary);

    if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
      setToast({
        visible: true,
        message: 'Please enter valid salary amounts',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        minSalary: min,
        maxSalary: max,
        currency: formData.currency,
        frequency: formData.frequency,
      };

      await updateUserProfile(user.$id, user.userType, updateData);
      // await refetch(); // Refresh user data
      setIsEditing(false);
      setToast({
        visible: true,
        message: 'Salary expectations updated successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating salary expectations:', error);
      setToast({
        visible: true,
        message: 'Failed to update salary expectations. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    field: string,
    placeholder: string,
    keyboardType: 'default' | 'numeric' = 'default',
    options?: string[]
  ) => (
    <View className="mb-4">
      <Text className="text-sm font-rubik-medium text-gray-700 mb-2">{label}</Text>
      {isEditing ? (
        options ? (
          <View className="border border-gray-300 rounded-lg">
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                className={`px-4 py-3 border-b border-gray-200 last:border-b-0 ${
                  formData[field as keyof typeof formData] === option ? 'bg-blue-50' : ''
                }`}
                onPress={() => handleInputChange(field, option)}
              >
                <Text className={`font-rubik ${
                  formData[field as keyof typeof formData] === option ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-rubik h-12"
            value={formData[field as keyof typeof formData]}
            onChangeText={(value) => handleInputChange(field, value)}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            keyboardType={keyboardType}
          />
        )
      ) : (
        <View className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
          <Text className="text-gray-900 font-rubik">
            {formData[field as keyof typeof formData] || `No ${label.toLowerCase()} set`}
          </Text>
        </View>
      )}
    </View>
  );

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
          <Text className="text-xl font-rubik-bold text-gray-900">Salary Expectations</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          {/* Salary Range */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-gray-900 mb-4">Salary Range</Text>
            {renderField('Minimum Salary', 'minSalary', 'Enter minimum salary', 'numeric')}
            {renderField('Maximum Salary', 'maxSalary', 'Enter maximum salary', 'numeric')}
          </View>

          {/* Currency and Frequency */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-gray-900 mb-4">Preferences</Text>
            {renderField('Currency', 'currency', 'Select currency', 'default', ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'])}
            {renderField('Frequency', 'frequency', 'Select frequency', 'default', ['annual', 'monthly', 'weekly', 'daily', 'hourly'])}
          </View>

          {/* Current Salary Display */}
          {!isEditing && (formData.minSalary || formData.maxSalary) && (
            <View className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Text className="text-sm font-rubik-medium text-blue-800 mb-2">Current Expectations</Text>
              <Text className="text-lg font-rubik-bold text-blue-900">
                {formData.currency} {formData.minSalary} - {formData.maxSalary} {formData.frequency}
              </Text>
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
                  onPress={() => setIsEditing(false)}
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
                <Text className="text-white font-rubik-medium">Edit Expectations</Text>
              </TouchableOpacity>
            )}
          </View>
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

export default SalaryExpectations;
