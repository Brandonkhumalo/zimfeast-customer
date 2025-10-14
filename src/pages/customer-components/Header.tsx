import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome5";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  toggleNearbyView: () => void;
  showNearbyOnly: boolean;
  isGettingLocation: boolean;
  userLocation: { lat: number; lng: number } | null;
}

export default function Header({
  searchTerm,
  setSearchTerm,
  currency,
  setCurrency,
  toggleNearbyView,
  showNearbyOnly,
  isGettingLocation,
  userLocation,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Delicious food, delivered fast</Text>
        <Text style={styles.subtitle}>Order from your favorite restaurants in Zimbabwe</Text>
      </View>

      {/* Currency Selector */}
      <View style={styles.currencyContainer}>
        <Text style={styles.currencyLabel}>Currency</Text>
        <Picker
          selectedValue={currency}
          onValueChange={setCurrency}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="USD ($)" value="USD" />
          <Picker.Item label="ZWL (Z$)" value="ZWL" />
        </Picker>
      </View>

      {/* Search Bar & Location Button */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={16} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search restaurants, cuisines, or dishes..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity
          onPress={toggleNearbyView}
          disabled={isGettingLocation}
          style={[
            styles.locationButton,
            showNearbyOnly ? styles.locationActive : styles.locationInactive,
          ]}
        >
          {isGettingLocation ? (
            <ActivityIndicator color="#fff" style={{ marginRight: 6 }} />
          ) : (
            <Icon
              name={showNearbyOnly ? "map-marker-alt" : "location-arrow"}
              size={16}
              color="#fff"
              style={{ marginRight: 6 }}
            />
          )}
          <Text style={styles.locationText}>
            {isGettingLocation
              ? "Getting Location..."
              : showNearbyOnly
              ? "Show All"
              : "Find Nearby"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info text */}
      {showNearbyOnly && userLocation && (
        <View style={styles.infoContainer}>
          <Icon name="info-circle" size={12} color="#F9FAFB" style={{ marginRight: 4 }} />
          <Text style={styles.infoText}>Showing restaurants within 10km of your location</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3B82F6",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#F3F4F6",
  },
  currencyContainer: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  currencyLabel: {
    fontSize: 12,
    color: "#F3F4F6",
    marginBottom: 4,
  },
  picker: {
    height: 36,
    width: 120,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#111827",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  locationActive: {
    backgroundColor: "#fff",
  },
  locationInactive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  locationText: {
    color: "#fff",
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  infoText: {
    color: "#F3F4F6",
    fontSize: 12,
  },
});
