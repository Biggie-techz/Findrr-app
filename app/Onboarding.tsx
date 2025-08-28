import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to Findrr',
    description:
      'Discover amazing opportunities and connect with professionals in your field',
    image: require('../assets/images/logo-text.png'),
  },
  {
    id: '2',
    title: 'Find Your Dream Job',
    description:
      'Browse thousands of job listings tailored to your skills and preferences',
    image: require('../assets/images/logo.png'),
  },
  {
    id: '3',
    title: 'Connect & Network',
    description:
      'Build meaningful professional relationships and grow your career network',
    image: require('../assets/images/react-logo.png'),
  },
  {
    id: '4',
    title: 'Get Started Today',
    description:
      'Join our community and take the first step towards your career goals',
    image: require('../assets/images/icon.png'),
  },
];

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const renderItem = ({ item }: { item: (typeof onboardingData)[0] }) => (
    <View className="flex-1 items-center justify-center px-8" style={{ width }}>
      <View className="items-center mb-8">
        <Image
          source={item.image}
          style={{
            width: 200,
            height: 200,
            resizeMode: 'contain',
            marginBottom: 32,
          }}
        />
        <Text className="text-3xl font-rubik-bold text-center text-gray-900 mb-4">
          {item.title}
        </Text>
        <Text className="text-lg font-rubik text-center text-gray-600 leading-6">
          {item.description}
        </Text>
      </View>
    </View>
  );

  const Pagination = () => {
    return (
      <View className="flex-row justify-center items-center mb-8">
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              className="bg-blue-600 rounded-full mx-1"
              style={{
                width: dotWidth,
                height: 8,
                opacity,
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Carousel */}
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
        />

        {/* Pagination */}
        <Pagination />

        {/* Action Buttons */}
        <View className="px-6 pb-8">
          {currentIndex === onboardingData.length - 1 ? (
            // Create Account Button (on last slide)
            <View className="flex flex-row gap-5">
              <TouchableOpacity
                className="bg-blue-600 rounded-lg py-4 items-center flex-1"
                onPress={() => router.push('/ApplicantSignUp')}
              >
                <Text
                  className="text-white font-semibold text-lg"
                  style={{ fontFamily: 'Rubik-SemiBold' }}
                >
                  Create Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-200 rounded-lg py-4 items-center flex-1"
                onPress={() => router.push('/SignIn')}
              >
                <Text
                  className="text-blue-600 font-semibold text-lg"
                  style={{ fontFamily: 'Rubik-SemiBold' }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Skip Button (on other slides)
            <TouchableOpacity
              className="bg-gray-100 rounded-lg py-4 items-center"
              onPress={() => scrollToIndex(onboardingData.length - 1)}
            >
              <Text
                className="text-gray-600 font-semibold text-lg"
                style={{ fontFamily: 'Rubik-SemiBold' }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
