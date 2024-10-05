import React, { useState } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Menu, Provider, DefaultTheme } from "react-native-paper";

const { colors: defaultColors } = DefaultTheme;
const screenWidth = Dimensions.get("window").width;

// Simulated data for flood risk over different durations (7 days, 2 weeks, 3 weeks)
const floodRiskData: {
  [key: string]: {
    labels: string[];
    datasets: {
      data: number[];
      color: (opacity?: number) => string;
      strokeWidth: number;
    }[];
  };
} = {
  "7 days": {
    labels: ["Today", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    datasets: [
      {
        data: [20, 30, 60, 90, 70, 50, 30], // Flood risk for 7 days
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  },
  "2 weeks": {
    labels: [
      "Today",
      "Day 2",
      "Day 3",
      "Day 4",
      "Day 5",
      "Day 6",
      "Day 7",
      "Day 8",
      "Day 9",
      "Day 10",
      "Day 11",
      "Day 12",
      "Day 13",
      "Day 14",
    ],
    datasets: [
      {
        data: [20, 30, 60, 90, 70, 50, 30, 40, 60, 80, 70, 50, 40, 20], // Flood risk for 2 weeks
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  },
  "3 weeks": {
    labels: [
      "Today",
      "Day 2",
      "Day 3",
      "Day 4",
      "Day 5",
      "Day 6",
      "Day 7",
      "Day 8",
      "Day 9",
      "Day 10",
      "Day 11",
      "Day 12",
      "Day 13",
      "Day 14",
      "Day 15",
      "Day 16",
      "Day 17",
      "Day 18",
      "Day 19",
      "Day 20",
      "Day 21",
    ],
    datasets: [
      {
        data: [
          20, 30, 60, 90, 70, 50, 30, 40, 60, 80, 70, 50, 40, 20, 30, 40, 50,
          60, 70, 60, 40,
        ], // Flood risk for 3 weeks
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  },
};

// Determine color based on severity
const getColorBySeverity = (risk: number) => {
  if (risk > 70) return "rgba(255, 0, 0, 1)"; // Red for high risk
  if (risk > 30) return "rgba(255, 165, 0, 1)"; // Orange for medium risk
  return "rgba(0, 255, 0, 1)"; // Green for low risk
};

export default function WeatherAlertsScreen() {
  const [visible, setVisible] = useState(false);
  const [selectedDays, setSelectedDays] = useState("7 days"); // Default is 7 days

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  // Current dataset based on selected duration (7 days, 2 weeks, 3 weeks)
  const currentData = floodRiskData[selectedDays];
  const highestRiskDay = Math.max(...currentData.datasets[0].data); // Find the most severe day

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
          {currentData.labels.map((label, index) => {
            const risk = currentData.datasets[0].data[index];
            const riskColor = getColorBySeverity(risk); // Get color based on risk

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

        {/* General Information Section */}
        <Text style={styles.info}>
          This chart shows the upcoming risk of flooding over the next{" "}
          {selectedDays}. Please take necessary precautions if the risk level is
          high.
        </Text>
        <Text style={styles.warning}>
          If the risk exceeds 70%, take action to protect your crops
          immediately!
        </Text>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  menuWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  menuButtonText: {
    fontSize: 16,
    color: "#333",
    marginRight: 4,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#1E2923",
    borderRadius: 16,
    padding: 10,
  },
  chart: {
    borderRadius: 16,
  },
  alertsContainer: {
    marginTop: 10,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  alertContent: {
    flex: 1,
    marginLeft: 10,
  },
  alertDay: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  riskLevel: {
    fontSize: 14,
    color: "#666",
  },
  actionContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  highRiskText: {
    color: "#FF0000",
    fontWeight: "bold",
  },
  mediumRiskText: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  lowRiskText: {
    color: "#00FF00",
    fontWeight: "bold",
  },
  info: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  warning: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "#FF0000",
  },
});
