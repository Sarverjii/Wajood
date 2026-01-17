import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeStackNavigator from './HomeStack';
import ScanStackNavigator from './ScanStack';
import ProfileScreen from '../screen/ProfileScreen';
import ContactStackNavigator from './ContactStack';
import ApprovalStackNavigator from './ApprovalStack';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          height: 50,
          backgroundColor: '#44536A',
        },

        tabBarActiveTintColor: '#F28C38',
        tabBarInactiveTintColor: '#FFFFFF',

        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Scan') {
            iconName = 'scan-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          } else if (route.name === 'Contact') {
            iconName = 'id-card-outline';
          } else if (route.name === 'Approval') {
            iconName = 'person-add-outline';
          }

          return (
            <View
              style={{
                display: 'flex',
                height: 50,
                marginTop: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name={iconName} size={30} color={color} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Contact" component={ContactStackNavigator} />
      <Tab.Screen name="Scan" component={ScanStackNavigator} />
      <Tab.Screen name="Approval" component={ApprovalStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppTabs;
