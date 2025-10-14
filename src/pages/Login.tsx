import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "../lib/queryClient";

type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  role: string;
};

type User = {
  id: number;
  email: string;
  role: string;
};

export default function Login() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (): Promise<LoginResponse> => {
      const res = await apiRequest(
        "POST",
        "http://192.168.1.9:8000/api/accounts/login/",
        { email, password }
      );
      return res as LoginResponse;
    },
    onSuccess: async (data) => {
      await AsyncStorage.setItem("token", data.accessToken);
      await AsyncStorage.setItem("role", data.role);

      // Fetch profile
      const profile = (await apiRequest(
        "GET",
        "http://192.168.1.9:8000/api/accounts/profile/"
      )) as User;

      if (data.role === "customer") navigation.navigate("Customer");
      else navigation.navigate("Home");
    },
    onError: (error: any) => {
      console.error("Login Error:", error);
      Alert.alert("Login Failed", error?.message || "Invalid credentials");
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login to ZimFeast</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          onPress={() => loginMutation.mutate()}
          disabled={loginMutation.isPending}
          style={[styles.button, loginMutation.isPending && { opacity: 0.7 }]}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={{ marginTop: 12 }}
        >
          <Text style={{ color: "#2563EB", textAlign: "center" }}>
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F3F4F6" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, elevation: 4 },
  title: { textAlign: "center", fontSize: 22, fontWeight: "700", color: "#1E3A8A", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#FBFCFD",
  },
  button: { backgroundColor: "#2563EB", paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});
