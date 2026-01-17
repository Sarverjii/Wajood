import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

const SaveApprovalScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const approvalData = route.params?.approvalData;
  const user = approvalData?.contact;

  const [loading, setLoading] = useState(false);

  if (!approvalData || !user) {
    return (
      <View style={styles.center}>
        <Text>No approval data available</Text>
      </View>
    );
  }

  const meta = [user.designation, user.company].filter(Boolean).join(' · ');

  const formatDate = date =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const handleSaveApprove = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      await axios.post(
        `${Config.API_BASE_URL}/api/approval/save`,
        {
          connectionId: approvalData.connectionId,
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
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save contact',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ===== Avatar ===== */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Icon name="person" size={52} color="#9AA7B8" />
        </View>

        <Text style={styles.name}>{user.name}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </View>

      {/* ===== Contact Info ===== */}
      <View style={styles.card}>
        {user.email && <InfoRow icon="mail-outline" value={user.email} />}
        {user.mobile && <InfoRow icon="call-outline" value={user.mobile} />}
      </View>

      {/* ===== Connection Details ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Connection Details</Text>

        {approvalData.connectPlace ? (
          <InfoRow icon="location-outline" value={approvalData.connectPlace} />
        ) : null}

        <InfoRow
          icon="calendar-outline"
          value={formatDate(approvalData.connectDate)}
        />

        <InfoRow icon="people-outline" value="In person" />
      </View>

      {/* ===== Actions ===== */}
      <View style={styles.actionRow}>
        {/* ❌ Delete does nothing for now */}
        <TouchableOpacity style={styles.rejectButton}>
          <Icon name="close-outline" size={22} color="#FFFFFF" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.approveButton}
          onPress={handleSaveApprove}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon name="checkmark-outline" size={22} color="#FFFFFF" />
              <Text style={styles.actionText}>Save Contact</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

/* ===== Reusable Info Row ===== */
const InfoRow = ({ icon, value }) => (
  <View style={styles.row}>
    <Icon name={icon} size={18} color="#44536A" />
    <Text style={styles.rowText}>{value}</Text>
  </View>
);

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
    width: 96,
    height: 96,
    borderRadius: 48,
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

  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },

  rejectButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  approveButton: {
    flex: 1,
    backgroundColor: '#2ECC71',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  actionText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SaveApprovalScreen;
