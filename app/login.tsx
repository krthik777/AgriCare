import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { router } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both username and password.');
    } else {
      try {
        // Store username and password in AsyncStorage
        await AsyncStorage.setItem('Username', username);
        await AsyncStorage.setItem('Password', password);

        console.log('Logging in with', username, password);
        await AsyncStorage.getItem(username);
        await AsyncStorage.getItem( password);
        router.replace('/one'); // Redirect to home screen
      } catch (e) {
        console.error('Failed to save user credentials', e);
        Alert.alert('Error', 'Failed to save login information.');
      }
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Redirecting to password recovery.');
  };

  const handleCreateAccount = () => {
    Alert.alert('Create Account', 'Redirecting to account creation.');
  };

  return (
    <ImageBackground source={require('./images/forest.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>AgriCare</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#B0B0B0"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.link}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.link}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures background covers the whole screen
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    padding: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8, // Shadow for depth
    maxWidth: 400,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d572c', // Same green as in HTML
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25, // Rounded corners
    fontSize: 16,
    backgroundColor: '#fff', // Solid white background
    opacity: 0.7,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50', // Green button
    padding: 15,
    borderRadius: 25, // Rounded button corners
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  link: {
    color: '#2d572c',
    fontSize: 16,
  },
});
