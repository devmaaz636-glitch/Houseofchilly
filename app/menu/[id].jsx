import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCart } from "../../store/cartContext";
import { menuItems } from "../../config/menuItems";
import { Fonts } from "../../constants/Typography";
import CartComponent from "../../components/restaurant/CartComponent";
import { getImage } from "../../utils/imageMap";

const { width } = Dimensions.get("window");

export default function MenuDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [menuItem, setMenuItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartVisible, setCartVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addToCart, getCartItemCount } = useCart();

  useEffect(() => {
    loadMenuItem();
  }, [id]);

  const loadMenuItem = async () => {
    try {
      setLoading(true);

      // 1️⃣ Try local menu first
      let foundItem = menuItems.find(
        (item) => String(item.id) === String(id)
      );

       // 2️⃣ If not found locally, try Firebase
       if (!foundItem) {
         const menuQuery = query(
           collection(db, "menu"),
           where("id", "==", id)
         );
         const snapshot = await getDocs(menuQuery);

         if (!snapshot.empty) {
           const docSnap = snapshot.docs[0];
           const data = docSnap.data();

           foundItem = {
             id: docSnap.id,
             ...data,
             // Map image asset name to image using getImage helper
             image: data.imageAsset ? getImage(data.imageAsset) : (data.image || null),
           };
         }
       }

      if (!foundItem) {
        Alert.alert("Error", "Menu item not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }

      setMenuItem(foundItem);
    } catch (error) {
      console.error("Menu load error:", error);
      Alert.alert("Error", "Failed to load menu item");
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!menuItem) return;

    addToCart(
      {
        ...menuItem,
        quantity,
        totalPrice: menuItem.price * quantity,
      },
      menuItem.id
    );

    Alert.alert(
      "Added to Cart",
      `${quantity} × ${menuItem.name} added to cart`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { text: "View Cart", onPress: () => setCartVisible(true) },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text style={{ fontFamily: Fonts.Poppins.Regular }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!menuItem) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text style={{ fontFamily: Fonts.Poppins.Regular }}>
          Item not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: "#fff" },
        Platform.OS === "android" && { paddingBottom: 55 },
      ]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text
          className="text-lg font-bold"
          style={{ fontFamily: Fonts.Urbanist.Medium }}
        >
          Menu Detail
        </Text>

        <TouchableOpacity onPress={() => setCartVisible(true)}>
          <View className="relative">
            <Ionicons name="cart-outline" size={24} color="#000" />
            {getCartItemCount() > 0 && (
              <View className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {getCartItemCount()}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
         {/* Image */}
         <View style={{ width, height: 300 }}>
           <Image
             source={menuItem.image || require("../../assets/images/logo.png")}
             style={{ width: "100%", height: "100%" }}
             resizeMode="cover"
           />
         </View>

        {/* Details */}
        <View className="px-4 py-6">
          <Text
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: Fonts.Urbanist.Medium }}
          >
            {menuItem.name}
          </Text>

          <Text
            className="text-2xl font-bold mb-4 text-red-600"
            style={{ fontFamily: Fonts.Urbanist.Medium }}
          >
            ${Number(menuItem.price).toFixed(2)}
          </Text>

          {menuItem.description && (
            <Text
              className="text-gray-600 mb-6 leading-6"
              style={{ fontFamily: Fonts.Poppins.Regular }}
            >
              {menuItem.description}
            </Text>
          )}

          {/* Quantity */}
          <View className="flex-row justify-between items-center mb-6">
            <Text
              className="text-lg font-bold"
              style={{ fontFamily: Fonts.Urbanist.Medium }}
            >
              Quantity
            </Text>

            <View className="flex-row items-center gap-4">
              <TouchableOpacity
                onPress={decreaseQuantity}
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
              >
                <Ionicons name="remove" size={20} />
              </TouchableOpacity>

              <Text
                className="text-xl font-bold w-8 text-center"
                style={{ fontFamily: Fonts.Urbanist.Medium }}
              >
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={increaseQuantity}
                className="bg-gray-200 w-10 h-10 rounded-full items-center justify-center"
              >
                <Ionicons name="add" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total */}
          <View className="bg-gray-100 p-4 rounded-xl mb-6">
            <View className="flex-row justify-between">
              <Text
                className="text-lg font-bold"
                style={{ fontFamily: Fonts.Urbanist.Medium }}
              >
                Total
              </Text>
              <Text
                className="text-2xl font-bold text-red-600"
                style={{ fontFamily: Fonts.Urbanist.Medium }}
              >
                ${(menuItem.price * quantity).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            onPress={handleAddToCart}
            className="bg-red-600 py-4 rounded-xl items-center mb-4"
          >
            <Text
              className="text-white text-lg font-bold"
              style={{ fontFamily: Fonts.Urbanist.Medium }}
            >
              ADD TO CART
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleAddToCart();
              setTimeout(() => router.push("/checkout"), 300);
            }}
            className="border-2 border-red-600 py-4 rounded-xl items-center"
          >
            <Text
              className="text-red-600 text-lg font-bold"
              style={{ fontFamily: Fonts.Urbanist.Medium }}
            >
              ORDER NOW
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Cart */}
      <CartComponent
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
      />
    </SafeAreaView>
  );
}
