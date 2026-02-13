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
import { imageMap } from "../../utils/imageMap"; 
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const sideItems = [
  { id: 1, name: "Soft Drinks", image: require("../../assets/images/pepsi1.png"), price: 50 },
  { id: 2, name: "Blue Lagoon", image: require("../../assets/images/pepsi2.png"), price: 60 },
  { id: 3, name: "Orange Blast", image: require("../../assets/images/pepsi3.png"), price: 55 },
  { id: 4, name: "Berry Punch", image: require("../../assets/images/pepsi4.png"), price: 65 },
];

export default function MenuDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [menuItem, setMenuItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartVisible, setCartVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSides, setSelectedSides] = useState([]);

  const { addToCart, getCartItemCount, isItemInCart, getItemQuantity } = useCart();

  // Auto-scroll carousel for multiple images
  useEffect(() => {
    if (!menuItem || !menuItem.images || menuItem.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === menuItem.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [menuItem]);

  useEffect(() => {
    loadMenuItem();
  }, [id]);

  const loadMenuItem = async () => {
    try {
      setLoading(true);

      let foundItem = menuItems.find(
        (item) => String(item.id) === String(id)
      );

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
            image: data.imageAsset
              ? imageMap[data.imageAsset] || null
              : data.image || null,
            images: data.images || (data.image ? [data.image] : []), 
          };
        }
      }

      if (!foundItem) {
        Alert.alert("Error", "Menu item not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
        return;
      }

      // Ensure images array exists
      if (!foundItem.images && foundItem.image) {
        foundItem.images = [foundItem.image];
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

  const toggleSideItem = (sideItem) => {
    const isSelected = selectedSides.some(item => item.id === sideItem.id);
    
    if (isSelected) {
      // Remove from selected sides
      setSelectedSides((prev) => prev.filter((item) => item.id !== sideItem.id));
    } else {
      // Add to selected sides
      setSelectedSides((prev) => [...prev, sideItem]);
    }
  };

  const handleAddSideToCart = (sideItem) => {
    addToCart(
      {
        ...sideItem,
        type: 'side',
        quantity: 1,
        totalPrice: sideItem.price,
      },
      menuItem?.id
    );

    Alert.alert(
      "Added to Cart",
      `${sideItem.name} added to cart`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { text: "View Cart", onPress: () => setCartVisible(true) },
      ]
    );
  };

  const handleAddToCart = () => {
    if (!menuItem) return;

    // Add main menu item
    addToCart(
      {
        ...menuItem,
        type: 'menu',
        quantity,
        totalPrice: menuItem.price * quantity,
      },
      menuItem.id
    );

    // Add selected sides
    selectedSides.forEach((sideItem) => {
      addToCart(
        {
          ...sideItem,
          type: 'side',
          quantity: 1,
          totalPrice: sideItem.price,
        },
        menuItem.id
      );
    });

    const sidesText = selectedSides.length > 0 
      ? ` with ${selectedSides.length} side item(s)` 
      : '';

    Alert.alert(
      "Added to Cart",
      `${quantity} × ${menuItem.name}${sidesText} added to cart`,
      [
        { text: "Continue Shopping", style: "cancel" },
        { text: "View Cart", onPress: () => setCartVisible(true) },
      ]
    );

    // Clear selected sides after adding
    setSelectedSides([]);
  };

  const handleOrderNow = () => {
    if (!menuItem) return;
    
    // Add main menu item
    addToCart(
      {
        ...menuItem,
        type: 'menu',
        quantity,
        totalPrice: menuItem.price * quantity,
      },
      menuItem.id
    );

    // Add selected sides
    selectedSides.forEach((sideItem) => {
      addToCart(
        {
          ...sideItem,
          type: 'side',
          quantity: 1,
          totalPrice: sideItem.price,
        },
        menuItem.id
      );
    });

    setTimeout(() => {
      router.push("/(tabs)/checkout");
    }, 300);
  };

  const getImageSource = () => {
    if (!menuItem) return null;
    if (menuItem.images && menuItem.images.length > 0) {
      const currentImage = menuItem.images[currentImageIndex];
      return typeof currentImage === "string" 
        ? { uri: currentImage } 
        : currentImage;
    }
    if (menuItem.image) {
      return typeof menuItem.image === "string"
        ? { uri: menuItem.image }
        : menuItem.image;
    }
    return null;
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

  const hasMultipleImages = menuItem.images && menuItem.images.length > 1;

  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: "#fff" },
        Platform.OS === "android" && { paddingBottom: 55 },
      ]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
       <TouchableOpacity
  onPress={() => router.back()}
  className="bg-white rounded-full p-2 shadow-md"
>
  <Ionicons name="chevron-back" size={22} color="#000" />
</TouchableOpacity>


       <View className="items-center my-1">
  <Text
    className="text-[16px] text-center"
    style={{
      fontFamily: "Shrikhand",
      fontStyle: "italic",
      fontWeight: "800",
      lineHeight: 30,
      letterSpacing: -0.5,
      includeFontPadding: false,
      textAlignVertical: "center",
    }}
  >
    Overview
  </Text>

  {/* Underline */}
  <View className="w-16 h-[1px] bg-[#CF2526] mt-1" />
</View>


        <TouchableOpacity onPress={() => setCartVisible(true)}>
  <View className="relative bg-white rounded-full p-2 shadow-md">
    <Ionicons name="cart-outline" size={24} color="#000" />

    {getCartItemCount() > 0 && (
      <View className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 rounded-full items-center justify-center">
        <Text className="text-white text-[10px] font-bold">
          {getCartItemCount()}
        </Text>
      </View>
    )}
  </View>
</TouchableOpacity>

      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={{ width, height: 320 }} className="relative">
          <Animatable.View
            key={currentImageIndex}
            animation="fadeIn"
            duration={600}
            style={{ width: "100%", height: "100%" }}
          >
            <Image
              source={getImageSource()}
              style={{ width: "100%", height: "100%", borderRadius: 16 }}
              resizeMode="cover"
            />
          </Animatable.View>

          {hasMultipleImages && (
            <View className="absolute bottom-4 left-0 right-0 flex-row justify-center items-center gap-2">
              {menuItem.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  className="h-2 rounded"
                  style={{
                    width: index === currentImageIndex ? 24 : 8,
                    backgroundColor: index === currentImageIndex ? '#D42129' : '#FFFFFF',
                    opacity: index === currentImageIndex ? 1 : 0.6,
                  }}
                />
              ))}
            </View>
          )}
        </View>

        <View className="px-4 py-6">
          {/* Title + Price */}
          <View className="flex-row justify-between items-start mb-2">
            <Text
              className="text-3xl font-bold flex-1 pr-2"
              style={{ fontFamily: Fonts.Urbanist.Medium }}
            >
              {menuItem.name}
            </Text>
            <Text
              className="text-[14px] font-semibold text-[#D42129] bg-[#D421291A] rounded-full px-3 py-[4px]"
              style={{ fontFamily: Fonts.Poppins.SemiBold }}
            >
              Rs. {menuItem.price}
            </Text>
          </View>

          {menuItem.description && (
            <Text
              className="text-[#666666] mb-6 text-[14px] leading-[14px] tracking-[-0.30px]"
              style={{ fontFamily: Fonts.Poppins.Regular }}
            >
              {menuItem.description}
            </Text>
          )}

          {/* Status Badges */}
          <View className="flex-row justify-center items-center gap-3 mb-6">
            <View className="flex-row items-center px-3 py-2 rounded-lg" style={{ backgroundColor: '#22C55E' }}>
              <Ionicons name="bag-check" size={16} color="#fff" style={{ marginRight: 4 }} />
              <Text className="text-white text-xs font-semibold" style={{ fontFamily: Fonts.Poppins.SemiBold }}>Delivered</Text>
            </View>

            <View className="flex-row items-center px-3 py-2 rounded-lg" style={{ backgroundColor: '#EF4444' }}>
              <Ionicons name="time-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
              <Text className="text-white text-xs font-semibold" style={{ fontFamily: Fonts.Poppins.SemiBold }}>10 mins</Text>
            </View>

            <View className="flex-row items-center px-3 py-2 rounded-lg" style={{ backgroundColor: '#FCD34D' }}>
              <Ionicons name="star" size={16} color="#fff" style={{ marginRight: 4 }} />
              <Text className="text-white text-xs font-semibold" style={{ fontFamily: Fonts.Poppins.SemiBold }}>4.5 Rating</Text>
            </View>
          </View>

          {/* Choose Your Sides Section */}
          <View className="mb-6">
            <Text className="text-2xl font-bold mb-4" style={{ fontFamily: "Shrikhand", fontStyle: "italic" }}>
              Choose Your Sides
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {sideItems.map((item) => {
                const isSelected = selectedSides.some(side => side.id === item.id);
                const cartQuantity = getItemQuantity(item.id, 'side');
                
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => toggleSideItem(item)}
                    onLongPress={() => handleAddSideToCart(item)}
                    className="mr-4"
                    style={{
                      width: 90,
                      height: 160,
                      borderRadius: 12,
                      backgroundColor: isSelected ? '#FEF3F2' : '#F5F5F5',
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: '#D42129',
                      padding: 8,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                      <Image
                        source={item.image}
                        style={{ width: 80, height: 80, resizeMode: 'contain' }}
                      />
                      <Text 
                        className="text-xs font-semibold mt-2 text-center"
                        style={{ fontFamily: Fonts.Poppins.SemiBold }}
                      >
                        {item.name}
                      </Text>
                      <Text 
                        className="text-xs text-[#D42129] font-bold"
                        style={{ fontFamily: Fonts.Poppins.Bold }}
                      >
                        Rs. {item.price}
                      </Text>
                    </View>
                    
                    {isSelected && (
                      <View className="absolute top-2 right-2 bg-red-600 rounded-full" style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      </View>
                    )}

                    {cartQuantity > 0 && (
                      <View className="absolute bottom-2 left-2 rounded-full px-2 py-1">
                        <Text className="text-white text-xs font-bold">
                          {/* {cartQuantity} in cart */}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={() => handleAddSideToCart(item)}
                      className="bg-red-600 w-full py-1 rounded-lg mt-2"
                    >
                      <Text className="text-white text-xs text-center font-bold">
                        Add
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Quantity + Add to Cart */}
          <View className="flex-row items-center gap-3 mb-4">
            <View className="flex-row items-center gap-3 rounded-xl px-3 py-2 border border-red-600">
              <TouchableOpacity onPress={decreaseQuantity} className="bg-white w-8 h-8 rounded-full items-center justify-center border border-red-600">
                <Ionicons name="remove" size={18} />
              </TouchableOpacity>

              <Text className="text-lg font-bold w-8 text-center" style={{ fontFamily: Fonts.Urbanist.Medium }}>
                {quantity}
              </Text>

              <TouchableOpacity onPress={increaseQuantity} className="bg-white w-8 h-8 rounded-full items-center justify-center border border-red-600">
                <Ionicons name="add" size={18} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleAddToCart} className="bg-red-600 py-4 rounded-xl items-center flex-1">
              <Text className="text-white text-base font-bold" style={{ fontFamily: Fonts.Urbanist.Medium }}>
                Add To Cart
              </Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <CartComponent visible={cartVisible} onClose={() => setCartVisible(false)} />
    </SafeAreaView>
  );
}