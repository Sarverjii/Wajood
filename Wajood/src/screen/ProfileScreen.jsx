import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import Config from 'react-native-config';

const ProfileScreen = () => {
  const { logout } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(`${Config.API_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.data);
    } catch (error) {
      console.error('Fetch user error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F28C38" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>No user data found</Text>
      </View>
    );
  }

  const {
    name,
    email,
    mobile,
    designation,
    company,
    companyWebsite,
    linkedinProfile,
    personalCode,
    personalLinks,
    pcAutoApprove,
    pcAutoCounterSave,
    pcShareOnlyEmail,
    pcShareOnlyMobile,
  } = user;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ===== Avatar ===== */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Icon name="person" size={50} color="#9AA7B8" />
        </View>
        <Text style={styles.name}>{name}</Text>
        {designation || company ? (
          <Text style={styles.meta}>
            {[designation, company].filter(Boolean).join(' · ')}
          </Text>
        ) : null}
      </View>

      {/* ===== Basic Info ===== */}
      <View style={styles.card}>
        {email && <InfoRow icon="mail-outline" value={email} />}
        {mobile && <InfoRow icon="call-outline" value={mobile} />}
        {companyWebsite && (
          <InfoRow icon="globe-outline" value={companyWebsite} />
        )}
        {linkedinProfile && (
          <InfoRow icon="logo-linkedin" value={linkedinProfile} />
        )}
      </View>

      {/* ===== Personal Code ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Code</Text>
        <Text style={styles.code}>{personalCode}</Text>
      </View>

      {/* ===== Preferences ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <PreferenceRow label="Auto approve saves" value={pcAutoApprove} />
        <PreferenceRow label="Auto counter save" value={pcAutoCounterSave} />
        <PreferenceRow label="Share only email" value={pcShareOnlyEmail} />
        <PreferenceRow label="Share only mobile" value={pcShareOnlyMobile} />
      </View>

      {/* ===== Personal Links ===== */}
      {personalLinks?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Links</Text>
          {personalLinks.map((link, index) => (
            <InfoRow key={index} icon="link-outline" value={link} />
          ))}
        </View>
      )}

      {/* ===== Logout ===== */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

/* ===== Reusable Components ===== */
const InfoRow = ({ icon, value }) => (
  <View style={styles.row}>
    <Icon name={icon} size={18} color="#44536A" />
    <Text style={styles.rowText}>{value}</Text>
  </View>
);

const PreferenceRow = ({ label, value }) => (
  <View style={styles.prefRow}>
    <Text style={styles.prefLabel}>{label}</Text>
    <Text style={[styles.prefValue, value && styles.prefTrue]}>
      {value ? 'Yes' : 'No'}
    </Text>
  </View>
);

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F6F8',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E9EEF3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E3A4A',
  },

  meta: {
    fontSize: 14,
    color: '#7B8794',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A4A',
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  rowText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#2E3A4A',
    flex: 1,
  },

  code: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F28C38',
  },

  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  prefLabel: {
    fontSize: 14,
    color: '#2E3A4A',
  },

  prefValue: {
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: '600',
  },

  prefTrue: {
    color: '#2ECC71',
  },

  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#44536A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
  },

  logoutText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
