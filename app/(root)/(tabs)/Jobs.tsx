import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    posted: '2 hours ago',
    logo: require('../../../assets/images/logo.png'),
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    isRemote: true,
    isSaved: false,
    isApplied: false,
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'DesignStudio',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$90,000 - $120,000',
    posted: '1 day ago',
    logo: require('../../../assets/images/logo.png'),
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
    isRemote: false,
    isSaved: true,
    isApplied: false,
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'DataSystems',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    posted: '2 days ago',
    logo: require('../../../assets/images/logo.png'),
    skills: ['Node.js', 'Python', 'AWS', 'Docker'],
    isRemote: true,
    isSaved: false,
    isApplied: true,
  },
  {
    id: 4,
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    posted: '3 days ago',
    logo: require('../../../assets/images/logo.png'),
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
    isRemote: false,
    isSaved: false,
    isApplied: false,
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    posted: '4 days ago',
    logo: require('../../../assets/images/logo.png'),
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    isRemote: true,
    isSaved: true,
    isApplied: false,
  },
];

// Filter options
const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const locations = [
  'All',
  'Remote',
  'San Francisco',
  'New York',
  'Austin',
  'Seattle',
  'Boston',
];

const JobCard = ({
  job,
  onSave,
  onApply,
}: {
  job: (typeof mockJobs)[0];
  onSave: (id: number) => void;
  onApply: (id: number) => void;
}) => (
  <View className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
    {/* Header */}
    <View className="flex-row items-start justify-between mb-4">
      <View className="flex-row items-start flex-1">
        <Image
          source={job.logo}
          className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-50 mr-4"
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text className="text-lg font-rubik-bold text-gray-900 mb-1">
            {job.title}
          </Text>
          <Text className="text-gray-600 font-rubik mb-1">{job.company}</Text>
          <View className="flex-row items-center">
            <Ionicons name="location" size={14} color="#6B7280" />
            <Text className="text-gray-500 text-sm ml-1 font-rubik">
              {job.location}
            </Text>
            {job.isRemote && (
              <View className="bg-green-100 px-2 py-1 rounded-full ml-2">
                <Text className="text-green-800 text-xs font-rubik-medium">
                  Remote
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={() => onSave(job.id)} className="p-2">
        <Ionicons
          name={job.isSaved ? 'bookmark' : 'bookmark-outline'}
          size={20}
          color={job.isSaved ? '#3B82F6' : '#6B7280'}
        />
      </TouchableOpacity>
    </View>

    {/* Job Details */}
    <View className="flex-row justify-between items-center mb-4">
      <View className="flex-row items-center">
        <Ionicons name="time" size={14} color="#6B7280" />
        <Text className="text-gray-500 text-sm ml-1 font-rubik">
          {job.type}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Ionicons name="cash" size={14} color="#6B7280" />
        <Text className="text-gray-500 text-sm ml-1 font-rubik">
          {job.salary}
        </Text>
      </View>
      <Text className="text-gray-400 text-sm font-rubik">{job.posted}</Text>
    </View>

    {/* Skills */}
    <View className="flex-row flex-wrap mb-4">
      {job.skills.map((skill, index) => (
        <View
          key={index}
          className="bg-gray-100 px-3 py-1 rounded-full mr-2 mb-2"
        >
          <Text className="text-gray-700 text-xs font-rubik">{skill}</Text>
        </View>
      ))}
    </View>

    {/* Actions */}
    <View className="flex flex-row gap-5">
      {job.isApplied ? (
        <View className="flex-1 bg-green-100 rounded-xl py-3 items-center">
          <Text className="text-green-800 font-rubik-medium">Applied</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => onApply(job.id)}
          className="flex-1 bg-blue-600 rounded-xl py-3 items-center"
        >
          <Text className="text-white font-rubik-medium">Apply Now</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="bg-gray-100 rounded-xl py-3 px-4 items-center"
        onPress={() => router.push(`/jobs/${job.id}`)}
      >
        <Text className="text-gray-900 font-rubik-medium">View</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FilterPill = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`px-3 py-2 rounded-full mr-2 mb-2 ${
      isActive
        ? 'bg-blue-600 border border-blue-600'
        : 'bg-white border border-gray-300'
    }`}
  >
    <Text
      className={`text-sm font-rubik ${
        isActive ? 'text-white' : 'text-gray-700'
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState(mockJobs);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesJobType =
      selectedJobType === 'All' || job.type === selectedJobType;
    const matchesLocation =
      selectedLocation === 'All' ||
      (selectedLocation === 'Remote'
        ? job.isRemote
        : job.location.includes(selectedLocation));

    return matchesSearch && matchesJobType && matchesLocation;
  });

  const handleSaveJob = (jobId: number) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const handleApplyJob = (jobId: number) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, isApplied: true } : job
      )
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView className="h-full bg-gray-50 pb-14">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-rubik-bold text-gray-900">
            Find Jobs
          </Text>
          <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
            <Ionicons name="notifications-outline" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search jobs, companies, or skills..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 font-rubik text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View className="mb-2">
          <Text className="text-sm font-rubik-medium text-gray-900 mb-2">
            Job Type
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row flex-wrap"
          >
            {jobTypes.map((type) => (
              <FilterPill
                key={type}
                label={type}
                isActive={selectedJobType === type}
                onPress={() => setSelectedJobType(type)}
              />
            ))}
          </ScrollView>
        </View>

        <View className="mb-2">
          <Text className="text-sm font-rubik-medium text-gray-900 mb-2">
            Location
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row flex-wrap"
          >
            {locations.map((location) => (
              <FilterPill
                key={location}
                label={location}
                isActive={selectedLocation === location}
                onPress={() => setSelectedLocation(location)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <JobCard
              job={item}
              onSave={handleSaveJob}
              onApply={handleApplyJob}
            />
          )}
          className="flex-1 px-6 pt-4 pb-14"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3B82F6']}
            />
          }
        />
      ) : (
        // Empty State
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-gray-100 p-6 rounded-full mb-6">
            <Ionicons name="briefcase-outline" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-rubik-bold text-gray-900 mb-2">
            No jobs found
          </Text>
          <Text className="text-gray-600 text-center font-rubik mb-6">
            {searchQuery ||
            selectedJobType !== 'All' ||
            selectedLocation !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Start exploring available opportunities'}
          </Text>
          {(searchQuery ||
            selectedJobType !== 'All' ||
            selectedLocation !== 'All') && (
            <TouchableOpacity
              className="bg-blue-600 rounded-xl px-6 py-3"
              onPress={() => {
                setSearchQuery('');
                setSelectedJobType('All');
                setSelectedLocation('All');
              }}
            >
              <Text className="text-white font-rubik-medium">
                Clear Filters
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results Count */}
      {filteredJobs.length > 0 && (
        <View className="bg-white border-t border-gray-200 px-6 py-3">
          <Text className="text-gray-600 text-sm font-rubik">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Jobs;
