import { logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Profile sections
const profileSections = [
  {
    id: 1,
    title: 'Account Settings',
    icon: 'settings',
    items: [
      {
        id: 1,
        title: 'Personal Information',
        icon: 'person',
        href: '/settings/PersonalInformation',
      },
      {
        id: 2,
        title: 'Notification Settings',
        icon: 'notifications',
        href: '/settings/NotificationSettings',
      },
      {
        id: 3,
        title: 'Privacy & Security',
        icon: 'shield-checkmark',
        href: '/settings/PrivacySecuritySettings',
      },
    ],
  },
  {
    id: 2,
    title: 'Job Preferences',
    icon: 'briefcase',
    items: [
      {
        id: 1,
        title: 'Job Alerts',
        icon: 'alert-circle',
        href: '/settings/JobAlertsSettings',
      },
      {
        id: 2,
        title: 'Preferred Locations',
        icon: 'location',
        href: '/settings/PreferredLocations',
      },
      {
        id: 3,
        title: 'Salary Expectations',
        icon: 'cash',
        href: '/settings/SalaryExpectations',
      },
    ],
  },
  {
    id: 3,
    title: 'Support',
    icon: 'help-circle',
    items: [
      {
        id: 1,
        title: 'Help Center',
        icon: 'help-buoy',
        href: '/settings/HelpCenter',
      },
      {
        id: 2,
        title: 'Contact Support',
        icon: 'chatbubbles',
        href: '/settings/ContactSupport',
      },
      {
        id: 3,
        title: 'About Findrr',
        icon: 'information-circle',
        href: '/settings/About',
      },
    ],
  },
];

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) => (
  <View className="bg-white rounded-xl p-4 flex-1 mx-1 shadow-sm border border-gray-100">
    <View className="flex-row items-center justify-between mb-2">
      <Ionicons name={icon as any} size={20} color="#3B82F6" />
      <Text className="text-2xl font-rubik-bold text-gray-900">{value}</Text>
    </View>
    <Text className="text-gray-600 text-sm font-rubik">{title}</Text>
  </View>
);

const ProfileSection = ({
  section,
}: {
  section: (typeof profileSections)[0];
}) => (
  <View className="mb-6">
    <View className="flex-row items-center mb-4">
      <Ionicons name={section.icon as any} size={20} color="#374151" />
      <Text className="text-lg font-rubik-bold text-gray-900 ml-2">
        {section.title}
      </Text>
    </View>
    <View className="bg-white rounded-xl shadow-sm border border-gray-100">
      {section.items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => router.push(item.href as any)}
          className={`flex-row items-center px-4 py-3 ${
            index < section.items.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <Ionicons name={item.icon as any} size={20} color="#6B7280" />
          <Text className="flex-1 ml-3 font-rubik text-gray-900">
            {item.title}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function Profile() {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const { user, refetch } = useGlobalContext();
  // console.log(user?.profile);

  useEffect(() => {
    const userPersonalInformation = JSON.parse(
      user?.profile?.personalInformation || '{}'
    );
    setUserInfo(userPersonalInformation);
    return () => {
      console.log(`userPersonalInformation: ${JSON.stringify(userPersonalInformation)}`);
    };
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const success = await logout();
      if (success) {
        refetch();
        router.replace('/Onboarding');
      } else {
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'An unexpected error occurred during logout.');
    } finally {
      setLogoutLoading(false);
    }
  };
  return (
    <SafeAreaView className="h-full pb-14">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-rubik-bold text-gray-900">
              My Profile
            </Text>
            <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#374151"
              />
            </TouchableOpacity>
          </View>

          {/* User Profile Card */}
          <View className="bg-white rounded-xl p-6 shadow-xl border border-gray-100">
            <View className="flex-row items-center mb-4">
              {user?.profile.avatar ? (
                <Image
                  source={{ uri: user?.profile.avatar }}
                  className="w-20 h-20 rounded-full border border-gray-100 bg-gray-50 mr-4"
                  resizeMode="contain"
                />
              ) : (
                <View className="w-20 h-20 rounded-full border border-gray-100 bg-gray-50 mr-4 items-center justify-center">
                  <Ionicons name="person" size={45} color="#374151" />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-xl font-rubik-bold text-gray-900">
                  {user?.name || 'User'}
                </Text>
                <Text className="text-gray-600 font-rubik mb-1">
                  {user?.email || 'No email provided'}
                </Text>
                <Text className="text-gray-500 text-sm font-rubik">
                  {userInfo?.location || user?.location || 'Location not set'}
                </Text>
                <Text className="text-gray-500 text-sm font-rubik">
                  Member since{' '}
                  {user?.profile?.createdAt
                    ? new Date(user.profile.createdAt).toLocaleDateString()
                    : 'Unknown'}
                </Text>
              </View>
            </View>

            {/* Stats Row */}
            <View className="flex-row mb-4 -mx-1">
              <StatCard
                title="Applications"
                value={user?.profile.applicationCount}
                icon="document-text"
              />
              <StatCard
                title="Interviews"
                value={user?.profile.interviewCount}
                icon="calendar"
              />
              <StatCard
                title="Saved Jobs"
                value={user?.profile.savedJobsCount}
                icon="bookmark"
              />
            </View>

            {/* Progress Bar */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-rubik-medium text-gray-900">
                  Profile Completion
                </Text>
                <Text className="text-sm font-rubik text-gray-600">
                  {Number(
                    (user?.profile.profileCompleteCount / 6) * 100
                  ).toFixed()}
                  %
                </Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min((user?.profile.profileCompleteCount / 6) * 100, 100)}%`,
                  }}
                />
              </View>
            </View>

            {/* Contact Info */}
            <View className="flex-row items-center">
              <Ionicons name="call" size={16} color="#6B7280" />
              <Text className="text-gray-600 text-sm ml-2 font-rubik">
                {user?.profile?.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        <View className="px-6 py-6">
          {profileSections.map((section) => (
            <ProfileSection key={section.id} section={section} />
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-danger rounded-xl p-4 items-center mt-6"
            onPress={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-rubik-medium">Sign Out</Text>
            )}
          </TouchableOpacity>

          {/* App Version */}
          <Text className="text-center text-gray-400 text-sm font-rubik mt-8">
            Findrr v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
