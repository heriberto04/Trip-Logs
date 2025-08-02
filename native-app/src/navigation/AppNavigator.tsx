import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// For now, create placeholder screens - we'll implement these later
import TripsScreen from '../screens/TripsScreen';
import SummaryScreen from '../screens/SummaryScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Icon placeholder - we'll replace with proper icons later
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => (
  <Text style={{ fontSize: 20, color: focused ? '#007AFF' : '#8E8E93' }}>
    {name === 'Trips' && '➕'}
    {name === 'Summary' && '📊'}
    {name === 'History' && '📁'}
    {name === 'Settings' && '⚙️'}
  </Text>
);

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <TabIcon name={route.name} focused={focused} />
          ),
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopColor: '#333',
          },
        })}
      >
        <Tab.Screen 
          name="Trips" 
          component={TripsScreen}
          options={{
            title: 'Trip Logs'
          }}
        />
        <Tab.Screen 
          name="Summary" 
          component={SummaryScreen}
          options={{
            title: 'Summary'
          }}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
          options={{
            title: 'History'
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Settings'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}