import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const About = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="items-center mb-6">
          <Image
            source={require('../../../assets/images/logo.png')}
            style={{ width: 120, height: 120, resizeMode: 'contain' }}
          />
          <Text className="text-2xl font-bold mt-4">Findrr</Text>
          <Text className="text-gray-600 mt-2 text-center">
            Findrr is a job search and recruitment platform connecting applicants and recruiters seamlessly.
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Version</Text>
          <Text className="text-gray-700">1.0.CZAW0</Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Contact</Text>
          <Text className="text-gray-700">support@findrr.com</Text>
        </View>

        <View>
          <Text className="text-lg font-semibold mb-2">About Us</Text>
          <Text className="text-gray-700">
            Our mission is to empower job seekers and recruiters by providing a user-friendly platform with powerful tools to find the perfect match.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default About
