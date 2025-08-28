import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data for messages
const mockConversations = [
  {
    id: 1,
    name: 'TechCorp Recruiter',
    company: 'TechCorp Inc.',
    lastMessage:
      "Hi! We'd like to schedule an interview for the Frontend Developer position.",
    timestamp: '2 hours ago',
    unreadCount: 1,
    avatar: require('../../../assets/images/logo.png'),
    isOnline: true,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    company: 'DesignStudio',
    lastMessage: 'Thanks for applying! When are you available for a call?',
    timestamp: '1 day ago',
    unreadCount: 0,
    avatar: require('../../../assets/images/logo.png'),
    isOnline: false,
  },
  {
    id: 3,
    name: 'Michael Chen',
    company: 'DataSystems',
    lastMessage: "Your application looks great! Let's move forward.",
    timestamp: '2 days ago',
    unreadCount: 3,
    avatar: require('../../../assets/images/logo.png'),
    isOnline: true,
  },
  {
    id: 4,
    name: 'Lisa Rodriguez',
    company: 'InnovateCo',
    lastMessage: "We're impressed with your portfolio.",
    timestamp: '3 days ago',
    unreadCount: 0,
    avatar: require('../../../assets/images/logo.png'),
    isOnline: false,
  },
  {
    id: 5,
    name: 'David Kim',
    company: 'AnalyticsPro',
    lastMessage: 'Looking forward to our interview tomorrow!',
    timestamp: '4 days ago',
    unreadCount: 0,
    avatar: require('../../../assets/images/logo.png'),
    isOnline: false,
  },
];

const ConversationItem = ({
  conversation,
}: {
  conversation: (typeof mockConversations)[0];
}) => (
  <TouchableOpacity
    className="flex-row items-center p-4 border-b border-gray-100 bg-white"
    onPress={() => router.navigate(`/ChatDetail?id=${conversation.id}`)}
  >
    <View className="relative">
      <Image
        source={conversation.avatar}
        className="w-14 h-14 rounded-full border border-gray-200 bg-gray-50 mr-4"
        resizeMode="contain"
      />
      {conversation.isOnline && (
        <View className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </View>

    <View className="flex-1">
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-lg font-rubik-bold text-gray-900">
          {conversation.name}
        </Text>
        <Text className="text-gray-500 text-sm font-rubik">
          {conversation.timestamp}
        </Text>
      </View>

      <Text className="text-gray-600 font-rubik mb-1">
        {conversation.company}
      </Text>

      <View className="flex-row items-center justify-between">
        <Text
          className={`text-sm font-rubik flex-1 mr-2 ${
            conversation.unreadCount > 0
              ? 'text-gray-900 font-rubik-medium'
              : 'text-gray-500'
          }`}
          numberOfLines={1}
        >
          {conversation.lastMessage}
        </Text>

        {conversation.unreadCount > 0 && (
          <View className="bg-blue-600 rounded-full min-w-[20px] h-5 px-1.5 items-center justify-center">
            <Text className="text-white text-xs font-rubik-bold">
              {conversation.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </View>

    <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
  </TouchableOpacity>
);

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations] = useState(mockConversations);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="h-full bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-rubik-bold text-gray-900">Chats</Text>
          <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
            <Ionicons name="ellipsis-horizontal" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 font-rubik text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conversations List */}
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ConversationItem conversation={item} />}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        />
      ) : (
        // Empty State
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-gray-100 p-6 rounded-full mb-6">
            <Ionicons name="chatbubble-outline" size={48} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-rubik-bold text-gray-900 mb-2">
            No messages yet
          </Text>
          <Text className="text-gray-600 text-center font-rubik mb-6">
            Your conversations with recruiters and companies will appear here.
          </Text>
          <Link href="/Jobs" asChild>
            <TouchableOpacity className="bg-blue-600 rounded-xl px-6 py-3">
              <Text className="text-white font-rubik-medium">Browse Jobs</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Messages;
