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
      // await refetch(); // Refresh user data
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
    <View className="flex-row items-center justify-between py-5 px-2 border-b border-slate-100">
      <View className="flex-1 mr-4">
        <Text className="text-base font-rubik-bold text-slate-900 mb-1">
          {label}
        </Text>
        <Text className="text-sm text-slate-600 font-rubik">{description}</Text>
      </View>
      <Switch
        value={notificationSettings[field as keyof typeof notificationSettings]}
        onValueChange={(value) => handleToggle(field, value)}
        disabled={!isEditing || disabled}
        trackColor={{ false: '#CBD5E1', true: '#6366F1' }}
        thumbColor={
          notificationSettings[field as keyof typeof notificationSettings]
            ? '#FFFFFF'
            : '#F1F5F9'
        }
      />
    </View>
  );

  const renderNotificationSection = (
    title: string,
    icon: string,
    color: string,
    children: React.ReactNode
  ) => (
    <View className="mb-8">
      <View className="flex-row items-center mb-6">
        <View className={`w-10 h-10 bg-${color} rounded-2xl items-center justify-center mr-3`}>
          <Ionicons name={icon as any} size={20} color="white" />
        </View>
        <Text className="text-lg font-rubik-bold text-slate-900">
          {title}
        </Text>
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
        <Text className="text-slate-500 mt-4 font-rubik">Loading user information...</Text>
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
                Notification Settings
              </Text>
              <Text className="text-sm text-slate-500 font-rubik mt-1">
                Manage your notification preferences
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
          {/* General Notifications */}
          {renderNotificationSection(
            'General Notifications',
            'notifications',
            'blue-500',
            <>
              <View className="flex-row items-center justify-between p-6 border-b border-slate-100">
                <View className="flex-1">
                  <Text className="text-base font-rubik-bold text-slate-900 mb-1">
                    Edit Mode
                  </Text>
                  <Text className="text-sm text-slate-600 font-rubik">
                    Enable editing to modify your notification preferences
                  </Text>
                </View>
                <TouchableOpacity
                  className={`px-6 py-3 rounded-2xl ${
                    isEditing
                      ? 'bg-emerald-500'
                      : 'bg-blue-500'
                  }`}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Text className="text-white font-rubik-bold">
                    {isEditing ? 'Done' : 'Edit'}
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
            </>
          )}

          {/* Job Related Notifications */}
          {user.userType === 'applicant' && renderNotificationSection(
            'Job Notifications',
            'briefcase',
            'teal-600',
            <>
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
            </>
          )}

          {/* Recruiter Notifications */}
          {user.userType === 'recruiter' && renderNotificationSection(
            'Recruiter Notifications',
            'business',
            'orange-500',
            <>
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
    </SafeAreaView>
  );
};

export default NotificationSettings;
