import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Job = () => {
  const { id } = useLocalSearchParams();

  // Mock job details - in a real app, this would come from an API
  const jobDetails = {
    id: id,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    type: 'Full-time',
    experience: '5+ years',
    posted: '2 days ago',
    description:
      'We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for building and maintaining high-quality web applications using modern technologies.',
    requirements: [
      '5+ years of experience with React.js',
      'Strong knowledge of TypeScript',
      'Experience with state management libraries (Redux, Zustand)',
      'Familiarity with modern build tools and CI/CD pipelines',
      'Excellent problem-solving skills',
    ],
    benefits: [
      'Health, dental, and vision insurance',
      '401(k) matching',
      'Flexible work hours',
      'Remote work options',
      'Professional development budget',
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-10">
            <TouchableOpacity
              className="p-2 rounded-full bg-gray-100"
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="text-2xl font-rubik-bold text-gray-900">
              {jobDetails.title}
            </Text>
            <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
              <Ionicons name="bookmark-outline" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="business" size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2 font-rubik">
              {jobDetails.company}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2 font-rubik">
              {jobDetails.location}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="cash" size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2 font-rubik">
              {jobDetails.salary}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="time" size={16} color="#6B7280" />
            <Text className="text-gray-600 ml-2 font-rubik">
              Posted {jobDetails.posted}
            </Text>
          </View>
        </View>

        {/* Job Details */}
        <View className="px-6 py-6">
          {/* Job Type and Experience */}
          <View className="flex-row mb-6">
            <View className="bg-blue-100 px-4 py-2 rounded-full mr-3">
              <Text className="text-blue-600 font-rubik-medium">
                {jobDetails.type}
              </Text>
            </View>
            <View className="bg-green-100 px-4 py-2 rounded-full">
              <Text className="text-green-600 font-rubik-medium">
                {jobDetails.experience} experience
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-gray-900 mb-3">
              Job Description
            </Text>
            <Text className="text-gray-600 font-rubik leading-6">
              {jobDetails.description}
            </Text>
          </View>

          {/* Requirements */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-gray-900 mb-3">
              Requirements
            </Text>
            {jobDetails.requirements.map((requirement, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="#10B981"
                  className="mt-1 mr-2"
                />
                <Text className="text-gray-600 font-rubik flex-1">
                  {requirement}
                </Text>
              </View>
            ))}
          </View>

          {/* Benefits */}
          <View className="mb-6">
            <Text className="text-lg font-rubik-bold text-gray-900 mb-3">
              Benefits
            </Text>
            {jobDetails.benefits.map((benefit, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Ionicons
                  name="star"
                  size={16}
                  color="#F59E0B"
                  className="mt-1 mr-2"
                />
                <Text className="text-gray-600 font-rubik flex-1">
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          {/* Apply Button */}
          <TouchableOpacity className="bg-blue-600 rounded-xl py-4 px-6 items-center">
            <Text className="text-white text-lg font-rubik-bold">
              Apply Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Job;
