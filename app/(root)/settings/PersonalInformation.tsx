import Toast from '@/components/Toast';
import { updateUserProfile } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

const PersonalInformation = () => {
  const { user, refetch } = useGlobalContext();
  console.log(user);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    resume: '',
    skills: '',
    companyName: '',
    companyWebsite: '',
  });

  const [countryCode, setCountryCode] = useState<string>('');
  const [country, setCountry] = useState<any | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<
    { label: string; value: string }[]
  >([]);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const skillsList = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'React', value: 'react' },
    { label: 'Node.js', value: 'nodejs' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
    { label: 'SQL', value: 'sql' },
    { label: 'HTML/CSS', value: 'htmlcss' },
  ];

  const fetchCities = async () => {
    if (!country) return;
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

  useEffect(() => {
    fetchCities();
  }, [country]);

  useEffect(() => {
    if (user?.profile?.personalInformation) {
      const parsedProfile =
        typeof user.profile.personalInformation === 'string'
          ? JSON.parse(user.profile.personalInformation)
          : user.profile.personalInformation;
      setFormData({
        firstName: parsedProfile.firstName || user.profile.firstName || '',
        lastName: parsedProfile.lastName || user.profile.lastName || '',
        phone: parsedProfile.phone || user.profile.phone || '',
        location: parsedProfile.location || user.profile.location || '',
        resume: parsedProfile.resume || user.profile.resume || '',
        skills: parsedProfile.skills || user.profile.skills || '',
        companyName: parsedProfile.companyName || '',
        companyWebsite: parsedProfile.companyWebsite || '',
      });
      if (parsedProfile.skills) {
        const skills = parsedProfile.skills
          .split(', ')
          .map((s: string) => s.trim());
        setSelectedSkills(
          skillsList.filter(
            (skill) =>
              skills.includes(skill.label) || skills.includes(skill.value)
          )
        );
      }
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

    setLoading(true);
    try {
      const personalInformation: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      if (user.userType === 'applicant') {
        const location = city && country ? `${city}, ${country.name}` : '';
        setFormData((prev) => ({ ...prev, location }));
        personalInformation.location = location;
        personalInformation.resume = formData.resume;
        const skills = selectedSkills.map((s) => s.label).join(', ');
        setFormData((prev) => ({ ...prev, skills }));
        personalInformation.skills = skills;
      } else if (user.userType === 'recruiter') {
        personalInformation.companyName = formData.companyName;
        personalInformation.companyWebsite = formData.companyWebsite;
      }

      await updateUserProfile(user.$id, user.userType, {
        personalInformation: JSON.stringify(personalInformation),
      });
      await refetch(); // Refresh user data
      setIsEditing(false);
      setToast({
        visible: true,
        message: 'Profile updated successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({
        visible: true,
        message: 'Failed to update profile. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    field: string,
    placeholder: string,
    multiline = false,
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'url' = 'default'
  ) => (
    <View className="mb-4">
      <Text className="text-sm font-rubik-medium text-gray-700 mb-2">
        {label}
      </Text>
      {isEditing ? (
        <TextInput
          className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-rubik ${
            multiline ? 'h-20' : 'h-12'
          } ${formData[field as keyof typeof formData] ? 'bg-green-100' : 'bg-white'}`}
          value={formData[field as keyof typeof formData]}
          onChangeText={(value) => handleInputChange(field, value)}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize="words"
        />
      ) : (
        <View className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
          <Text className="text-gray-900 font-rubik">
            {formData[field as keyof typeof formData] ||
              `No ${label.toLowerCase()} provided`}
          </Text>
        </View>
      )}
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
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-rubik-bold text-gray-900">
            Personal Information
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-6 py-6"
          showsVerticalScrollIndicator={false}
        >
          {/* Basic Information */}
          <View className="mb-6">
            <View className='flex items-center justify-between flex-row mb-4'>
              <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
                Basic Information
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
            {renderField('First Name', 'firstName', 'Enter your first name')}
            {renderField('Last Name', 'lastName', 'Enter your last name')}
            {renderField(
              'Phone',
              'phone',
              'Enter your phone number',
              false,
              'phone-pad'
            )}
            <View className="mb-4">
              <Text className="text-sm font-rubik-medium text-gray-700 mb-2">
                Email
              </Text>
              <View className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                <Text className="text-gray-900 font-rubik">{user.email}</Text>
              </View>
            </View>
          </View>

          {/* Applicant Specific Fields */}
          {user.userType === 'applicant' && (
            <View className="mb-6">
              <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
                Professional Information
              </Text>
              <View className="mb-4">
                <Text className="text-sm font-rubik-medium text-gray-700 mb-2">
                  Location
                </Text>
                {isEditing ? (
                  <View className="bg-gray-50 rounded-xl px-3 py-3">
                    {/* Country Picker */}
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="location" size={20} color="#6366F1" />
                      <Text className="ml-2 text-gray-700 font-rubik">
                        Select Country
                      </Text>
                    </View>
                    <CountryPicker
                      countryCode={countryCode as any}
                      withFilter
                      withFlag
                      withCountryNameButton
                      withAlphaFilter
                      onSelect={(selected: any) => {
                        setCountryCode(selected.cca2);
                        setCountry(selected);
                        setCity(null);
                        fetchCities();
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
                            onChange={(item: any) => setCity(item.value)}
                          />
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <View className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                    <Text className="text-gray-900 font-rubik">
                      {formData.location || 'No location provided'}
                    </Text>
                  </View>
                )}
              </View>
              <View className="mb-4">
                <Text className="text-sm font-rubik-medium text-gray-700 mb-2">
                  Resume
                </Text>
                {isEditing ? (
                  <View className="bg-gray-50 rounded-xl px-3 py-3">
                    <TextInput
                      className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-rubik h-12 mb-2 ${formData.resume ? 'bg-green-100' : 'bg-white'}`}
                      value={formData.resume}
                      onChangeText={(value) =>
                        handleInputChange('resume', value)
                      }
                      placeholder="Enter resume URL or upload file"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      className="bg-blue-600 rounded-lg py-3 items-center"
                      onPress={() => {
                        // TODO: Implement file picker
                        setToast({
                          visible: true,
                          message: 'File picker not implemented yet',
                          type: 'info',
                        });
                      }}
                    >
                      <Text className="text-white font-rubik-medium">
                        Upload Resume File
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                    <Text className="text-gray-900 font-rubik">
                      {formData.resume || 'No resume provided'}
                    </Text>
                  </View>
                )}
              </View>
              <View className="mb-4">
                <Text className="text-sm font-rubik-medium text-gray-700 mb-2">
                  Skills
                </Text>
                {isEditing ? (
                  <View className="bg-gray-50 rounded-xl px-3 py-3">
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
                      data={skillsList}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Skills"
                      value={selectedSkills.map((s) => s.value)}
                      search
                      searchPlaceholder="Search skills..."
                      onChange={(item: any) => {
                        const exists = selectedSkills.find(s => s.value === item.value);
                        if (exists) {
                          setSelectedSkills(selectedSkills.filter(s => s.value !== item.value));
                        } else {
                          setSelectedSkills([...selectedSkills, item]);
                        }
                      }}
                    />
                    <Text className="text-gray-700 font-rubik mt-2">
                      Selected: {selectedSkills.map((s) => s.label).join(', ')}
                    </Text>
                  </View>
                ) : (
                  <View className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                    <Text className="text-gray-900 font-rubik">
                      {formData.skills || 'No skills provided'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Recruiter Specific Fields */}
          {user.userType === 'recruiter' && (
            <View className="mb-6">
              <Text className="text-lg font-rubik-bold text-gray-900 mb-4">
                Company Information
              </Text>
              {renderField('Company Name', 'companyName', 'Enter company name')}
              {renderField(
                'Company Website',
                'companyWebsite',
                'Enter company website',
                false,
                'url'
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

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </SafeAreaView>
  );
};

export default PersonalInformation;
