import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: any;
  title: string;
}) => (
  <View className="flex-1 flex flex-col items-center">
    <Ionicons name={icon} size={24} color={focused ? '#0061ff' : '#666876'} />
    <Text
      className={`${focused ? 'font-rubik-medium text-primary-300' : 'font-rubik text-black-200'} text-sm w-full mt-1 text-center`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          borderTopColor: '#0061ff1a',
          borderTopWidth: 1,
          minHeight: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={`${focused ? 'home' : 'home-outline'}`}
              title="Home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Jobs"
        options={{
          title: 'Jobs',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              title="Find Jobs"
              focused={focused}
              icon={`${focused ? 'search' : 'search-outline'}`}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Messages"
        options={{
          title: 'Messages',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={`${focused ? 'chatbubble' : 'chatbubble-outline'}`}
              title="Chats"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Saved"
        options={{
          title: 'Saved',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={`${focused ? 'bookmark' : 'bookmark-outline'}`}
              title="Saved"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={`${focused ? 'person' : 'person-outline'}`}
              title="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;