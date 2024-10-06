import { StyleSheet, TextInput, FlatList, TouchableOpacity, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface Crop {
  id: number;
  name: string;
  successRate: number;
}

interface SoilDetail {
  type: string;
  moisture: number;
  pH: number;
  nutrients: string;
}

const soilDetails: { [key: string]: SoilDetail } = {
  Rice: { type: 'Loamy', moisture: 20, pH: 6.5, nutrients: 'Nitrogen, Phosphorus, Potassium' },
  Wheat: { type: 'Sandy Loam', moisture: 15, pH: 6.0, nutrients: 'Nitrogen, Phosphorus' },
  Corn: { type: 'Clay', moisture: 25, pH: 6.8, nutrients: 'Nitrogen, Phosphorus, Potassium, Calcium' },
  Soybean: { type: 'Loam', moisture: 20, pH: 6.2, nutrients: 'Nitrogen, Phosphorus, Potassium' },
  Barley: { type: 'Sandy Loam', moisture: 18, pH: 6.5, nutrients: 'Phosphorus, Potassium' },
  Oats: { type: 'Loam', moisture: 16, pH: 6.3, nutrients: 'Nitrogen, Phosphorus, Potassium' },
  Millet: { type: 'Sandy Loam', moisture: 14, pH: 6.5, nutrients: 'Phosphorus, Potassium' },
  Sorghum: { type: 'Sandy', moisture: 18, pH: 6.0, nutrients: 'Phosphorus, Potassium' },
  Cotton: { type: 'Loam', moisture: 16, pH: 6.8, nutrients: 'Nitrogen, Potassium' },
  Sugarcane: { type: 'Clay Loam', moisture: 22, pH: 6.5, nutrients: 'Nitrogen, Phosphorus, Potassium' },
  Peanuts: { type: 'Sandy Loam', moisture: 18, pH: 6.0, nutrients: 'Phosphorus, Calcium' },
  Potato: { type: 'Sandy', moisture: 20, pH: 5.5, nutrients: 'Nitrogen, Phosphorus, Potassium' },
  Tomato: { type: 'Loamy', moisture: 18, pH: 6.2, nutrients: 'Nitrogen, Phosphorus, Potassium' },
  Carrot: { type: 'Sandy Loam', moisture: 16, pH: 6.0, nutrients: 'Phosphorus, Potassium' },
  Onion: { type: 'Loamy', moisture: 15, pH: 6.2, nutrients: 'Phosphorus, Potassium' },
};

export default function TabTwoScreen() {
  const [latitude, setLatitude] = useState(''); // State for latitude input
  const [longitude, setLongitude] = useState(''); // State for longitude input
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [soilMoisture, setSoilMoisture] = useState<number | null>(null);

  const crops: Crop[] = [
    { id: 1, name: 'Rice', successRate: 85 },
    { id: 2, name: 'Wheat', successRate: 75 },
    { id: 3, name: 'Corn', successRate: 90 },
    { id: 4, name: 'Soybean', successRate: 80 },
  { id: 5, name: 'Barley', successRate: 70 },
  { id: 6, name: 'Oats', successRate: 88 },
  { id: 7, name: 'Millet', successRate: 65 },
  { id: 8, name: 'Sorghum', successRate: 77 },
  { id: 9, name: 'Cotton', successRate: 85 },
  { id: 10, name: 'Sugarcane', successRate: 92 },
  { id: 11, name: 'Peanuts', successRate: 81 },
  { id: 12, name: 'Potato', successRate: 79 },
  { id: 13, name: 'Tomato', successRate: 83 },
  { id: 14, name: 'Carrot', successRate: 74 },
  { id: 15, name: 'Onion', successRate: 72 }
  ];

  const fetchSoilMoisture = () => {
    let randomMoisture;
    
    // 70% chance to get a number between 10 and 20
    if (Math.random() < 0.7) {
      randomMoisture = Math.floor(Math.random() * 11) + 10; // Generates a number between 10 and 20
    } else {
      randomMoisture = Math.floor(Math.random() * 49) + 20; // Generates a number between 20 and 68
    }
  
    setSoilMoisture(randomMoisture);
    alert(`Showing crops for Lat: ${latitude}, Lon: ${longitude}`);
  };
  

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude.toFixed(4)); // Set the latitude
          setLongitude(longitude.toFixed(4)); // Set the longitude
        },
        (error) => {
          console.log(error);
          alert("Unable to fetch location. Please try again.");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const selectCrop = (crop: Crop) => {
    setSelectedCrop(crop);
  };

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
          placeholder="Enter Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric" // Only numeric input for latitude
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric" // Only numeric input for longitude
        />
        <TouchableOpacity style={styles.iconButton} onPress={getCurrentLocation}>
          <Icon name="location-arrow" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={fetchSoilMoisture}>
          <Icon name="search" size={20} color="white" />
        </TouchableOpacity>
      </RNView>

      {/* Square section for crops list on the left */}
      <RNView style={styles.squaresContainer}>
        <RNView style={styles.leftSquare}>
          <FlatList
            data={crops}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }: { item: Crop }) => (
              <TouchableOpacity onPress={() => selectCrop(item)}>
                <Text style={styles.cropItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
            scrollEnabled={true} // Enables scrolling
          />
        </RNView>

        {/* Right tab: Graph section */}
        <RNView style={styles.rightSquare}>
          <RNView style={styles.graphContainer}>
            <BarChart
              data={graphData}
              width={Dimensions.get('window').width * 0.4 - 20}
              height={220}
              yAxisLabel="%"
              chartConfig={{
                backgroundColor: '#e9f7ef',
                backgroundGradientFrom: '#e9f7ef',
                backgroundGradientTo: '#c8e6c9',
                decimalPlaces: 0,
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
                marginHorizontal: 10,
              }}
            />
          </RNView>
        </RNView>
      </RNView>

      {/* Rectangular area below the squares */}
      <RNView style={styles.rectangularTab}>
        {soilMoisture !== null && (
          <RNView style={styles.moistureBlock}>
            <Text style={styles.moistureText}>
              Soil Moisture: {soilMoisture}% in Lat: {latitude}, Lon: {longitude}
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
              This crop is suitable for Lat: {latitude}, Lon: {longitude}. Ideal soil: {soilDetails[selectedCrop.name].type}.
            </Text>
            <Text style={styles.soilDetailText}>
              Moisture: {soilDetails[selectedCrop.name].moisture}%{'\n'}
              pH: {soilDetails[selectedCrop.name].pH}{'\n'}
              Nutrients: {soilDetails[selectedCrop.name].nutrients}
            </Text>
          </RNView>
        )}
      </RNView>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9f7ef',
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
    borderColor: '#a5d6a7',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f1f8e9',
  },
  iconButton: {
    backgroundColor: '#66bb6a',
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
    backgroundColor: '#a5d6a7',
    marginRight: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center', // Limit height to ensure it doesn't overflow
    overflow: 'hidden', // Hide overflow
  },
  rightSquare: {
    flex: 1,
    backgroundColor: '#c8e6c9',
    marginLeft: 10,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  graphContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangularTab: {
    flex: 1,
    backgroundColor: '#f1f8e9',
    padding: 20,
    borderRadius: 25,
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
    color: '#388e3c',
  },
  barContainer: {
    height: 20,
    backgroundColor: '#c8e6c9',
    borderRadius: 5,
    marginTop: 10,
  },
  bar: {
    height: '100%',
    backgroundColor: '#2e7d32',
    borderRadius: 10,
  },
  cropItem: {
    padding: 10,
    fontSize: 18,
    backgroundColor: '#81c784',
    marginVertical: 5,
    textAlign: 'center',
    color: 'white',
  },
  detailsBlock: {
    marginTop: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#4caf50',
  },
  soilDetailText: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dcedc8', // Light green background for soil details
    borderRadius: 8,
  },
});
