import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ScanScreen from '../screen/ScanStack/ScanScreen';
import SaveContactScreen from '../screen/ScanStack/SaveContactScreen';

const Stack = createNativeStackNavigator();

const ScanStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScanMain" component={ScanScreen} />
      <Stack.Screen name="SaveContact" component={SaveContactScreen} />
    </Stack.Navigator>
  );
};

export default ScanStackNavigator;
