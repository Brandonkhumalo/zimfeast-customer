import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { MapPin } from "lucide-react-native"; // Use react-native lucide icons
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"; // Ensure RN compatible Card

export default function OrderTracking() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDriverMapOpen, setIsDriverMapOpen] = useState(false);

  // Mock order data
  const order = {
    id: "order-142",
    status: "out_for_delivery",
    items: ["2x Sadza with Beef Stew", "1x Mazanje"],
    driver: {
      name: "John Mukamuri",
      vehicle: "Toyota Vitz • ABC 123 GP",
      phone: "+263 77 123 4567",
    },
    timeline: [
      { status: "confirmed", time: "2:30 PM", completed: true },
      { status: "preparing", time: "2:35 PM", completed: true },
      { status: "out_for_delivery", time: "3:15 PM", completed: true },
      { status: "delivered", time: "Estimated 3:30 PM", completed: false },
    ],
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Order Confirmed";
      case "preparing":
        return "Restaurant Preparing";
      case "out_for_delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  if (!isOpen) {
    return (
      <TouchableOpacity
        style={styles.trackButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.trackButtonText}>📍 Track Order</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.overlay}>
      <Card style={styles.card}>
        <CardHeader>
          <View style={styles.header}>
            <CardTitle>Track Your Order</CardTitle>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
        </CardHeader>

        <CardContent>
          <ScrollView style={styles.timeline}>
            {order.timeline.map((step) => (
              <View key={step.status} style={styles.timelineStep}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: step.completed ? "#1E40AF" : "#D1D5DB" },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.statusText,
                      { color: step.completed ? "#000" : "#6B7280" },
                    ]}
                  >
                    {getStatusLabel(step.status)}
                  </Text>
                  <Text style={styles.statusTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {(order.status === "preparing" || order.status === "out_for_delivery") && (
            <Card style={styles.driverCard}>
              <Text style={styles.driverName}>Driver: {order.driver.name}</Text>
              <Text style={styles.driverVehicle}>{order.driver.vehicle}</Text>
              <View style={styles.driverActions}>
                <TouchableOpacity style={styles.outlineButton}>
                  <Text>📞 Call Driver</Text>
                </TouchableOpacity>
                {order.status === "out_for_delivery" && (
                  <TouchableOpacity
                    style={styles.defaultButton}
                    onPress={() => setIsDriverMapOpen(true)}
                  >
                    <MapPin width={16} height={16} color="#fff" />
                    <Text style={{ color: "#fff", marginLeft: 4 }}>Track Driver</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          )}
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  trackButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#1E40AF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
  },
  trackButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxHeight: "80%",
    padding: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    fontSize: 18,
    color: "#6B7280",
  },
  timeline: {
    marginVertical: 12,
  },
  timelineStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontWeight: "500",
  },
  statusTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  driverCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F3F4F6",
  },
  driverName: {
    fontWeight: "500",
    marginBottom: 4,
  },
  driverVehicle: {
    color: "#6B7280",
    marginBottom: 8,
  },
  driverActions: {
    flexDirection: "row",
    gap: 8,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#1E40AF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  defaultButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E40AF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
