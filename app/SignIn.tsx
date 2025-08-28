import {
  emailPasswordLogin,
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

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      console.log('Sign in with:', email, password);
      const result = await emailPasswordLogin(email, password);
      if (result.success) {
        router.push('/(root)/(tabs)');
      } else {
        Alert.alert('Error', 'Failed to sign in. Please try again.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await googleLogin();
    if (result) {
      router.push('/(root)/(tabs)');
    } else {
      Alert.alert('Error', 'Failed to sign in. Please try again.');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 justify-center">
            {/* Header */}
            <View className="items-center mb-8">
              <Image
                source={require('../assets/images/logo-text.png')}
                style={{ width: 200, height: 80, resizeMode: 'contain' }}
              />
              <Text className="text-gray-600 text-center font-rubik">
                Sign in to your account
              </Text>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-black-300 mb-2 font-rubik-medium">
                Email
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-gray-800 font-rubik"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-black-300 mb-2 font-rubik-medium">
                Password
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 bg-white">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-black-300 font-rubik"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
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
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end mb-6">
              <Text className="text-blue-600 font-rubik-medium">
                Forgot password?
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              className="bg-blue-600 rounded-lg py-4 items-center mb-6"
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  className="text-white font-semibold text-lg"
                  style={{ fontFamily: 'Rubik-SemiBold' }}
                >
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6 font-rubik">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500">Or continue with</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity
              className="flex-row items-center justify-center border border-gray-300 rounded-lg py-3 mb-6 bg-white"
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#DB4437"
                className="mr-3"
              />
              <Text className="text-black-300 font-rubik-medium">
                Sign in with Google
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600 font-rubik">
                Don't have an account?{' '}
              </Text>
              <Link href={'/ApplicantSignUp'}>
                <Text className="text-blue-600 font-rubik-medium">
                  Create one
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
