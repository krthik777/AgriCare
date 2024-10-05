import { StyleSheet, Button } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  const handlePress = () => {
    alert('Polayaa');
  };

  return (
    <View style={styles.container}>
      {/* Green Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Empty</Text>
      </View>
      
      {/* Main Content */}
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
    justifyContent: 'flex-start', // Content starts from the top (below navbar)
    alignItems: 'center', // Horizontally centers the content
    padding: 20, // Adds padding around the container
    backgroundColor: '#f5f5f5', // Sets a light background color
  },
  navbar: {
    width: '100%', // Full width
    height: 60, // Navbar height
    backgroundColor: 'green', // Green background color
    justifyContent: 'center', // Vertically centers the navbar content
    alignItems: 'center', // Horizontally centers the title
    paddingTop: 10, // Adds some padding for status bar adjustment
  },
  navbarTitle: {
    fontSize: 20, // Title font size
    color: 'white', // White text color for contrast
    fontWeight: 'bold', // Bold text for the navbar title
  },
  title: {
    fontSize: 24, // Increased font size
    fontWeight: 'bold', // Bolder font style
    color: '#333', // Dark text color
    marginTop: 20, // Adds margin to give space below navbar
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
