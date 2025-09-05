import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HelpCenter = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

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

  const renderHelpSection = (
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

  const renderFAQ = (faq: { question: string; answer: string }, index: number) => {
    const isExpanded = expandedFAQ === index;
    return (
      <TouchableOpacity
        key={index}
        className="mb-4 p-6 bg-slate-50 rounded-2xl border border-slate-200"
        onPress={() => setExpandedFAQ(isExpanded ? null : index)}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-rubik-bold text-slate-900 flex-1 mr-4">
            {faq.question}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#64748B"
          />
        </View>
        {isExpanded && (
          <Text className="text-sm font-rubik text-slate-700 mt-4 leading-6">
            {faq.answer}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderGuideItem = (title: string, description: string, icon: string) => (
    <TouchableOpacity className="flex-row items-center p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-3">
      <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-4">
        <Ionicons name={icon as any} size={20} color="#3B82F6" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-rubik-bold text-slate-900">{title}</Text>
        <Text className="text-sm font-rubik text-slate-600 mt-1">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
              Help Center
            </Text>
            <Text className="text-sm text-slate-500 font-rubik mt-1">
              Get help and support
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
        {/* Welcome Section */}
        {renderHelpSection(
          'Welcome',
          'help-circle',
          'blue-500',
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="information-circle" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-rubik-bold text-slate-900 mb-1">
                  Findrr Help Center
                </Text>
                <Text className="text-sm text-slate-600 font-rubik">
                  Find answers to common questions and get the help you need
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Frequently Asked Questions */}
        {renderHelpSection(
          'FAQ',
          'help-buoy',
          'emerald-600',
          <View className="p-6">
            {faqs.map((faq, index) => renderFAQ(faq, index))}
          </View>
        )}

        {/* Contact Support */}
        {renderHelpSection(
          'Contact Support',
          'headset',
          'purple-600',
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-purple-100 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="mail" size={24} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-rubik-bold text-slate-900 mb-1">
                  Need more help?
                </Text>
                <Text className="text-sm text-slate-600 font-rubik">
                  Our support team is here to assist you with personalized help
                </Text>
              </View>
            </View>
            <TouchableOpacity className="bg-purple-600 rounded-2xl py-4 px-6 items-center flex-row justify-center">
              <Ionicons name="mail" size={20} color="white" />
              <Text className="text-white font-rubik-bold text-base ml-2">
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User Guide */}
        {renderHelpSection(
          'User Guide',
          'book',
          'orange-500',
          <View className="p-6">
            {renderGuideItem(
              'Getting Started',
              'Learn the basics of using Findrr',
              'rocket'
            )}
            {renderGuideItem(
              'Job Search Tips',
              'Tips for finding the perfect job',
              'search'
            )}
            {renderGuideItem(
              'Profile Optimization',
              'Make your profile stand out to employers',
              'person'
            )}
          </View>
        )}

        {/* App Version */}
        <View className="mb-8">
          <View className="bg-white rounded-3xl border border-white/50 p-6 items-center">
            <View className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center mb-3">
              <Ionicons name="code-working" size={24} color="#64748B" />
            </View>
            <Text className="text-sm font-rubik-bold text-slate-900 mb-1">
              Findrr v1.0.0
            </Text>
            <Text className="text-xs text-slate-500 font-rubik">
              Latest version installed
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpCenter;
