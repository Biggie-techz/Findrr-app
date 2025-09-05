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
    <View className="mb-6">
      <Text className="text-sm font-rubik-bold text-slate-700 mb-3">{label}</Text>
      {isEditing ? (
        options ? (
          <View className="border border-slate-300 rounded-2xl overflow-hidden">
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                className={`px-4 py-4 border-b border-slate-200 last:border-b-0 ${
                  formData[field as keyof typeof formData] === option ? 'bg-indigo-50' : 'bg-white'
                }`}
                onPress={() => handleInputChange(field, option)}
              >
                <Text className={`font-rubik-medium ${
                  formData[field as keyof typeof formData] === option ? 'text-indigo-600' : 'text-slate-900'
                }`}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <TextInput
            className="border border-slate-300 rounded-2xl px-4 py-4 text-slate-900 font-rubik bg-white h-14"
            value={formData[field as keyof typeof formData]}
            onChangeText={(value) => handleInputChange(field, value)}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            keyboardType={keyboardType}
          />
        )
      ) : (
        <View className="border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
          <Text className="text-slate-900 font-rubik">
            {formData[field as keyof typeof formData] || `No ${label.toLowerCase()} set`}
          </Text>
        </View>
      )}
    </View>
  );

  const renderSalarySection = (
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
                Salary Expectations
              </Text>
              <Text className="text-sm text-slate-500 font-rubik mt-1">
                Set your salary requirements
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
          {renderSalarySection(
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
                    Enable editing to modify your salary expectations
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

          {/* Salary Range */}
          {renderSalarySection(
            'Salary Range',
            'cash',
            'green-600',
            <View className="p-6">
              {renderField('Minimum Salary', 'minSalary', 'Enter minimum salary', 'numeric')}
              {renderField('Maximum Salary', 'maxSalary', 'Enter maximum salary', 'numeric')}
            </View>
          )}

          {/* Currency and Frequency */}
          {renderSalarySection(
            'Preferences',
            'options',
            'purple-600',
            <View className="p-6">
              {renderField('Currency', 'currency', 'Select currency', 'default', ['NGN', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'])}
              {renderField('Frequency', 'frequency', 'Select frequency', 'default', ['annual', 'monthly', 'weekly', 'daily', 'hourly'])}
            </View>
          )}

          {/* Current Salary Display */}
          {!isEditing && (formData.minSalary || formData.maxSalary) && (
            <View className="mb-8">
              <View className="flex-row items-center mb-6">
                <View className="w-10 h-10 bg-teal-500 rounded-2xl items-center justify-center mr-3">
                  <Ionicons name="eye" size={20} color="white" />
                </View>
                <Text className="text-lg font-rubik-bold text-slate-900">
                  Current Expectations
                </Text>
              </View>
              <View className="bg-white rounded-3xl border border-white/50 overflow-hidden p-6">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-green-100 rounded-2xl items-center justify-center mr-4">
                    <Ionicons name="cash" size={24} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-rubik-medium text-slate-600 mb-1">
                      Expected Salary Range
                    </Text>
                    <Text className="text-xl font-rubik-bold text-slate-900">
                      {formData.currency} {formData.minSalary} - {formData.maxSalary}
                    </Text>
                    <Text className="text-sm text-slate-500 font-rubik capitalize">
                      {formData.frequency} basis
                    </Text>
                  </View>
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
                onPress={() => setIsEditing(false)}
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

export default SalaryExpectations;
