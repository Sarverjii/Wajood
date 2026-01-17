import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

const ContactDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { contact, connection } = route.params || {};

  const [loading, setLoading] = useState(false);

  if (!contact) {
    return (
      <View style={styles.center}>
        <Text>No contact details available</Text>
      </View>
    );
  }

  const removeContact = () => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: handleRemoveContact,
        },
      ],
    );
  };

  const handleRemoveContact = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      await axios.post(
        `${Config.API_BASE_URL}/api/contacts/remove-saved`,
        {
          contactUserId: contact._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Contact removed successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to remove contact';

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const {
    name,
    email,
    mobile,
    designation,
    company,
    companyWebsite,
    linkedinProfile,
    personalLinks,
  } = contact;

  const renderRow = (icon, value) => {
    if (!value) return null;

    return (
      <View style={styles.row}>
        <Icon name={icon} size={18} color="#44536A" />
        <Text style={styles.rowText}>{value}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ===== Avatar ===== */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Icon name="person" size={48} color="#9AA7B8" />
        </View>
        <Text style={styles.name}>{name}</Text>

        {[designation, company].filter(Boolean).length > 0 && (
          <Text style={styles.meta}>
            {[designation, company].filter(Boolean).join(' · ')}
          </Text>
        )}
      </View>

      {/* ===== Contact Info ===== */}
      <View style={styles.card}>
        {renderRow('call-outline', mobile)}
        {renderRow('mail-outline', email)}
        {renderRow('globe-outline', companyWebsite)}
        {renderRow('logo-linkedin', linkedinProfile)}

        {personalLinks?.length > 0 &&
          personalLinks.map((link, index) => renderRow('link-outline', link))}
      </View>

      {/* ===== Connection Info ===== */}
      {connection && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Connection Details</Text>

          {renderRow('location-outline', connection.connectPlace || '—')}
          {renderRow(
            'calendar-outline',
            new Date(connection.connectDate).toDateString(),
          )}
          {renderRow('people-outline', connection.connectMode)}
        </View>
      )}

      {/* ===== Actions ===== */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="call-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, loading && { opacity: 0.6 }]}
          onPress={removeContact}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.secondaryText}>Remove Contact</Text>
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
    fontSize: 22,
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
    marginBottom: 12,
    color: '#2E3A4A',
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

  actions: {
    marginTop: 10,
  },

  actionBtn: {
    backgroundColor: '#F28C38',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },

  secondaryText: {
    fontSize: 15,
    color: '#2E3A4A',
    fontWeight: '500',
  },
});

export default ContactDetailScreen;
