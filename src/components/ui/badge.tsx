import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const Badge = ({ variant = "default", children, style, ...props }: BadgeProps) => {
  return (
    <View style={[styles.base, stylesByVariant[variant], style]} {...props}>
      <Text style={[styles.text, textByVariant[variant]]}>{children}</Text>
    </View>
  );
};

// Base styles
const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999, // fully rounded
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});

// Styles for variants
const stylesByVariant: Record<BadgeVariant, any> = {
  default: {
    backgroundColor: "#2563EB", // primary
    borderColor: "transparent",
  },
  secondary: {
    backgroundColor: "#64748B", // secondary
    borderColor: "transparent",
  },
  destructive: {
    backgroundColor: "#DC2626", // destructive
    borderColor: "transparent",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#000",
  },
};

// Text colors per variant
const textByVariant: Record<BadgeVariant, any> = {
  default: { color: "#fff" },
  secondary: { color: "#fff" },
  destructive: { color: "#fff" },
  outline: { color: "#000" },
};

export { Badge };
