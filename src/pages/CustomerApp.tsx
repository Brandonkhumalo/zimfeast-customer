import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import * as Location from "expo-location";

import Navbar from "../components/Navbar";
import Header from "./customer-components/Header";
import QuickFilters from "./customer-components/QuickFilters";
import RestaurantGrid from "./customer-components/RestaurantGrid";
import CartComponent from "./customer-components/CartComponent";
import TopRestaurant from "./customer-components/TopRestaurants";
import OrderTracking from "../components/OrderTracking";
import { demoRestaurants } from "../components/demo-data/demoRestaurants";

export default function CustomerApp({ navigation }: any) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [restaurantsData, setRestaurantsData] = useState<any[]>([]);

  const [gridPage, setGridPage] = useState(0);
  const [topPage, setTopPage] = useState(0);

  // Handle authentication status
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Unauthorized", "You are logged out. Logging in again...");
      navigation.navigate("Login");
      return;
    }
  }, [isAuthenticated, isLoading]);

  // Filter restaurants based on cuisine or location
  useEffect(() => {
    const filtered = selectedCuisine
      ? demoRestaurants.filter((r) => r.cuisineType === selectedCuisine)
      : demoRestaurants;

    setRestaurantsData(filtered);
    setGridPage(0);
    setTopPage(0);
  }, [userLocation, showNearbyOnly, selectedCuisine]);

  const toggleNearbyView = () => {
    if (!showNearbyOnly) {
      if (userLocation) setShowNearbyOnly(true);
      else getCurrentLocation();
    } else {
      setShowNearbyOnly(false);
    }
  };

  // Get user location using Expo Location
  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Permission denied");

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setUserLocation({ lat: location.coords.latitude, lng: location.coords.longitude });
      setShowNearbyOnly(true);

      setIsGettingLocation(false);
      toast.show({ title: "Location Found", description: "Showing nearby restaurants within 10km", type: "success" });
    } catch (err) {
      setIsGettingLocation(false);
      toast.show({ title: "Location Access Denied", description: "Enable location services to find nearby restaurants", type: "error" });
    }
  };

  // Add item to cart
  const addToCart = (item: any) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const gridRestaurants = restaurantsData.slice(gridPage * 5, gridPage * 5 + 5);
  const topRestaurants = restaurantsData.filter(r => r.rating && r.rating >= 4).slice(topPage * 5, topPage * 5 + 5);

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView>np
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currency={currency}
          setCurrency={setCurrency}
          toggleNearbyView={toggleNearbyView}
          showNearbyOnly={showNearbyOnly}
          isGettingLocation={isGettingLocation}
          userLocation={userLocation}
        />
        <QuickFilters selectedCuisine={selectedCuisine} setSelectedCuisine={setSelectedCuisine} />
        <RestaurantGrid
          restaurants={gridRestaurants}
          currency={currency}
          addToCart={addToCart}
          userLocation={userLocation}
        />

        <View style={styles.pagination}>
          <TouchableOpacity onPress={() => setGridPage(p => Math.max(p - 1, 0))} disabled={gridPage === 0} style={styles.button}>
            <Text style={styles.buttonText}>Previous 5</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGridPage(p => (p + 1) * 5 < restaurantsData.length ? p + 1 : p)} disabled={(gridPage + 1) * 5 >= restaurantsData.length} style={styles.button}>
            <Text style={styles.buttonText}>Next 5</Text>
          </TouchableOpacity>
        </View>

        <TopRestaurant restaurants={topRestaurants} currency={currency} addToCart={addToCart} userLocation={userLocation} />

        <View style={styles.pagination}>
          <TouchableOpacity onPress={() => setTopPage(p => Math.max(p - 1, 0))} disabled={topPage === 0} style={styles.button}>
            <Text style={styles.buttonText}>Previous Top 5</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTopPage(p => (p + 1) * 5 < restaurantsData.filter(r => r.rating && r.rating >= 4).length ? p + 1 : p)} disabled={(topPage + 1) * 5 >= restaurantsData.filter(r => r.rating && r.rating >= 4).length} style={styles.button}>
            <Text style={styles.buttonText}>Next Top 5</Text>
          </TouchableOpacity>
        </View>

        <CartComponent isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} setItems={setCartItems} currency={currency} userLocation={userLocation} />
        <OrderTracking />
      </ScrollView>

      <TouchableOpacity style={styles.cartButton} onPress={() => setIsCartOpen(true)}>
        <Text style={{ color: "#fff", fontSize: 20 }}>🛒</Text>
        {cartItems.length > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  pagination: { flexDirection: "row", justifyContent: "center", gap: 12, paddingVertical: 16 },
  button: { backgroundColor: "#2563eb", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  buttonText: { color: "#fff", fontWeight: "600" },
  cartButton: { position: "absolute", bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: "#2563eb", justifyContent: "center", alignItems: "center" },
  cartBadge: { position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: "#f87171", justifyContent: "center", alignItems: "center" },
  cartBadgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});
