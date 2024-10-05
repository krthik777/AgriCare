import { StyleSheet, Button } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  const handlePress = () => {
    alert('Button Pressed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Tab Two!</Text>
      <Text style={styles.subtitle}>This is a customized tab with a button.</Text>
      <Button title="Click Me" onPress={handlePress} />
      <View style={styles.separator} lightColor="#dcdcdc" darkColor="rgba(255,255,255,0.2)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the entire screen
    justifyContent: 'center', // Vertically centers the content
    alignItems: 'center', // Horizontally centers the content
    padding: 20, // Adds padding around the container
    backgroundColor: '#f5f5f5', // Sets a light background color
  },
  title: {
    fontSize: 24, // Increased font size
    fontWeight: 'bold', // Bolder font style
    color: '#333', // Dark text color
  },
  subtitle: {
    fontSize: 16, // Subtitle size
    marginVertical: 10, // Adds space between title and subtitle
    color: '#666', // Grey subtitle text color
  },
  separator: {
    marginVertical: 20, // More space between elements
    height: 1, // Thin line
    width: '90%', // Almost full-width separator
    backgroundColor: '#ccc', // Light grey line color
  },
});
