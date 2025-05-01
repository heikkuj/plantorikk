import { useAuth } from '@/provider/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

// Simple stack layout within the authenticated area
const StackLayout = () => {
  const { signOut } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f0f0f',
        },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="list"
        options={{
          headerTitle: 'My Files',
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <Ionicons name="log-out-outline" size={30} color={'#fff'} />
            </TouchableOpacity>
          ),
        }}
      ></Stack.Screen>
    </Stack>
  )
}

export default StackLayout