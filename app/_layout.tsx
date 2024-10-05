import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Text } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import React from 'react';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [isAuthChecked, setIsAuthChecked] = useState(false); // Check if auth is verified
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const router = useRouter();
  const segments = useSegments();

  // Fallback UI while waiting for authentication and fonts
  const renderFallback = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text>Loading...</Text>
    </View>
  );

  // Check for authentication in AsyncStorage
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const username = await AsyncStorage.getItem('Username');
        const password = await AsyncStorage.getItem('Password');

        if (username && password) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error checking authentication', err);
      } finally {
        setIsAuthChecked(true); // Mark authentication as checked
      }
    };

    checkAuthentication();
  }, [segments]);

  // Redirect to login if not authenticated and trying to access a protected route
  useEffect(() => {
    if (isAuthChecked && !isAuthenticated && segments[0] !== 'login') {
      router.replace('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthChecked, isAuthenticated, segments, router]);

  // Catch any font loading errors
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide splash screen when fonts are loaded and authentication is checked
  useEffect(() => {
    if (loaded && isAuthChecked) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAuthChecked]);

  // If fonts or auth checks aren't done yet, show fallback loading
  if (!loaded || !isAuthChecked) {
    return renderFallback();
  }

  return <RootLayoutNav isAuthenticated={isAuthenticated} />;
}

function RootLayoutNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}> {/* Globally hide header */}
        {/* Show login page only when user is not authenticated */}
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name="login" options={{ headerShown: false }} />
        )}
      </Stack>
    </ThemeProvider>
  );
}
