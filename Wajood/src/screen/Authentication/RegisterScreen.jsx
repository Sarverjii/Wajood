import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const RegisterScreen = () => {
  const navigation = useNavigation();

  // Required
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  // Optional
  const [company, setCompany] = useState('');
  const [designation, setDesignation] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    const payload = {
      name,
      email,
      mobile,
      password,
      company: company || '',
      designation: designation || '',
      linkedinProfile: linkedinProfile || '',
      companyWebsite: companyWebsite || '',
    };

    try {
      const response = await axios.post(
        'http://10.0.2.2:3000/api/auth/register',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Register success:', response.data);

      alert(response.data.message || 'Registered successfully');

      // ✅ Go back to Login
      navigation.goBack();
    } catch (error) {
      console.log('Register error:', error);

      // Axios error handling (important)
      const message =
        error.response?.data?.message || error.message || 'Registration failed';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Branding */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/Logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>WAJOOD</Text>
          <Text style={styles.tagline}>Create your digital identity</Text>
        </View>

        {/* Form */}
        <Text style={styles.title}>Register</Text>

        {/* Required Fields */}
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email *"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile *"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password *"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmpassword}
          onChangeText={setConfirmPassword}
        />

        {/* Optional Fields */}
        <Text style={styles.sectionTitle}>Additional Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Company"
          placeholderTextColor="#999"
          value={company}
          onChangeText={setCompany}
        />

        <TextInput
          style={styles.input}
          placeholder="Designation"
          placeholderTextColor="#999"
          value={designation}
          onChangeText={setDesignation}
        />

        <TextInput
          style={styles.input}
          placeholder="LinkedIn Profile"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={linkedinProfile}
          onChangeText={setLinkedinProfile}
        />

        <TextInput
          style={styles.input}
          placeholder="Company Website"
          placeholderTextColor="#999"
          autoCapitalize="none"
          value={companyWebsite}
          onChangeText={setCompanyWebsite}
        />

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating account...' : 'Register'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  appName: {
    color: '#F28C38',
    fontSize: 26,
    fontWeight: '700',
  },

  tagline: {
    color: '#F28C38',
    fontSize: 16,
    marginTop: 4,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F28C38',
    textAlign: 'center',
    marginBottom: 20,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
  },

  button: {
    backgroundColor: '#F28C38',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  loginButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  loginLink: {
    color: '#F28C38',
    fontWeight: '600',
  },
});

export default RegisterScreen;
