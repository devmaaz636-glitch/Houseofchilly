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
} from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import bestselller1 from "../../assets/images/bestselller1.png";
import bestselller2 from "../../assets/images/bestselller2.png";
import bestselller3 from "../../assets/images/bestselller3.png";
import bestselller4 from "../../assets/images/bestselller4.png";
import { Fonts } from "../../constants/Typography";

const { width: screenWidth } = Dimensions.get("window");
const bannerWidth = screenWidth - 32;
const bannerHeight = (bannerWidth * 160) / 350;

// Define carousel banners with different images
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
    image: require("../../assets/images/home1.png"), 
    subImage: homehandisubimage,
    discount: "30",
    title: "Special Karachi",
    subtitle: "biryani deal"
  },
  {
    id: 3,
    image: require("../../assets/images/home1.png"), 
    subImage: homerollsubimage,
    discount: "40",
    title: "Hot & Crispy",
    subtitle: "fried chicken"
  }
];

// Best Seller static items - Using actual menu item IDs for proper routing
const bestSellerItems = [
  {
    id: 'burger-1',
    name: 'Chicken Burger',
    price: '450',
    image: bestselller1
  },
  {
    id: 'sandwich-1',
    name: 'Zinger Burger',
    price: '550',
    image: bestselller2
  },
  {
    id: 'burger-2',
    name: 'Beef Burger',
    price: '600',
    image: bestselller3
  },
  {
    id: 'bun-kebab-double-decker',
    name: 'Special Roll',
    price: '400',
    image: bestselller4
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

  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItemsData 
    : menuItemsData.filter(item => item.category === selectedCategory);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setAnimationKey(prev => prev + 1);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCategoryChange(item.id)}
      className={`px-4 py-2 mx-2 rounded-full min-w-[80px] items-center justify-center ${
        selectedCategory === item.id 
          ? 'bg-red-600' 
          : 'bg-white'
      }`}
    >
      <Text
        className={`font-bold text-[13px] ${
          selectedCategory === item.id 
            ? 'text-white' 
            : 'text-black'
        }`}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Get first 3 items for the featured layout
  const featuredItems = filteredMenuItems.slice(0, 3);

  const renderFeaturedLayout = () => {
    if (featuredItems.length === 0) return null;

    const leftItem = featuredItems[0];
    const topRightItem = featuredItems[1];
    const bottomRightItem = featuredItems[2];

    return (
      <Animatable.View
        key={`featured-layout-${animationKey}`}
        animation="fadeIn"
        duration={500}
        className="px-4 mb-4"
      >
        <View className="flex-row gap-3 h-[320px]">
          {/* Left Side - Large Card */}
          <TouchableOpacity
            onPress={() => router.push(`/menu/${leftItem.id}`)}
            className="rounded-2xl overflow-hidden"
            style={{ flex: 1.1 }}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={leftItem.image || logo}
              className="w-full h-full"
              resizeMode="cover"
            >
              <View className="absolute inset-0 bg-black/40" />
              <View className="flex-1 justify-end p-4">
                <Text
                  className="text-white text-xl font-bold mb-2"
                  style={{ fontFamily: Fonts.Urbanist.Medium }}
                  numberOfLines={2}
                >
                  {leftItem.name}
                </Text>
                <TouchableOpacity
                  className="bg-red-600 px-5 py-2 rounded-full self-start"
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push(`/menu/${leftItem.id}`);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    className="text-white font-bold text-sm"
                    style={{ fontFamily: Fonts.Urbanist.Medium }}
                  >
                    ORDER NOW
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* Right Side - Two Stacked Cards */}
          <View className="flex-1 gap-3">
            {/* Top Right Card */}
            {topRightItem && (
              <TouchableOpacity
                onPress={() => router.push(`/menu/${topRightItem.id}`)}
                className="rounded-2xl overflow-hidden flex-1"
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={topRightItem.image || logo}
                  className="w-full h-full"
                  resizeMode="cover"
                >
                  <View className="absolute inset-0 bg-black/40" />
                  <View className="flex-1 justify-end p-3">
                    <Text
                      className="text-white text-base font-bold mb-1"
                      style={{ fontFamily: Fonts.Urbanist.Medium }}
                      numberOfLines={1}
                    >
                      {topRightItem.name}
                    </Text>
                    <TouchableOpacity
                      className="bg-red-600 px-5 py-2 rounded-full self-start"
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(`/menu/${topRightItem.id}`);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        className="text-white font-bold text-sm"
                        style={{ fontFamily: Fonts.Urbanist.Medium }}
                      >
                        ORDER NOW
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}

            {/* Bottom Right Card */}
            {bottomRightItem && (
              <TouchableOpacity
                onPress={() => router.push(`/menu/${bottomRightItem.id}`)}
                className="rounded-2xl overflow-hidden flex-1"
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={bottomRightItem.image || logo}
                  className="w-full h-full"
                  resizeMode="cover"
                >
                  <View className="absolute inset-0 bg-black/40" />
                  <View className="flex-1 justify-end p-3">
                    <Text
                      className="text-white text-base font-bold mb-1"
                      style={{ fontFamily: Fonts.Urbanist.Medium }}
                      numberOfLines={1}
                    >
                      {bottomRightItem.name}
                    </Text>
                    <TouchableOpacity
                      className="bg-red-600 px-5 py-2 rounded-full self-start"
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(`/menu/${bottomRightItem.id}`);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        className="text-white font-bold text-sm"
                        style={{ fontFamily: Fonts.Urbanist.Medium }}
                      >
                        ORDER NOW
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animatable.View>
    );
  };

 
  const renderBestSellerItems = () => {
    const cardWidth = (screenWidth - 48) / 2;

    return (
      <View className="px-4 mb-6">
        <View className="flex-row flex-wrap" style={{ gap: 16 }}>
          {bestSellerItems.map((item, index) => (
            <Animatable.View
              key={item.id}
              animation="fadeIn"
              duration={400}
              delay={index * 50}
              style={{ width: cardWidth }}
            >
              <View
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  borderWidth: 0.5,
                  borderColor: '#F34046',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="p-3">
                  {/* Name */}
                  <Text
                    style={{
                      fontFamily: Fonts.Poppins.SemiBold,
                      fontWeight: '600',
                      fontSize: 12,
                      lineHeight: 12,
                      letterSpacing: -0.24,
                      textAlign: 'center',
                      color: '#000000',
                      marginBottom: 4,
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  {/* Price */}
                  <Text
                    style={{
                      fontFamily: Fonts.Poppins.SemiBold,
                      fontWeight: '600',
                      fontSize: 12,
                      lineHeight: 12,
                      textAlign: 'center',
                      color: '#D42129',
                      marginBottom: 8,
                    }}
                  >
                    Rs. {item.price}
                  </Text>

                  {/* Image */}
                  <View 
                    className="rounded-xl overflow-hidden mb-3 items-center justify-center"
                    style={{
                      width: '100%',
                      aspectRatio: 1,
                    }}
                  >
                    <Image
                      source={item.image}
                      style={{ 
                        width: '100%', 
                        height: '100%',
                      }}
                      resizeMode="cover"
                    />
                  </View>

                
                  <TouchableOpacity
                    className="bg-red-600 px-5 py-2 rounded-full self-center"
                    onPress={() => router.push(`/menu/${item.id}`)}
                    activeOpacity={0.8}
                  >
                    <Text
                      className="text-white font-bold text-sm"
                      style={{ fontFamily: Fonts.Urbanist.Medium }}
                    >
                      ORDER NOW
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animatable.View>
          ))}
        </View>
      </View>
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
        <Animatable.View
          key={currentBannerIndex}
          animation="fadeIn"
          duration={600}
        >
          <View
            className="self-center rounded-2xl overflow-hidden relative"
            style={{ 
              width: bannerWidth, 
              height: bannerHeight,
              backgroundColor: '#001801'
            }}
          >
            {/* Background Image */}
            <ImageBackground
              source={banner.image}
              className="w-full h-full absolute"
              resizeMode="cover"
            >
              <View 
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(0, 24, 1, 0.7)' }} 
              />
            </ImageBackground>
            
            {/* Text and Button container */}
            <View 
              className="absolute z-10"
              style={{ 
                left: screenWidth * 0.04,
                top: '50%',
                transform: [{ translateY: -50 }],
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
              
              {/* Description text */}
              {renderBannerText()}

              {/* Order Now Button */}
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
            </View>

            {/* Sub Image on the right side */}
            <View
              className="absolute top-0 bottom-0 right-0 justify-center items-center z-0"
              style={{
                width: bannerWidth * 0.4,
                backgroundColor: '#001801'
              }}
            >
              <Image
                source={banner.subImage}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
        </Animatable.View>

        {/* Carousel Dots Indicator */}
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
        { backgroundColor: "#FFFFFF" },
        Platform.OS === "android" && { paddingBottom: 55 },
        Platform.OS === "ios" && { paddingBottom: 20 },
      ]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white">
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
          <TouchableOpacity className="bg-white p-2 rounded-xl shadow-md">
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
                : 'bg-gray-100'
            }`}
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
                : 'bg-gray-100'
            }`}
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

          {/* Featured Layout */}
          {renderFeaturedLayout()}

          {/* Empty State */}
          {filteredMenuItems.length === 0 && (
            <Animatable.View
              key={`empty-${animationKey}`}
              animation="fadeIn"
              duration={300}
              className="py-8 items-center"
            >
              <Text
                className="text-gray-500"
                style={{ fontFamily: Fonts.Poppins.Regular }}
              >
                No items in this category
              </Text>
            </Animatable.View>
          )}
        </View>

        {/* Best Seller Section */}
        <View className="mb-4">
          <View className="px-4 mb-4 flex-row items-center justify-between">
            <View>
              <Text
                className="text-2xl font-bold italic"
                style={{ fontFamily: Fonts.Shrikhand, color: "#1F2937" }}
              >
                Best Seller
              </Text>
              <View className="mt-1 w-20 h-[3px] bg-[#CF2526] rounded-full" />
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text
                style={{
                  fontFamily: Fonts.Poppins.SemiBold,
                  fontWeight: '600',
                  fontSize: 12,
                  lineHeight: 12,
                  letterSpacing: -0.24,
                  textAlign: 'center',
                  color: '#000000',
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          {renderBestSellerItems()}
        </View>

        {/* Bottom Padding */}
        <View className="h-[100px]" />
      </ScrollView>

      {loading && (
        <View className="absolute inset-0 bg-white/80 items-center justify-center">
          <ActivityIndicator size="large" color="#DC2626" />
        </View>
      )}
    </SafeAreaView>
  );
}