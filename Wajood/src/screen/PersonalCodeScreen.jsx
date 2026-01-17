import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const PersonalCodeScreen = () => {
  const route = useRoute();

  // ✅ Get personal code from HomeScreen
  const personalCode = route.params?.personalCode;

  const [isActive, setIsActive] = useState(true);
  const [enteredCode, setEnteredCode] = useState('');
  const [connectPlace, setConnectPlace] = useState('');
  const [shareContact, setShareContact] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!enteredCode.trim()) {
      return Alert.alert('Error', 'Please enter a personal code');
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        'http://10.0.2.2:3000/api/qr/personalcode',
        {
          personalCode: enteredCode.trim(),
          shareContact,
          connectPlace,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        Alert.alert('Success', 'Connection created successfully');

        // Reset form
        setEnteredCode('');
        setConnectPlace('');
        setShareContact(false);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to connect using personal code';

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ===== Your Personal Code ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Personal Code</Text>

        {personalCode ? (
          <View style={styles.codeBox}>
            <Icon name="key-outline" size={26} color="#F28C38" />
            <Text style={styles.codeText}>{personalCode}</Text>
          </View>
        ) : (
          <Text style={styles.mutedText}>Personal code not available</Text>
        )}

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Activate Personal Code</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#CBD5E1', true: '#F28C38' }}
          />
        </View>
      </View>

      {/* ===== Enter Someone Else's Code ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Use Someone Else’s Code</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter personal code"
          placeholderTextColor="#9AA7B8"
          value={enteredCode}
          onChangeText={setEnteredCode}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Where did you connect? (optional)"
          placeholderTextColor="#9AA7B8"
          value={connectPlace}
          onChangeText={setConnectPlace}
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Share your contact</Text>
          <Switch
            value={shareContact}
            onValueChange={setShareContact}
            thumbColor="#FFFFFF"
            trackColor={{ false: '#CBD5E1', true: '#F28C38' }}
          />
        </View>

        <TouchableOpacity
          style={[styles.actionButton, loading && { opacity: 0.7 }]}
          onPress={handleConnect}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.actionText}>Connect</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F6F8',
    flexGrow: 1,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E3A4A',
    marginBottom: 14,
  },

  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4EC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  codeText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#F28C38',
    flex: 1,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },

  switchLabel: {
    fontSize: 15,
    color: '#2E3A4A',
    fontWeight: '500',
  },

  input: {
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2E3A4A',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  actionButton: {
    backgroundColor: '#F28C38',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PersonalCodeScreen;
