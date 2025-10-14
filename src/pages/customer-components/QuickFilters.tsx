import React from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

interface QuickFiltersProps {
  selectedCuisine: string;
  setSelectedCuisine: (value: string) => void;
}

const cuisines = [
  { key: "", label: "All Restaurants", icon: "utensils" },
  { key: "fast_food", label: "Fast Food", icon: "pizza-slice" },
  { key: "traditional", label: "Traditional", icon: "leaf" },
  { key: "breakfast", label: "Breakfast", icon: "coffee" },
  { key: "pizza", label: "Pizza", icon: "pizza-slice" },
  { key: "chinese", label: "Chinese", icon: "utensils" },
  { key: "Indian", label: "Indian", icon: "utensils" },
  { key: "lunch_pack", label: "Lunch Pack", icon: "utensils" },
];

export default function QuickFilters({ selectedCuisine, setSelectedCuisine }: QuickFiltersProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {cuisines.map((cuisine) => {
          const isSelected = selectedCuisine === cuisine.key;
          return (
            <TouchableOpacity
              key={cuisine.key}
              onPress={() => setSelectedCuisine(cuisine.key)}
              style={[styles.button, isSelected ? styles.buttonSelected : styles.buttonOutline]}
            >
              <Icon name={cuisine.icon} size={16} color={isSelected ? "#fff" : "#1F2937"} style={{ marginRight: 6 }} />
              <Text style={[styles.buttonText, isSelected ? styles.textSelected : styles.textOutline]}>
                {cuisine.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 12,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    marginRight: 8,
  },
  buttonSelected: {
    backgroundColor: "#3B82F6", // primary
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  textSelected: {
    color: "#fff",
  },
  textOutline: {
    color: "#1F2937",
  },
});
