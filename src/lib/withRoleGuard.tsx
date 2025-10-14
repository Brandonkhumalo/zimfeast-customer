import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";

interface Props {
  allowedRoles: Array<"customer" | "driver" | "restaurant" | "admin">;
}

export function withRoleGuard<T extends {}>(
  WrappedComponent: React.FC<T>,
  allowedRoles: Props["allowedRoles"]
) {
  return function GuardedComponent(props: T) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(() => {
      if (!isLoading && isAuthenticated && user && !allowedRoles.includes(user.role)) {
        setUnauthorized(true);
      }
    }, [isLoading, isAuthenticated, user]);

    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.infoText}>Loading...</Text>
        </View>
      );
    }

    if (!isAuthenticated) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Unauthorized: Please log in</Text>
        </View>
      );
    }

    if (unauthorized) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>Unauthorized: You cannot access this portal</Text>
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  infoText: {
    marginTop: 8,
    color: "#333",
    fontSize: 16,
  },
});
