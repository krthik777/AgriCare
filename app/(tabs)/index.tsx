import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Alert } from 'react-native';

export default function DashboardScreen() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [heavyRainWarning, setHeavyRainWarning] = useState(null);
  const [optimizerAlert, setOptimizerAlert] = useState(null); // New state for alerts

  useEffect(() => {
    // Function to fetch weather data from Meteomatics for each parameter
    const fetchWeatherData = async (lat, lon) => {
      try {
        // Fetch temperature
        const tempResponse = await fetch(
          `https://api.meteomatics.com/now/t_2m:C/${lat},${lon}/json`,
          {
            headers: {
              Authorization: 'Basic ' + btoa('vinod_karthik:zNe2n010EJ'), // Replace with your Meteomatics username and password
            },
          }
        );

        if (!tempResponse.ok) {
          throw new Error('Error fetching temperature data');
        }
        const tempData = await tempResponse.json();
        setTemperature(tempData.data[0].coordinates[0].dates[0].value);

        // Fetch humidity
        const humidityResponse = await fetch(
          `https://api.meteomatics.com/now/relative_humidity_2m:p/${lat},${lon}/json`,
          {
            headers: {
              Authorization: 'Basic ' + btoa('vinod_karthik:zNe2n010EJ'), // Replace with your Meteomatics username and password
            },
          }
        );

        if (!humidityResponse.ok) {
          throw new Error('Error fetching humidity data');
        }
        const humidityData = await humidityResponse.json();
        setHumidity(humidityData.data[0].coordinates[0].dates[0].value);

        // Fetch wind speed
        const windResponse = await fetch(
          `https://api.meteomatics.com/now/wind_speed_10m:ms/${lat},${lon}/json`,
          {
            headers: {
              Authorization: 'Basic ' + btoa('vinod_karthik:zNe2n010EJ'), // Replace with your Meteomatics username and password
            },
          }
        );

        if (!windResponse.ok) {
          throw new Error('Error fetching wind speed data');
        }
        const windData = await windResponse.json();
        setWindSpeed(windData.data[0].coordinates[0].dates[0].value);

        // Fetch heavy rainfall warning
        const rainResponse = await fetch(
          `https://api.meteomatics.com/now/heavy_rain_warning_6h:idx,precip_6h:mm/${lat},${lon}/json`,
          {
            headers: {
              Authorization: 'Basic ' + btoa('vinod_karthik:zNe2n010EJ'), // Replace with your Meteomatics username and password
            },
          }
        );

        if (!rainResponse.ok) {
          throw new Error('Error fetching heavy rain warning data');
        }
        const rainData = await rainResponse.json();
        const heavyRainValue = rainData.data.find(d => d.parameter === 'heavy_rain_warning_6h:idx');
        setHeavyRainWarning(heavyRainValue.coordinates[0].dates[0].value);

        // Set alert messages based on conditions
        setOptimizerAlert(getAlertMessages(tempData.data[0].coordinates[0].dates[0].value, 
                                           humidityData.data[0].coordinates[0].dates[0].value, 
                                           windData.data[0].coordinates[0].dates[0].value));

      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        Alert.alert('Error', 'Unable to fetch location');
      }
    );
  }, []);

  // Function to determine the alerts based on temperature, humidity, and wind speed
  const getAlertMessages = (temp, humidity, wind) => {
    let alerts = [];

    if (temp > 35) {
      alerts.push('High temperature: Precaution required for crops.');
    } else if (temp < 10) {
      alerts.push('Low temperature: Frost risk for crops.');
    }

    if (humidity > 90) {
      alerts.push('High humidity: Potential for fungal growth.');
    } else if (humidity < 30) {
      alerts.push('Low humidity: Plants may suffer from dehydration.');
    }

    if (wind > 10) {
      alerts.push('High wind speed: Risk of crop damage.');
    }

    return alerts.length > 0 ? alerts : ['Weather conditions are favorable.'];
  };

  return (
    <ImageBackground
      source={require('../images/chatbg.jpg')} // Ensure the path to your image is correct
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Main Content Section with Three Divs */}
        <View style={styles.content}>
          <TouchableOpacity style={styles.div}>
            <View style={styles.divContent}>
              <Text style={styles.sectionTitle}>Temperature: {temperature ?? 'Loading...'}°C</Text>
              <Text style={styles.sectionTitle}>Humidity: {humidity ?? 'Loading...'}%</Text>
              <Text style={styles.sectionTitle}>Wind Speed: {windSpeed ?? 'Loading...'} m/s</Text>
              <View style={styles.circularProgress}>
                <Text style={styles.progressValue}>85% </Text>
                <Text style={styles.progressLabel}>Temperature</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.div}>
            <Text style={styles.sectionTitle}>Optimizer:</Text>
            <Text style={styles.sectionTitle}>Heavy Rain Warning: {heavyRainWarning === 1 ? 'Warning!' : 'No Warning'}</Text>
            {optimizerAlert && optimizerAlert.map((alert, index) => (
              <Text key={index} style={styles.alertText}>{alert}</Text>
            ))}
          </TouchableOpacity>

          <TouchableOpacity style={styles.div}>
            <Text style={styles.sectionTitle}>Mapping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  div: {
    width: '70%',
    backgroundColor: 'rgba(9, 9, 9, 0.7)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  divContent: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 10,
  },
  circularProgress: {
    borderWidth: 2,
    borderColor: 'palegreen',
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progressLabel: {
    position: 'absolute',
    bottom: -20,
    color: 'black',
  },
  alertText: {
    color: '#ffcc00',
    fontSize: 16,
    marginTop: 5,
  },
});
