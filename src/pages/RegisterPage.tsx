import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

interface RegisterResponse {
  accessToken: string;
}

export default function RegisterPage() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"customer" | "restaurant" | "driver">("customer");

  const registerMutation = useMutation({
    mutationFn: async (): Promise<RegisterResponse> => {
      const res = await fetch("http://192.168.1.9:8000/api/accounts/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          role,
        }),
      });

      if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(text);
      }
      return res.json();
    },
    onSuccess: async (data) => {
      // Save token
      await AsyncStorage.setItem("token", data.accessToken);

      // Refetch user profile
      await queryClient.invalidateQueries({ queryKey: ["/api/accounts/profile/"] });

      // Redirect based on role
      if (role === "restaurant" || role === "driver") {
        navigation.navigate("BusinessHub");
      } else {
        navigation.navigate("Home");
      }
    },
    onError: (err: any) => Alert.alert(err.message || "Registration failed"),
  });

  const handleSubmit = () => {
    registerMutation.mutate();
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-4">
      <View className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <Text className="text-2xl font-bold text-center mb-6">Register</Text>

        {registerMutation.isPending && <ActivityIndicator size="large" className="mb-4" />}

        <Text className="text-gray-700 mb-1">First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="John"
          className="border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <Text className="text-gray-700 mb-1">Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          placeholder="Doe"
          className="border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <Text className="text-gray-700 mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          className="border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <Text className="text-gray-700 mb-1">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          className="border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <Text className="text-gray-700 mb-1">Phone Number</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+263 77 123 4567"
          keyboardType="phone-pad"
          className="border border-gray-300 rounded px-3 py-2 mb-3"
        />

        <Text className="text-gray-700 mb-1">Role</Text>
        <View className="border border-gray-300 rounded mb-3">
          {["customer", "restaurant", "driver"].map((r) => (
            <TouchableOpacity key={r} onPress={() => setRole(r as any)} className="px-3 py-2">
              <Text className={role === r ? "text-blue-600 font-bold" : "text-gray-700"}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={registerMutation.isPending}
          className="bg-blue-600 py-3 rounded mb-4">

          <Text className="text-white text-center font-bold">
            {registerMutation.isPending ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-600 mr-1">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-blue-600 font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
