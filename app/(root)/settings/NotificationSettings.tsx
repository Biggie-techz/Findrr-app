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
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationSettings = () => {
  const { user, refetch } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    jobAlerts: true,
    applicationUpdates: true,
    interviewInvites: true,
    newApplications: true,
    jobViews: true,
    marketingEmails: false,
  });

  useEffect(() => {
    if (user?.profile?.notificationSettings) {
      const parsedSettings =
        typeof user.profile.notificationSettings === 'string'
          ? JSON.parse(user.profile.notificationSettings)
          : user.profile.notificationSettings;
      setNotificationSettings({
        emailNotifications: parsedSettings.emailNotifications ?? true,
        pushNotifications: parsedSettings.pushNotifications ?? true,
        jobAlerts: parsedSettings.jobAlerts ?? true,
        applicationUpdates: parsedSettings.applicationUpdates ?? true,
        interviewInvites: parsedSettings.interviewInvites ?? true,
        newApplications: parsedSettings.newApplications ?? true,
        jobViews: parsedSettings.jobViews ?? true,
        marketingEmails: parsedSettings.marketingEmails ?? false,
      });
    }
  }, [user]);

  const handleToggle = (field: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.userType || !user?.$id) {
      Alert.alert('Error', 'User information not available');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(user.$id, user.userType, {
        notificationSettings: JSON.stringify(notificationSettings),
      });
      await refetch(); // Refresh user data
      setIsEditing(false);
      Alert.alert('Success', 'Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
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
        value={notificationSettings[field as keyof typeof notificationSettings]}
        onValueChange={(value) => handleToggle(field, value)}
        disabled={!isEditing || disabled}
        trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
        thumbColor={
          notificationSettings[field as keyof typeof notificationSettings]
            ? '#FFFFFF'
            : '#F3F4F6'
        }
      />
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
            Notification Settings
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-6 py-6"
          showsVerticalScrollIndicator={false}
        >
          {/* General Notifications */}
          <View className="mb-6">
            <View className="flex items-center justify-between flex-row mb-4">
              <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
                General Notifications
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
              'Email Notifications',
              'emailNotifications',
              'Receive notifications via email'
            )}
            {renderToggle(
              'Push Notifications',
              'pushNotifications',
              'Receive push notifications on your device'
            )}
            {renderToggle(
              'Marketing Emails',
              'marketingEmails',
              'Receive promotional emails and updates'
            )}
          </View>

          {/* Job Related Notifications */}
          {user.userType === 'applicant' && (
            <View className="mb-6">
              <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
                Job Notifications
              </Text>
              {renderToggle(
                'Job Alerts',
                'jobAlerts',
                'Get notified about new jobs matching your preferences'
              )}
              {renderToggle(
                'Application Updates',
                'applicationUpdates',
                'Receive updates on your job applications'
              )}
              {renderToggle(
                'Interview Invites',
                'interviewInvites',
                'Get notified when you receive interview invitations'
              )}
            </View>
          )}

          {/* Recruiter Notifications */}
          {user.userType === 'recruiter' && (
            <View className="mb-6">
              <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
                Recruiter Notifications
              </Text>
              {renderToggle(
                'New Applications',
                'newApplications',
                'Get notified when someone applies to your jobs'
              )}
              {renderToggle(
                'Job Views',
                'jobViews',
                'Receive notifications when your jobs are viewed'
              )}
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

export default NotificationSettings;
