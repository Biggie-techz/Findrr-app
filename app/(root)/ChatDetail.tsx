import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock conversation data
const mockMessages: Record<
  number,
  Array<{ id: number; text: string; sender: string; timestamp: string }>
> = {
  1: [
    {
      id: 1,
      text: "Hi! We'd like to schedule an interview for the Frontend Developer position.",
      sender: 'them',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      text: 'That sounds great! When would be a good time?',
      sender: 'me',
      timestamp: '1 hour ago',
    },
    {
      id: 3,
      text: 'How about this Friday at 2 PM?',
      sender: 'them',
      timestamp: '30 minutes ago',
    },
  ],
  2: [
    {
      id: 1,
      text: 'Thanks for applying! When are you available for a call?',
      sender: 'them',
      timestamp: '1 day ago',
    },
    {
      id: 2,
      text: "I'm available anytime this week after 3 PM.",
      sender: 'me',
      timestamp: '20 hours ago',
    },
  ],
  3: [
    {
      id: 1,
      text: "Your application looks great! Let's move forward.",
      sender: 'them',
      timestamp: '2 days ago',
    },
    {
      id: 2,
      text: "Thank you! I'm excited about this opportunity.",
      sender: 'me',
      timestamp: '1 day ago',
    },
  ],
  4: [
    {
      id: 1,
      text: "We're impressed with your portfolio.",
      sender: 'them',
      timestamp: '3 days ago',
    },
    {
      id: 2,
      text: "I appreciate that! I've put a lot of work into it.",
      sender: 'me',
      timestamp: '2 days ago',
    },
  ],
  5: [
    {
      id: 1,
      text: 'Looking forward to our interview tomorrow!',
      sender: 'them',
      timestamp: '4 days ago',
    },
    {
      id: 2,
      text: 'Me too! See you then.',
      sender: 'me',
      timestamp: '3 days ago',
    },
  ],
};

const mockRecruiters: Record<
  number,
  { name: string; company: string; avatar: any; isOnline: boolean }
> = {
  1: {
    name: 'TechCorp Recruiter',
    company: 'TechCorp Inc.',
    avatar: require('../../assets/images/logo.png'),
    isOnline: true,
  },
  2: {
    name: 'Sarah Johnson',
    company: 'DesignStudio',
    avatar: require('../../assets/images/logo.png'),
    isOnline: false,
  },
  3: {
    name: 'Michael Chen',
    company: 'DataSystems',
    avatar: require('../../assets/images/logo.png'),
    isOnline: true,
  },
  4: {
    name: 'Lisa Rodriguez',
    company: 'InnovateCo',
    avatar: require('../../assets/images/logo.png'),
    isOnline: false,
  },
  5: {
    name: 'David Kim',
    company: 'AnalyticsPro',
    avatar: require('../../assets/images/logo.png'),
    isOnline: false,
  },
};

const MessageBubble = ({ message }: { message: any }) => (
  <View
    className={`flex-row mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
  >
    <View
      className={`max-w-[80%] rounded-2xl p-4 ${
        message.sender === 'me'
          ? 'bg-blue-600 rounded-br-md'
          : 'bg-gray-100 rounded-bl-md'
      }`}
    >
      <Text
        className={`text-sm font-rubik ${
          message.sender === 'me' ? 'text-white' : 'text-gray-900'
        }`}
      >
        {message.text}
      </Text>
      <Text
        className={`text-xs mt-1 ${
          message.sender === 'me' ? 'text-blue-200' : 'text-gray-500'
        }`}
      >
        {message.timestamp}
      </Text>
    </View>
  </View>
);

const ChatDetail = () => {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState(mockMessages[Number(id)] || []);
  const [newMessage, setNewMessage] = useState('');

  const recruiter = mockRecruiters[Number(id)];

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        timestamp: 'Just now',
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-white border-t border-gray-200"
    >
      <SafeAreaView className="h-full bg-gray-50">
        {/* Header */}
        <View className="bg-white border-b px-6 py-4 border-gray-200 flex-row items-center">
          <TouchableOpacity
            className="mr-2"
            onPress={() => router.navigate('/Messages')}
          >
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="relative mr-4">
            <Image
              source={recruiter.avatar}
              className="w-12 h-12 rounded-full border border-gray-200 bg-gray-50"
              resizeMode="contain"
            />
            {recruiter.isOnline && (
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </View>

          <View className="flex-1">
            <Text className="text-lg font-rubik-bold text-gray-900">
              {recruiter.name}
            </Text>
            <Text className="text-gray-600 font-rubik">
              {recruiter.company}
            </Text>
          </View>

          <TouchableOpacity className="p-2">
            <Ionicons name="call-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MessageBubble message={item} />}
          className="flex-1 px-6 py-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View className="flex-row items-center">
          <TextInput
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 font-rubik text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity
            onPress={sendMessage}
            className="ml-3 bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center"
            disabled={!newMessage.trim()}
          >
            <Ionicons
              name="send"
              size={20}
              color={newMessage.trim() ? 'white' : '#9CA3AF'}
              style={{
                transform: 'rotateZ(-35deg)',
              }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatDetail;
