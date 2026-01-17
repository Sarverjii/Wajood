import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

const SaveContactScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const scannedUser = route?.params?.scannedUser;

  const [meetingPlace, setMeetingPlace] = useState('');
  const [shareContact, setShareContact] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!scannedUser) {
    return (
      <View style={styles.center}>
        <Text>No contact data available</Text>
      </View>
    );
  }

  const {
    _id,
    name,
    email,
    mobile,
    designation,
    company,
    companyWebsite,
    linkedinProfile,
    personalLinks,
  } = scannedUser;

  const renderRow = (icon, value) => {
    if (!value) return null;

    return (
      <View style={styles.row}>
        <Icon name={icon} size={18} color="#44536A" />
        <Text style={styles.rowText}>{value}</Text>
      </View>
    );
  };

  const handleSaveContact = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      await axios.post(
        `${Config.API_BASE_URL}/api/qr/save`,
        {
          contactUserId: _id,
          connectPlace: meetingPlace,
          shareContact,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Alert.alert('Success', 'Contact saved successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Contact'); // ✅ go to Contact tab
          },
        },
      ]);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to save contact';

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ===== Avatar ===== */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <Icon name="person" size={50} color="#9AA7B8" />
        </View>
        <Text style={styles.name}>{name}</Text>
      </View>

      {/* ===== Details ===== */}
      <View style={styles.card}>
        {renderRow('call-outline', mobile)}
        {renderRow('mail-outline', email)}
        {renderRow('briefcase-outline', designation)}
        {renderRow('business-outline', company)}
        {renderRow('globe-outline', companyWebsite)}
        {renderRow('logo-linkedin', linkedinProfile)}

        {personalLinks?.length > 0 &&
          personalLinks.map((link, index) => (
            <View key={index}>{renderRow('link-outline', link)}</View>
          ))}
      </View>

      {/* ===== Meeting Place ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Where did you make this contact?
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Eg. Conference, Office, Cafe..."
          placeholderTextColor="#9AA7B8"
          value={meetingPlace}
          onChangeText={setMeetingPlace}
        />
      </View>

      {/* ===== Share Contact ===== */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setShareContact(!shareContact)}
        activeOpacity={0.7}
      >
        <Icon
          name={shareContact ? 'checkbox' : 'square-outline'}
          size={22}
          color="#F28C38"
        />
        <Text style={styles.checkboxText}>Share your contact</Text>
      </TouchableOpacity>

      {/* ===== Save Button ===== */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveContact}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Contact</Text>
        )}
      </TouchableOpacity>
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

  avatarPlaceholder: {
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

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A4A',
    marginBottom: 4,
  },

  subText: {
    fontSize: 13,
    color: '#7B8794',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  checkboxText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#2E3A4A',
  },

  saveButton: {
    backgroundColor: '#F28C38',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2E3A4A',
    backgroundColor: '#FFFFFF',
  },
});

export default SaveContactScreen;
