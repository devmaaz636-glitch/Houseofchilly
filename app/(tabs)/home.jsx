
import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { menuItems, categories } from "../../config/menuItems";
import { getImage } from "../../utils/imageMap";
import home1 from "../../assets/images/home1.png";
import menuIcon from '../../assets/images/menus.png';
import logo from "../../assets/images/logo.png";
import locationicon from "../../assets/images/locationicon.png";
import homelocationicon from '../../assets/images/homelocationicon.png';
import deliveryicon from "../../assets/images/deliveryicon.png";
import homesubimage from "../../assets/images/homesubimage.png";
import homehandisubimage from "../../assets/images/homehandisubimage.png";
import homerollsubimage from "../../assets/images/homerollsubimage.png";

import { Fonts } from "../../constants/Typography";

const { width: screenWidth } = Dimensions.get("window");
const bannerWidth = screenWidth - 32;
const bannerHeight = (bannerWidth * 160) / 350;

// Define carousel banners
const carouselBanners = [
  {
    id: 1,
    image: home1,
    subImage: homesubimage,
    discount: "50",
    title: "Tasty Hyderabadi",
    subtitle: "& sindhi biryani"
  },
  {
    id: 2,
    image: home1,
    subImage: homehandisubimage,
    discount: "30",
    title: "Special Karachi",
    subtitle: "biryani deal"
  },
  {
    id: 3,
    image: home1,
    subImage: homerollsubimage,
    discount: "40",
    title: "Hot & Crispy",
    subtitle: "fried chicken"
  }
];

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderType, setOrderType] = useState('delivery');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [menuItemsData, setMenuItemsData] = useState(menuItems);
  const [loading, setLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => 
        prevIndex === carouselBanners.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const menuQuery = query(collection(db, "menu"));
      const menuSnapshot = await getDocs(menuQuery);
      
      if (!menuSnapshot.empty) {
        const fetchedItems = [];
        menuSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedItems.push({
            id: doc.id,
            ...data,
            image: data.imageAsset ? getImage(data.imageAsset) : (data.image || null),
          });
        });
        setMenuItemsData(fetchedItems.length > 0 ? fetchedItems : menuItems);
      }
    } catch (error) {
      console.log("Using local menu items", error);
      setMenuItemsData(menuItems);
    } finally {
      setLoading(false);
    }
  };

  // Get filtered items based on category
  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return menuItemsData;
    }
    return menuItemsData.filter(item => item.category === selectedCategory);
  };

  // Group items by category for "all" view
  const getGroupedItemsByCategory = () => {
    const grouped = {};
    
    // Get categories that have items (excluding 'all')
    const categoriesWithItems = categories.filter(cat => cat.id !== 'all');
    
    categoriesWithItems.forEach(category => {
      const itemsInCategory = menuItemsData.filter(
        item => item.category === category.id
      );
      
      // Only include category if it has items
      if (itemsInCategory.length > 0) {
        grouped[category.id] = {
          name: category.name,
          items: itemsInCategory.slice(0, 4) // Take first 4 items
        };
      }
    });
    
    return grouped;
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setAnimationKey(prev => prev + 1);
    setMenuDrawerVisible(false);
  };

  // Menu Drawer Functions
  const openMenuDrawer = () => {
    setMenuDrawerVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenuDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuDrawerVisible(false);
    });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCategoryChange(item.id)}
      className={`px-5 py-2.5 mx-2 rounded-full min-w-[90px] items-center justify-center ${
        selectedCategory === item.id 
          ? 'bg-red-600' 
          : 'bg-white border border-gray-200'
      }`}
    >
      <Text
        className={`font-bold text-[13px] ${
          selectedCategory === item.id 
            ? 'text-white' 
            : 'text-gray-700'
        }`}
        style={{ fontFamily: Fonts.Poppins.SemiBold }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render menu item card
  const renderMenuItem = (item, index, cardWidth) => (
    <Animatable.View
      key={item.id}
      animation="fadeInUp"
      duration={400}
      delay={index * 50}
      style={{ width: cardWidth }}
    >
      <TouchableOpacity
        onPress={() => router.push(`/menu/${item.id}`)}
        activeOpacity={0.9}
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <View className="p-4">
          {/* Item Name */}
          <Text
            style={{
              fontFamily: Fonts.Poppins.SemiBold,
              fontWeight: '600',
              fontSize: 14,
              lineHeight: 18,
              color: '#000000',
              textAlign: 'center',
              marginBottom: 6,
            }}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          {/* Price */}
          <Text
            className="text-center text-[14px] font-semibold text-[#D42129] bg-[#D421291A] rounded-full px-3 py-[2px] self-center mb-3"
            style={{ fontFamily: Fonts.Poppins.SemiBold }}
          >
            Rs. {item.price}
          </Text>

          {/* Image */}
          <View 
            className="items-center justify-center mb-4"
            style={{
              width: '100%',
              height: cardWidth * 0.75,
            }}
          >
            <Image
              source={item.image || logo}
              style={{ 
                width: '90%', 
                height: '90%',
              }}
              resizeMode="contain"
            />
          </View>

          {/* Order Button */}
          <TouchableOpacity
            className="bg-red-600 py-2.5 rounded-full"
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/menu/${item.id}`);
            }}
            activeOpacity={0.8}
            style={{
              shadowColor: '#D42129',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Text
              className="text-white font-bold text-sm text-center uppercase"
              style={{ 
                fontFamily: Fonts.Poppins.SemiBold,
                letterSpacing: 0.5,
              }}
            >
              ORDER NOW
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  // Render menu grid for specific category
  const renderCategoryMenuGrid = () => {
    const cardWidth = (screenWidth - 48) / 2;
    const filteredItems = getFilteredItems();

    return (
      <Animatable.View
        key={`menu-grid-${animationKey}`}
        animation="fadeIn"
        duration={500}
        className="px-4 mb-6"
      >
        <View className="flex-row flex-wrap" style={{ gap: 16 }}>
          {filteredItems.map((item, index) => 
            renderMenuItem(item, index, cardWidth)
          )}
        </View>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <View className="py-12 items-center">
            <Text
              className="text-gray-400 text-base"
              style={{ fontFamily: Fonts.Poppins.Medium }}
            >
              No items in this category
            </Text>
          </View>
        )}
      </Animatable.View>
    );
  };

  // Render all categories with 4 items each
  const renderAllCategoriesView = () => {
    const cardWidth = (screenWidth - 48) / 2;
    const groupedItems = getGroupedItemsByCategory();
    const categoryKeys = Object.keys(groupedItems);

    if (categoryKeys.length === 0) {
      return (
        <View className="py-12 items-center px-4">
          <Text
            className="text-gray-400 text-base"
            style={{ fontFamily: Fonts.Poppins.Medium }}
          >
            No items available
          </Text>
        </View>
      );
    }

    return (
      <Animatable.View
        key={`all-categories-${animationKey}`}
        animation="fadeIn"
        duration={500}
        className="mb-6"
      >
        {categoryKeys.map((categoryId, categoryIndex) => {
          const categoryData = groupedItems[categoryId];
          
          return (
            <View key={categoryId} className="mb-8">
              {/* Category Header */}
              <View className="px-4 mb-4 flex-row items-center justify-between">
                <View>
                  <Text
                    className="text-xl font-bold italic"
                    style={{ fontFamily: Fonts.Shrikhand, color: "#1F2937" }}
                  >
                    {categoryData.name}
                  </Text>
                  <View className="mt-1 w-16 h-[3px] bg-[#CF2526] rounded-full" />
                </View>
                
                {/* See All Button */}
                <TouchableOpacity 
                  activeOpacity={0.7}
                  onPress={() => handleCategoryChange(categoryId)}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.Poppins.SemiBold,
                      fontWeight: '600',
                      fontSize: 12,
                      lineHeight: 12,
                      letterSpacing: -0.24,
                      textAlign: 'center',
                      color: '#D42129',
                    }}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Category Items Grid */}
              <Animatable.View
                animation="fadeIn"
                duration={400}
                delay={categoryIndex * 100}
                className="px-4"
              >
                <View className="flex-row flex-wrap" style={{ gap: 16 }}>
                  {categoryData.items.map((item, index) => 
                    renderMenuItem(item, index, cardWidth)
                  )}
                </View>
              </Animatable.View>
            </View>
          );
        })}
      </Animatable.View>
    );
  };

 const renderBannerCarousel = () => {
    const banner = carouselBanners[currentBannerIndex];

    const renderBannerText = () => {
      if (banner.id === 1) {
        return (
          <View style={{ marginTop: 4, maxWidth: screenWidth * 0.45 }}>
            <Text 
              style={{ 
                fontSize: screenWidth * 0.032,
                fontFamily: Fonts.Shrikhand,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: 0.36,
                lineHeight: screenWidth * 0.04,
                color: '#FFFFFF'
              }}
            >
              Tasty Hyderabadi
            </Text>
            <Text 
              style={{ 
                fontSize: screenWidth * 0.032,
                fontFamily: Fonts.Shrikhand,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: 0.36,
                lineHeight: screenWidth * 0.04,
                color: '#FFFFFF99'
              }}
            >
              {banner.subtitle}
            </Text>
          </View>
        );
      } else {
        return (
          <View style={{ marginTop: 4, maxWidth: screenWidth * 0.45 }}>
            <Text 
              style={{ 
                fontSize: screenWidth * 0.032,
                fontFamily: Fonts.Shrikhand,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: 0.36,
                lineHeight: screenWidth * 0.04
              }}
            >
              <Text style={{ color: '#FFFFFF' }}>{banner.title}</Text>
              {'\n'}
              <Text style={{ color: '#FFFFFF99' }}>{banner.subtitle}</Text>
            </Text>
          </View>
        );
      }
    };

    return (
      <View className="mb-6">
        <View
          className="self-center rounded-2xl overflow-hidden relative"
          style={{ 
            width: bannerWidth, 
            height: bannerHeight,
          }}
        >
          {/* Background Image - home1 only */}
          <ImageBackground
            source={banner.image}
            className="w-full h-full absolute"
            resizeMode="cover"
          />
          
          {/* Text and Button container with smooth fade and scale animation */}
          <Animatable.View
            key={`text-${currentBannerIndex}`}
            animation={{
              0: {
                opacity: 0,
                translateX: -30,
                scale: 0.9,
              },
              1: {
                opacity: 1,
                translateX: 0,
                scale: 1,
              },
            }}
            duration={700}
            easing="ease-out"
            className="absolute z-10 justify-center"
            style={{ 
              left: screenWidth * 0.04,
              top: 0,
              bottom: 0,
              maxWidth: screenWidth * 0.45
            }}
          >
            {/* Discount */}
            <Text 
              className="font-bold uppercase italic"
              style={{ 
                color: '#D42129',
                fontSize: screenWidth * 0.06,
                fontFamily: Fonts.Shrikhand,
                letterSpacing: 0.72,
                lineHeight: screenWidth * 0.07
              }}
            >
              {banner.discount}% OFF
            </Text>
            
            {renderBannerText()}

            <TouchableOpacity 
              className="mt-3 self-start rounded-full px-4 py-2"
              style={{ backgroundColor: '#D42129' }}
              activeOpacity={0.8}
            >
              <Text 
                className="text-white text-sm font-bold uppercase"
                style={{
                  fontFamily: Fonts.Shrikhand,
                  letterSpacing: 0.42
                }}
              >
                Order Now
              </Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* Sub Image on the right side with smooth fade and scale animation */}
          <Animatable.View
            key={`image-${currentBannerIndex}`}
            animation={{
              0: {
                opacity: 0,
                translateX: 30,
                scale: 0.85,
              },
              1: {
                opacity: 1,
                translateX: 0,
                scale: 1,
              },
            }}
            duration={700}
            easing="ease-out"
            className="absolute top-0 bottom-0 right-0 justify-center items-center z-0"
            style={{
              width: bannerWidth * 0.4,
            }}
          >
            <Image
              source={banner.subImage}
              className="w-full h-full"
              resizeMode="contain"
            />
          </Animatable.View>
        </View>

        {/* Carousel Indicators */}
        <View className="flex-row justify-center items-center mt-4 gap-2">
          {carouselBanners.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentBannerIndex(index)}
              className="h-2 rounded"
              style={{
                width: index === currentBannerIndex ? 24 : 8,
                backgroundColor: index === currentBannerIndex ? '#D42129' : '#E5E7EB',
              }}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#F5F5F5" },
        Platform.OS === "android" && { paddingBottom: 55 },
        Platform.OS === "ios" && { paddingBottom: 20 },
      ]}
    >
      {/* Header */}
      <View 
        className="flex-row items-center justify-between px-4 py-3 bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        {/* Location */}
        <View className="flex-row items-center flex-1">
          <Image
            source={homelocationicon}
            className="w-7 h-7 mr-2"
            resizeMode="contain"
          />
          <View>
            <Text
              className="text-black font-bold text-sm"
              style={{ fontFamily: Fonts.Poppins.Medium }}
            >
              Home
            </Text>
            <Text
              className="text-gray-600 text-xs"
              style={{ fontFamily: Fonts.Poppins.Regular }}
            >
              Pakistan
            </Text>
          </View>
        </View>

        {/* Logo - Centered */}
        <View className="items-center justify-center">
          <Image
            source={logo}
            className="w-[50px] h-[60px]"
            resizeMode="contain"
          />
        </View>

        {/* Menu Icon */}
        <View className="flex-1 items-end">
          <TouchableOpacity 
            onPress={openMenuDrawer}
            className="bg-white p-2 rounded-xl"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Image
              source={menuIcon}
              className="w-7 h-7"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Type Buttons */}
        <View className="flex-row px-4 py-4 gap-4">
          <TouchableOpacity
            onPress={() => setOrderType('pickup')}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl ${
              orderType === 'pickup' 
                ? 'bg-white border-2 border-red-600' 
                : 'bg-white border border-gray-200'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 2,
            }}
            activeOpacity={0.8}
          >
            <Image
              source={locationicon}
              className="w-5 h-5 mr-2"
              resizeMode="contain"
            />
            <Text
              className={`ml-2 font-bold ${
                orderType === 'pickup' ? 'text-red-600' : 'text-gray-600'
              }`}
              style={{ fontFamily: Fonts.Urbanist.Medium }}
            >
              Pick Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setOrderType('delivery');
              router.push("/delivery");
            }}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-xl ${
              orderType === 'delivery'
                ? 'bg-white border-2 border-red-600'
                : 'bg-white border border-gray-200'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
              elevation: 2,
            }}
            activeOpacity={0.8}
          >
            <Image
              source={deliveryicon}
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text
              className={`ml-2 font-bold ${
                orderType === 'delivery' ? 'text-red-600' : 'text-gray-600'
              }`}
              style={{ fontFamily: Fonts.Urbanist.Medium }}
            >
              Delivery
            </Text>
          </TouchableOpacity>
        </View>

        {/* What's New Here Section with Carousel */}
        <View className="mb-6">
          <View className="px-4 mb-4">
            <Text
              className="text-2xl font-bold italic"
              style={{ fontFamily: Fonts.Shrikhand, color: "#1F2937" }}
            >
              Whats New Here
            </Text>
            <View className="mt-1 w-20 h-[3px] bg-[#CF2526] rounded-full" />
          </View>

          {renderBannerCarousel()}
        </View>

        {/* Explore Menu Section */}
        <View className="mb-4">
          <View className="px-4 mb-4">
            <Text
              className="text-2xl font-bold italic"
              style={{ fontFamily: Fonts.Shrikhand, color: "#1F2937" }}
            >
              Explore Menu
            </Text>
            <View className="mt-1 w-20 h-[3px] bg-[#CF2526] rounded-full" />
          </View>
          
          {/* Categories */}
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          />

          {/* Menu Display - Show all categories or specific category */}
          {selectedCategory === 'all' 
            ? renderAllCategoriesView() 
            : renderCategoryMenuGrid()
          }
        </View>

        {/* Bottom Padding */}
        <View className="h-[100px]" />
      </ScrollView>

      {/* Menu Drawer Modal */}
      <Modal
        visible={menuDrawerVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenuDrawer}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPress={closeMenuDrawer}
          className="flex-1 bg-black/50"
        >
          <Animated.View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: screenWidth * 0.75,
              backgroundColor: '#FFFFFF',
              transform: [{ translateX: slideAnim }],
              shadowColor: '#000',
              shadowOffset: { width: -2, height: 0 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 8,
            }}
            className="rounded-l-3xl"
          >
            <TouchableOpacity activeOpacity={1}>
              <SafeAreaView className="flex-1">
                {/* Drawer Header */}
                <View className="px-6 py-4 border-b border-gray-200">
                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-xl font-bold"
                      style={{ fontFamily: Fonts.Shrikhand, color: '#1F2937' }}
                    >
                      Menu Categories
                    </Text>
                    <TouchableOpacity 
                      onPress={closeMenuDrawer}
                      className="p-2"
                    >
                      <Text className="text-2xl text-gray-600">×</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Categories List */}
                <ScrollView className="flex-1 px-4 py-4">
                  {categories.map((category, index) => (
                    <Animatable.View
                      key={category.id}
                      animation="fadeInRight"
                      duration={400}
                      delay={index * 50}
                    >
                      <TouchableOpacity
                        onPress={() => handleCategoryChange(category.id)}
                        className={`py-4 px-5 mb-3 rounded-xl ${
                          selectedCategory === category.id
                            ? 'bg-red-600'
                            : 'bg-gray-50'
                        }`}
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                          elevation: 1,
                        }}
                        activeOpacity={0.7}
                      >
                        <Text
                          className={`text-base font-semibold ${
                            selectedCategory === category.id
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}
                          style={{ fontFamily: Fonts.Poppins.SemiBold }}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    </Animatable.View>
                  ))}
                </ScrollView>

                {/* Drawer Footer */}
                <View className="px-6 py-4 border-t border-gray-200">
                  <TouchableOpacity
                    onPress={closeMenuDrawer}
                    className="bg-red-600 py-3 rounded-full"
                    activeOpacity={0.8}
                  >
                    <Text
                      className="text-white text-center font-bold text-base"
                      style={{ fontFamily: Fonts.Poppins.Bold }}
                    >
                      Close Menu
                    </Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {loading && (
        <View className="absolute inset-0 bg-white/90 items-center justify-center">
          <ActivityIndicator size="large" color="#DC2626" />
          <Text 
            className="mt-4 text-gray-600"
            style={{ fontFamily: Fonts.Poppins.Medium }}
          >
            Loading menu...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}