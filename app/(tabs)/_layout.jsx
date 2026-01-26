import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../assets/Color";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // Colors
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: "#9BA1A6",

        // Tab bar style
        tabBarStyle: {
          backgroundColor: Colors.SECONDARY,
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 22 : 10,
          paddingTop: 6,
          borderTopWidth: 0,

          // Shadow (iOS)
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 6,

          // Elevation (Android)
          elevation: 12,
        },

        // Label styling
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="delivery"
        options={{
          title: "Delivery",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bicycle-outline" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size ?? 24} color={color} />
          ),
        }}
      />

      {/* Hidden screen (used for navigation only) */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
