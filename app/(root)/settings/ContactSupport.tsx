import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '../../../lib/global-provider'

const ContactSupport = () => {
  const { user } = useGlobalContext()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call

      Alert.alert(
        'Success',
        'Your message has been sent successfully! We will get back to you within 24 hours.',
        [{ text: 'OK' }]
      )

      // Clear form after successful submission
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: '',
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderContactSection = (
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
              Contact Support
            </Text>
            <Text className="text-sm text-slate-500 font-rubik mt-1">
              We're here to help you
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
        {/* Contact Info */}
        {renderContactSection(
          'Get in Touch',
          'chatbubbles',
          'blue-500',
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center mr-4">
                <Ionicons name="information-circle" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-rubik-bold text-slate-900 mb-1">
                  Need immediate help?
                </Text>
                <Text className="text-sm text-slate-600 font-rubik">
                  Our support team is available 24/7 to assist you with any questions or issues.
                </Text>
              </View>
            </View>
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 bg-green-100 rounded-xl items-center justify-center mr-3">
                <Ionicons name="mail" size={16} color="#10B981" />
              </View>
              <Text className="text-slate-700 font-rubik-medium">
                support@findrr.com
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-blue-100 rounded-xl items-center justify-center mr-3">
                <Ionicons name="call" size={16} color="#3B82F6" />
              </View>
              <Text className="text-slate-700 font-rubik-medium">
                1-800-FINDRR
              </Text>
            </View>
          </View>
        )}

        {/* Contact Form */}
        {renderContactSection(
          'Send a Message',
          'send',
          'emerald-600',
          <View className="p-6">
            {/* Name Field */}
            <View className="mb-6">
              <Text className="text-sm font-rubik-bold text-slate-700 mb-3">
                Full Name *
              </Text>
              <TextInput
                className="border border-slate-300 rounded-2xl px-4 py-4 font-rubik text-slate-900 bg-white h-14"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Email Field */}
            <View className="mb-6">
              <Text className="text-sm font-rubik-bold text-slate-700 mb-3">
                Email Address *
              </Text>
              <TextInput
                className="border border-slate-300 rounded-2xl px-4 py-4 font-rubik text-slate-900 bg-white h-14"
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Subject Field */}
            <View className="mb-6">
              <Text className="text-sm font-rubik-bold text-slate-700 mb-3">
                Subject *
              </Text>
              <TextInput
                className="border border-slate-300 rounded-2xl px-4 py-4 font-rubik text-slate-900 bg-white h-14"
                placeholder="What's this about?"
                value={formData.subject}
                onChangeText={(value) => handleInputChange('subject', value)}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Message Field */}
            <View className="mb-8">
              <Text className="text-sm font-rubik-bold text-slate-700 mb-3">
                Message *
              </Text>
              <TextInput
                className="border border-slate-300 rounded-2xl px-4 py-4 font-rubik text-slate-900 bg-white"
                placeholder="Please describe your issue or question in detail..."
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#94A3B8"
                style={{ minHeight: 120 }}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`bg-emerald-600 rounded-3xl py-4 px-6 items-center flex-row justify-center ${
                isSubmitting ? 'opacity-50' : ''
              }`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View className="flex-row items-center">
                  <Ionicons name="time" size={20} color="white" />
                  <Text className="text-white font-rubik-bold text-base ml-2">
                    Sending...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Ionicons name="send" size={20} color="white" />
                  <Text className="text-white font-rubik-bold text-base ml-2">
                    Send Message
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* FAQ Section */}
        {renderContactSection(
          'Frequently Asked Questions',
          'help-circle',
          'purple-600',
          <View className="p-6">
            <View className="mb-4">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-purple-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="time" size={16} color="#8B5CF6" />
                </View>
                <Text className="text-base font-rubik-bold text-slate-900">
                  How quickly will I receive a response?
                </Text>
              </View>
              <Text className="text-sm text-slate-600 font-rubik ml-11">
                We typically respond within 24 hours during business days.
              </Text>
            </View>

            <View className="mb-4">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-purple-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="document-text" size={16} color="#8B5CF6" />
                </View>
                <Text className="text-base font-rubik-bold text-slate-900">
                  What information should I include?
                </Text>
              </View>
              <Text className="text-sm text-slate-600 font-rubik ml-11">
                Please provide as much detail as possible about your issue, including any error messages and steps to reproduce.
              </Text>
            </View>

            <View className="mb-0">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-purple-100 rounded-xl items-center justify-center mr-3">
                  <Ionicons name="call" size={16} color="#8B5CF6" />
                </View>
                <Text className="text-base font-rubik-bold text-slate-900">
                  Can I call for immediate support?
                </Text>
              </View>
              <Text className="text-sm text-slate-600 font-rubik ml-11">
                Yes, our phone support is available 24/7 at 1-800-FINDRR.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ContactSupport
