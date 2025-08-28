import { createJob, getCurrentUser } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, { Country } from 'react-native-country-picker-modal';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

const PostJob = () => {
  const [currentUserId, setCurrentUserId] = useState('');
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [salaryMode, setSalaryMode] = useState<'single' | 'range'>('single');
  const [salary, setSalary] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const [countryCode, setCountryCode] = useState('');
  const [country, setCountry] = useState<Country | null>(null);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        // Not logged in => redirect to onboarding
        router.push('/Onboarding');
      // } else {
      //   console.log('User is logged in:', user.profile);
        setCompanyName(user.profile.companyName);
        setCurrentUserId(user.id);
        console.log(currentUserId);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (!country) return;

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const response = await fetch(
          'https://countriesnow.space/api/v0.1/countries/cities',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: country.name }),
          }
        );

        const data = await response.json();
        console.log('Cities API response:', data);

        if (data && Array.isArray(data.data)) {
          const mappedCities = data.data.map((c: string) => ({
            label: c,
            value: c,
          }));
          setCities(mappedCities);
        } else {
          console.warn('No cities found for:', country.name);
          setCities([]);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [country]);

  const jobTypeOptions = [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'On-site', value: 'On-site' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Internship', value: 'Internship' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Hybrid', value: 'Hybrid' },
  ];

  const skillOptions = [
    { label: 'React', value: 'React' },
    { label: 'React Native', value: 'React Native' },
    { label: 'Node.js', value: 'Node.js' },
    { label: 'Firebase', value: 'Firebase' },
    { label: 'Appwrite', value: 'Appwrite' },
    { label: 'UI/UX Design', value: 'UI/UX Design' },
    { label: 'Python', value: 'Python' },
    { label: 'Java', value: 'Java' },
  ];

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills([...skills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await createJob({
        title,
        requirements: skills,
        location,
        salary,
        description,
        recruiterId: currentUserId,
        companyName,
        jobType: jobType,
        deadline,
      });

      console.log('Job created:', response);
      setSuccessMessage('Job posted successfully!');
      setTimeout(() => {
        router.push('/(root)/(tabs)');
      }, 2000);
    } catch (error) {
      console.error('Error creating job:', error);
      setSuccessMessage('❌ Failed to post job. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 justify-center pt-4 bg-white">
        {/* Success message */}
        {successMessage ? (
          <TouchableOpacity
            className="bg-green-100 border border-green-400 rounded-xl p-3 sticky top-4 mt-5 z-10 items-center"
            style={{
              width: '90%',
              left: '-50%',
              transform: 'translateX(225%)',
            }}
            onPress={() => setSuccessMessage('')}
          >
            <Text className="text-green-700 font-medium">{successMessage}</Text>
          </TouchableOpacity>
        ) : null}
        <ScrollView
          className="flex-1 px-5 pt-6 relative"
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-1 flex-row items-center'>
            <Ionicons name="arrow-back-circle-outline" size={30} onPress={() => router.back()} />
            <Text className="text-3xl font-rubik-bold text-gray-800 my-6 ml-2 items-center text-center">
              Post a Job
            </Text>
          </View>

          {/* Card wrapper */}
          <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
            <Text className="text-lg font-rubik font-semibold text-gray-700 mb-3">
              Job Details
            </Text>

            <View className="flex-row items-center bg-gray-50 rounded-xl px-3 py-2 mb-3">
              <Ionicons name="briefcase" size={20} color="#6366F1" />
              <TextInput
                placeholder="Job Title"
                value={title}
                onChangeText={setTitle}
                className="flex-1 ml-3 text-gray-700 font-rubik"
              />
            </View>

            <View className="flex-row items-center bg-gray-50 rounded-xl px-3 py-2 mb-3">
              <Ionicons name="business" size={20} color="#6366F1" />
              <TextInput
                placeholder="Company Name"
                value={companyName}
                onChangeText={setCompanyName}
                className="flex-1 ml-3 text-gray-700 font-rubik"
              />
            </View>

            <View className="flex-row items-start bg-gray-50 rounded-xl px-3 py-2">
              <Ionicons
                name="document-text"
                size={20}
                color="#6366F1"
                className="mt-1"
              />
              <TextInput
                placeholder="Job Description"
                value={description}
                onChangeText={setDescription}
                multiline
                className="flex-1 ml-3 text-gray-700 font-rubik"
              />
            </View>
          </View>

          {/* Company Info */}
          <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
            <Text className="text-lg font-rubik font-semibold text-gray-700 mb-3">
              Company Information
            </Text>

            {/* ✅ Location */}
            <View className="bg-gray-50 rounded-xl px-3 py-3 mb-3">
              {/* Country Picker */}
              <View className="flex-row items-center mb-2">
                <Ionicons name="location" size={20} color="#6366F1" />
                <Text className="ml-2 text-gray-700 font-rubik">
                  Select Country
                </Text>
              </View>
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCountryNameButton
                withAlphaFilter
                onSelect={(selected: Country) => {
                  setCountryCode(selected.cca2);
                  setCountry(selected);
                  setCity(null); // reset city when country changes
                }}
              />

              {/* City Dropdown */}
              {country && (
                <View className="mt-4">
                  <Text className="text-gray-700 font-rubik mb-2">
                    Select City
                  </Text>
                  {loadingCities ? (
                    <ActivityIndicator color="#6366F1" size="small" />
                  ) : (
                    <Dropdown
                      style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                      }}
                      placeholderStyle={{ color: '#9CA3AF' }}
                      selectedTextStyle={{ color: '#4F46E5' }}
                      data={cities}
                      labelField="label"
                      valueField="value"
                      placeholder="Choose City"
                      value={city}
                      search
                      searchPlaceholder="Search city..."
                      onChange={(item) => setCity(item.value)}
                    />
                  )}
                </View>
              )}
            </View>
            {/* ✅ Salary Selector */}
            <View className="bg-gray-50 rounded-xl px-3 py-3 mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <Ionicons name="cash" size={20} color="#6366F1" />
                  <Text className="ml-2 text-gray-700 font-rubik">Salary</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    setSalaryMode(salaryMode === 'single' ? 'range' : 'single')
                  }
                  className="bg-blue-50 p-2 rounded-full"
                >
                  <Ionicons name="swap-horizontal" size={20} color="#6366F1" />
                </TouchableOpacity>
              </View>

              {salaryMode === 'single' ? (
                <TextInput
                  placeholder="Enter Salary (e.g. $5000)"
                  value={salary}
                  onChangeText={setSalary}
                  keyboardType="numeric"
                  className="bg-white rounded-lg border border-gray-300 px-3 py-2 text-gray-700 font-rubik"
                />
              ) : (
                <View className="flex-row">
                  <TextInput
                    placeholder="Min Salary"
                    value={minSalary}
                    onChangeText={setMinSalary}
                    keyboardType="numeric"
                    className="flex-1 bg-white rounded-lg border border-gray-300 px-3 py-2 text-gray-700 font-rubik mr-2"
                  />
                  <TextInput
                    placeholder="Max Salary"
                    value={maxSalary}
                    onChangeText={setMaxSalary}
                    keyboardType="numeric"
                    className="flex-1 bg-white rounded-lg border border-gray-300 px-3 py-2 text-gray-700 font-rubik"
                  />
                </View>
              )}
            </View>

            {/* ✅ Job Type Multi-Select */}
            <View className="bg-gray-50 rounded-xl px-3 py-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="time" size={20} color="#6366F1" />
                <Text className="ml-2 text-gray-700 font-rubik">Job Type</Text>
              </View>
              <MultiSelect
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
                placeholderStyle={{ color: '#9CA3AF' }}
                selectedTextStyle={{ color: '#4F46E5' }}
                data={jobTypeOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Job Types"
                search
                searchPlaceholder="Search job types..."
                value={jobTypes}
                onChange={(selected: string[]) => setJobTypes(selected)}
                selectedStyle={{
                  borderRadius: 16,
                  backgroundColor: '#E0E7FF',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              />
            </View>
          </View>

          {/* Additional Info */}
          <View className="bg-white rounded-2xl p-5 shadow-md mb-8">
            <Text className="text-lg font-rubik font-semibold text-gray-700 mb-3">
              Additional Information
            </Text>

            <MultiSelect
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 12,
                padding: 10,
              }}
              placeholderStyle={{ color: '#9CA3AF' }}
              selectedTextStyle={{ color: '#4F46E5' }}
              inputSearchStyle={{ color: '#111827' }}
              iconStyle={{ tintColor: '#6366F1' }}
              data={skillOptions}
              labelField="label"
              valueField="value"
              placeholder="Select Required Skills"
              search
              searchPlaceholder="Search skills..."
              value={skills}
              onChange={(selected: string[]) => setSkills(selected)}
              selectedStyle={{
                borderRadius: 16,
                backgroundColor: '#E0E7FF',
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            />

            {/* ✅ Custom skill input */}
            <View className="flex-row items-center bg-gray-50 rounded-xl px-3 py-2 mt-3">
              <TextInput
                placeholder="Add custom skill"
                value={customSkill}
                onChangeText={setCustomSkill}
                onSubmitEditing={addCustomSkill}
                className="flex-1 ml-3 text-gray-700 font-rubik"
              />
              <TouchableOpacity onPress={addCustomSkill}>
                <Ionicons name="add-circle" size={22} color="#4F46E5" />
              </TouchableOpacity>
            </View>

            {/* ✅ Show selected skills as tags */}
            <View className="flex-row flex-wrap mt-3">
              {skills.map((skill, index) => (
                <View
                  key={index}
                  className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2"
                >
                  <Text className="text-blue-700 font-rubik mr-2">{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(skill)}>
                    <Ionicons name="close-circle" size={18} color="#6366F1" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* ✅ Deadline Date Picker */}
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center bg-gray-50 rounded-xl px-3 py-3 mt-5"
            >
              <Ionicons name="calendar" size={20} color="#6366F1" />
              <Text className="ml-3 text-gray-700 font-rubik">
                {deadline
                  ? deadline.toDateString()
                  : 'Select Application Deadline'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={deadline || new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>

          {/* Modern Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-blue-600 py-4 rounded-2xl shadow-lg mb-12"
          >
            <Text className="text-white text-center font-rubik font-semibold text-lg">
              Submit Job
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PostJob;
