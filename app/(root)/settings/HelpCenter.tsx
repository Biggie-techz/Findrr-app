import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HelpCenter = () => {
  const faqs = [
    {
      question: 'How do I update my profile?',
      answer: 'Go to the Profile tab, tap on your avatar, and select "Edit Profile" to update your information.',
    },
    {
      question: 'How do I search for jobs?',
      answer: 'Use the Jobs tab to browse available positions. You can filter by location, job type, and salary range.',
    },
    {
      question: 'How do I apply for a job?',
      answer: 'Tap on a job listing to view details, then press the "Apply Now" button to submit your application.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Go to Settings > Account > Change Password. Follow the prompts to reset your password.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can reach our support team by emailing support@findrr.com or using the contact form below.',
    },
  ];

  const renderFAQ = (faq: { question: string; answer: string }, index: number) => (
    <View key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <Text className="text-base font-rubik-bold text-gray-900 mb-2">{faq.question}</Text>
      <Text className="text-sm font-rubik text-gray-700">{faq.answer}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-rubik-bold text-gray-900">Help Center</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-bold text-gray-900 mb-2">Welcome to Findrr Help Center</Text>
          <Text className="text-sm font-rubik text-gray-600">
            Find answers to common questions and get the help you need to make the most of Findrr.
          </Text>
        </View>

        {/* Frequently Asked Questions */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-bold text-gray-900 mb-4">Frequently Asked Questions</Text>
          {faqs.map((faq, index) => renderFAQ(faq, index))}
        </View>

        {/* Contact Support */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-bold text-gray-900 mb-4">Contact Support</Text>
          <View className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Text className="text-sm font-rubik-medium text-blue-800 mb-2">Need more help?</Text>
            <Text className="text-sm font-rubik text-blue-700 mb-4">
              Our support team is here to assist you. Reach out to us for personalized help.
            </Text>
            <TouchableOpacity className="bg-blue-600 rounded-lg py-3 px-4 items-center">
              <Text className="text-white font-rubik-medium">Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User Guide */}
        <View className="mb-6">
          <Text className="text-lg font-rubik-bold text-gray-900 mb-4">User Guide</Text>
          <TouchableOpacity className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-2">
            <Text className="text-base font-rubik-medium text-gray-900">Getting Started</Text>
            <Text className="text-sm font-rubik text-gray-600 mt-1">Learn the basics of using Findrr</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-2">
            <Text className="text-base font-rubik-medium text-gray-900">Job Search Tips</Text>
            <Text className="text-sm font-rubik text-gray-600 mt-1">Tips for finding the perfect job</Text>
          </TouchableOpacity>
          <TouchableOpacity className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Text className="text-base font-rubik-medium text-gray-900">Profile Optimization</Text>
            <Text className="text-sm font-rubik text-gray-600 mt-1">Make your profile stand out to employers</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="mb-8 p-4 bg-gray-100 rounded-lg">
          <Text className="text-sm font-rubik text-gray-600 text-center">Findrr v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpCenter;
