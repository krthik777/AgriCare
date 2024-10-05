import { StyleSheet, TextInput, FlatList, TouchableOpacity, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing the FontAwesome icon set
import { Dimensions } from 'react-native'; // Import Dimensions for responsive design
import { BarChart } from 'react-native-chart-kit'; // Import BarChart from Chart Kit

interface Crop {
  id: number;
  name: string;
  successRate: number;
}

export default function TabTwoScreen() {
  const [location, setLocation] = useState(''); // State for the location input
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null); // State for the selected crop
  const [soilMoisture, setSoilMoisture] = useState<number | null>(null); // State for the soil moisture level

  const crops: Crop[] = [
    { id: 1, name: 'Rice', successRate: 85 },
    { id: 2, name: 'Wheat', successRate: 75 },
    { id: 3, name: 'Corn', successRate: 90 },
    // Add more crops as needed
  ];

  // Function to simulate fetching soil moisture data
  const fetchSoilMoisture = () => {
    const randomMoisture = Math.floor(Math.random() * 100); // Generate a random moisture level
    setSoilMoisture(randomMoisture); // Update the state with the random moisture
    alert(`Showing crops for ${location}`); // Alert the user with the location
  };

  // Function to get the user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude}, Lon: ${longitude}`); // Set the location state
        },
        (error) => {
          console.log(error); // Log any error
          alert("Unable to fetch location. Please try again.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const selectCrop = (crop: Crop) => {
    setSelectedCrop(crop); // Update the selected crop state
  };

  // Prepare data for the graph
  const graphData = {
    labels: crops.map(crop => crop.name),
    datasets: [
      {
        data: crops.map(crop => crop.successRate),
      },
    ],
  };

  return (
    <RNView style={styles.container}>
      {/* Top input and icons */}
      <RNView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your area"
          value={location}
          onChangeText={setLocation} // Update the location state as user types
        />
        <TouchableOpacity style={styles.iconButton} onPress={getCurrentLocation}>
          <Icon name="location-arrow" size={20} color="white" /> {/* Location icon */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={fetchSoilMoisture}>
          <Icon name="search" size={20} color="white" /> {/* Search icon */}
        </TouchableOpacity>
      </RNView>

      {/* Square section for crops list on the left */}
      <RNView style={styles.squaresContainer}>
        {/* Left tab: Crops list */}
        <RNView style={styles.leftSquare}>
          <FlatList
            data={crops}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: { item: Crop }) => ( // Specify the type for item
              <TouchableOpacity onPress={() => selectCrop(item)}>
                <Text style={styles.cropItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </RNView>

        {/* Right tab: Graph section */}
        <RNView style={styles.rightSquare}>
          <RNView style={styles.graphContainer}>
          <BarChart
  data={graphData}
  width={Dimensions.get('window').width * 0.4 - 20} // Adjust width to fit within padding
  height={220}
  yAxisLabel="%"
  chartConfig={{
    backgroundColor: '#e9f7ef',
    backgroundGradientFrom: '#e9f7ef',
    backgroundGradientTo: '#c8e6c9',
    decimalPlaces: 0, // For percentages
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  }}
  style={{
    marginVertical: 8,
    borderRadius: 16,
    // Optionally, add marginHorizontal for extra spacing
    marginHorizontal: 10, // Add some horizontal margin if needed
  }}
/>
          </RNView>
        </RNView>
      </RNView>

      {/* Rectangular area below the squares */}
      <RNView style={styles.rectangularTab}>
        {/* Display soil moisture data and crop details */}
        {soilMoisture !== null && (
          <RNView style={styles.moistureBlock}>
            <Text style={styles.moistureText}>
              Soil Moisture: {soilMoisture}% in {location}
            </Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${soilMoisture}%` }]} />
            </View>
          </RNView>
        )}
        {selectedCrop && (
          <RNView style={styles.detailsBlock}>
            <Text style={styles.detailsTitle}>{selectedCrop.name} Details</Text>
            <Text style={styles.detailsText}>
              This crop is suitable for {location}. Ideal soil: Loamy.
            </Text>
          </RNView>
        )}
      </RNView>
    </RNView>
  );
}

// Define your styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9f7ef', // Light green background
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#a5d6a7', // Soft green border for the input
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f1f8e9', // Light green background for input field
  },
  iconButton: {
    backgroundColor: '#66bb6a', // Green button background
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  squaresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 200,
    marginBottom: 20,
  },
  leftSquare: {
    flex: 1,
    backgroundColor: '#a5d6a7', // Light green for the left square
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  rightSquare: {
    flex: 1,
    backgroundColor: '#c8e6c9', // Slightly different green for the right square
    marginLeft: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Prevent overflow
  },
  graphContainer: {
    width: '100%', // Set to 100% to fit within the square
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dcedc8', // Lighter green for empty box
    borderRadius: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#388e3c', // Darker green for the text
  },
  rectangularTab: {
    flex: 1,
    backgroundColor: '#f1f8e9', // Very light green for rectangular tab background
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  moistureBlock: {
    marginBottom: 20,
  },
  moistureText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c', // Dark green text for moisture info
  },
  barContainer: {
    height: 20,
    backgroundColor: '#c8e6c9', // Light green for the progress bar container
    borderRadius: 5,
    marginTop: 10,
  },
  bar: {
    height: '100%',
    backgroundColor: '#2e7d32', // Darker green for the progress bar
    borderRadius: 5,
  },
  cropItem: {
    padding: 10,
    fontSize: 18,
    backgroundColor: '#81c784', // Medium green for crop items
    marginVertical: 5,
    textAlign: 'center',
    color: 'white', // White text for contrast
  },
  detailsBlock: {
    marginTop: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388e3c', // Dark green for crop details title
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#4caf50', // Green for crop details text
  },
});
