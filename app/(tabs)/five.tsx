import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, ScrollView, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust this value for iOS
    >
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={message.from === 'user' ? styles.userMessage : styles.botMessage}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#C2B280" // Sand for placeholder
        />
        <Button title="Send" color="#6A5ACD" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cdfffe',
    justifyContent: 'space-between',
    padding: 15,
  },
  chatContainer: {
    flex: 1,
    marginBottom: 15,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#35a14b',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '75%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#278132',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '75%',
  },
  messageText: {
    color: '#FFFFF0',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#36454F',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10, // Adjusted padding for better input box appearance
  },
  input: {
    flex: 1,
    borderColor: '#C2B280',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#FFFFF0',
  },
});
