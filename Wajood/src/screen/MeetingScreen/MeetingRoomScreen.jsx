import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Config from 'react-native-config';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const TILE_MARGIN = 8;
const NUM_COLUMNS = 2;
const TILE_SIZE = (width - TILE_MARGIN * (NUM_COLUMNS * 2 + 1)) / NUM_COLUMNS;

const socket = io(Config.API_BASE_URL, {
  transports: ['websocket'],
});

const MeetingRoomScreen = ({ route }) => {
  const { meeting, currentUserId } = route.params;

  const meetingId = meeting?.meetingID ?? '---';
  const [participants, setParticipants] = useState(meeting?.joined || []);
  const [currentUser, setCurrentUser] = useState(null);

  // store previous list for join detection
  const prevParticipantsRef = useRef(meeting?.joined || []);

  // ================= JOIN MEETING =================
  useEffect(() => {
    console.log('MEETING \n');
    console.log(meeting);

    console.log('currentUserId \n');
    console.log(currentUserId);
    const myEntry = meeting.joined.find(
      p => String(p.user) === String(currentUserId),
    );

    setCurrentUser(myEntry);

    socket.emit('join-meeting', {
      meetingID: meetingId,
      user: {
        _id: currentUserId,
        name: myEntry.name,
      },
    });

    socket.on('joined-update', updatedList => {
      const prev = prevParticipantsRef.current;

      // 🔹 JOIN detection
      const joinedUser = updatedList.find(
        u => !prev.some(p => String(p.user) === String(u.user)),
      );

      if (joinedUser && String(joinedUser.user) !== String(currentUserId)) {
        Toast.show({
          type: 'info',
          text1: `${joinedUser.name} joined the meeting`,
          position: 'top',
          visibilityTime: 2000,
        });
      }

      // 🔹 LEAVE detection
      const leftUser = prev.find(
        p => !updatedList.some(u => String(u.user) === String(p.user)),
      );

      if (leftUser && String(leftUser.user) !== String(currentUserId)) {
        Toast.show({
          type: 'info',
          text1: `${leftUser.name} left the meeting`,
          position: 'top',
          visibilityTime: 2000,
        });
      }

      prevParticipantsRef.current = updatedList;
      setParticipants(updatedList);
    });

    return () => {
      socket.off('joined-update');
    };
  }, []);

  // ================= LEAVE MEETING =================
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (currentUser?.user) {
          socket.emit('leave-meeting', {
            meetingID: meetingId,
            userId: currentUserId,
          });
        }
      };
    }, [currentUser, meetingId]),
  );

  // ================= TILE RENDER =================
  const renderParticipant = ({ item }) => (
    <View style={styles.tile}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name?.charAt(0)?.toUpperCase() ?? '?'}
        </Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {item.name ?? 'Unknown'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Meeting ID</Text>
        <Text style={styles.meetingId}>{meetingId}</Text>
      </View>

      {/* Participants */}
      <FlatList
        data={participants}
        renderItem={renderParticipant}
        keyExtractor={item => item._id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MeetingRoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  header: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },

  headerLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },

  meetingId: {
    color: '#E5E7EB',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },

  list: {
    padding: TILE_MARGIN,
  },

  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: TILE_MARGIN,
    backgroundColor: '#020617',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },

  name: {
    color: '#E5E7EB',
    fontSize: 14,
    maxWidth: '90%',
  },
});
