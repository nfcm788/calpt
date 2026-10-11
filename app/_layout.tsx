import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/auth';
import { usePremiumStore } from '@/store/premium';
import * as api from '@/lib/fake-data';

export default function RootLayout() {
  const setUser = useAuthStore(s => s.setUser);
  const initPremium = usePremiumStore(s => s.init);

  useEffect(() => {
    api.getUser().then(user => {
      setUser(user);
      if (user) initPremium(user.id).catch(() => {});
    });
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="tabs" />
        <Stack.Screen
          name="scan"
          options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="paywall"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  );
}
