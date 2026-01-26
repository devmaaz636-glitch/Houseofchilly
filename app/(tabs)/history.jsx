import { View, Text, FlatList, Alert, TouchableOpacity, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

const History = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "orders"
  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      const guestStatus = await AsyncStorage.getItem("isGuest");
      // For guests, use phone number pattern or empty
      setUserEmail(email || (guestStatus === "true" ? "guest" : null));
    };

    fetchUserEmail();
  }, []);

  const fetchBookings = async () => {
    if (!userEmail || userEmail === "guest") {
      setBookings([]);
      return;
    }

    try {
      const bookingCollection = collection(db, "bookings");
      const bookingQuery = query(
        bookingCollection,
        where("email", "==", userEmail)
      );
      const bookingSnapshot = await getDocs(bookingQuery);

      const bookingList = bookingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by date (newest first)
      bookingList.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

      setBookings(bookingList);
    } catch (error) {
      console.error("Fetch bookings error:", error);
      setBookings([]);
    }
  };

  const fetchOrders = async () => {
    if (!userEmail || userEmail === "guest") {
      setOrders([]);
      return;
    }

    try {
      const orderCollection = collection(db, "orders");
      const orderQuery = query(
        orderCollection,
        where("email", "==", userEmail)
      );
      const orderSnapshot = await getDocs(orderQuery);

      const orderList = orderSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by date (newest first)
      orderList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(orderList);
    } catch (error) {
      console.error("Fetch orders error:", error);
      setOrders([]);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchBookings(), fetchOrders()]);
    setLoading(false);
  };

  useEffect(() => {
    if (userEmail) {
      fetchAll();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('en-US', options);
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#f49b33";
      case "confirmed":
        return "#4CAF50";
      case "preparing":
        return "#2196F3";
      case "ready":
        return "#9C27B0";
      case "delivered":
        return "#00BCD4";
      case "cancelled":
        return "#f44336";
      default:
        return "#f49b33";
    }
  };

  const renderBookingItem = ({ item }) => (
    <View className="mx-4 mb-4 bg-[#474747] rounded-xl p-4 border-l-4 border-[#f49b33]">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-[#CF2526] p-2 rounded-full mr-3">
            <Ionicons name="restaurant" size={20} color="#fff" />
          </View>
          <Text className="text-white text-lg font-bold flex-1">
            {item.restaurant || "Restaurant"}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View className="space-y-2">
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={18} color="#f49b33" />
          <Text className="text-white ml-2 flex-1">
            {formatDate(item.date)}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons name="time-outline" size={18} color="#f49b33" />
          <Text className="text-white ml-2 flex-1">
            {item.slot}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons name="people-outline" size={18} color="#CF2526" />
          <Text className="text-white ml-2 flex-1">
            {item.guests} {item.guests === 1 ? "Guest" : "Guests"}
          </Text>
        </View>

        {item.fullName && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="person-outline" size={18} color="#f49b33" />
            <Text className="text-white ml-2 flex-1">
              {item.fullName}
            </Text>
          </View>
        )}

        {item.phoneNumber && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="call-outline" size={18} color="#f49b33" />
            <Text className="text-white ml-2 flex-1">
              {item.phoneNumber}
            </Text>
          </View>
        )}

        {item.isGuest && (
          <View className="mt-2 bg-[#f49b33]/20 px-3 py-1 rounded-full self-start">
            <Text className="text-[#f49b33] text-xs font-semibold">
              Guest Booking
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderOrderItem = ({ item }) => (
    <View className="mx-4 mb-4 bg-[#474747] rounded-xl p-4 border-l-4" style={{ borderLeftColor: getStatusColor(item.status) }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-[#f49b33] p-2 rounded-full mr-3">
            <Ionicons name="fast-food" size={20} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">
              {item.restaurantName || "Restaurant"}
            </Text>
            <View className="mt-1 bg-[#2b2b2b] px-2 py-1 rounded-full self-start">
              <Text className="text-xs font-semibold" style={{ color: getStatusColor(item.status) }}>
                {item.status?.toUpperCase() || "PENDING"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Order Items */}
      <View className="mb-3">
        <Text className="text-white/70 text-sm mb-2">Items:</Text>
        {item.items?.map((orderItem, idx) => (
          <View key={idx} className="flex-row justify-between mb-1">
            <Text className="text-white/80 text-sm">
              {orderItem.name} x {orderItem.quantity}
            </Text>
            <Text className="text-white text-sm">
              ${(orderItem.price * orderItem.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Details */}
      <View className="border-t border-[#5a5a5a] pt-3 space-y-2">
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={18} color="#f49b33" />
          <Text className="text-white ml-2 flex-1 text-sm">
            {formatDate(item.createdAt)}
          </Text>
        </View>

        {item.address && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="location-outline" size={18} color="#f49b33" />
            <Text className="text-white ml-2 flex-1 text-sm" numberOfLines={2}>
              {item.address}
            </Text>
          </View>
        )}

        {item.phoneNumber && (
          <View className="flex-row items-center mb-2">
            <Ionicons name="call-outline" size={18} color="#f49b33" />
            <Text className="text-white ml-2 flex-1 text-sm">
              {item.phoneNumber}
            </Text>
          </View>
        )}

        {item.specialInstructions && (
          <View className="flex-row items-start mb-2">
            <Ionicons name="document-text-outline" size={18} color="#f49b33" style={{ marginTop: 2 }} />
            <Text className="text-white/70 ml-2 flex-1 text-sm italic">
              {item.specialInstructions}
            </Text>
          </View>
        )}

        <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-[#5a5a5a]">
          <Text className="text-white font-bold">Total:</Text>
          <Text className="text-[#f49b33] text-xl font-bold">
            ${item.totalAmount?.toFixed(2) || "0.00"}
          </Text>
        </View>

        {item.isGuest && (
          <View className="mt-2 bg-[#f49b33]/20 px-3 py-1 rounded-full self-start">
            <Text className="text-[#f49b33] text-xs font-semibold">
              Guest Order
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyBookings = () => (
    <View className="flex-1 justify-center items-center px-6 py-16">
      <View className="bg-[#474747] p-8 rounded-2xl items-center">
        <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
          <Ionicons name="calendar-outline" size={60} color="#f49b33" />
        </View>
        <Text className="text-white text-xl font-bold mb-2">
          No Bookings Yet
        </Text>
        <Text className="text-white/70 text-center mb-6">
          Your booking history will appear here once you make your first reservation
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          className="bg-[#f49b33] px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Explore Restaurants</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyOrders = () => (
    <View className="flex-1 justify-center items-center px-6 py-16">
      <View className="bg-[#474747] p-8 rounded-2xl items-center">
        <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
          <Ionicons name="fast-food-outline" size={60} color="#f49b33" />
        </View>
        <Text className="text-white text-xl font-bold mb-2">
          No Orders Yet
        </Text>
        <Text className="text-white/70 text-center mb-6">
          Your order history will appear here once you place your first order
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          className="bg-[#f49b33] px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Explore Restaurants</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !bookings.length && !orders.length) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
        <View className="items-center">
          <View className="bg-[#474747] p-6 rounded-full mb-4">
            <Ionicons name="hourglass-outline" size={40} color="#f49b33" />
          </View>
          <Text className="text-white text-lg">Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#fffff]">
      {userEmail ? (
        <>
          {/* Header */}
          <View className="px-4 pt-4 pb-2">
            <Text className="text-white text-2xl font-bold mb-1">
              History
            </Text>
            <Text className="text-white/70">
              {activeTab === "bookings" 
                ? `${bookings.length} ${bookings.length === 1 ? "booking" : "bookings"}`
                : `${orders.length} ${orders.length === 1 ? "order" : "orders"}`
              }
            </Text>
          </View>

          {/* Tabs */}
          <View className="flex-row mx-4 mb-4 bg-[#474747] rounded-lg p-1">
            <TouchableOpacity
              onPress={() => setActiveTab("bookings")}
              className={`flex-1 py-3 rounded-lg ${
                activeTab === "bookings" ? "bg-[#CF2526]" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  activeTab === "bookings" ? "text-white" : "text-white/70"
                }`}
              >
                Bookings ({bookings.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("orders")}
              className={`flex-1 py-3 rounded-lg ${
                activeTab === "orders" ? "bg-[#CF2526]" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  activeTab === "orders" ? "text-white" : "text-white/70"
                }`}
              >
                Orders ({orders.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === "bookings" ? (
            <FlatList
              data={bookings}
              onRefresh={fetchAll}
              refreshing={loading}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={fetchAll}
                  tintColor="#f49b33"
                />
              }
              keyExtractor={(item) => item.id}
              renderItem={renderBookingItem}
              ListEmptyComponent={renderEmptyBookings}
              contentContainerStyle={{ 
                paddingTop: 16,
                paddingBottom: 20,
                flexGrow: 1 
              }}
            />
          ) : (
            <FlatList
              data={orders}
              onRefresh={fetchAll}
              refreshing={loading}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={fetchAll}
                  tintColor="#f49b33"
                />
              }
              keyExtractor={(item) => item.id}
              renderItem={renderOrderItem}
              ListEmptyComponent={renderEmptyOrders}
              contentContainerStyle={{ 
                paddingTop: 16,
                paddingBottom: 20,
                flexGrow: 1 
              }}
            />
          )}
        </>
      ) : (
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-[#474747] p-8 rounded-2xl items-center w-full">
            <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
              <Ionicons name="lock-closed" size={60} color="#f49b33" />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              Sign In Required
            </Text>
            <Text className="text-white/70 text-center mb-6">
              Please sign in to view your history
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/signin")}
              className="bg-[#CF2526] px-8 py-4 rounded-lg w-full"
            >
              <Text className="text-white text-lg font-bold text-center">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default History;