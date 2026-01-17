// src/navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screen/Authentication/WelcomeScreen';
import LoginScreen from '../screen/Authentication/LoginScreen';
import RegisterScreen from '../screen/Authentication/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WELCOME" component={WelcomeScreen} />
      <Stack.Screen name="LOGIN" component={LoginScreen} />
      <Stack.Screen name="REGISTER" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
