import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";
import { cn } from "../../lib/utils"; // ✅ only one cn import

// --- Card Container ---
export const Card = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.card, style]} {...props} />
));
Card.displayName = "Card";

// --- Header ---
export const CardHeader = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.header, style]} {...props} />
));
CardHeader.displayName = "CardHeader";

// --- Title ---
export const CardTitle = React.forwardRef<View, ViewProps>(({ style, children, ...props }, ref) => (
  <Text ref={ref} style={[styles.title, style]} {...props}>
    {children}
  </Text>
));
CardTitle.displayName = "CardTitle";

// --- Description ---
export const CardDescription = React.forwardRef<View, ViewProps>(({ style, children, ...props }, ref) => (
  <Text ref={ref} style={[styles.description, style]} {...props}>
    {children}
  </Text>
));
CardDescription.displayName = "CardDescription";

// --- Content ---
export const CardContent = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.content, style]} {...props} />
));
CardContent.displayName = "CardContent";

// --- Footer ---
export const CardFooter = React.forwardRef<View, ViewProps>(({ style, ...props }, ref) => (
  <View ref={ref} style={[styles.footer, style]} {...props} />
));
CardFooter.displayName = "CardFooter";

// --- Styles ---
const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginVertical: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
