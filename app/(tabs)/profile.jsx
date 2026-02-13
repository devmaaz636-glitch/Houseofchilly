
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Profile() {
  const router = useRouter();
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState(null);
  const [stats, setStats] = useState({
    bookings: 0,
    favorites: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);

      // Fetch bookings count
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("email", "==", userEmail)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const bookingsCount = bookingsSnapshot.size;

      // Fetch favorites count
      let favoritesCount = 0;
      try {
        const favoritesQuery = query(
          collection(db, "favorites"),
          where("userEmail", "==", userEmail)
        );
        const favoritesSnapshot = await getDocs(favoritesQuery);
        favoritesCount = favoritesSnapshot.size;
      } catch (error) {
        console.log("Favorites collection might not exist yet");
      }

      // Fetch reviews count
      let reviewsCount = 0;
      try {
        const reviewsQuery = query(
          collection(db, "reviews"),
          where("email", "==", userEmail)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        reviewsCount = reviewsSnapshot.size;
      } catch (error) {
        console.log("Reviews collection might not exist yet");
      }

      setStats({
        bookings: bookingsCount,
        favorites: favoritesCount,
        reviews: reviewsCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      Alert.alert("Error", "Could not load profile statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              await AsyncStorage.removeItem("userEmail");
              setUserEmail(null);
              Alert.alert("Logged out", "You have been logged out successfully.");
              router.push("/signin");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Logout Error", "Error while logging out");
            }
          }
        }
      ]
    );
  };

  const handleMyBookings = () => {
    router.push("/history");
  };

  const handleFavorites = () => {
    router.push("/(tabs)/favorites");
  };

  const handleSettings = () => {
    router.push("/(tabs)/settings");
  };

  const handleDelivery = () => {
    router.push("/(tabs)/delivery");
  };

  const handleKitchen = () => {
    router.push("/(tabs)/kitchen");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleSignin = () => {
    router.push("/signin");
  };

  return (
    <ScrollView className="flex-1 bg-[#2b2b2b]">
      {/* Header Section */}
      <View className="bg-[#CF2526] pt-16 pb-8 px-6 rounded-b-3xl">
        <View className="items-center">
          <View className="bg-white/20 p-4 rounded-full mb-4">
            <Ionicons name="person" size={60} color="#fff" />
          </View>
          <Text className="text-white text-2xl font-bold">
            {userEmail ? "Welcome Back!" : "Guest User"}
          </Text>
          {userEmail && (
            <Text className="text-white/80 text-sm mt-1">
              {userEmail}
            </Text>
          )}
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 px-6 pt-8 pb-6">
        {userEmail ? (
          <>
            {/* User Info Card */}
            <View className="bg-[#ffffff] rounded-2xl p-6 mb-6">
              <View className="flex-row items-center mb-4">
                <View className="bg-[#CF2526] p-2 rounded-full mr-3">
                  <Ionicons name="mail" size={20} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-[#CF2526] text-sm font-semibold mb-1">
                    Email Address
                  </Text>
                  <Text className="text-white text-base" numberOfLines={1}>
                    {userEmail}
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View className="border-b border-[#5a5a5a] my-4" />

              {/* Stats */}
              {loading ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color="#f49b33" />
                </View>
              ) : (
                <View className="flex-row justify-around">
                  <TouchableOpacity 
                    className="items-center"
                    onPress={handleMyBookings}
                  >
                    <Text className="text-[#CF2526] text-2xl font-bold">
                      {stats.bookings}
                    </Text>
                    <Text className="text-white/70 text-xs mt-1">Bookings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="items-center"
                    onPress={handleFavorites}
                  >
                    <Text className="text-[#CF2526] text-2xl font-bold">
                      {stats.favorites}
                    </Text>
                    <Text className="text-white/70 text-xs mt-1">Favorites</Text>
                  </TouchableOpacity>
                  <View className="items-center">
                    <Text className="text-[#CF2526] text-2xl font-bold">
                      {stats.reviews}
                    </Text>
                    <Text className="text-white/70 text-xs mt-1">Reviews</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
              <TouchableOpacity 
                className="bg-[#474747] rounded-xl p-4 flex-row items-center justify-between"
                onPress={handleMyBookings}
              >
                <View className="flex-row items-center">
                  <Ionicons name="calendar" size={24} color="#f49b33" />
                  <View className="ml-3">
                    <Text className="text-white text-base font-semibold">
                      My Bookings
                    </Text>
                    <Text className="text-white/60 text-xs mt-0.5">
                      View your reservation history
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#f49b33" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-[#474747] rounded-xl p-4 flex-row items-center justify-between mt-3"
                onPress={handleFavorites}
              >
                <View className="flex-row items-center">
                  <Ionicons name="heart" size={24} color="#f49b33" />
                  <View className="ml-3">
                    <Text className="text-white text-base font-semibold">
                      Favorite Restaurants
                    </Text>
                    <Text className="text-white/60 text-xs mt-0.5">
                      Your saved restaurants
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#f49b33" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-[#474747] rounded-xl p-4 flex-row items-center justify-between mt-3"
                onPress={handleDelivery}
              >
                <View className="flex-row items-center">
                  <Ionicons name="bicycle" size={24} color="#f49b33" />
                  <View className="ml-3">
                    <Text className="text-white text-base font-semibold">
                      Delivery Tracking
                    </Text>
                    <Text className="text-white/60 text-xs mt-0.5">
                      Track your orders
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#f49b33" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-[#474747] rounded-xl p-4 flex-row items-center justify-between mt-3"
                onPress={handleKitchen}
              >
                <View className="flex-row items-center">
                  <Ionicons name="restaurant" size={24} color="#f49b33" />
                  <View className="ml-3">
                    <Text className="text-white text-base font-semibold">
                      Kitchen
                    </Text>
                    <Text className="text-white/60 text-xs mt-0.5">
                      Manage orders (Staff)
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#f49b33" />
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-[#474747] rounded-xl p-4 flex-row items-center justify-between mt-3"
                onPress={handleSettings}
              >
                <View className="flex-row items-center">
                  <Ionicons name="settings" size={24} color="#f49b33" />
                  <View className="ml-3">
                    <Text className="text-white text-base font-semibold">
                      Settings
                    </Text>
                    <Text className="text-white/60 text-xs mt-0.5">
                      Manage your preferences
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#f49b33" />
              </TouchableOpacity>
            </View>

            {/* Quick Stats Card */}
            {!loading && stats.bookings > 0 && (
              <View className="bg-[#f49b33]/10 border border-[#f49b33]/30 rounded-xl p-4 mt-6">
                <View className="flex-row items-center">
                  <Ionicons name="trophy" size={24} color="#f49b33" />
                  <Text className="text-white ml-3 flex-1">
                    You've made {stats.bookings} {stats.bookings === 1 ? 'reservation' : 'reservations'}! 🎉
                  </Text>
                </View>
              </View>
            )}

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 flex-row items-center justify-center mt-8"
            >
              <Ionicons name="log-out" size={24} color="#ef4444" />
              <Text className="text-red-500 text-lg font-bold ml-2">
                Logout
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Guest Welcome Card */}
            <View className="bg-[#474747] rounded-2xl p-6 mb-6">
              <View className="items-center">
                <View className="bg-[#f49b33]/20 p-4 rounded-full mb-4">
                  <Ionicons name="person-add" size={40} color="#f49b33" />
                </View>
                <Text className="text-white text-xl font-bold mb-2">
                  Join Us Today!
                </Text>
                <Text className="text-white/70 text-center text-sm">
                  Create an account to access exclusive features and manage your
                  bookings easily
                </Text>
              </View>
            </View>

            {/* Features List */}
            <View className="mb-6">
              <View className="flex-row items-center mb-4">
                <View className="bg-[#f49b33] p-2 rounded-full mr-3">
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
                <Text className="text-white text-base">
                  Save your favorite restaurants
                </Text>
              </View>
              <View className="flex-row items-center mb-4">
                <View className="bg-[#f49b33] p-2 rounded-full mr-3">
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
                <Text className="text-white text-base">
                  Track your booking history
                </Text>
              </View>
              <View className="flex-row items-center mb-4">
                <View className="bg-[#f49b33] p-2 rounded-full mr-3">
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
                <Text className="text-white text-base">
                  Get exclusive offers & deals
                </Text>
              </View>
              <View className="flex-row items-center mb-4">
                <View className="bg-[#f49b33] p-2 rounded-full mr-3">
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </View>
                <Text className="text-white text-base">
                  Write and read restaurant reviews
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              onPress={handleSignup}
              className="bg-[#f49b33] rounded-xl p-4 flex-row items-center justify-center mb-3"
            >
              <Ionicons name="person-add" size={24} color="#fff" />
              <Text className="text-white text-lg font-bold ml-2">
                Create Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignin}
              className="bg-transparent border-2 border-[#f49b33] rounded-xl p-4 flex-row items-center justify-center"
            >
              <Ionicons name="log-in" size={24} color="#f49b33" />
              <Text className="text-[#f49b33] text-lg font-bold ml-2">
                Sign In
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}