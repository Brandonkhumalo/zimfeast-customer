import React from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
// If you have your own Card and Badge components for RN, import them:
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { calculateDeliveryFeeFromCoordinates, DEFAULT_DELIVERY_FEE } from "../../shared/deliveryUtils";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    description?: string;
    cuisineType: string;
    coordinates?: { lat: number; lng: number };
    imageUrl?: string;
    rating?: number;
    estimatedDeliveryTime?: number;
  };
  currency: string;
  onAddToCart: (item: any) => void;
  userLocation?: { lat: number; lng: number } | null;
}

export default function RestaurantCard({
  restaurant,
  currency,
  onAddToCart,
  userLocation,
}: RestaurantCardProps) {
  const getCurrencySymbol = (curr: string) => (curr === "USD" ? "$" : "Z$");

  const getDeliveryFee = (): string => {
    if (!userLocation || !restaurant.coordinates) {
      return DEFAULT_DELIVERY_FEE.toFixed(2);
    }

    const coords = restaurant.coordinates;
    if (!coords?.lat || !coords?.lng) return DEFAULT_DELIVERY_FEE.toFixed(2);

    const fee = calculateDeliveryFeeFromCoordinates(
      userLocation.lat,
      userLocation.lng,
      coords.lat,
      coords.lng
    );

    return fee.toFixed(2);
  };

  const handleViewMenu = () => {
    onAddToCart({
      id: `${restaurant.id}-sample`,
      name: "Sample Dish",
      price: parseFloat(getDeliveryFee()),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  };

  return (
    <Card style={styles.card}>
      {restaurant.imageUrl ? (
        <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>🍽️</Text>
        </View>
      )}

      <CardContent style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Badge style={styles.badge}>⭐ {restaurant.rating || "4.5"}</Badge>
        </View>

        <Text style={styles.cuisine}>
          {restaurant.cuisineType.charAt(0).toUpperCase() +
            restaurant.cuisineType.slice(1).replace("_", " ")}{" "}
          • {restaurant.description || "Great food"}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.deliveryTime}>
            {restaurant.estimatedDeliveryTime || 30}-
            {(restaurant.estimatedDeliveryTime || 30) + 10} min
          </Text>
          <Text style={styles.deliveryFee}>
            {getCurrencySymbol(currency)}
            {getDeliveryFee()} delivery
          </Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="View Menu" onPress={handleViewMenu} />
        </View>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  placeholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    color: "#9CA3AF",
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: "#1E40AF",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cuisine: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deliveryTime: {
    fontSize: 14,
    color: "#6B7280",
  },
  deliveryFee: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonWrapper: {
    marginTop: 12,
  },
});
