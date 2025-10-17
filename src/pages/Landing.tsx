import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Text, Linking, View, ScrollView, StyleSheet } from "react-native";

// Simple Card wrapper for features/partners
const Card = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export default function Landing() {
  const navigation = useNavigation<any>();

  const features = [
    {
      icon: "🏍️",
      title: "Fast Delivery",
      description: "Quick delivery from your favorite local restaurants",
    },
    {
      icon: "🍽️",
      title: "Local Cuisine",
      description: "Authentic Zimbabwean dishes and international favorites",
    },
    {
      icon: "🔒",
      title: "Secure Payments",
      description: "Safe and secure payment options including USD and ZWL",
    },
  ];

  const partners = [
    {
      icon: "🏪",
      title: "Restaurant Partners",
      description:
        "Grow your business with thousands of hungry customers. Easy setup, real-time orders, secure payments.",
      benefits: ["Zero setup fees", "Weekly payments", "Marketing support", "Real-time analytics"],
    },
    {
      icon: "🏍️",
      title: "Delivery Drivers",
      description: "Earn money on your schedule. Flexible hours, daily earnings, fuel bonuses available.",
      benefits: ["Flexible working hours", "Weekly cash payments", "Fuel incentives", "24/7 support"],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2563EB', '#1D4ED8', '#1E40AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>ZimFeast</Text>
        <Text style={styles.headerSubtitle}>Delicious food delivery across Zimbabwe</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.getStartedBtn}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose ZimFeast?</Text>
        <Text style={styles.sectionSubtitle}>Fast, reliable food delivery with local flavors</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuresRow}>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.description}</Text>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Business Partnerships */}
      <View style={[styles.section, styles.partnersSection]}>
        <Text style={styles.sectionTitle}>Partner with ZimFeast</Text>
        {partners.map((partner, index) => (
          <Card key={index} style={styles.partnerCard}>
            <Text style={styles.partnerIcon}>{partner.icon}</Text>
            <Text style={styles.partnerTitle}>{partner.title}</Text>
            <Text style={styles.partnerDesc}>{partner.description}</Text>
            {partner.benefits.map((b, i) => (
              <Text key={i} style={styles.partnerBenefit}>
                • {b}
              </Text>
            ))}
          </Card>
        ))}
        <TouchableOpacity
          onPress={() => Linking.openURL("https://tishanyq.co.zw")}
          style={styles.joinBtn}>
          <Text style={styles.joinBtnText}>Join Business Hub</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    maxWidth: 300,
    textAlign: "center",
    marginBottom: 40,
  },
  getStartedBtn: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    elevation: 5,
  },
  getStartedText: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 24,
  },
  featuresRow: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  featureCard: { width: 200 },
  featureIcon: { fontSize: 36, marginBottom: 12 },
  featureTitle: { fontSize: 20, fontWeight: "600", textAlign: "center", marginBottom: 4 },
  featureDesc: { fontSize: 14, color: "#6B7280", textAlign: "center" },
  partnersSection: { backgroundColor: "rgba(229,231,235,0.1)" },
  partnerCard: { marginBottom: 16 },
  partnerIcon: { fontSize: 36, marginBottom: 12, textAlign: "center" },
  partnerTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  partnerDesc: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  partnerBenefit: { fontSize: 14, color: "#6B7280", marginLeft: 8, marginBottom: 4 },
  joinBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 16,
  },
  joinBtnText: { color: "#fff", fontSize: 18, fontWeight: "600", textAlign: "center" },
});
