import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const About = () => {
  return (
    <SafeAreaView className="flex-1">
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
              About
            </Text>
            <Text className="text-sm text-slate-500 font-rubik mt-1">
              Learn more about Findrr
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
        <View className="items-center mb-6">
          <Image
            source={require('../../../assets/images/logo.png')}
            style={{ width: 120, height: 120, resizeMode: 'contain' }}
          />
          <Text className="text-base text-slate-700 text-center max-w-xs">
            Findrr is a job search and recruitment platform connecting applicants and recruiters seamlessly.
          </Text>
        </View>

        <View className="mb-6 bg-white rounded-3xl p-6 border border-white/50">
          <Text className="text-lg font-rubik-bold mb-2 text-slate-900">Version</Text>
          <Text className="text-slate-700">1.0.CZAW0</Text>
        </View>

        <View className="mb-6 bg-white rounded-3xl p-6 border border-white/50">
          <Text className="text-lg font-rubik-bold mb-2 text-slate-900">Contact</Text>
          <Text className="text-slate-700">support@findrr.com</Text>
        </View>

        <View className="bg-white rounded-3xl p-6 border border-white/50">
          <Text className="text-lg font-rubik-bold mb-2 text-slate-900">About Us</Text>
          <Text className="text-slate-700">
            Our mission is to empower job seekers and recruiters by providing a user-friendly platform with powerful tools to find the perfect match.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default About
