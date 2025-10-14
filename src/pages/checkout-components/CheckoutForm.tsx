// CheckoutForm.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/queryClient";
import { MobilePaymentFields } from "./MobilePaymentFields";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

interface Order {
  id: string;
  total_fee: string;
  tip: string;
  items: OrderItem[];
  restaurant_names: string[];
  delivery_fee: number;
  status: string;
}

interface CheckoutFormProps {
  orderId: string;
}

export const CheckoutForm = ({ orderId }: CheckoutFormProps) => {
  const navigation = useNavigation();

  const [paymentMethod, setPaymentMethod] = useState<"web" | "mobile" | "voucher">("web");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mobileProvider, setMobileProvider] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [voucherBalance, setVoucherBalance] = useState<number | null>(null);

  // --- Fetch Order Details ---
  const { data: currentOrder, isLoading } = useQuery<Order>({
    queryKey: [`order-${orderId}`],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`http://192.168.1.9:8000/api/orders/order/${orderId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch order details");
      return res.json();
    },
  });

  // --- Fetch Voucher Balance ---
  useEffect(() => {
    if (paymentMethod === "voucher") {
      const fetchBalance = async () => {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch("http://192.168.1.9:8000/api/payments/feast/voucher/balance/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setVoucherBalance(Number(data.balance));
      };
      fetchBalance();
    }
  }, [paymentMethod]);

  // --- Normalize Phone ---
  const normalizePhone = (phone: string) => {
    const clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) return "+263" + clean.slice(1);
    if (clean.startsWith("263")) return "+" + clean;
    if (clean.startsWith("+")) return clean;
    return "+263" + clean;
  };

  // --- Payment Mutation ---
  const paymentMutation = useMutation({
    mutationFn: async () => {
      const token = await AsyncStorage.getItem("token");
      let body: any = { order_id: orderId };

      if (paymentMethod === "mobile") {
        body.method = "paynow";
        body.phone = normalizePhone(phoneNumber);
        body.provider = mobileProvider;
      } else if (paymentMethod === "voucher") {
        body.method = "voucher";
      } else {
        body.method = "paynow";
      }

      const res = await fetch("http://192.168.1.9:8000/api/payments/create/payment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (data) => {
      if (paymentMethod === "voucher" && data.status === "paid_with_voucher") {
        ToastAndroid.show("Paid with Voucher", ToastAndroid.SHORT);
        queryClient.invalidateQueries({ queryKey: [`order-${orderId}`] });
        navigation.navigate("Home" as never);
        return;
      }

      if (data.paynow_url) {
        ToastAndroid.show("Redirecting to PayNow...", ToastAndroid.SHORT);
        // You could use a WebView here to open PayNow URL
        return;
      }

      if (data.status === "paid" || data.status === "Payment Successful") {
        ToastAndroid.show("Payment Successful", ToastAndroid.SHORT);
        navigation.navigate("Home" as never);
      } else {
        ToastAndroid.show("Payment Failed", ToastAndroid.SHORT);
      }
    },
    onError: (err: any) => {
      ToastAndroid.show(`Payment Failed: ${err.message}`, ToastAndroid.SHORT);
    },
  });

  // --- Voucher Deposit Mutation ---
  const voucherDepositMutation = useMutation({
    mutationFn: async () => {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://192.168.1.9:8000/api/payments/deposit-voucher/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: depositAmount }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: (data) => {
      ToastAndroid.show("Redirecting to PayNow...", ToastAndroid.SHORT);
      // Handle PayNow redirect via WebView
    },
  });

  const handleSubmit = () => {
    if (!currentOrder) {
      ToastAndroid.show("Order not found", ToastAndroid.SHORT);
      return;
    }
    if (paymentMethod === "mobile" && (!phoneNumber || !mobileProvider)) {
      ToastAndroid.show("Enter phone and provider", ToastAndroid.SHORT);
      return;
    }
    paymentMutation.mutate();
  };

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (!currentOrder)
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );

  const isProcessing = paymentMutation.isPending || voucherDepositMutation.isPending;
  const totalAmount = parseFloat(currentOrder.total_fee);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Complete Your Payment</Text>
      <Text style={styles.subtitle}>Order #{currentOrder.id.slice(-8)}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Order:</Text>
        {currentOrder.items.length === 0 ? (
          <Text>No items added yet.</Text>
        ) : (
          currentOrder.items.map((item, idx) => (
            <Text key={idx}>
              {item.name} x {item.quantity} - ${parseFloat(item.price).toFixed(2)}
            </Text>
          ))
        )}
        <Text style={styles.info}>Delivery Fee: ${currentOrder.delivery_fee.toFixed(2)}</Text>
        <Text style={styles.info}>Total: ${totalAmount.toFixed(2)}</Text>
      </View>

      {/* Payment Method Picker */}
      <View style={styles.field}>
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={paymentMethod} onValueChange={(v) => setPaymentMethod(v)}>
            <Picker.Item label="PayNow Web" value="web" />
            <Picker.Item label="PayNow Mobile" value="mobile" />
            <Picker.Item label="Feast Voucher" value="voucher" />
          </Picker>
        </View>
      </View>

      {paymentMethod === "mobile" && (
        <MobilePaymentFields
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          mobileProvider={mobileProvider}
          setMobileProvider={setMobileProvider}
        />
      )}

      {paymentMethod === "voucher" && (
        <View style={styles.section}>
          <Text>
            Feast Voucher Balance:{" "}
            {voucherBalance !== null ? `$${voucherBalance.toFixed(2)}` : "Loading..."}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount to deposit"
            keyboardType="numeric"
            value={depositAmount}
            onChangeText={setDepositAmount}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => voucherDepositMutation.mutate()}
            disabled={!depositAmount || voucherDepositMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {voucherDepositMutation.isPending ? "Redirecting..." : "Deposit to Voucher"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isProcessing && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay ${totalAmount.toFixed(2)}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionTitle: { fontWeight: "600", marginBottom: 8 },
  info: { fontSize: 14, marginTop: 4 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
