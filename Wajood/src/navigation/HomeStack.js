import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screen/HomeScreen';
import PersonalCodeScreen from '../screen/PersonalCodeScreen';
import MeetingStackNavigator from './MeetingStack';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PersonalCode"
        component={PersonalCodeScreen}
        options={{
          title: 'Personal Code',
        }}
      />

      {/* 👇 MEETING STACK */}
      <Stack.Screen
        name="Meeting"
        component={MeetingStackNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
