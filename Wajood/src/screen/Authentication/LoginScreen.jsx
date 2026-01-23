import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import Config from 'react-native-config';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = React.useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      console.log(
        'Sending POST API Request on : ' +
          `${Config.API_BASE_URL}/api/auth/login`,
      );
      const response = await axios.post(
        `${Config.API_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        },
      );
      const { token, user, message, qrCode } = response.data;
      alert(message || 'Login successful');

      await login(token, user, qrCode);
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Login failed');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Branding */}
        <View style={styles.logoContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>

          <Image
            source={require('../../assets/Logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.appName}>WAJOOD</Text>
          <Text style={styles.tagline}>your single digital identity</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('REGISTER')}
          >
            <Text style={styles.registerText}>
              Don’t have an account?{' '}
              <Text
                style={styles.registerLink}
                onPress={() => {
                  navigation.navigate('REGISTER');
                }}
              >
                Register
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#44536A',
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 30,
  },

  form: {
    width: '100%',
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
  },

  tagline: {
    color: '#F28C38',
    fontSize: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F28C38',
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },

  button: {
    backgroundColor: '#F28C38',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  registerButton: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 50,
  },

  registerText: {
    color: '#FFFFFF',
  },

  registerLink: {
    color: '#F28C38',
    fontWeight: '600',
  },
});

export default LoginScreen;
