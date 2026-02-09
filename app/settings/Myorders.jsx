import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCart } from "../../store/cartContext";

const MyOrders = () => {
  const router = useRouter();
  const { cart } = useCart();

  const [refreshing, setRefreshing] = useState(false);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    if (cart?.length > 0) {
      const orders = cart.map((item, index) => ({
        id: item.id || `order-${index}`,
        name: item.name,
        description: item.description || "Delicious food item",
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        status: "Completed",
      }));
      setCompletedOrders(orders);
    }
  }, [cart]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getImageSource = (img) => {
    if (!img) return require("../../assets/images/logo.png");
    if (typeof img === "string") return { uri: img };
    return img;
  };

  const renderOrderItem = (order) => (
    <View
      key={order.id}
      className="bg-white mx-5 mb-3 rounded-2xl p-4 flex-row"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
   
      <Image
        source={getImageSource(order.image)}
        className="w-24 h-24 rounded-xl"
        resizeMode="cover"
      />

   
      <View className="flex-1 ml-4 justify-between">
      
        <View className="flex-row items-start justify-between">
          <Text
            className="text-black font-bold text-base flex-1 pr-2"
            numberOfLines={2}
          >
            {order.name}
          </Text>

         <Text className="text-[#22C55E] font-semibold text-xs mt-1 bg-[#2DC0581A] px-3 py-1 rounded-full">
  {order.status}
</Text>
        </View>

  
        <Text
          className="text-gray-500 text-xs mt-1"
          numberOfLines={1}
        >
          {order.description}
        </Text>

    

    
        <View className="bg-red-50 rounded-full px-3 py-1 mt-2 self-start">
          <Text className="text-[#D42129] font-semibold text-sm">
            Rs. {Number(order.price).toFixed(0)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
   
      <View className="px-5 py-4 relative">
 
  <TouchableOpacity
    onPress={() => router.back()}
    className="absolute left-5 top-4 bg-white p-2 rounded-full"
  >
    <Ionicons name="chevron-back" size={20} color="#000" />
  </TouchableOpacity>


  <View className="items-center">
    <Text className="text-black text-xl font-bold">
      Order List
    </Text>

    <View className="mt-1 h-[2px] w-20 bg-[#CF2526] rounded-full" />
  </View>
</View>

    
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#CF2526"]}
          />
        }
      >
        <View className="pt-4 pb-6">
          {completedOrders.length === 0 ? (
            <View className="items-center mt-20 px-10">
              <Ionicons
                name="receipt-outline"
                size={80}
                color="#CBD5E0"
              />
              <Text className="text-xl font-bold text-gray-700 mt-4">
                No Orders Yet
              </Text>
              <Text className="text-sm text-gray-500 mt-2 text-center">
                Your order history will appear here
              </Text>

              <TouchableOpacity
                onPress={() => router.push("/home")}
                className="mt-6 bg-[#CF2526] px-6 py-3 rounded-full"
              >
                <Text className="text-white font-semibold text-sm">
                  Start Ordering
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            completedOrders.map(renderOrderItem)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyOrders;