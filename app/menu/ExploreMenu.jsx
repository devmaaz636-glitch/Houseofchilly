import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useRouter } from "expo-router";
import { Fonts } from "../../constants/Typography";
import logo from "../../assets/images/logo.png";

/* 🔹 Categories */
const categories = [
  { id: "all", name: "All", icon: "🍽️" },
  { id: "cold-beverage", name: "Cold Beverage", icon: "🥤" },
  { id: "hot-beverages", name: "Hot Beverages", icon: "☕" },
  { id: "sushi", name: "Sushi", icon: "🍣" },
  { id: "breakfast", name: "Breakfast", icon: "🍳" },
  { id: "lassi", name: "Lassi", icon: "🥛" },
  { id: "biryani", name: "Biryani", icon: "🍛" },
  { id: "karahi", name: "Karahi", icon: "🍲" },
  { id: "handi", name: "Handi", icon: "🥘" },
  { id: "roll-paratha", name: "Roll Paratha", icon: "🌯" },
  { id: "bbq", name: "B.B.Q", icon: "🍖" },
  { id: "chinese", name: "Chinese", icon: "🥢" },
  { id: "appetizer", name: "Appetizer", icon: "🥗" },
  { id: "sides", name: "Sides", icon: "🍟" },
  { id: "sandwiches", name: "Sandwiches", icon: "🥪" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "soups", name: "Soups", icon: "🍲" },
  { id: "salads", name: "Salads", icon: "🥬" },
  { id: "tandoor", name: "Tandoor", icon: "🔥" },
  { id: "dessert", name: "Dessert", icon: "🍰" },
];

export default function ExploreMenu({ menuItems }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);

  /* 🔹 Category pill */
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item.id)}
      className={`px-4 py-2 mx-2 rounded-full flex-row items-center ${
        selectedCategory === item.id ? "bg-red-600" : "bg-white"
      }`}
    >
      <Text className="mr-1">{item.icon}</Text>
      <Text
        className={`font-bold text-[13px] ${
          selectedCategory === item.id ? "text-white" : "text-black"
        }`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      {/* Categories */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      />

      {/* Menu Cards */}
      <View className="px-4">
        {filteredItems.map((item, index) => (
          <Animatable.View
            key={item.id}
            animation="fadeInUp"
            duration={400}
            delay={index * 60}
            className="mb-4 rounded-2xl overflow-hidden"
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/menu/${item.id}`)}
            >
              <ImageBackground
                source={item.image || logo}
                className="h-[160px] justify-end"
                resizeMode="cover"
              >
                <View className="bg-black/40 p-4">
                  <Text
                    className="text-white text-lg font-bold mb-2"
                    style={{ fontFamily: Fonts.Urbanist.Medium }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <TouchableOpacity
                    className="bg-[#D42129] px-4 py-2 rounded-full self-start"
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push(`/menu/${item.id}`);
                    }}
                  >
                    <Text
                      className="text-white text-sm font-bold uppercase"
                      style={{ fontFamily: Fonts.Urbanist.Medium }}
                    >
                      Order Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Animatable.View>
        ))}
      </View>
    </View>
  );
}
