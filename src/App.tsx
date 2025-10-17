// App.tsx
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { useAuth } from "./hooks/useAuth";

// Screens
import Landing from "./pages/Landing";
import CustomerApp from "./pages/CustomerApp";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/not-found";
import { PayNowWebview } from "./pages/checkout-components/PayNowWebview";

const Stack = createNativeStackNavigator();

interface PrivateRouteProps {
  component: React.FC<any>;
  allowedRoles?: Array<"customer" | "admin">;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600 text-2xl font-bold">Unauthorized</Text>
        <Text className="text-gray-500 mt-2">You do not have access to this portal.</Text>
      </View>
    );
  }

  return <Component />;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          {/* Public routes */}
          <Stack.Screen name="Landing" component={Landing} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={RegisterPage} />

          {/* Private routes */}
          <Stack.Screen name="Customer">
            {() => <PrivateRoute component={CustomerApp} allowedRoles={["customer", "admin"]} />}
          </Stack.Screen>
          <Stack.Screen name="Checkout">
            {() => <PrivateRoute component={Checkout} />}
          </Stack.Screen>
          <Stack.Screen name="PayNowWebview">
            {() => <PrivateRoute component={PayNowWebview} />}
          </Stack.Screen>

          {/* Fallback */}
          <Stack.Screen name="NotFound" component={NotFound} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
