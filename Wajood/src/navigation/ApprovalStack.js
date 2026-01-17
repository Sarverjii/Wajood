import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ApprovalScreen from '../screen/ApprovalScreen/ApprovalScreen';
import SaveApprovalScreen from '../screen/ApprovalScreen/SaveApprovalScreen';
import ShareApprovalScreen from '../screen/ApprovalScreen/ShareApprovalScreen';

const Stack = createNativeStackNavigator();

const ApprovalStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main approval landing */}
      <Stack.Screen name="ApprovalHome" component={ApprovalScreen} />

      {/* Sub screens */}
      <Stack.Screen name="SaveApproval" component={SaveApprovalScreen} />
      <Stack.Screen name="ShareApproval" component={ShareApprovalScreen} />
    </Stack.Navigator>
  );
};

export default ApprovalStackNavigator;
