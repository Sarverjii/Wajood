import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

const MeetingIDScreen = () => {
  const navigation = useNavigation();

  const [meetingID, setMeetingID] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [meetingMode, setMeetingMode] = useState('In-Person');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const [myMeetings, setMyMeetings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // ================= FETCH MY MEETINGS =================
  const fetchMyMeetings = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(
        `${Config.API_BASE_URL}/api/meeting/myMeeting`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMyMeetings(res.data.data || []);
    } catch (err) {
      console.error('Fetch meetings error:', err.response?.data || err.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMyMeetings();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyMeetings();
    setRefreshing(false);
  };

  // ================= CREATE MEETING =================
  const startMeeting = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const res = await axios.post(
        `${Config.API_BASE_URL}/api/meeting/create`,
        { meetingMode, meetingLocation: location },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setShowModal(false);

      navigation.navigate('MeetingRoom', {
        meeting: res.data.data,
        currentUserId: res.data.userId,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= JOIN MEETING =================
  const joinMeeting = async () => {
    try {
      if (!meetingID) return;

      const cleanMeetingID = meetingID.trim().toUpperCase();
      const token = await AsyncStorage.getItem('token');

      const res = await axios.post(
        `${Config.API_BASE_URL}/api/meeting/join/${cleanMeetingID}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await navigation.navigate('MeetingRoom', {
        meeting: {
          meetingID: cleanMeetingID,
          joined: res.data.joined,
        },
        currentUserId: res.data.userId,
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ================= REJOIN =================
  const rejoinMeeting = async meeting => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await axios.post(
        `${Config.API_BASE_URL}/api/meeting/join/${meeting.meetingID}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      navigation.navigate('MeetingRoom', {
        meeting: {
          meetingID: meeting.meetingID,
          joined: res.data.joined,
        },
        currentUserId: res.data.userId,
      });
    } catch (err) {
      console.error('Rejoin error:', err.response?.data || err.message);
    }
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={22} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Meeting</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* MAIN CARD */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => setShowModal(true)}
        >
          <Icon name="add-circle-outline" size={18} color="#FFF" />
          <Text style={styles.primaryText}>Create Meeting</Text>
        </TouchableOpacity>

        <Text style={styles.or}>OR</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Meeting ID"
          placeholderTextColor="#9AA7B8"
          value={meetingID}
          onChangeText={setMeetingID}
          autoCapitalize="characters"
        />

        <TouchableOpacity style={styles.secondaryButton} onPress={joinMeeting}>
          <Icon name="enter-outline" size={18} color="#FFF" />
          <Text style={styles.secondaryText}>Join Meeting</Text>
        </TouchableOpacity>

        {/* ===== MY MEETINGS ===== */}
        <Text style={styles.sectionTitle}>Your Current Meetings</Text>

        <FlatList
          data={myMeetings}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#F28C38']}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.meetingRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.rowTop}>
                  <Text style={styles.meetingCode}>{item.meetingID}</Text>

                  <View
                    style={[
                      styles.badge,
                      item.meetingMode === 'Video Call'
                        ? styles.videoBadge
                        : styles.inPersonBadge,
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.meetingMode}</Text>
                  </View>
                </View>

                {item.meetingLocation ? (
                  <Text style={styles.location}>📍 {item.meetingLocation}</Text>
                ) : null}

                <Text style={styles.participants}>
                  👥 {item.joined?.length || 0} Participants
                </Text>
              </View>

              <TouchableOpacity
                style={styles.rejoinBtn}
                onPress={() => rejoinMeeting(item)}
              >
                <Text style={styles.rejoinText}>Rejoin</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* CREATE MEETING MODAL */}
      <Modal transparent animationType="fade" visible={showModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Start Meeting</Text>

            <View style={styles.modeRow}>
              {['In-Person', 'Video Call'].map(mode => (
                <Pressable
                  key={mode}
                  style={[
                    styles.modeButton,
                    meetingMode === mode && styles.modeActive,
                  ]}
                  onPress={() => setMeetingMode(mode)}
                >
                  <Text
                    style={[
                      styles.modeText,
                      meetingMode === mode && styles.modeTextActive,
                    ]}
                  >
                    {mode}
                  </Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Location (optional)"
              value={location}
              onChangeText={setLocation}
            />

            <TouchableOpacity
              style={styles.startButton}
              onPress={startMeeting}
              disabled={loading}
            >
              <Text style={styles.startText}>
                {loading ? 'Starting...' : 'Start Meeting'}
              </Text>
            </TouchableOpacity>

            <Pressable onPress={() => setShowModal(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MeetingIDScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#44536A',
  },

  header: {
    height: 44,
    backgroundColor: '#44536A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    flex: 1,
  },

  primaryButton: {
    backgroundColor: '#F28C38',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },

  or: {
    textAlign: 'center',
    color: '#9AA7B8',
    marginVertical: 16,
  },

  input: {
    backgroundColor: '#F4F7FB',
    borderRadius: 12,
    padding: 14,
    textAlign: 'center',
    marginBottom: 12,
  },

  secondaryButton: {
    backgroundColor: '#55657F',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '700',
    fontSize: 14,
    color: '#1F2937',
  },

  meetingRow: {
    flexDirection: 'row',
    backgroundColor: '#F4F7FB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },

  meetingCode: {
    fontSize: 16,
    fontWeight: '700',
    color: '#020617',
  },

  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  badge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  videoBadge: {
    backgroundColor: '#DBEAFE',
  },

  inPersonBadge: {
    backgroundColor: '#DCFCE7',
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
  },

  location: {
    fontSize: 12,
    color: '#374151',
  },

  participants: {
    fontSize: 12,
    color: '#6B7280',
  },

  rejoinBtn: {
    backgroundColor: '#44536A',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  rejoinText: {
    color: '#FFF',
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },

  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  modeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E9EEF3',
    marginHorizontal: 4,
    alignItems: 'center',
  },

  modeActive: {
    backgroundColor: '#F28C38',
  },

  modeText: {
    color: '#1F2937',
    fontWeight: '600',
  },

  modeTextActive: {
    color: '#FFF',
  },

  modalInput: {
    backgroundColor: '#F4F7FB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },

  startButton: {
    backgroundColor: '#44536A',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  startText: {
    color: '#FFF',
    fontWeight: '600',
  },

  cancel: {
    textAlign: 'center',
    marginTop: 12,
    color: '#9AA7B8',
  },
});
