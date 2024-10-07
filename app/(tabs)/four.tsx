import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
  Text,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu, Provider, DefaultTheme } from "react-native-paper";
import * as Location from "expo-location";

const { colors: defaultColors } = DefaultTheme;
const screenWidth = Dimensions.get("window").width;

// Simulated data for flood risk over different durations (7 days, 2 weeks, 3 weeks)
const floodRiskData: { [key: string]: any } = {
  "7 days": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [22, 19, 26, 31, 27, 11, 15],
      },
    ],
  },
  "2 weeks": {
    labels: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
    datasets: [
      {
        data: [22, 19, 26, 31, 27, 11, 15, 23, 25, 21, 17, 28, 33, 30],
      },
    ],
  },
  "3 weeks": {
    labels: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
    datasets: [
      {
        data: [
          22, 19, 26, 31, 27, 11, 15, 23, 25, 21, 17, 28, 33, 30, 24, 39, 33,
          24, 16, 19, 23,
        ],
      },
    ],
  },
};

// Determine color based on severity
const getColorBySeverity = (risk: number) => {
  if (risk > 70) return "rgba(255, 0, 0, 1)";
  if (risk > 30) return "rgba(255, 165, 0, 1)";
  return "rgba(0, 255, 0, 1)";
};

export default function WeatherAlertsScreen() {
  const [visible, setVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState("7 days");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationData, setLocationData] = useState<{
    Key: string;
    LocalizedName: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Get user's location on component mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });

      // Fetch location data from AccuWeather API
      const apiKey = "JywUDSEUc8Csv397eeyxL0kuPbrP6SG2";
      const url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${locationData.coords.latitude},${locationData.coords.longitude}`;
      const response = await fetch(url);
      const data = await response.json();
      setLocationData(data);
    })();
  }, []);

  const currentData = floodRiskData[selectedDays];

  const fetchWeatherData = async () => {
    const apiKey = "JywUDSEUc8Csv397eeyxL0kuPbrP6SG2";
    const url = locationData
      ? `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationData.Key}?apikey=${apiKey}`
      : "";
    const response = await fetch(url);
    const data = await response.json();
    setWeatherData(data);
    setWeatherModalVisible(true);
  };

  return (
    <Provider>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Flood Risk ({selectedDays})</Text>
          <View style={styles.menuWrapper}>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
                  <Text style={styles.menuButtonText}>Select Duration</Text>
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color="#333"
                  />
                </TouchableOpacity>
              }
            >
              <Menu.Item
                onPress={() => {
                  setSelectedDays("7 days");
                  closeMenu();
                }}
                title="7 days"
              />
              <Menu.Item
                onPress={() => {
                  setSelectedDays("2 weeks");
                  closeMenu();
                }}
                title="2 weeks"
              />
              <Menu.Item
                onPress={() => {
                  setSelectedDays("3 weeks");
                  closeMenu();
                }}
                title="3 weeks"
              />
            </Menu>
          </View>
          <TouchableOpacity
            onPress={fetchWeatherData}
            style={styles.weatherButton}
          >
            <Text style={styles.weatherButtonText}>Current Weather</Text>
          </TouchableOpacity>
        </View>

        {/* Display user's location */}
        <View style={styles.locationContainer}>
          {location && locationData ? (
            <Text style={styles.locationText}>
              Latitude: {location.latitude}, Longitude: {location.longitude},
              Location: {locationData.LocalizedName} ({locationData.Key})
            </Text>
          ) : (
            <Text style={styles.locationText}>
              {errorMsg ? errorMsg : "Getting location..."}
            </Text>
          )}
        </View>

        {/* Risk Level Chart */}
        <View style={styles.chartContainer}>
          <LineChart
            data={currentData}
            width={screenWidth * 0.9}
            height={220}
            chartConfig={{
              backgroundColor: "#1E2923",
              backgroundGradientFrom: "#08130D",
              backgroundGradientTo: "#1E2923",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
          />
        </View>

        {/* Alerts for Each Day */}
        <View style={styles.alertsContainer}>
          {currentData.labels.map((label: string, index: number) => {
            const risk = currentData.datasets[0].data[index];
            const riskColor = getColorBySeverity(risk);

            return (
              <View
                key={index}
                style={[styles.alertBox, { borderColor: riskColor }]}
              >
                <MaterialIcons
                  name={risk > 70 ? "warning" : "info"}
                  size={24}
                  color={riskColor}
                />
                <View style={styles.alertContent}>
                  <Text style={styles.alertDay}>{label}</Text>
                  <Text style={styles.riskLevel}>Risk Level: {risk}%</Text>
                </View>
                <View style={styles.actionContainer}>
                  {risk > 70 && (
                    <Text style={styles.highRiskText}>
                      High Risk! Protect crops from flooding.
                    </Text>
                  )}
                  {risk <= 70 && risk > 30 && (
                    <Text style={styles.mediumRiskText}>
                      Moderate risk. Monitor flood conditions closely.
                    </Text>
                  )}
                  {risk <= 30 && (
                    <Text style={styles.lowRiskText}>
                      Low risk. No immediate action needed.
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.info}>
          This chart shows the upcoming risk of flooding over the next{" "}
          {selectedDays}. Please take necessary precautions if the risk level is
          high.
        </Text>
        <Text style={styles.warning}>
          If the risk exceeds 70%, take action to protect your crops
          immediately!
        </Text>

        {/* Weather Forecast Modal */}
        <Modal
          visible={weatherModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setWeatherModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Weather Forecast</Text>
              {weatherData ? (
                <ScrollView>
                  {weatherData.DailyForecasts.map(
                    (forecast: any, index: number) => (
                      <View key={index} style={styles.forecastCard}>
                        {/* Date */}
                        <Text style={styles.forecastDate}>
                          {new Date(forecast.Date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>

                        {/* Temperature and Conditions */}
                        <View style={styles.forecastRow}>
                          <View style={styles.tempInfo}>
                            <Text style={styles.temperatureText}>
                              {forecast.Temperature.Maximum.Value}°
                              {forecast.Temperature.Maximum.Unit}
                            </Text>
                            <Text style={styles.subTemperatureText}>Max</Text>
                          </View>

                          <View style={styles.tempInfo}>
                            <Text style={styles.temperatureText}>
                              {forecast.Temperature.Minimum.Value}°
                              {forecast.Temperature.Minimum.Unit}
                            </Text>
                            <Text style={styles.subTemperatureText}>Min</Text>
                          </View>

                          {/* Weather Icon */}
                          <View style={styles.weatherIconWrapper}>
                            <MaterialIcons
                              name="wb-sunny"
                              size={36}
                              color="#FFA500"
                            />
                            <Text style={styles.weatherCondition}>
                              {forecast.Day.IconPhrase}
                            </Text>
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </ScrollView>
              ) : (
                <Text>Loading...</Text>
              )}
              <TouchableOpacity
                onPress={() => setWeatherModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9f7ef", // Light Mint Green
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#388e3c", // Dark Green
  },
  menuWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f1f8e9", // Pale Green
    borderRadius: 8,
  },
  menuButtonText: {
    fontSize: 16,
    color: "#4caf50", // Bright Green
  },
  weatherButton: {
    backgroundColor: "#66bb6a", // Medium Green
    padding: 8,
    borderRadius: 8,
  },
  weatherButtonText: {
    color: "#ffffff", // White
    fontSize: 16,
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: "#666", // Retained for neutral contrast
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  alertsContainer: {
    marginBottom: 20,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "#c8e6c9", // Soft Green for the border
  },
  alertContent: {
    marginLeft: 12,
  },
  alertDay: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#388e3c", // Dark Green
  },
  riskLevel: {
    fontSize: 14,
    color: "#666", // Retained for neutral contrast
  },
  actionContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  highRiskText: {
    color: "#c8e6c9", // Soft Green to indicate a less intense warning
  },
  mediumRiskText: {
    color: "#66bb6a", // Medium Green for a moderate warning
  },
  lowRiskText: {
    color: "#2e7d32", // Darker Green for a positive indication
  },
  info: {
    fontSize: 14,
    color: "#666", // Retained for neutral contrast
    marginBottom: 8,
  },
  warning: {
    fontSize: 16,
    color: "#388e3c", // Dark Green for warnings
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff", // White for modal background
    padding: 20,
    borderRadius: 16,
    width: "85%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#388e3c", // Dark Green
    marginBottom: 20,
    textAlign: "center",
  },
  forecastCard: {
    backgroundColor: "#f9f9f9", // Retained for a neutral card background
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#388e3c", // Dark Green
    marginBottom: 8,
    textAlign: "center",
  },
  forecastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tempInfo: {
    alignItems: "center",
  },
  temperatureText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#388e3c", // Dark Green
  },
  subTemperatureText: {
    fontSize: 14,
    color: "#888", // Retained for neutral contrast
  },
  weatherIconWrapper: {
    alignItems: "center",
  },
  weatherCondition: {
    fontSize: 16,
    fontWeight: "600",
    color: "#388e3c", // Dark Green
    marginTop: 4,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#66bb6a", // Medium Green for the close button
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#ffffff", // White
    fontSize: 16,
    fontWeight: "bold",
  },
});
