import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Navbar() {
  const navigation = useNavigation();
  const route = useRoute();

  const navigationItems = [
    { path: "Customer", label: "Customer App", icon: "shopping-bag" },
  ];

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.navigate("Home" as never);
        return;
      }

      const res = await fetch("http://192.168.1.9:8000/api/accounts/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Logout failed");

      await AsyncStorage.removeItem("token");
      navigation.navigate("Home" as never);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Logout failed");
    }
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate("Home" as never)}>
        <Text style={styles.logo}>ZimFeast</Text>
      </TouchableOpacity>

      <View style={styles.navLinks}>
        {navigationItems.map((item) => (
          <TouchableOpacity
            key={item.path}
            style={[
              styles.navButton,
              route.name === item.path && styles.activeButton,
            ]}
            onPress={() => navigation.navigate(item.path as never)}
          >
            <FontAwesome5
              name={item.icon as any}
              size={16}
              color={route.name === item.path ? "#fff" : "#333"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.navText,
                route.name === item.path && styles.activeText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={16} color="#333" />
          <Text style={[styles.navText, { marginLeft: 6 }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
  },
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  navText: {
    fontSize: 14,
    color: "#333",
  },
  activeButton: {
    backgroundColor: "#007bff",
  },
  activeText: {
    color: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
});
