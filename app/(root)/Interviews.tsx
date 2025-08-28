import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Interviews = () => {
  return (
    <SafeAreaView className='flex-1 items-center justify-center'>
        <Ionicons name="chevron-back-circle-outline" size={30} color="black" className='absolute top-10 left-4' onPress={() => router.back()} />
      <Text className='text-3xl font-rubik-bold'>Interviews</Text>
      <Text className='italic text-gray-600'>Coming soon...</Text>
    </SafeAreaView>
  )
}

export default Interviews