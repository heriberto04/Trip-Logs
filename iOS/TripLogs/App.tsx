/**
 * Trip Logs - iOS Native App
 * Converted from Next.js Web App
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TripsProvider } from './src/contexts/TripsContext';
import { TripsScreen } from './src/screens/TripsScreen';
import { SummaryScreen } from './src/screens/SummaryScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <TripsProvider>
        <NavigationContainer>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: '#8E8E93',
              headerStyle: {
                backgroundColor: isDarkMode ? '#1C1C1E' : '#F9F9F9',
              },
              headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
              tabBarStyle: {
                backgroundColor: isDarkMode ? '#1C1C1E' : '#F9F9F9',
              },
            }}
          >
            <Tab.Screen 
              name="Trips" 
              component={TripsScreen}
              options={{
                title: 'Trip Logs',
                tabBarLabel: 'Trips',
              }}
            />
            <Tab.Screen 
              name="Summary" 
              component={SummaryScreen}
              options={{
                title: 'Summary',
                tabBarLabel: 'Summary',
              }}
            />
            <Tab.Screen 
              name="History" 
              component={HistoryScreen}
              options={{
                title: 'History',
                tabBarLabel: 'History',
              }}
            />
            <Tab.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{
                title: 'Settings',
                tabBarLabel: 'Settings',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </TripsProvider>
    </SafeAreaProvider>
  );
}

export default App;
