import { useGlobalContext } from '@/lib/global-provider';
import { Slot } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppLayout() {
  const { loading, isLogged } = useGlobalContext();

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex items-center justify-center">
        <ActivityIndicator className="text-blue-600" size="large" />
      </SafeAreaView>
    );
  }

  // Redirect to onboarding if user is NOT logged in
  // if (!isLogged) return <Redirect href={'/Onboarding'} />;

  // Show the authenticated app content if user is logged in
  return <Slot />;
}
