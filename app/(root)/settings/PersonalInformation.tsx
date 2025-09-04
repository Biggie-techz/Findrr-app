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
  const { user } = useGlobalContext();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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
      if (data && Array.isArray(data.data)) {
        const mappedCities = data.data.map((c: string) => ({
          label: c,
          value: c,
        }));
        setCities(mappedCities);
      } else {
        setCities([]);
      }
    } catch (error) {
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [country]);

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
      setIsEditing(false);
      setToast({
        visible: true,
        message: 'Profile updated successfully',
        type: 'success',
      });
    } catch (error) {
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
    keyboardType: 'default' | 'email-address' | 'phone-pad' | 'url' = 'default',
    icon?: keyof typeof Ionicons.glyphMap
  ) => (
    <View className="mb-5">
      <View className="mb-3 flex-row items-center">
        {icon && (
          <Ionicons name={icon} size={16} color="#64748B" className="mr-2" />
        )}
        <Text className="text-sm font-rubik-semibold text-slate-700 ">
          {label}
        </Text>
      </View>
      {isEditing ? (
        <View className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
          <TextInput
            className={`px-5 py-4 text-slate-900 font-rubik text-base ${
              multiline ? 'h-24' : 'h-14'
            }`}
            value={formData[field as keyof typeof formData]}
            onChangeText={(value) => handleInputChange(field, value)}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            multiline={multiline}
            keyboardType={keyboardType}
            autoCapitalize="words"
            style={{ textAlignVertical: multiline ? 'top' : 'center' }}
          />
        </View>
      ) : (
        <View className="bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm">
          <Text className="text-slate-900 font-rubik text-base">
            {formData[field as keyof typeof formData] ||
              `No ${label.toLowerCase()} provided`}
          </Text>
        </View>
      )}
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 items-center justify-center">
        <View className="bg-white rounded-3xl p-8 shadow-lg">
          <ActivityIndicator size="large" color="#6366F1" />
          <Text className="text-slate-600 font-rubik-medium mt-4 text-center">
            Loading your profile...
          </Text>
        </View>
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
        <View className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
          <View className="flex-row items-center justify-between px-6 py-5">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center shadow-sm"
            >
              <Ionicons name="arrow-back" size={22} color="#475569" />
            </TouchableOpacity>
            <View className="flex-1 items-center">
              <Text className="text-xl font-rubik-bold text-slate-900">
                Personal Information
              </Text>
              <Text className="text-sm text-slate-500 font-rubik mt-1">
                {user.userType === 'applicant' ? 'Job Seeker' : 'Recruiter'}{' '}
                Profile
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
          {/* Profile Header Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-white/50">
            <View className="items-center mb-4">
              <View className="w-20 h-20 bg-black-100/10 rounded-full items-center justify-center shadow-lg mb-3">
                <Text className="text-black-100 font-rubik-bold text-2xl">
                  {formData.firstName?.[0]?.toUpperCase() ||
                    user.email?.[0]?.toUpperCase() ||
                    'U'}
                </Text>
              </View>
              <Text className="text-xl font-rubik-bold text-slate-900 text-center">
                {formData.firstName && formData.lastName
                  ? `${formData.firstName} ${formData.lastName}`
                  : user.email}
              </Text>
              <Text className="text-slate-500 font-rubik-medium text-center">
                {user.userType === 'applicant' ? 'Job Seeker' : 'Recruiter'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              className={`w-full py-4 rounded-2xl items-center shadow-lg ${
                isEditing
                  ? 'bg-red-500'
                  : 'bg-blue-500'
              }`}
            >
              <Text className="text-white font-rubik-bold text-base">
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Basic Information Section */}
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-white/50">
            <View className="flex-row items-center mb-6">
              <Text className="text-lg font-rubik-bold text-slate-900">
                Basic Information
              </Text>
            </View>

            {renderField(
              'First Name',
              'firstName',
              'Enter your first name',
              false,
              'default',
              'person'
            )}
            {renderField(
              'Last Name',
              'lastName',
              'Enter your last name',
              false,
              'default',
              'person'
            )}
            {renderField(
              'Phone',
              'phone',
              'Enter your phone number',
              false,
              'phone-pad',
              'call'
            )}

            <View className="mb-5">
              <View className="mb-3 flex-row items-center">
                <Ionicons
                  name="mail"
                  size={16}
                  color="#64748B"
                  className="mr-2"
                />
                <Text className="text-sm font-rubik-semibold text-slate-700 ">
                  Email Address
                </Text>
              </View>
              <View className="bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm">
                <Text className="text-slate-900 font-rubik text-base">
                  {user.email}
                </Text>
              </View>
            </View>
          </View>

          {/* Applicant Specific Fields */}
          {user.userType === 'applicant' && (
            <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-white/50">
              <View className="flex-row items-center mb-6">
                <Text className="text-lg font-rubik-bold text-slate-900">
                  Professional Information
                </Text>
              </View>

              <View className="mb-5">
                <Text className="text-sm font-rubik-semibold text-slate-700 mb-3 flex-row items-center">
                  <Ionicons
                    name="location"
                    size={16}
                    color="#64748B"
                    className="mr-2"
                  />
                  Location
                </Text>
                {isEditing ? (
                  <View className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-4">
                    <View className="flex-row items-center mb-3">
                      <Ionicons name="earth" size={20} color="#6366F1" />
                      <Text className="ml-3 text-slate-700 font-rubik-medium">
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

                    {country && (
                      <View className="mt-4">
                        <Text className="text-slate-700 font-rubik-medium mb-2">
                          Select City
                        </Text>
                        {loadingCities ? (
                          <View className="items-center py-4">
                            <ActivityIndicator color="#6366F1" size="small" />
                          </View>
                        ) : (
                          <Dropdown
                            style={{
                              backgroundColor: '#F8FAFC',
                              borderRadius: 16,
                              padding: 12,
                              borderWidth: 2,
                              borderColor: '#E2E8F0',
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.1,
                              shadowRadius: 4,
                              elevation: 3,
                            }}
                            placeholderStyle={{
                              color: '#94A3B8',
                              fontSize: 16,
                            }}
                            selectedTextStyle={{
                              color: '#334155',
                              fontSize: 16,
                              fontWeight: '600',
                            }}
                            data={cities}
                            labelField="label"
                            valueField="value"
                            placeholder="Choose your city"
                            value={city}
                            search
                            searchPlaceholder="Search cities..."
                            onChange={(item: any) => setCity(item.value)}
                          />
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <View className="bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm">
                    <Text className="text-slate-900 font-rubik text-base">
                      {formData.location || 'No location provided'}
                    </Text>
                  </View>
                )}
              </View>

              <View className="mb-5">
                <Text className="text-sm font-rubik-semibold text-slate-700 mb-3 flex-row items-center">
                  <Ionicons
                    name="document"
                    size={16}
                    color="#64748B"
                    className="mr-2"
                  />
                  Resume
                </Text>
                {isEditing ? (
                  <View className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-4">
                    <TextInput
                      className="px-4 py-3 text-slate-900 font-rubik text-base h-14 bg-slate-50 rounded-xl mb-3"
                      value={formData.resume}
                      onChangeText={(value) =>
                        handleInputChange('resume', value)
                      }
                      placeholder="Enter resume URL or upload file"
                      placeholderTextColor="#94A3B8"
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl py-4 items-center shadow-lg"
                      onPress={() => {
                        setToast({
                          visible: true,
                          message: 'File picker coming soon!',
                          type: 'info',
                        });
                      }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="cloud-upload" size={20} color="white" />
                        <Text className="text-white font-rubik-bold text-base ml-2">
                          Upload Resume File
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm">
                    <Text className="text-slate-900 font-rubik text-base">
                      {formData.resume || 'No resume provided'}
                    </Text>
                  </View>
                )}
              </View>

              <View className="mb-5">
                <Text className="text-sm font-rubik-semibold text-slate-700 mb-3 flex-row items-center">
                  <Ionicons
                    name="code"
                    size={16}
                    color="#64748B"
                    className="mr-2"
                  />
                  Skills
                </Text>
                {isEditing ? (
                  <View className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm p-4">
                    <Dropdown
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: 16,
                        padding: 12,
                        borderWidth: 2,
                        borderColor: '#E2E8F0',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                      placeholderStyle={{ color: '#94A3B8', fontSize: 16 }}
                      selectedTextStyle={{
                        color: '#334155',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                      data={skillsList}
                      labelField="label"
                      valueField="value"
                      placeholder="Select your skills"
                      value={
                        selectedSkills.length > 0
                          ? selectedSkills[selectedSkills.length - 1].value
                          : null
                      }
                      search
                      searchPlaceholder="Search skills..."
                      onChange={(item: any) => {
                        const exists = selectedSkills.find(
                          (s) => s.value === item.value
                        );
                        if (exists) {
                          setSelectedSkills(
                            selectedSkills.filter((s) => s.value !== item.value)
                          );
                        } else {
                          setSelectedSkills([...selectedSkills, item]);
                        }
                      }}
                      maxHeight={200}
                    />
                    <Text className="text-slate-700 font-rubik mt-3">
                      Selected: {selectedSkills.map((s) => s.label).join(', ')}
                    </Text>
                  </View>
                ) : (
                  <View className="bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm">
                    <Text className="text-slate-900 font-rubik text-base">
                      {formData.skills || 'No skills provided'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Recruiter Specific Fields */}
          {user.userType === 'recruiter' && (
            <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-white/50">
              <View className="flex-row items-center mb-6">
                <Text className="text-lg font-rubik-bold text-slate-900">
                  Company Information
                </Text>
              </View>

              {renderField(
                'Company Name',
                'companyName',
                'Enter company name',
                false,
                'default',
                'business'
              )}
              {renderField(
                'Company Website',
                'companyWebsite',
                'Enter company website',
                false,
                'url',
                'globe'
              )}
            </View>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <View className="flex-row gap-4 mb-8">
              <TouchableOpacity
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl py-4 items-center shadow-lg"
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark" size={20} color="#666876" />
                    <Text className="text-black-200 font-rubik-bold text-base ml-2">
                      Save Changes
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gradient-to-r from-slate-400 to-slate-500 rounded-2xl py-4 items-center shadow-lg"
                onPress={() => setIsEditing(false)}
                disabled={loading}
              >
                <View className="flex-row items-center">
                  <Ionicons name="close" size={20} color="#F75555" />
                  <Text className="text-danger font-rubik-bold text-base ml-2">
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
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
