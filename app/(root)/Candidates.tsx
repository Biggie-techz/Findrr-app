import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Candidates = () => {
  return (
    <SafeAreaView className='flex-1 items-center justify-center relative'>
      <TouchableOpacity className='absolute left-4 top-10'  onPress={() => router.back()}>
        <Ionicons name="chevron-back-circle-outline" size={30} color="black" />
      </TouchableOpacity>
      <Text className='font-rubik-bold text-3xl'>Candidates</Text>
      <Text className='italic text-gray-600'>Coming soon...</Text>
    </SafeAreaView>
  )
}

export default Candidates