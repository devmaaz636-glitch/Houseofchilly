import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const userEmail = await AsyncStorage.getItem("userEmail");
      
      if (!userEmail) {
        setLoading(false);
        return;
      }

      // Get user's favorite restaurants from Firestore
      const favoritesRef = collection(db, "favorites");
      const favoritesQuery = query(
        favoritesRef,
        where("userEmail", "==", userEmail)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);

      const favoriteRestaurantIds = [];
      favoritesSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.restaurantId) {
          favoriteRestaurantIds.push(data.restaurantId);
        }
      });

      // Fetch restaurant details
      if (favoriteRestaurantIds.length > 0) {
        const restaurantsRef = collection(db, "restaurants");
        const restaurantsSnapshot = await getDocs(restaurantsRef);
        
        const favoriteRestaurants = [];
        restaurantsSnapshot.forEach((doc) => {
          if (favoriteRestaurantIds.includes(doc.id)) {
            favoriteRestaurants.push({
              id: doc.id,
              ...doc.data(),
            });
          }
        });
        
        setFavorites(favoriteRestaurants);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Fetch favorites error:", error);
      Alert.alert("Error", "Failed to load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (restaurantId) => {
    try {
      const userEmail = await AsyncStorage.getItem("userEmail");
      if (!userEmail) return;

      // Find and delete the favorite document
      const favoritesRef = collection(db, "favorites");
      const favoritesQuery = query(
        favoritesRef,
        where("userEmail", "==", userEmail),
        where("restaurantId", "==", restaurantId)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);

      favoritesSnapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "favorites", docSnap.id));
      });

      // Update local state
      setFavorites(favorites.filter((fav) => fav.id !== restaurantId));
      Alert.alert("Success", "Restaurant removed from favorites");
    } catch (error) {
      console.error("Remove favorite error:", error);
      Alert.alert("Error", "Failed to remove favorite. Please try again.");
    }
  };

  const handleRemoveFavorite = (restaurant) => {
    Alert.alert(
      "Remove Favorite",
      `Remove ${restaurant.name} from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFavorite(restaurant.id),
        },
      ]
    );
  };

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/restaurant/${item.name}`)}
      className="bg-[#474747] rounded-xl p-4 mb-3 mx-4 flex-row"
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        className="w-24 h-24 rounded-lg mr-3"
        resizeMode="cover"
      />
      <View className="flex-1">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-white text-lg font-bold flex-1 mr-2">
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleRemoveFavorite(item);
            }}
            className="p-2"
          >
            <Ionicons name="heart" size={24} color="#f49b33" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={16} color="#f49b33" />
          <Text className="text-white/70 text-sm ml-1 flex-1" numberOfLines={1}>
            {item.address || "Address not available"}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#f49b33" />
          <Text className="text-white/70 text-sm ml-1">
            {item.opening} - {item.closing}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-[#f49b33] px-4 py-2 rounded-lg self-start mt-3"
          onPress={(e) => {
            e.stopPropagation();
            router.push(`/restaurant/${item.name}`);
          }}
        >
          <Text className="text-white font-bold">View Menu</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-6 py-16">
      <View className="bg-[#474747] p-8 rounded-2xl items-center">
        <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
          <Ionicons name="heart-outline" size={60} color="#f49b33" />
        </View>
        <Text className="text-white text-xl font-bold mb-2">
          No Favorites Yet
        </Text>
        <Text className="text-white/70 text-center mb-6">
          Add restaurants to your favorites to quickly access them later
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          className="bg-[#f49b33] px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Browse Restaurants</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !favorites.length) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
        <ActivityIndicator size="large" color="#f49b33" />
        <Text className="text-white mt-4">Loading favorites...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-white text-2xl font-bold mb-1">
          Favorite Restaurants
        </Text>
        <Text className="text-white/70">
          {favorites.length} {favorites.length === 1 ? "restaurant" : "restaurants"}
        </Text>
      </View>

      <FlatList
        data={favorites}
        onRefresh={fetchFavorites}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchFavorites}
            tintColor="#f49b33"
          />
        }
        keyExtractor={(item) => item.id}
        renderItem={renderRestaurant}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 20,
          flexGrow: 1,
        }}
      />
    </SafeAreaView>
  );
};

export default Favorites;

