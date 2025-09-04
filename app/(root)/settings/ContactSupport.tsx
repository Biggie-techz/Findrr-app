import { Ionicons } from '@expo/vector-icons'
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="bg-white px-6 py-6 border-b border-gray-200">
          <View className="flex-row items-center">
            <View className="bg-blue-100 p-3 rounded-full mr-4">
              <Ionicons name="headset" size={24} color="#3B82F6" />
            </View>
            <View>
              <Text className="text-2xl font-rubik-bold text-gray-900">
                Contact Support
              </Text>
              <Text className="text-gray-600 font-rubik mt-1">
                We're here to help you
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View className="px-6 py-6">
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-rubik-bold text-gray-900 mb-2">
              Need immediate help?
            </Text>
            <Text className="text-gray-600 font-rubik mb-3">
              Our support team is available 24/7 to assist you with any questions or issues.
            </Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="mail" size={16} color="#6B7280" />
              <Text className="text-gray-600 font-rubik ml-2">
                support@findrr.com
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call" size={16} color="#6B7280" />
              <Text className="text-gray-600 font-rubik ml-2">
                1-800-FINDRR
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Form */}
        <View className="px-6">
          <Text className="text-xl font-rubik-bold text-gray-900 mb-6">
            Send us a message
          </Text>

          <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            {/* Name Field */}
            <View className="mb-4">
              <Text className="text-gray-700 font-rubik-medium mb-2">
                Full Name *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 font-rubik text-gray-900"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-gray-700 font-rubik-medium mb-2">
                Email Address *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 font-rubik text-gray-900"
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Subject Field */}
            <View className="mb-4">
              <Text className="text-gray-700 font-rubik-medium mb-2">
                Subject *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 font-rubik text-gray-900"
                placeholder="What's this about?"
                value={formData.subject}
                onChangeText={(value) => handleInputChange('subject', value)}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Message Field */}
            <View className="mb-6">
              <Text className="text-gray-700 font-rubik-medium mb-2">
                Message *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 font-rubik text-gray-900"
                placeholder="Please describe your issue or question in detail..."
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
                style={{ minHeight: 120 }}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`bg-blue-600 rounded-lg py-4 px-6 ${isSubmitting ? 'opacity-50' : ''}`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text className="text-white text-center font-rubik-bold text-lg">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View className="px-6 py-6">
          <Text className="text-xl font-rubik-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </Text>

          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
            <Text className="font-rubik-bold text-gray-900 mb-2">
              How quickly will I receive a response?
            </Text>
            <Text className="text-gray-600 font-rubik">
              We typically respond within 24 hours during business days.
            </Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
            <Text className="font-rubik-bold text-gray-900 mb-2">
              What information should I include?
            </Text>
            <Text className="text-gray-600 font-rubik">
              Please provide as much detail as possible about your issue, including any error messages and steps to reproduce.
            </Text>
          </View>

          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <Text className="font-rubik-bold text-gray-900 mb-2">
              Can I call for immediate support?
            </Text>
            <Text className="text-gray-600 font-rubik">
              Yes, our phone support is available 24/7 at 1-800-FINDRR.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ContactSupport
