import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentConfirm = () => {
  const router = useRouter();
  const { order } = useLocalSearchParams();
  const orderData = order ? JSON.parse(order) : null;

  if (!orderData) return null;

  const orderDate = new Date(orderData.createdAt);
  const date = orderDate.toDateString();
  const time = orderDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleDonePress = () => {
    // Navigate to delivery tracker with order data
    router.push({
      pathname: "./DeliveryTracker",
      params: { order: JSON.stringify(orderData) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]">
      {/* HEADER */}
      <View className="px-5 pt-4 pb-3 border-b border-dashed border-gray-300">
        <View className="items-center justify-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-0 bg-white p-2 rounded-full"
          >
            <Ionicons name="chevron-back" size={20} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Payment</Text>
        </View>
      </View>

      {/* MAIN CARD */}
      <View className="mx-5 mt-16 bg-white rounded-3xl px-6 pb-8 pt-16">
        {/* Success Icon */}
        <View className="items-center absolute -top-10 left-0 right-0">
          <View className="bg-[#CF2526] w-20 h-20 rounded-full items-center justify-center">
            <Ionicons name="checkmark" size={40} color="white" />
          </View>
        </View>

        <Text className="text-2xl font-bold text-center mt-4">Thank You!</Text>
        <Text className="text-gray-400 text-center mb-6">
          Your Transaction Successful
        </Text>

        {/* PAYMENT ROW */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="cash" size={28} color="#CF2526" />
            <View className="ml-3">
              <Text className="font-bold text-lg">{orderData.paymentMethod}</Text>
              <Text className="text-gray-400 text-sm">
                {orderData.paymentMethod === "Cash on Delivery" ? "No extra charges" : ""}
              </Text>
            </View>
          </View>

          <View className="w-6 h-6 border-2 border-[#CF2526] rounded-full items-center justify-center">
            <View className="w-3 h-3 bg-[#CF2526] rounded-full" />
          </View>
        </View>

        {/* Divider */}
        <View className="border-t border-dashed border-gray-300 mb-2" />

        {/* RECEIPT DETAILS */}
        <View className="pt-2">
          <View className="flex-row justify-between py-4 border-b border-dashed border-gray-300">
            <Text className="text-gray-500">Date</Text>
            <Text className="font-bold">{date}</Text>
          </View>

          <View className="flex-row justify-between py-4 border-b border-dashed border-gray-300">
            <Text className="text-gray-500">Time</Text>
            <Text className="font-bold">{time}</Text>
          </View>

          <View className="flex-row justify-between py-4 border-b border-dashed border-gray-300">
            <Text className="text-gray-500">Payment Type</Text>
            <Text className="font-bold">{orderData.paymentMethod}</Text>
          </View>

          <View className="flex-row justify-between py-4 border-b border-dashed border-gray-300">
            <Text className="text-gray-500">Status</Text>
            <Text className="font-bold text-[#CF2526]">
              {orderData.paymentMethod === "Cash on Delivery" ? "Pay on Delivery" : "Paid"}
            </Text>
          </View>

          <View className="flex-row justify-between py-4">
            <Text className="text-gray-500">Total</Text>
            <Text className="font-bold">Rs. {orderData.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* DONE / PAID BUTTON */}
        <TouchableOpacity
          onPress={handleDonePress}
          className="bg-[#CF2526] rounded-full mt-8 items-center"
          style={{
            paddingTop: 18,
            paddingBottom: 14,
          }}
        >
          <Text className="text-white text-lg font-bold">
            {orderData.paymentMethod === "Cash on Delivery" ? "Done" : "Paid"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentConfirm;