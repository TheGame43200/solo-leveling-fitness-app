import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Chrome as Home, CreditCard as CustomTraining, ChartLine as LineChart, User as UserIcon, Play } from 'lucide-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#0f1221',
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
            paddingBottom: 10,
          },
          tabBarActiveTintColor: '#a855f7',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: '#0f1221',
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            color: '#fff',
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            headerTitle: 'Solo Fitness',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="custom-training"
          options={{
            title: 'Personnalisé',
            tabBarIcon: ({ color, size }) => (
              <CustomTraining size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="start"
          options={{
            title: '',
            tabBarButton: () => (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push('/training/session')}
              >
                <View style={styles.startButtonInner}>
                  <Play size={24} color="#fff" style={styles.startIcon} />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progrès',
            tabBarIcon: ({ color, size }) => (
              <LineChart size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => (
              <UserIcon size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  startButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7e22ce',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  startIcon: {
    marginLeft: 3, // Adjusted to center the Play icon
  }
});