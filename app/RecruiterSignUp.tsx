import {
  createRecruiterAccount,
  getCurrentUser,
  googleLogin,
} from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RecruiterSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    companyWebsite: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        // Already logged in => redirect to homepage
        router.push('/(root)/(tabs)');
      } else {
        // Not logged in => stay on onboarding
        console.log('No active session');
      }
    };

    checkUser();
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Required fields validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.companyName ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (
      formData.companyWebsite &&
      !/^https?:\/\/.+\..+/.test(formData.companyWebsite)
    ) {
      Alert.alert('Error', 'Please enter a valid website URL');
      return false;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { account, recruiter } = await createRecruiterAccount({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
      });
      Alert.alert('Success', 'Recruiter account created successfully!');
      router.push('/(root)/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await googleLogin();
      if (result) {
        router.push('/(root)/(tabs)');
      } else {
        Alert.alert(
          'Error',
          'Failed to sign up with Google. Please try again.'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sign up with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6">
            {/* Header */}
            <View className="items-center mb-8">
              <Image
                source={require('../assets/images/logo-text.png')}
                style={{ width: 200, height: 80, resizeMode: 'contain' }}
              />
              <Text
                className="text-gray-600 text-center mt-2"
                style={{ fontFamily: 'Rubik-Regular' }}
              >
                Create your recruiter account{' '}
                <Link href={'/ApplicantSignUp'}>
                  <Text className="text-blue-600 font-rubik-extrabold">
                    Or applicant account
                  </Text>
                </Link>
              </Text>
            </View>

            {/* Name Fields */}
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-black-300 mb-2 font-rubik-medium">
                  First Name *
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#6B7280"
                    className="mr-3"
                  />
                  <TextInput
                    className="flex-1 text-gray-800"
                    placeholder="First name"
                    placeholderTextColor="#9CA3AF"
                    value={formData.firstName}
                    onChangeText={(text) =>
                      handleInputChange('firstName', text)
                    }
                    autoCapitalize="words"
                    style={{ fontFamily: 'Rubik-Regular' }}
                  />
                </View>
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-black-300 mb-2 font-rubik-medium">
                  Last Name *
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#6B7280"
                    className="mr-3"
                  />
                  <TextInput
                    className="flex-1 text-gray-800"
                    placeholder="Last name"
                    placeholderTextColor="#9CA3AF"
                    value={formData.lastName}
                    onChangeText={(text) => handleInputChange('lastName', text)}
                    autoCapitalize="words"
                    style={{ fontFamily: 'Rubik-Regular' }}
                  />
                </View>
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-black-300 mb-2 font-rubik-medium">
                Email *
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-gray-800"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ fontFamily: 'Rubik-Regular' }}
                />
              </View>
            </View>

            {/* Phone Input (Optional) */}
            <View className="mb-4">
              <Text className="text-black-300 mb-2 font-rubik-medium">
                Phone Number
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-gray-800"
                  placeholder="Phone number (optional)"
                  placeholderTextColor="#9CA3AF"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  keyboardType="phone-pad"
                  style={{ fontFamily: 'Rubik-Regular' }}
                />
              </View>
            </View>

            {/* Company Name */}
            <View className="mb-4">
              <Text className="text-black-300 mb-2 font-rubik-medium">
                Company Name *
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <Ionicons
                  name="business-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-gray-800"
                  placeholder="Company name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.companyName}
                  onChangeText={(text) =>
                    handleInputChange('companyName', text)
                  }
                  autoCapitalize="words"
                  style={{ fontFamily: 'Rubik-Regular' }}
                />
              </View>
            </View>

            {/* Company Website (Optional) */}
            <View className="mb-4">
              <Text className="text-black-300 mb-2 font-rubik-medium">
                Company Website
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-gray-800"
                  placeholder="https://company.com (optional)"
                  placeholderTextColor="#9CA3AF"
                  value={formData.companyWebsite}
                  onChangeText={(text) =>
                    handleInputChange('companyWebsite', text)
                  }
                  keyboardType="url"
                  autoCapitalize="none"
                  style={{ fontFamily: 'Rubik-Regular' }}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-black-300 mb-2 font-rubik-medium">
                Password *
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-black-300"
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  secureTextEntry={!showPassword}
                  style={{ fontFamily: 'Rubik-Regular' }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              <Text
                className="text-gray-500 text-xs mt-1"
                style={{ fontFamily: 'Rubik-Regular' }}
              >
                Must be at least 8 characters
              </Text>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-black-300 mb-2 font-rubik-medium">
                Confirm Password *
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-black-300"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange('confirmPassword', text)
                  }
                  secureTextEntry={!showConfirmPassword}
                  style={{ fontFamily: 'Rubik-Regular' }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
                    }
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Conditions */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                className="w-5 h-5 border-2 border-gray-300 rounded mr-3 items-center justify-center"
                style={{
                  backgroundColor: acceptedTerms ? '#2563EB' : 'transparent',
                }}
              >
                {acceptedTerms && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <Text
                className="flex-1 text-gray-600 text-sm"
                style={{ fontFamily: 'Rubik-Regular' }}
              >
                I agree to the{' '}
                <Text className="text-blue-600">Terms of Service</Text> and{' '}
                <Text className="text-blue-600">Privacy Policy</Text>
              </Text>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`${loading || !acceptedTerms ? 'bg-gray-300' : 'bg-blue-600'} rounded-lg py-4 items-center mb-6`}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  className="text-white font-semibold text-lg"
                  style={{ fontFamily: 'Rubik-SemiBold' }}
                  disabled={loading || !acceptedTerms}
                >
                  Create Recruiter Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text
                className="mx-4 text-gray-500"
                style={{ fontFamily: 'Rubik-Regular' }}
              >
                Or sign up with
              </Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Google Sign Up */}
            <TouchableOpacity
              className="flex-row items-center justify-center border border-gray-300 rounded-lg py-3 mb-6 bg-white"
              onPress={handleGoogleSignUp}
              disabled={loading}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#DB4437"
                className="mr-3"
              />
              <Text
                className={`${loading || !acceptedTerms ? 'text-gray-300' : 'text-black'} font-rubik-medium`}
              >
                Sign up with Google
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center mb-8">
              <Text
                className="text-gray-600"
                style={{ fontFamily: 'Rubik-Regular' }}
              >
                Already have an account?{' '}
              </Text>
              <Link href={'/SignIn'}>
                <Text className="text-blue-600 font-rubik-medium">Sign in</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default RecruiterSignUp;
