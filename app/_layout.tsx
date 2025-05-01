// import { Stack } from 'expo-router';

// export default function RootLayout() {
//   return (
//     <Stack>
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       <Stack.Screen name="+not-found" />
//     </Stack>
//   );
// }

import { AuthProvider, useAuth } from '@/provider/AuthProvider';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

// Makes sure the user is authenticated before accessing protected pages
const InitialLayout = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    // Check if the path/url is in the (auth) group
    const inAuthGroup = segments[0] === '(auth)';

    if (session && !inAuthGroup) {
      // Redirect authenticated users to the list page
      router.replace('/list')
    } else if (!session) {
      // Redirect unauthenticated users to the login page
      router.replace('/')
    }
  }, [session, initialized])

  return <Slot />
}

// Wrap the app with the AuthProvider
const RootLayout = () => {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  )
}

export default RootLayout
