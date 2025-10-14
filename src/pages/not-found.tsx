import React from "react";
import { View, Text } from "react-native";
import { Card, CardContent } from "../components/ui/card";
import { ExclamationCircleIcon } from "react-native-heroicons/outline"; // alternative to AlertCircle

export default function NotFound() {
  return (
    <View className="flex-1 w-full justify-center items-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <View className="flex-row items-center mb-4 gap-2">
            <ExclamationCircleIcon size={32} color="#EF4444" /> 
            <Text className="text-2xl font-bold text-gray-900">404 Page Not Found</Text>
          </View>

          <Text className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
