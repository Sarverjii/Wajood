import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MeetingIDScreen from '../screen/MeetingScreen/MeetingIDScreen';
import MeetingRoomScreen from '../screen/MeetingScreen/MeetingRoomScreen';

const Stack = createNativeStackNavigator();

const MeetingStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MeetingID" component={MeetingIDScreen} />

      <Stack.Screen
        name="MeetingRoom"
        component={MeetingRoomScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MeetingStackNavigator;
