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
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const JobAlertsSettings = () => {
  const { user, refetch } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobAlertSettings, setJobAlertSettings] = useState({
    enabled: true,
    keywords: '',
    jobTypes: {
      fullTime: true,
      partTime: false,
      contract: false,
      freelance: false,
      internship: false,
    },
    locations: '',
    salaryMin: '',
    salaryMax: '',
    categories: '',
    experienceLevel: 'entry', // entry, mid, senior, executive
  });

  const [country, setCountry] = useState<any | null>(null);

  useEffect(() => {
    if (user?.profile?.jobAlertSettings) {
      const parsedSettings =
        typeof user.profile.jobAlertSettings === 'string'
          ? JSON.parse(user.profile.jobAlertSettings)
          : user.profile.jobAlertSettings;
      setJobAlertSettings({
        enabled: parsedSettings.enabled ?? true,
        keywords: parsedSettings.keywords ?? '',
        jobTypes: {
          fullTime: parsedSettings.jobTypes?.fullTime ?? true,
          partTime: parsedSettings.jobTypes?.partTime ?? false,
          contract: parsedSettings.jobTypes?.contract ?? false,
          freelance: parsedSettings.jobTypes?.freelance ?? false,
          internship: parsedSettings.jobTypes?.internship ?? false,
        },
        locations: parsedSettings.locations ?? '',
        salaryMin: parsedSettings.salaryMin ?? '',
        salaryMax: parsedSettings.salaryMax ?? '',
        categories: parsedSettings.categories ?? '',
        experienceLevel: parsedSettings.experienceLevel ?? 'entry',
      });
    }
  }, [user]);

  const handleToggle = (field: string, value: boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setJobAlertSettings((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setJobAlertSettings((prev) => ({ ...prev, [field]: value as any }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setJobAlertSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.userType || !user?.$id) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    setJobAlertSettings((prev) => ({ ...prev }));

    setLoading(true);
    try {
      await updateUserProfile(user.$id, user.userType, {
        jobAlertSettings: JSON.stringify({
          ...jobAlertSettings,
          locations: location,
        }),
      });
      await refetch(); // Refresh user data
      setIsEditing(false);
      Alert.alert('Success', 'Job alert settings updated successfully');
    } catch (error) {
      console.error('Error updating job alert settings:', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getNestedValue = (field: string): boolean => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentValue =
        jobAlertSettings[parent as keyof typeof jobAlertSettings];
      if (typeof parentValue === 'object' && parentValue !== null) {
        return (parentValue as any)[child] || false;
      }
      return false;
    }
    return (
      (jobAlertSettings[field as keyof typeof jobAlertSettings] as boolean) ||
      false
    );
  };

  const renderToggle = (
    label: string,
    field: string,
    description: string,
    disabled = false
  ) => (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-1 mr-4">
        <Text className="text-base font-rubik-medium text-gray-900 mb-1">
          {label}
        </Text>
        <Text className="text-sm text-gray-600 font-rubik">{description}</Text>
      </View>
      <Switch
        value={getNestedValue(field)}
        onValueChange={(value) => handleToggle(field, value)}
        disabled={!isEditing || disabled}
        trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
        thumbColor={getNestedValue(field) ? '#FFFFFF' : '#F3F4F6'}
      />
    </View>
  );

  const renderField = (
    label: string,
    field: string,
    placeholder: string,
    multiline = false,
    keyboardType: 'default' | 'numeric' = 'default'
  ) => (
    <View className="mb-4">
      <Text className="text-sm font-rubik-medium text-gray-700 mb-2">
        {label}
      </Text>
      {isEditing ? (
        <TextInput
          className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-rubik ${
            multiline ? 'h-20' : 'h-12'
          }`}
          value={
            jobAlertSettings[field as keyof typeof jobAlertSettings] as string
          }
          onChangeText={(value) => handleInputChange(field, value)}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline={multiline}
          keyboardType={keyboardType}
        />
      ) : (
        <View className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
          <Text className="text-gray-900 font-rubik">
            {(jobAlertSettings[
              field as keyof typeof jobAlertSettings
            ] as string) || `No ${label.toLowerCase()} specified`}
          </Text>
        </View>
      )}
    </View>
  );

  const renderExperienceSelector = () => (
    <View className="mb-4">
      <Text className="text-sm font-rubik-medium text-gray-700 mb-2">
        Experience Level
      </Text>
      {isEditing ? (
        <View className="flex-row gap-2">
          {['entry', 'mid', 'senior', 'executive'].map((level) => (
            <TouchableOpacity
              key={level}
              className={`flex-1 py-3 px-4 rounded-lg border ${
                jobAlertSettings.experienceLevel === level
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white'
              }`}
              onPress={() => handleInputChange('experienceLevel', level)}
            >
              <Text
                className={`text-center font-rubik-medium capitalize ${
                  jobAlertSettings.experienceLevel === level
                    ? 'text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
          <Text className="text-gray-900 font-rubik capitalize">
            {jobAlertSettings.experienceLevel} level
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
          <Text className="text-xl font-rubik-bold text-gray-900">
            Job Alert Settings
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-6 py-6"
          showsVerticalScrollIndicator={false}
        >
          {/* General Settings */}
          <View className="mb-6">
            <View className="flex items-center justify-between flex-row mb-4">
              <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
                General Settings
              </Text>
              <TouchableOpacity
                className="flex bg-blue-500/70 rounded-full py-1 px-4 items-center"
                onPress={() => setIsEditing(true)}
              >
                <Text className="text-white font-rubik-medium">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
            {renderToggle(
              'Enable Job Alerts',
              'enabled',
              'Receive job alerts based on your preferences'
            )}
          </View>

          {/* Job Preferences */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
              Job Preferences
            </Text>
            {renderField(
              'Keywords',
              'keywords',
              'Enter keywords (e.g., React, Node.js)',
              true
            )}
            {renderField(
              'Categories',
              'categories',
              'Enter job categories (comma separated)',
              true
            )}
            {renderExperienceSelector()}
          </View>

          {/* Job Types */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
              Job Types
            </Text>
            {renderToggle(
              'Full Time',
              'jobTypes.fullTime',
              'Include full-time positions'
            )}
            {renderToggle(
              'Part Time',
              'jobTypes.partTime',
              'Include part-time positions'
            )}
            {renderToggle(
              'Contract',
              'jobTypes.contract',
              'Include contract positions'
            )}
            {renderToggle(
              'Freelance',
              'jobTypes.freelance',
              'Include freelance opportunities'
            )}
            {renderToggle(
              'Internship',
              'jobTypes.internship',
              'Include internship positions'
            )}
          </View>

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
                    <Text className="text-white font-rubik-medium">
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-gray-300 rounded-lg py-4 items-center"
                  onPress={() => setIsEditing(false)}
                  disabled={loading}
                >
                  <Text className="text-gray-700 font-rubik-medium">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              ''
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default JobAlertsSettings;
