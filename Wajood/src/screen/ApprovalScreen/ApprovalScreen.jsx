import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Config from 'react-native-config';

const ApprovalScreen = () => {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('share'); // 'share' | 'save'
  const [shareList, setShareList] = useState([]);
  const [saveList, setSaveList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchApprovals();
    }, []),
  );

  const fetchApprovals = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const [shareRes, saveRes] = await Promise.all([
        axios.get(`${Config.API_BASE_URL}/api/contacts/share-approve`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${Config.API_BASE_URL}/api/contacts/save-approve`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setShareList(shareRes.data.data || []);
      setSaveList(saveRes.data.data || []);
    } catch (error) {
      console.error(
        'Approval fetch error:',
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === 'share' ? shareList : saveList;

  // 🔍 Search
  const filteredList = useMemo(() => {
    if (!search.trim()) return currentList;

    const query = search.toLowerCase();

    return currentList.filter(item => {
      const user = activeTab === 'share' ? item.requester : item.contact;

      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.designation?.toLowerCase().includes(query) ||
        user.company?.toLowerCase().includes(query)
      );
    });
  }, [search, currentList, activeTab]);

  const renderItem = ({ item }) => {
    const user = activeTab === 'share' ? item.requester : item.contact;
    const meta = [user.designation, user.company].filter(Boolean).join(' · ');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          console.log(item);
          navigation.navigate(
            activeTab === 'share' ? 'ShareApproval' : 'SaveApproval',
            {
              approvalData: item,
            },
          );
        }}
      >
        <View style={styles.avatar}>
          <Icon name="person" size={26} color="#9AA7B8" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        </View>

        <Icon name="chevron-forward" size={20} color="#9AA7B8" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#F28C38" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ===== Tabs ===== */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'share' && styles.activeTab]}
          onPress={() => setActiveTab('share')}
        >
          <Icon name="person-add-outline" size={18} color="#F28C38" />
          <Text style={styles.tabText}>Share Approval</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'save' && styles.activeTab]}
          onPress={() => setActiveTab('save')}
        >
          <Icon name="time-outline" size={18} color="#F28C38" />
          <Text style={styles.tabText}>Save Approval</Text>
        </TouchableOpacity>
      </View>

      {/* ===== Search ===== */}
      <View style={styles.searchBox}>
        <Icon name="search-outline" size={18} color="#9AA7B8" />
        <TextInput
          placeholder="Search by name, company, role"
          placeholderTextColor="#9AA7B8"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* ===== List ===== */}
      {filteredList.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No pending approvals</Text>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={item => item.connectionId}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },

  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },

  activeTab: {
    backgroundColor: '#FFF4EC',
  },

  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#2E3A4A',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 15,
    color: '#2E3A4A',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E9EEF3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A4A',
  },

  meta: {
    fontSize: 13,
    color: '#7B8794',
    marginTop: 2,
  },

  emptyText: {
    fontSize: 15,
    color: '#7B8794',
  },
});

export default ApprovalScreen;
