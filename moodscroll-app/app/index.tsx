import { useRouter, useNavigationContainerRef } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Small timeout lets RootLayout mount before redirect
    const timeout = setTimeout(() => {
      router.replace('/onboarding/MoodCheckScreen');
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View>
      <Text>Redirecting...</Text>
    </View>
  );
}
