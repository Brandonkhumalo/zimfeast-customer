import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import RestaurantCard from "../../components/RestaurantCard";
import { Restaurant } from "./types";

interface RestaurantGridProps {
  restaurants: Restaurant[];
  currency: string;
  addToCart: (item: any) => void;
  userLocation: { lat: number; lng: number } | null;
}

export default function RestaurantGrid({
  restaurants,
  currency,
  addToCart,
  userLocation,
}: RestaurantGridProps) {
  if (!restaurants || restaurants.length === 0) {
    return (
      <View style={styles.noRestaurantsContainer}>
        <Icon name="search" size={40} color="#9CA3AF" style={{ marginBottom: 12 }} />
        <Text style={styles.noRestaurantsText}>No restaurants found</Text>
      </View>
    );
  }

  // Split into two rows: top 5 and bottom 5
  const topRow = restaurants.slice(0, 5);
  const bottomRow = restaurants.slice(5, 10);

  const renderRow = (row: Restaurant[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
      {row.map((r) => (
        <RestaurantCard
          key={r.id}
          restaurant={r}
          currency={currency}
          onAddToCart={addToCart}
          userLocation={userLocation}
        />
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants near you</Text>
      {renderRow(topRow)}
      {renderRow(bottomRow)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    marginBottom: 16,
  },
  noRestaurantsContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  noRestaurantsText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
});
