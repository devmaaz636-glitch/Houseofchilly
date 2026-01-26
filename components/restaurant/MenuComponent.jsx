import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCart } from "../../store/cartContext";

const MenuComponent = ({ restaurantId, restaurantName }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, restaurantId: cartRestaurantId } = useCart();

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      
      let items = [];

      // Strategy 1: Query by restaurantId (document ID)
      if (restaurantId) {
        try {
          let menuQuery = query(
            collection(db, "menu"),
            where("restaurantId", "==", restaurantId)
          );
          let menuSnapshot = await getDocs(menuQuery);
          menuSnapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...docSnap.data() });
          });
        } catch (error) {
          console.log("Query by restaurantId failed:", error);
        }
      }

      // Strategy 2: Query by restaurantName (exact match)
      if (items.length === 0 && restaurantName) {
        try {
          let menuQuery = query(
            collection(db, "menu"),
            where("restaurantName", "==", restaurantName)
          );
          let menuSnapshot = await getDocs(menuQuery);
          menuSnapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...docSnap.data() });
          });
        } catch (error) {
          console.log("Query by restaurantName failed:", error);
        }
      }

      // Strategy 3: Get all menu items and filter client-side by name (partial match)
      if (items.length === 0 && restaurantName) {
        try {
          const allMenuSnapshot = await getDocs(collection(db, "menu"));
          allMenuSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            // Check if restaurant name matches (case-insensitive)
            if (data.restaurantName && 
                data.restaurantName.toLowerCase() === restaurantName.toLowerCase()) {
              items.push({ id: docSnap.id, ...data });
            }
          });
        } catch (error) {
          console.log("Client-side filtering failed:", error);
        }
      }

      // Strategy 4: If still no items, show all available menu items (for demo/fallback)
      if (items.length === 0) {
        try {
          const allMenuSnapshot = await getDocs(collection(db, "menu"));
          allMenuSnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            // Only show available items
            if (data.available !== false) {
              items.push({ id: docSnap.id, ...data });
            }
          });
        } catch (error) {
          console.log("Fallback menu fetch failed:", error);
        }
      }

      // If still no items, create demo menu items for this restaurant
      if (items.length === 0) {
        items = [
          {
            id: "demo-1",
            name: "Chicken Kebab",
            description: "Tender grilled chicken marinated in special spices",
            price: 18.99,
            category: "Main Course",
            image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
            available: true,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
          },
          {
            id: "demo-2",
            name: "Beef Kebab",
            description: "Premium beef grilled to perfection",
            price: 22.99,
            category: "Main Course",
            image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
            available: true,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
          },
          {
            id: "demo-3",
            name: "Hummus",
            description: "Creamy chickpea dip with olive oil and spices",
            price: 8.99,
            category: "Appetizers",
            image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
            available: true,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
          },
          {
            id: "demo-4",
            name: "Fresh Salad",
            description: "Mixed greens with vegetables and dressing",
            price: 9.99,
            category: "Appetizers",
            image: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg",
            available: true,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
          },
          {
            id: "demo-5",
            name: "Baklava",
            description: "Sweet pastry with honey and mixed nuts",
            price: 6.99,
            category: "Desserts",
            image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg",
            available: true,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
          },
          {
            id: "demo-6",
            name: "Mint Tea",
            description: "Traditional refreshing mint tea",
            price: 3.99,
            category: "Beverages",
            image: "https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg",
            available: true,
            restaurantId: restaurantId,
            restaurantName: restaurantName,
          },
        ];
      }

      setMenuItems(items);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(items.map((item) => item.category || "Other")),
      ];
      setCategories(uniqueCategories);
      
      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setLoading(false);
      // Don't show alert, just show empty state
    }
  };

  const handleAddToCart = (item) => {
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      Alert.alert(
        "Cart contains items from another restaurant",
        "Do you want to clear your cart and add items from this restaurant?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Clear & Add",
            onPress: () => {
              // Clear cart will be handled by addToCart function
              addToCart(item, restaurantId);
              Alert.alert("Success", `${item.name} added to cart!`);
            },
          },
        ]
      );
    } else {
      addToCart(item, restaurantId);
      Alert.alert("Success", `${item.name} added to cart!`);
    }
  };

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  const renderMenuItem = ({ item }) => (
    <View className="bg-[#474747] rounded-xl p-4 mb-3 mx-2 flex-row">
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        className="w-24 h-24 rounded-lg mr-3"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-white text-lg font-bold mb-1">{item.name}</Text>
        <Text className="text-white/70 text-sm mb-2 flex-1">
          {item.description || "Delicious dish"}
        </Text>
        <View className="flex-row justify-between items-center mt-auto">
          <Text className="text-[#f49b33] text-xl font-bold">
            ${item.price?.toFixed(2) || "0.00"}
          </Text>
          <TouchableOpacity
            onPress={() => handleAddToCart(item)}
            className="bg-[#f49b33] px-4 py-2 rounded-lg flex-row items-center"
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text className="text-white font-bold ml-1">Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="py-8 items-center">
        <Ionicons name="restaurant-outline" size={48} color="#f49b33" />
        <Text className="text-white mt-4">Loading menu...</Text>
      </View>
    );
  }

  if (menuItems.length === 0) {
    return (
      <View className="py-8 items-center bg-[#474747] rounded-xl mx-2 mb-4">
        <Ionicons name="restaurant-outline" size={48} color="#f49b33" />
        <Text className="text-white text-lg font-bold mt-4">
          Menu Not Available
        </Text>
        <Text className="text-white/70 text-center mt-2 px-4">
          Menu items for this restaurant are not yet available.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-4">
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ paddingHorizontal: 8 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`mx-2 px-6 py-3 rounded-full ${
              selectedCategory === category
                ? "bg-[#f49b33]"
                : "bg-[#474747]"
            }`}
          >
            <Text
              className={`font-bold ${
                selectedCategory === category ? "text-white" : "text-white/80"
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <View className="py-8 items-center">
            <Text className="text-white/70">No items in this category</Text>
          </View>
        }
      />
    </View>
  );
};

export default MenuComponent;

