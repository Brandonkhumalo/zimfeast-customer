import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Types ---
interface Restaurant {
  id: string;
  name: string;
  coordinates?: { lat: number; lng: number };
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId?: string;
  restaurantName?: string;
}

interface CartProps {
  visible: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  currency: string;
  userLocation?: { lat: number; lng: number } | null;
}

// --- Utils ---
const DEFAULT_DELIVERY_FEE = 1.5;

function calculateDeliveryFeeFromCoordinates(
  userLat: number,
  userLng: number,
  restLat: number,
  restLng: number
): number {
  const distanceKm = Math.sqrt(
    Math.pow(userLat - restLat, 2) + Math.pow(userLng - restLng, 2)
  );
  return Math.max(DEFAULT_DELIVERY_FEE, distanceKm * 2);
}

const getCurrencySymbol = (curr: string) => (curr === "USD" ? "$" : "Z$");

// --- Component ---
export default function Cart({
  visible,
  onClose,
  items,
  onUpdateQuantity,
  currency,
  userLocation,
}: CartProps) {
  const restaurantIds = Array.from(
    new Set(items.map((i) => i.restaurantId).filter(Boolean) as string[])
  );

  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
    enabled: restaurantIds.length > 0,
    queryFn: async () => {
      const res = await fetch("http://192.168.1.9:8000/api/restaurants/");
      return res.json();
    },
  });

  const getDeliveryFee = (): number => {
    if (!userLocation || !restaurants || restaurants.length === 0)
      return DEFAULT_DELIVERY_FEE;

    let maxFee = DEFAULT_DELIVERY_FEE;
    restaurantIds.forEach((id) => {
      const rest = restaurants.find((r) => r.id === id);
      if (rest?.coordinates) {
        const { lat, lng } = rest.coordinates;
        const fee = calculateDeliveryFeeFromCoordinates(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng
        );
        maxFee = Math.max(maxFee, fee);
      }
    });
    return maxFee;
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;

  const createOrder = useMutation({
    mutationFn: async () => {
      const token = await AsyncStorage.getItem("token");
      if (!userLocation) throw new Error("Location required for delivery");
      const firstRestaurant = restaurantIds[0];
      if (!firstRestaurant) throw new Error("No restaurant selected");

      const restaurantItems = items.filter(
        (i) => i.restaurantId === firstRestaurant
      );

      const orderData = {
        restaurantId: firstRestaurant,
        items: restaurantItems,
        subtotal: subtotal.toFixed(2),
        deliveryCoordinates: userLocation,
        deliveryAddress: "Current Location",
        currency,
        status: "pending",
      };

      const res = await fetch("http://192.168.1.9:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Order creation failed");
      return res.json();
    },
    onSuccess: (data) => {
      Alert.alert("Order Created", "Redirecting to payment...");
      onClose();
    },
    onError: (err: any) => {
      Alert.alert("Error", err.message || "Unable to create order");
    },
  });

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!userLocation)
      return Alert.alert(
        "Location Required",
        "Enable location access to calculate delivery fee."
      );
    if (restaurantIds.length > 1)
      return Alert.alert(
        "Multiple Restaurants",
        "Please order from one restaurant at a time."
      );
    createOrder.mutate();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.cartContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Cart</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView contentContainerStyle={styles.content}>
            {items.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome5
                  name="shopping-cart"
                  size={40}
                  color="#999"
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <Text style={styles.subText}>
                  Add items from a restaurant to get started
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.restaurantName && (
                      <Text style={styles.restaurantName}>
                        {item.restaurantName}
                      </Text>
                    )}
                    <Text style={styles.price}>
                      {getCurrencySymbol(currency)}
                      {item.price.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNumber}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Footer */}
          {items.length > 0 && (
            <View style={styles.footer}>
              <View style={styles.summaryRow}>
                <Text>Subtotal</Text>
                <Text>
                  {getCurrencySymbol(currency)}
                  {subtotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Delivery Fee</Text>
                <Text>
                  {getCurrencySymbol(currency)}
                  {deliveryFee.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRowTotal}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalText}>
                  {getCurrencySymbol(currency)}
                  {total.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.checkoutText}>
                    Proceed to Checkout ({getCurrencySymbol(currency)}
                    {total.toFixed(2)})
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  cartContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  content: { padding: 16 },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { fontSize: 16, color: "#555" },
  subText: { fontSize: 12, color: "#888" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  cardInfo: { flex: 1 },
  itemName: { fontWeight: "bold" },
  restaurantName: { color: "#777", fontSize: 12 },
  price: { marginTop: 4 },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: { fontSize: 16 },
  qtyNumber: { marginHorizontal: 8 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 6,
  },
  totalText: { fontWeight: "bold", fontSize: 16 },
  checkoutButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "bold" },
});
