// CartComponent.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "./types"; 
import { Alert } from "react-native";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartComponentProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  currency: string;
  userLocation: { lat: number; lng: number } | null;
}

export default function CartComponent({
  isOpen,
  onClose,
  items,
  setItems,
  currency,
}: CartComponentProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("You must be logged in to place an order");
        return;
      }

      const payload = {
        restaurant: "e1014e44-0e90-4d26-a1b3-2aa1d98fb413",
        total_fee: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        tip: 5.0,
        status: "created",
        items: items.map((item) => ({
          menu_item_id: parseInt(item.id, 10),
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const res = await fetch("http://192.168.1.9:8000/api/orders/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      navigation.navigate("Checkout", { orderId: data.id }); // ✅ typed navigation
      onClose();
    } catch (err: any) {
      console.error("Checkout failed:", err.message);
      Alert.alert("Failed to place order: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Cart</Text>

        {items.length === 0 ? (
          <Text style={styles.emptyText}>Your cart is empty</Text>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    {currency} {(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyNumber}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={[styles.checkoutBtn, items.length === 0 || loading ? { opacity: 0.5 } : {}]}
          disabled={items.length === 0 || loading}
          onPress={handleCheckout}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    padding: 16,
    maxHeight: "90%",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  emptyText: { textAlign: "center", color: "#999" },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: { fontWeight: "500" },
  itemPrice: { color: "#666" },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    backgroundColor: "#ddd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  qtyText: { fontSize: 18, fontWeight: "bold" },
  qtyNumber: { marginHorizontal: 8, fontSize: 16 },
  checkoutBtn: {
    backgroundColor: "#1E40AF",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "bold" },
  closeBtn: { position: "absolute", top: 8, right: 8 },
  closeText: { fontSize: 20 },
});
