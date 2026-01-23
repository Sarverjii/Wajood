import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [qrValue, setQrValue] = useState(null);
  const [user, setUser] = useState(null);

  // 🔁 Refresh every time Home is focused
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const token = await AsyncStorage.getItem('token');

          const userRes = await axios.get(`${Config.API_BASE_URL}/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = userRes.data.data;
          setUser(userData);

          await AsyncStorage.setItem('user', JSON.stringify(userData));

          setQrValue(userData._id);
        } catch (err) {
          console.error('Home load error:', err.message);
        }
      };

      loadData();
    }, []),
  );

  return (
    <ScrollView style={styles.root}>
      {/* ===== SCAN SECTION ===== */}
      <Text style={styles.sectionTitle}>SCAN</Text>

      <Pressable
        style={styles.scanCard}
        onPress={() => navigation.navigate('Scan')}
      >
        <View style={styles.scanPlaceholder}>
          <Icon name="scan-outline" size={34} color="#9AA7B8" />
          <Text style={styles.scanText}>Open QR Scanner</Text>
        </View>
      </Pressable>

      {/* ===== SHOW SECTION ===== */}
      <Text style={styles.sectionTitle}>YOUR QR</Text>

      <View style={styles.showCard}>
        {/* QR */}
        <View style={styles.qrWrapper}>
          {qrValue ? (
            <QRCode value={qrValue} size={170} />
          ) : (
            <Text style={styles.qrText}>QR CODE</Text>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* User Info */}
        {user && (
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Icon name="person" size={30} color="#9AA7B8" />
            </View>

            <View style={styles.userText}>
              <Text style={styles.name}>{user.name}</Text>

              {user.designation || user.company ? (
                <Text style={styles.sub}>
                  {[user.designation, user.company].filter(Boolean).join(' · ')}
                </Text>
              ) : null}

              <Text style={styles.meta}>{user.mobile}</Text>
              <Text style={styles.meta}>{user.email}</Text>
            </View>
          </View>
        )}
      </View>

      {/* ===== ACTION BUTTONS ===== */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          navigation.navigate('PersonalCode', {
            personalCode: user?.personalCode,
            userId: user?._id,
            pcAutoApprove: user?.pcAutoApprove,
            pcAutoCounterSave: user?.pcAutoCounterSave,
          })
        }
      >
        <Icon name="key-outline" size={18} color="#FFF" />
        <Text style={styles.primaryButtonText}>Personal Code</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Meeting')}
      >
        <Icon name="people-outline" size={18} color="#FFF" />
        <Text style={styles.secondaryButtonText}>Meeting ID</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#44536A',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 1.2,
    opacity: 0.9,
  },

  /* ===== SCAN ===== */
  scanCard: {
    backgroundColor: '#55657F',
    borderRadius: 18,
    padding: 14,
    marginBottom: 20,
  },

  scanPlaceholder: {
    height: 160,
    borderRadius: 14,
    backgroundColor: '#2E3A4A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scanText: {
    color: '#9AA7B8',
    fontSize: 14,
    marginTop: 8,
  },

  /* ===== SHOW ===== */
  showCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },

  qrWrapper: {
    alignSelf: 'center',
    backgroundColor: '#F4F7FB',
    padding: 16,
    borderRadius: 16,
  },

  qrText: {
    fontSize: 16,
    color: '#9AA7B8',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF2F6',
    marginVertical: 16,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E9EEF3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  userText: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },

  sub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  meta: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },

  /* ===== BUTTONS ===== */
  primaryButton: {
    backgroundColor: '#F28C38',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  secondaryButton: {
    backgroundColor: '#fc9643',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 50,
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HomeScreen;
