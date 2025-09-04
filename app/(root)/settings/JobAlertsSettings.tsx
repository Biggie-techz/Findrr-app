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
    categories: '',
    experienceLevel: 'entry', // entry, mid, senior, executive
  });

  const [country, setCountry] = useState<any | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ visible: false, message: '', type: 'success' });

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
      setToast({
        visible: true,
        message: 'User information not available',
        type: 'error',
      });
      return;
    }

    setJobAlertSettings((prev) => ({ ...prev }));

    setLoading(true);
    try {
      await updateUserProfile(user.$id, user.userType, {
        jobAlertSettings: JSON.stringify({
          ...jobAlertSettings,
          locations: country,
        }),
      });
      // await refetch(); // Refresh user data
      setIsEditing(false);
      setToast({
        visible: true,
        message: 'Job alert settings updated successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating job alert settings:', error);
      setToast({
        visible: true,
        message: 'Failed to update settings. Please try again.',
        type: 'error',
      });
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
    <View className="flex-row items-center justify-between py-5 px-2 border-b border-slate-100">
      <View className="flex-1 mr-4">
        <Text className="text-base font-rubik-bold text-slate-900 mb-1">
          {label}
        </Text>
        <Text className="text-sm text-slate-600 font-rubik">{description}</Text>
      </View>
      <Switch
        value={getNestedValue(field)}
        onValueChange={(value) => handleToggle(field, value)}
        disabled={!isEditing || disabled}
        trackColor={{ false: '#CBD5E1', true: '#6366F1' }}
        thumbColor={getNestedValue(field) ? '#FFFFFF' : '#F1F5F9'}
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
    <View className="mb-6">
      <Text className="text-sm font-rubik-bold text-slate-700 mb-3">
        {label}
      </Text>
      {isEditing ? (
        <TextInput
          className={`border border-slate-300 rounded-2xl px-4 py-4 text-slate-900 font-rubik bg-white ${
            multiline ? 'h-24' : 'h-14'
          }`}
          value={
            jobAlertSettings[field as keyof typeof jobAlertSettings] as string
          }
          onChangeText={(value) => handleInputChange(field, value)}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          multiline={multiline}
          keyboardType={keyboardType}
        />
      ) : (
        <View className="border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
          <Text className="text-slate-900 font-rubik">
            {(jobAlertSettings[
              field as keyof typeof jobAlertSettings
            ] as string) || `No ${label.toLowerCase()} specified`}
          </Text>
        </View>
      )}
    </View>
  );

  const renderExperienceSelector = () => (
    <View className="mb-6">
      <Text className="text-sm font-rubik-bold text-slate-700 mb-3">
        Experience Level
      </Text>
      {isEditing ? (
        <View className="flex-row gap-3">
          {['entry', 'mid', 'senior', 'executive'].map((level) => (
            <TouchableOpacity
              key={level}
              className={`flex-1 py-7 px-2 rounded-2xl border-2 ${
                jobAlertSettings.experienceLevel === level
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-white'
              }`}
              onPress={() => handleInputChange('experienceLevel', level)}
            >
              <Text
                className={`text-center font-rubik-bold capitalize text-sm ${
                  jobAlertSettings.experienceLevel === level
                    ? 'text-indigo-600'
                    : 'text-slate-700'
                }`}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="border border-slate-200 rounded-2xl px-4 py-4 bg-slate-50">
          <Text className="text-slate-900 font-rubik capitalize">
            {jobAlertSettings.experienceLevel} level
          </Text>
        </View>
      )}
    </View>
  );

  const renderJobAlertsSection = (
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
              className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center"
            >
              <Ionicons name="arrow-back" size={22} color="#475569" />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="text-xl font-rubik-bold text-slate-900">
                Job Alert Settings
              </Text>
              <Text className="text-sm text-slate-500 font-rubik mt-1">
                Customize your job alert preferences
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
          {renderJobAlertsSection(
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
                    Enable editing to modify your job alert preferences
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
              {renderToggle(
                'Enable Job Alerts',
                'enabled',
                'Receive job alerts based on your preferences'
              )}
            </>
          )}

          {/* Job Preferences */}
          {renderJobAlertsSection(
            'Job Preferences',
            'briefcase',
            'teal-600',
            <View className="p-6">
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
          )}

          {/* Job Types */}
          {renderJobAlertsSection(
            'Job Types',
            'business',
            'orange-600',
            <>
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
            </>
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
        onHide={() =>
          setToast({ visible: false, message: '', type: 'success' })
        }
      />
    </SafeAreaView>
  );
};

export default JobAlertsSettings;
