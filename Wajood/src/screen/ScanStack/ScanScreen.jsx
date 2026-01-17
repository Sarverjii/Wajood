import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import {
  useFocusEffect,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'Wajood needs camera access to scan QR codes',
        buttonPositive: 'OK',
        buttonNegative: 'Cancel',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const ScanScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // ⭐ VERY IMPORTANT

  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ask permission once
  useEffect(() => {
    (async () => {
      const granted = await requestCameraPermission();
      setHasPermission(granted);
    })();
  }, []);

  // 🔁 Reset state every time Scan tab is focused
  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setLoading(false);
    }, []),
  );

  const handleScan = async qrValue => {
    try {
      setScanned(true);
      setLoading(true); // 🚫 disables camera

      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        `${Config.API_BASE_URL}/api/qr/scan`,
        { qrValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        // ⚠️ Tabs cannot replace → navigate to result tab / screen
        navigation.navigate('SaveContact', {
          scannedUser: response.data.data,
        });
        return;
      }

      // ❌ backend returned success:false
      setLoading(false);
      setScanned(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to verify QR code';

      setLoading(false);

      Alert.alert(
        'QR Verification Failed',
        errorMessage,
        [
          {
            text: 'OK',
            onPress: () => {
              setScanned(false);
              navigation.navigate('Home'); // ✅ correct for tabs
            },
          },
        ],
        { cancelable: false },
      );
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* 📷 Camera ONLY when tab is focused and not loading */}
      {isFocused && !loading && (
        <Camera
          key={isFocused ? 'active' : 'inactive'} // 🔥 force remount
          style={{ flex: 1 }}
          scanBarcode
          onReadCode={event => {
            if (scanned) return;

            const value = event.nativeEvent.codeStringValue;
            handleScan(value);
          }}
        />
      )}

      {/* 🪟 Verifying QR Modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ActivityIndicator size="large" color="#F28C38" />
            <Text style={styles.modalText}>Verifying QR Code…</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 30,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: 220,
  },

  modalText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A4A',
  },
});
