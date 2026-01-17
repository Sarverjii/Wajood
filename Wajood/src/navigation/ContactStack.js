import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ContactScreen from '../screen/ContactsStack/ContactScreen';
import ContactDetailScreen from '../screen/ContactsStack/ContactDetailScreen';

const Stack = createNativeStackNavigator();

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactList"
        component={ContactScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{
          title: 'Contact Details',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default ContactStackNavigator;
