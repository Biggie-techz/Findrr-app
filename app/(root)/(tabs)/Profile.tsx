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
    color: 'blue-600',
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
    color: 'teal-600',
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
    color: 'red-500',
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
  <View className="bg-white rounded-2xl p-4 flex-1 mx-1 border border-black-100/20">
    <View className="flex-row items-center justify-between mb-2">
      <Ionicons name={icon as any} size={20} color="#6366F1" />
      <Text className="text-2xl font-rubik-bold text-slate-900">{value}</Text>
    </View>
    <Text className="text-slate-600 text-sm font-rubik">{title}</Text>
  </View>
);

const ProfileSection = ({
  section,
}: {
  section: (typeof profileSections)[0];
}) => (
  <View className="mb-8">
    <View className="flex-row items-center mb-6">
      <View className={`w-10 h-10 bg-${section.color} rounded-2xl items-center justify-center mr-3`}>
        <Ionicons name={section.icon as any} size={20} color="white" />
      </View>
      <Text className="text-lg font-rubik-bold text-slate-900">
        {section.title}
      </Text>
    </View>
    <View className="bg-white rounded-3xl border border-white/50 overflow-hidden">
      {section.items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => router.push(item.href as any)}
          className={`flex-row items-center px-6 py-4 ${
            index < section.items.length - 1 ? 'border-b border-slate-100' : ''
          }`}
        >
          <Ionicons name={item.icon as any} size={20} color="#64748B" />
          <Text className="flex-1 ml-3 font-rubik text-slate-900">
            {item.title}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function Profile() {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{ location?: string }>({});
  const { user, refetch } = useGlobalContext();

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
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Modern Header */}
        <View className="bg-white/80 backdrop-blur-lg border-b border-white/20">
          <View className="flex-row items-center justify-between px-6 py-5">
            <Text className="text-xl font-rubik-bold text-slate-900">
              My Profile
            </Text>
            <TouchableOpacity className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center">
              <Ionicons name="notifications-outline" size={22} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Profile Card */}
        <View className="bg-white rounded-3xl mx-6 mt-6 p-6 border border-white/50">
          <View className="flex-row items-center mb-4">
            {user?.profile.avatar ? (
              <Image
                source={{ uri: user?.profile.avatar }}
                className="w-20 h-20 rounded-full border-2 border-slate-200 bg-slate-50 mr-4"
                resizeMode="contain"
              />
            ) : (
              <View className="w-20 h-20 bg-slate-300 rounded-full mr-4 items-center justify-center">
                <Text className="text-white font-rubik-bold text-2xl">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="text-xl font-rubik-bold text-slate-900">
                {user?.name || 'User'}
              </Text>
              <Text className="text-slate-600 font-rubik mb-1">
                {user?.email || 'No email provided'}
              </Text>
              <Text className="text-slate-500 text-sm font-rubik">
                {userInfo?.location || 'Location not set'}
              </Text>
              <Text className="text-slate-500 text-sm font-rubik">
                Member since{' '}
                {user?.profile?.createdAt
                  ? new Date(user.profile.createdAt).toLocaleDateString()
                  : 'Unknown'}
              </Text>
            </View>
          </View>

          {/* Stats Row */}
          <View className="flex-row mb-6 -mx-1">
            <StatCard
              title="Applications"
              value={user?.profile.applicationCount || 0}
              icon="document-text"
            />
            <StatCard
              title="Interviews"
              value={user?.profile.interviewCount || 0}
              icon="calendar"
            />
            <StatCard
              title="Saved Jobs"
              value={user?.profile.savedJobsCount || 0}
              icon="bookmark"
            />
          </View>

          {/* Progress Bar */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-rubik-bold text-slate-900">
                Profile Completion
              </Text>
              <Text className="text-sm font-rubik text-slate-600">
                {Number(
                  (user?.profile.profileCompleteCount / 6) * 100
                ).toFixed()}
                %
              </Text>
            </View>
            <View className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <View
                className="bg-blue-600 h-3 rounded-full"
                style={{
                  width: `${Math.min((user?.profile.profileCompleteCount / 6) * 100, 100)}%`,
                }}
              />
            </View>
          </View>

          {/* Contact Info */}
          <View className="flex-row items-center">
            <Ionicons name="call" size={16} color="#64748B" />
            <Text className="text-slate-600 text-sm ml-2 font-rubik">
              {user?.profile?.phone || 'No phone provided'}
            </Text>
          </View>
        </View>

        {/* Profile Sections */}
        <View className="px-6 py-6">
          {profileSections.map((section) => (
            <ProfileSection key={section.id} section={section} />
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            className="bg-red-500 rounded-3xl p-4 items-center mt-6"
            onPress={handleLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="log-out-outline" size={20} color="white" />
                <Text className="text-white font-rubik-bold text-base ml-2">Sign Out</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* App Version */}
          <Text className="text-center text-slate-400 text-sm font-rubik mt-8 mb-14">
            Findrr v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
