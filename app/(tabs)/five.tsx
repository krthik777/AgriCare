import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, ScrollView, Text, View, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { callGeminiAPI } from '../apis/chat'; // Adjust the path as necessary

export default function ChatPage() {
  const [messages, setMessages] = useState<{ text: string; from: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setMessages(prevMessages => [...prevMessages, { text: input, from: 'user' }]);

    try {
      const botReply = await callGeminiAPI(input);
      setMessages(prevMessages => [...prevMessages, { text: botReply, from: 'bot' }]);
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: `Error: ${(error as Error).message}`, from: 'bot' },
      ]);
    }

    setInput('');
  };

  return (
    <ImageBackground source={require('../images/chatbg.jpg')} style={styles.backgroundImage}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* <View style={styles.chatHeader}>
          <Text style={styles.headerText}>AgriChat</Text>
        </View> */}

        <ScrollView style={styles.chatContainer}>
          {messages.map((message, index) => (
            <View
              key={index}
              style={message.from === 'user' ? styles.senderMessage : styles.receiverMessage}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputMessage}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#D3D3D3"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 15,
  },
  chatHeader: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Black with slight transparency
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  headerText: {
    color: '#F0F0F0', // Light gray
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    marginVertical: 15,
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(50, 50, 50, 0.9)', // Slightly lighter black tone for sender
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(30, 30, 30, 0.9)', // Dark charcoal for receiver
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageText: {
    color: '#D3D3D3', // Light gray text for messages
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light transparency for footer
    padding: 10,
    borderRadius: 15,
  },
  inputMessage: {
    flex: 1,
    borderColor: '#333333',
    borderWidth: 2,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Transparent black input background
  },
  sendButton: {
    backgroundColor: '#333333', // Dark gray button
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
  },
});
