import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCart } from "../store/cartContext";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,}$/, "Phone number must be at least 10 digits"),
  address: Yup.string()
    .required("Delivery address is required")
    .min(10, "Please provide a complete address"),
  city: Yup.string().required("City is required"),
  postalCode: Yup.string()
    .required("Postal code is required")
    .matches(/^[A-Z0-9\s-]{5,10}$/i, "Please enter a valid postal code"),
  specialInstructions: Yup.string(),
});

// Delivery fee calculation (can be based on distance, order amount, etc.)
const calculateDeliveryFee = (subtotal, deliveryDistance = 5) => {
  // Base delivery fee
  let fee = 2.99;
  
  // Add distance-based fee (0.50 per km after 3km)
  if (deliveryDistance > 3) {
    fee += (deliveryDistance - 3) * 0.50;
  }
  
  // Free delivery for orders over $30
  if (subtotal >= 30) {
    fee = 0;
  }
  
  return Math.round(fee * 100) / 100;
};

// Calculate estimated delivery time in minutes
const calculateEstimatedTime = (deliveryDistance = 5) => {
  // Base time: 30 minutes for restaurant preparation
  let baseTime = 30;
  
  // Add travel time: 2 minutes per km
  let travelTime = deliveryDistance * 2;
  
  // Total estimated time
  return baseTime + travelTime;
};

const Checkout = () => {
  const router = useRouter();
  const { cart, restaurantId, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(2.99);
  const [estimatedTime, setEstimatedTime] = useState(45);
  const [deliveryDistance, setDeliveryDistance] = useState(5); // in km, can be calculated from location

  useEffect(() => {
    loadUserData();
    loadRestaurantData();
  }, []);

  useEffect(() => {
    // Calculate delivery fee and estimated time based on cart total
    if (cart.length > 0) {
      const subtotal = getCartTotal();
      const fee = calculateDeliveryFee(subtotal, deliveryDistance);
      const time = calculateEstimatedTime(deliveryDistance);
      setDeliveryFee(fee);
      setEstimatedTime(time);
    } else {
      setDeliveryFee(2.99);
      setEstimatedTime(45);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, deliveryDistance]);

  const loadUserData = async () => {
    const email = await AsyncStorage.getItem("userEmail");
    const guestStatus = await AsyncStorage.getItem("isGuest");
    setUserEmail(email);
    setIsGuest(guestStatus === "true");
  };

  const loadRestaurantData = async () => {
    if (restaurantId) {
      try {
        const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId));
        if (restaurantDoc.exists()) {
          setRestaurantName(restaurantDoc.data().name);
        }
      } catch (error) {
        console.error("Error loading restaurant:", error);
      }
    }
  };

  const handlePlaceOrder = async (values) => {
    if (cart.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        email: userEmail || values.phoneNumber + "@guest.com",
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        address: `${values.address}, ${values.city}, ${values.postalCode}`, // Full formatted address
        streetAddress: values.address,
        city: values.city,
        postalCode: values.postalCode,
        specialInstructions: values.specialInstructions || "",
        restaurantId: restaurantId,
        restaurantName: restaurantName || "Unknown Restaurant",
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: getCartTotal(),
        deliveryFee: deliveryFee,
        totalAmount: getCartTotal() + deliveryFee,
        status: "pending", // pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isGuest: isGuest || !userEmail,
        trackingNumber: `TRK${Date.now()}`, // Generate tracking number
        deliveryType: "delivery", // delivery or pickup
        estimatedDeliveryTime: new Date(Date.now() + estimatedTime * 60000).toISOString(),
        estimatedDeliveryMinutes: estimatedTime,
        deliveryDistance: deliveryDistance,
        city: values.city,
        postalCode: values.postalCode,
        deliveryStatus: "pending", // pending, assigned, picked_up, in_transit, delivered
        orderNumber: `ORD${Date.now()}`, // Human-readable order number
      };

      await addDoc(collection(db, "orders"), orderData);

      // Save totals before clearing cart
      const finalTotal = orderData.totalAmount;
      const savedOrderNumber = orderData.orderNumber;
      const savedTrackingNumber = orderData.trackingNumber;
      const savedEstimatedTime = estimatedTime;

      // Clear cart after successful order
      clearCart();
      
      Alert.alert(
        "Order Placed Successfully! 🎉",
        `Order Number: ${savedOrderNumber}\nTracking: ${savedTrackingNumber}\n\nEstimated Delivery: ${savedEstimatedTime} minutes\nTotal: $${finalTotal.toFixed(2)}\n\nYou can track your order in the Delivery tab.`,
        [
          {
            text: "Track Order",
            onPress: () => {
              router.push("/(tabs)/delivery");
            },
          },
          {
            text: "OK",
            style: "cancel",
            onPress: () => {
              router.push("/(tabs)/history");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#2b2b2b] justify-center items-center px-6">
        <View className="bg-[#474747] p-8 rounded-2xl items-center">
          <Ionicons name="cart-outline" size={80} color="#f49b33" />
          <Text className="text-white text-xl font-bold mt-4">
            Your cart is empty
          </Text>
          <Text className="text-white/70 text-center mt-2 mb-6">
            Add items to your cart to proceed with checkout
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#f49b33] px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#2b2b2b]"
      style={[
        Platform.OS == "android" && { paddingBottom: 55 },
        Platform.OS == "ios" && { paddingBottom: 20 },
      ]}
    >
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-2 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#f49b33" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Checkout</Text>
        </View>

        {/* Order Summary */}
        <View className="mx-4 mt-4 bg-[#474747] rounded-xl p-4">
          <Text className="text-white text-lg font-bold mb-3">
            Order Summary
          </Text>
          <View className="mb-2">
            <Text className="text-white/70 text-sm">Restaurant:</Text>
            <Text className="text-white font-semibold">{restaurantName || "Unknown"}</Text>
          </View>
          <View className="mb-2">
            <Text className="text-white/70 text-sm mb-2">Items:</Text>
            {cart.map((item) => (
              <View key={item.id} className="flex-row justify-between mt-1 mb-1">
                <Text className="text-white/80 text-sm">
                  {item.name} x {item.quantity}
                </Text>
                <Text className="text-white text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
          <View className="border-t border-[#5a5a5a] mt-3 pt-3">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white/80 text-sm">Subtotal:</Text>
              <Text className="text-white text-sm">
                ${getCartTotal().toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center">
                <Text className="text-white/80 text-sm">Delivery Fee:</Text>
                {deliveryFee === 0 && (
                  <View className="ml-2 bg-green-500 px-2 py-0.5 rounded">
                    <Text className="text-white text-xs font-bold">FREE</Text>
                  </View>
                )}
              </View>
              <Text className={`text-sm ${deliveryFee === 0 ? "text-green-400" : "text-white"}`}>
                ${deliveryFee === 0 ? "0.00" : deliveryFee.toFixed(2)}
              </Text>
            </View>
            {getCartTotal() < 30 && (
              <Text className="text-[#f49b33] text-xs mt-1 mb-2">
                Order $${(30 - getCartTotal()).toFixed(2)} more for free delivery!
              </Text>
            )}
            <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-[#5a5a5a]">
              <Text className="text-white text-lg font-bold">Total:</Text>
              <Text className="text-[#f49b33] text-xl font-bold">
                ${(getCartTotal() + deliveryFee).toFixed(2)}
              </Text>
            </View>
            <View className="flex-row items-center mt-3 pt-2 border-t border-[#5a5a5a]">
              <Ionicons name="time-outline" size={18} color="#f49b33" />
              <Text className="text-white/80 text-sm ml-2">
                Estimated Delivery: {estimatedTime} minutes
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Information Form */}
        <View className="mx-4 mt-4 bg-[#474747] rounded-xl p-4">
          <Text className="text-white text-lg font-bold mb-4">
            Delivery Information
          </Text>

          <Formik
            initialValues={{
              fullName: "",
              phoneNumber: "",
              address: "",
              city: "",
              postalCode: "",
              specialInstructions: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handlePlaceOrder}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                {/* Full Name */}
                <View className="mb-4">
                  <Text className="text-[#f49b33] mb-2 font-semibold">
                    Full Name *
                  </Text>
                  <TextInput
                    className="h-12 border-2 border-[#5a5a5a] text-white rounded-lg px-4 bg-[#2b2b2b]"
                    placeholder="Enter your full name"
                    placeholderTextColor="#888"
                    onChangeText={handleChange("fullName")}
                    onBlur={handleBlur("fullName")}
                    value={values.fullName}
                  />
                  {touched.fullName && errors.fullName && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </Text>
                  )}
                </View>

                {/* Phone Number */}
                <View className="mb-4">
                  <Text className="text-[#f49b33] mb-2 font-semibold">
                    Phone Number *
                  </Text>
                  <TextInput
                    className="h-12 border-2 border-[#5a5a5a] text-white rounded-lg px-4 bg-[#2b2b2b]"
                    placeholder="Enter your phone number"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    onChangeText={handleChange("phoneNumber")}
                    onBlur={handleBlur("phoneNumber")}
                    value={values.phoneNumber}
                  />
                  {touched.phoneNumber && errors.phoneNumber && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.phoneNumber}
                    </Text>
                  )}
                </View>

                {/* Address */}
                <View className="mb-4">
                  <Text className="text-[#f49b33] mb-2 font-semibold">
                    Street Address *
                  </Text>
                  <TextInput
                    className="h-20 border-2 border-[#5a5a5a] text-white rounded-lg px-4 py-2 bg-[#2b2b2b]"
                    placeholder="Enter your street address (e.g., 123 Main St)"
                    placeholderTextColor="#888"
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange("address")}
                    onBlur={handleBlur("address")}
                    value={values.address}
                  />
                  {touched.address && errors.address && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </Text>
                  )}
                </View>

                {/* City */}
                <View className="mb-4">
                  <Text className="text-[#f49b33] mb-2 font-semibold">
                    City *
                  </Text>
                  <TextInput
                    className="h-12 border-2 border-[#5a5a5a] text-white rounded-lg px-4 bg-[#2b2b2b]"
                    placeholder="Enter your city"
                    placeholderTextColor="#888"
                    onChangeText={handleChange("city")}
                    onBlur={handleBlur("city")}
                    value={values.city}
                  />
                  {touched.city && errors.city && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.city}
                    </Text>
                  )}
                </View>

                {/* Postal Code */}
                <View className="mb-4">
                  <Text className="text-[#f49b33] mb-2 font-semibold">
                    Postal Code *
                  </Text>
                  <TextInput
                    className="h-12 border-2 border-[#5a5a5a] text-white rounded-lg px-4 bg-[#2b2b2b]"
                    placeholder="Enter postal code"
                    placeholderTextColor="#888"
                    onChangeText={handleChange("postalCode")}
                    onBlur={handleBlur("postalCode")}
                    value={values.postalCode}
                    autoCapitalize="characters"
                  />
                  {touched.postalCode && errors.postalCode && (
                    <Text className="text-red-500 text-xs mt-1">
                      {errors.postalCode}
                    </Text>
                  )}
                </View>

                {/* Special Instructions */}
                <View className="mb-6">
                  <Text className="text-[#f49b33] mb-2 font-semibold">
                    Special Instructions (Optional)
                  </Text>
                  <TextInput
                    className="h-20 border-2 border-[#5a5a5a] text-white rounded-lg px-4 py-2 bg-[#2b2b2b]"
                    placeholder="Any special instructions for delivery..."
                    placeholderTextColor="#888"
                    multiline
                    numberOfLines={3}
                    onChangeText={handleChange("specialInstructions")}
                    onBlur={handleBlur("specialInstructions")}
                    value={values.specialInstructions}
                  />
                </View>

                {/* Place Order Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  className={`bg-[#f49b33] py-4 rounded-xl flex-row items-center justify-center ${
                    loading && "opacity-50"
                  }`}
                >
                  {loading ? (
                    <>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text className="text-white text-lg font-bold ml-2">
                        Placing Order...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={24} color="#fff" />
                      <Text className="text-white text-lg font-bold ml-2">
                        Place Order
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Checkout;

