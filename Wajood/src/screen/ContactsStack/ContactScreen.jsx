import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

const ContactScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchContacts();
    }, []),
  );

  const fetchContacts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.get(
        'http://10.0.2.2:3000/api/contacts/saved',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setContacts(response.data.data || []);
    } catch (error) {
      console.error(
        'Fetch contacts error:',
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search logic
  const filteredContacts = useMemo(() => {
    if (!search.trim()) return contacts;

    return contacts.filter(item => {
      const user = item.contact;
      const query = search.toLowerCase();

      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.mobile?.toLowerCase().includes(query)
      );
    });
  }, [search, contacts]);

  const renderItem = ({ item }) => {
    const user = item.contact;

    const metaText = [user.designation, user.company]
      .filter(Boolean)
      .join(' · ');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('ContactDetail', {
            contact: user,
            connection: item,
          })
        }
      >
        <View style={styles.avatar}>
          <Icon name="person" size={28} color="#9AA7B8" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          {metaText ? <Text style={styles.meta}>{metaText}</Text> : null}
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
      {/* ===== Header ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <Text style={styles.count}>{contacts.length} contacts</Text>
      </View>

      {/* ===== Search ===== */}
      <View style={styles.searchBox}>
        <Icon name="search-outline" size={18} color="#9AA7B8" />
        <TextInput
          placeholder="Search by name, email, phone"
          placeholderTextColor="#9AA7B8"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* ===== List ===== */}
      {filteredContacts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No contacts found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
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

  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E3A4A',
  },

  count: {
    fontSize: 14,
    color: '#7B8794',
    marginTop: 4,
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
    width: 44,
    height: 44,
    borderRadius: 22,
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

  subText: {
    fontSize: 13,
    color: '#7B8794',
    marginTop: 2,
  },

  emptyText: {
    fontSize: 15,
    color: '#7B8794',
  },
});

export default ContactScreen;
