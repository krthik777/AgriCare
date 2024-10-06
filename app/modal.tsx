import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
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
    <ImageBackground
      source={require('./images/chatbg.jpg')} // Replace with your background image URL
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>User Profile</Text>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Image source={{ uri: 'https://via.placeholder.com/80' }} style={styles.profileImg} />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{username || 'No username found'}</Text>
            <Text style={styles.profileSubtitle}>Farmer | Remote</Text>
          </View>
        </View>
        <View>
          <Text style={styles.dateText}>Date: Sun, Oct 06, 2024</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        {/* Left Section */}
        <View style={styles.section}>
          <View style={styles.location}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.sectionContent}>{city}</Text>
          </View>
          <View style={styles.connect}>
            <Text style={styles.sectionTitle}>Connect</Text>
            <Text style={styles.sectionContent}>Phone: 9495677838 <Text style={styles.editText}>Edit</Text></Text>
            <Text style={styles.sectionContent}>Email: farmuser1@gmail.com <Text style={styles.editText}>Edit</Text></Text>
          </View>
        </View>

        {/* Right Section */}
        <View style={styles.section}>
          <View style={styles.socials}>
            <Text style={styles.sectionTitle}>Socials</Text>
            <View style={styles.socialIcons}>
              <Image source={require('./images/facebook.jpg')} style={styles.socialIcon} />
              <Image source={require('./images/whatsapp.jpg')} style={styles.socialIcon} />
            </View>
            <TouchableOpacity style={styles.addAccountBtn}>
              <Text style={styles.addAccountBtnText}>Add Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items at the start
    padding: 20,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a white overlay for readability
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
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 20,
  },
  profileDetails: {
    flexDirection: 'column',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  dateText: {
    color: '#999',
  },
  main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    
  },
  section: {
    width: '48%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16, // Optional: increase font size for section title
  },
  sectionContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  editText: {
    fontSize: 12,
    color: '#28A745',
  },
  location: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  connect: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  socials: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
  },
  addAccountBtn: {
    backgroundColor: '#28A745',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  addAccountBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF5733',
    borderRadius: 5,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

