import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../store/useStore';
import { HomeScreen } from '../screens/HomeScreen';
import { CoinDetailScreen } from '../screens/CoinDetailScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RootStackParamList, TabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="CoinDetail" component={CoinDetailScreen} />
  </Stack.Navigator>
);

const WatchlistStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Watchlist" component={WatchlistScreen} />
    <Stack.Screen name="CoinDetail" component={CoinDetailScreen} />
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => {
  const { theme } = useStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'WatchlistTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: theme === 'dark' ? '#64748b' : '#94a3b8',
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          borderTopColor: theme === 'dark' ? '#334155' : '#e2e8f0',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          shadowColor: theme === 'dark' ? '#000' : '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistStack}
        options={{
          tabBarLabel: 'Watchlist',
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};
