import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AnimatedSplashScreen } from '@/src/components/AnimatedSplashScreen';
import { ToastProvider } from '@/src/context/ToastContext';
import NetInfo from '@react-native-community/netinfo';
import { useAppStore } from '@/src/store/useAppStore';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'auth',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [showSplash, setShowSplash] = useState(true);
  const syncWithCloud = useAppStore((state) => state.syncWithCloud);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // Sembunyikan splash native bawaan OS agar animasi kustom kita langsung mengambil alih
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Listener Koneksi Internet: Saat online kembali, sinkronkan otomatis background logs
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) {
        syncWithCloud().catch(() => {});
      }
    });

    return () => unsubscribe();
  }, [syncWithCloud]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <RootLayoutNav />
      {showSplash && <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />}
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ToastProvider>
    </ThemeProvider>
  );
}
