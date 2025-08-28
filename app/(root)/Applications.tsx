import { Link } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Applications() {
  return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Link
          href="/(root)/(tabs)"
          className="absolute top-10 left-4 p-2 bg-gray-200 rounded-full"
        >
          <Text>Back</Text>
        </Link>
        <Text className="text-2xl font-rubik-bold text-gray-900">
          Applications
        </Text>
        <Text className="text-gray-600 font-rubik mt-2">
          Your job applications will appear here
        </Text>
      </SafeAreaView>
  );
}
