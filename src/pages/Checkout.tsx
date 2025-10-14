import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { CheckoutForm } from "./checkout-components/CheckoutForm";

interface CheckoutProps {
  navigation: any;
  route: { params: { orderId?: string } };
}

export default function Checkout({ navigation, route }: CheckoutProps) {
  // Get orderId from route params
  const orderId = route.params?.orderId || "6c7a9a9f-f18a-4574-a82a-f483e41ced7f";

  useEffect(() => {
    if (!orderId) {
      navigation.navigate("Home");
    }
  }, [orderId, navigation]);

  if (!orderId) {
    return (
      <View style={styles.center}>
        <Text>No order specified. Redirecting...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <CheckoutForm orderId={orderId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#111827",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
