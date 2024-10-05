import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';

const OPENCAGE_API_KEY = '82fa4061fa6d4e65820991750a66ea6d'; // Replace with your OpenCage API key

export default function ModalScreen() {
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('Fetching location...');
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('Username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (err) {
        console.error('Error fetching username:', err);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setCity('Permission to access location was denied.');
          return;
        }

        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 5,
            timeInterval: 2000,
          },
          async (location) => {
            const { latitude, longitude } = location.coords;
            const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const city = data.results[0].components.city ||
                data.results[0].components.town ||
                data.results[0].components.village ||
                'Unknown city';
              setCity(city);
            } else {
              setCity('Unknown location');
            }
          }
        );

        setLocationSubscription(subscription);
      } catch (error) {
        console.error('Error fetching location:', error);
        setCity('Error fetching location');
      }
    };

    getLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('Username');
      await AsyncStorage.removeItem('Password');
      router.replace('/login');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>User Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{username || 'No username found'}</Text>

        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{city}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F4F4F4',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
