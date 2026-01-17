import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screen/HomeScreen';
import PersonalCodeScreen from '../screen/PersonalCodeScreen';

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
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
