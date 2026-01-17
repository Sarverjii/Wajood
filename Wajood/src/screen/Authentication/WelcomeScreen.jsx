import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      {/* Top spaced content */}
      <View style={styles.content}>
        {/* Welcome */}
        <Text style={styles.welcomeText}>Welcome to</Text>

        {/* Logo */}
        <Image
          source={require('../../assets/Logo.jpeg')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* App Name */}
        <Text style={styles.appName}>WAJOOD</Text>
        <Text style={styles.tagline}>your single digital identity</Text>

        {/* Description */}
        <View style={styles.textContainer}>
          <Text style={styles.description}>
            You will never need to create another personal contact source
          </Text>

          <Text style={styles.description}>
            Exchange your Wajood contact with people you meet in 1-click. When
            and where you met gets saved forever
          </Text>

          <Text style={styles.description}>
            All your contacts on Wajood will get auto-updated to reflect only
            their latest contact details
          </Text>

          <Text style={styles.description}>
            Whenever you change your contact details all your contacts on Wajood
            will see your latest info
          </Text>

          <Text style={styles.description}>
            Exchange contacts with many people in a meeting in one click
          </Text>

          <Text
            style={styles.description}
            onPress={() => navigation.navigate('LOGIN')}
          >
            Explore the power of AI to network through your contacts
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LOGIN')}
      >
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#44536A',
    alignItems: 'center',
  },

  /**
   * Pushes content down ~25% of screen height
   */
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: '5%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  welcomeText: {
    color: '#F28C38',
    fontSize: 25,
    marginBottom: 12,
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },

  appName: {
    color: '#F28C38',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 1,
  },

  tagline: {
    color: '#F28C38',
    fontSize: 20,
    marginBottom: 20,
  },

  textContainer: {
    width: '100%',
    alignItems: 'center',
  },

  description: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 14,
    textAlign: 'center',
  },

  button: {
    marginBottom: 30,
    backgroundColor: '#F28C38',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
