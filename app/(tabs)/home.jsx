import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  TextInput,
  FlatList,
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
import logo from "../../assets/images/logo.png";
import locationicon from "../../assets/images/locationicon.png";
import homelocationicon from '../../assets/images/homelocationicon.png';
import deliveryicon from "../../assets/images/deliveryicon.png";
import { Fonts } from "../../constants/Typography";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderType, setOrderType] = useState('delivery');
  const [menuItemsData, setMenuItemsData] = useState(menuItems);
  const [loading, setLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

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

  // Get filtered items based on category and search
  const getFilteredItems = () => {
    let items = menuItemsData;
    
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query))
      );
    }
    
    return items;
  };

  // Group items by category for "all" view
  const getGroupedItemsByCategory = () => {
    const grouped = {};
    const categoriesWithItems = categories.filter(cat => cat.id !== 'all');
    
    categoriesWithItems.forEach(category => {
      let itemsInCategory = menuItemsData.filter(
        item => item.category === category.id
      );
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        itemsInCategory = itemsInCategory.filter(item =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      }
      
      if (itemsInCategory.length > 0) {
        grouped[category.id] = {
          name: category.name,
          items: itemsInCategory.slice(0, 4)
        };
      }
    });
    
    return grouped;
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setAnimationKey(prev => prev + 1);
  };

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  // Clear search and auto-hide search bar
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchVisible(false); // Auto-hides search bar
  };

  // Render menu item card with professional styling
  const renderMenuItem = (item, index, cardWidth) => (
    <Animatable.View
      key={item.id}
      animation="fadeInUp"
      duration={500}
      delay={index * 80}
      style={{ width: cardWidth, marginBottom: 20 }}
    >
      <TouchableOpacity
        onPress={() => router.push(`/menu/${item.id}`)}
        activeOpacity={0.95}
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <View className="p-4">
          {/* Item Name */}
          <Text
            style={{
              fontFamily: Fonts.Poppins.SemiBold,
              fontWeight: '600',
              fontSize: 14,
              lineHeight: 19,
              color: '#1F2937',
              textAlign: 'center',
              marginBottom: 8,
              minHeight: 38,
            }}
            numberOfLines={2}
          >
            {item.name}
          </Text>

          {/* Price */}
          <View className="mb-3 items-center">
            <View className="bg-[#D421291A] rounded-full px-4 py-1">
              <Text
                className="text-center text-[14px] font-semibold text-[#D42129]"
                style={{ fontFamily: Fonts.Poppins.SemiBold }}
              >
                Rs. {item.price}
              </Text>
            </View>
          </View>

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
                width: '92%', 
                height: '92%',
              }}
              resizeMode="contain"
            />
          </View>

          {/* Order Button */}
          <TouchableOpacity
            className="bg-red-600 py-3 rounded-full"
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/menu/${item.id}`);
            }}
            activeOpacity={0.85}
            style={{
              shadowColor: '#D42129',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            <Text
              className="text-white font-bold text-sm text-center uppercase"
              style={{ 
                fontFamily: Fonts.Poppins.Bold,
                letterSpacing: 0.8,
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
    const cardWidth = (screenWidth - 56) / 2;
    const filteredItems = getFilteredItems();

    return (
      <Animatable.View
        key={`menu-grid-${animationKey}`}
        animation="fadeIn"
        duration={600}
        className="px-6 mb-6"
      >
        <View className="flex-row flex-wrap justify-between">
          {filteredItems.map((item, index) => 
            renderMenuItem(item, index, cardWidth)
          )}
        </View>

        {filteredItems.length === 0 && (
          <View className="py-16 items-center">
            <Text
              className="text-gray-400 text-base text-center"
              style={{ fontFamily: Fonts.Poppins.Medium }}
            >
              {searchQuery ? 'No items found matching your search' : 'No items in this category'}
            </Text>
          </View>
        )}
      </Animatable.View>
    );
  };

  // Render all categories with items
  const renderAllCategoriesView = () => {
    const cardWidth = (screenWidth - 56) / 2;
    const groupedItems = getGroupedItemsByCategory();
    const categoryKeys = Object.keys(groupedItems);

    if (categoryKeys.length === 0) {
      return (
        <View className="py-16 items-center px-6">
          <Text
            className="text-gray-400 text-base text-center"
            style={{ fontFamily: Fonts.Poppins.Medium }}
          >
            {searchQuery ? 'No items found matching your search' : 'No items available'}
          </Text>
        </View>
      );
    }

    return (
      <Animatable.View
        key={`all-categories-${animationKey}`}
        animation="fadeIn"
        duration={600}
        className="mb-6"
      >
        {categoryKeys.map((categoryId, categoryIndex) => {
          const categoryData = groupedItems[categoryId];
          
          return (
            <View key={categoryId} className="mb-10">
              <Animatable.View
                animation="fadeIn"
                duration={500}
                delay={categoryIndex * 120}
                className="px-6"
              >
                <View className="flex-row flex-wrap justify-between">
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

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* Header with Background - Dynamic height based on search visibility */}
      <ImageBackground
        source={home1}
        className="w-full"
        resizeMode="cover"
        style={{
          height: isSearchVisible ? screenHeight * 0.32 : screenHeight * 0.35,
        }}
      >
        {/* Overlay */}
        <View 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.18)',
          }} 
        />
        
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            
            {/* Top Navigation Bar */}
            <View className="flex-row items-center justify-between px-5 py-3 mb-2">
              {/* Location */}
              <View className="flex-row items-center flex-1">
                <Image
                  source={homelocationicon}
                  className="w-7 h-7 mr-1"
                  resizeMode="contain"
                  style={{ tintColor: '#FFFFFF' }}
                />
                <View>
                  <Text
                    className="text-white font-bold text-sm"
                    style={{ fontFamily: Fonts.Poppins.SemiBold }}
                  >
                    Home
                  </Text>
                  <Text
                    className="text-white/95 text-xs"
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
                  className="w-[78px] h-[88px]"
                  resizeMode="contain"
                />
              </View>

              {/* Search Icon */}
              <View className="flex-1 items-end">
                <TouchableOpacity 
                  onPress={handleSearchToggle}
                  className="bg-white rounded-full"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    elevation: 8,
                    width: 46,
                    height: 46,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.75}
                >
                  <View style={{ position: 'relative', width: 20, height: 20 }}>
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        borderWidth: 2.5,
                        borderColor: '#1F2937',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                    <View
                      style={{
                        width: 8,
                        height: 2.5,
                        backgroundColor: '#1F2937',
                        position: 'absolute',
                        bottom: 2,
                        right: 0,
                        transform: [{ rotate: '45deg' }],
                        borderRadius: 2,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar - Animated with smooth transitions */}
            {isSearchVisible && (
              <Animatable.View 
                animation="fadeInDown"
                duration={450}
                className="px-6 mt-1"
              >
                <View 
                  className="bg-white rounded-xl flex-row items-center px-4 py-3.5"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.18,
                    shadowRadius: 6,
                    elevation: 6,
                  }}
                >
                  <View style={{ position: 'relative', width: 18, height: 18, marginRight: 12 }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: '#9CA3AF',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                    <View
                      style={{
                        width: 6,
                        height: 2,
                        backgroundColor: '#9CA3AF',
                        position: 'absolute',
                        bottom: 1,
                        right: 0,
                        transform: [{ rotate: '45deg' }],
                        borderRadius: 1,
                      }}
                    />
                  </View>

                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search menu items..."
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-gray-900"
                    style={{
                      fontFamily: Fonts.Poppins.Regular,
                      fontSize: 14,
                    }}
                    autoFocus
                  />

                  {searchQuery.length > 0 && (
                    <TouchableOpacity
                      onPress={handleClearSearch}
                      className="ml-2 bg-gray-200 rounded-full w-7 h-7 items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <Text className="text-gray-600 font-bold text-sm">✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </Animatable.View>
            )}

            {/* Spacer to push buttons to center/bottom */}
            <View style={{ flex: 1 }} />

            {/* Order Type Buttons - CENTERED when search is hidden, hidden when search is visible */}
            {!isSearchVisible && (
              <Animatable.View 
                animation="fadeIn"
                duration={400}
                className="items-center justify-center px-6"
                style={{ paddingBottom: 70 }}
              >
                <View className="flex-row justify-center" style={{ gap: 18 }}>
                  {/* Pick Up Button */}
                  <TouchableOpacity
                    onPress={() => setOrderType('pickup')}
                    className={`flex-row items-center justify-center py-3.5 px-8 rounded-full ${
                      orderType === 'pickup' 
                        ? 'bg-white border-2 border-gray-50' 
                        : 'bg-white/30'
                    }`}
                    style={{
                      shadowColor: orderType === 'pickup' ? '#D42129' : '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: orderType === 'pickup' ? 0.3 : 0.2,
                      shadowRadius: 6,
                      elevation: orderType === 'pickup' ? 7 : 4,
                      minWidth: 150,
                    }}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={locationicon}
                      className="w-5 h-5"
                      resizeMode="contain"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      className={`font-bold text-[15px] ${
                        orderType === 'pickup' ? 'text-red-600' : 'text-white'
                      }`}
                      style={{ fontFamily: Fonts.Urbanist.Bold }}
                    >
                      Pick Up
                    </Text>
                  </TouchableOpacity>

                  {/* Delivery Button */}
                  <TouchableOpacity
                    onPress={() => {
                      setOrderType('delivery');
                      router.push("/delivery");
                    }}
                    className={`flex-row items-center justify-center py-3.5 px-8 rounded-full ${
                      orderType === 'delivery'
                        ? 'bg-white border-2 border-gray-50'
                        : 'bg-white/30'
                    }`}
                    style={{
                      shadowColor: orderType === 'delivery' ? '#D42129' : '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: orderType === 'delivery' ? 0.3 : 0.2,
                      shadowRadius: 6,
                      elevation: orderType === 'delivery' ? 7 : 4,
                      minWidth: 150,
                    }}
                    activeOpacity={0.85}
                  >
                    <Image
                      source={deliveryicon}
                      className="w-5 h-5"
                      resizeMode="contain"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      className={`font-bold text-[15px] ${
                        orderType === 'delivery' ? 'text-red-600' : 'text-white'
                      }`}
                      style={{ fontFamily: Fonts.Urbanist.Bold }}
                    >
                      Delivery
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            )}
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Main Content - Professional Overlapping Section */}
      <View style={{ flex: 1, marginTop: -30 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            Platform.OS === "android" && { paddingBottom: 80 },
            Platform.OS === "ios" && { paddingBottom: 40 },
          ]}
        >
          {/* White Rounded Container */}
          <View 
            style={{
              backgroundColor: '#F5F5F5',
              borderTopLeftRadius: 36,
              borderTopRightRadius: 36,
              paddingTop: 36,
              minHeight: screenHeight * 0.65,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -5 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            {/* Explore Menu Header */}
            <View className="px-6 mb-7">
              <Text
                className="text-2xl font-bold italic"
               style={{ fontFamily: Fonts.Shrikhand, color: "#1F2937" }}
              >
                Explore Menu
              </Text>
              <View className="mt-2 w-24 h-[3.5px] bg-[#D42129] rounded-full" />
            </View>
            
            {/* Category Tabs Section */}
            <View className="mb-7">
              <FlatList
                data={categories}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleCategoryChange(item.id)}
                    className={`px-7 py-3.5 rounded-full items-center justify-center ${
                      selectedCategory === item.id 
                        ? 'bg-red-600' 
                        : 'bg-white border-2 border-gray-200'
                    }`}
                    style={{
                      marginRight: 12,
                      minWidth: 118,
                    }}
                  >
                    <Text
                      className={`font-bold text-[12px] ${
                        selectedCategory === item.id 
                          ? 'text-white' 
                          : 'text-gray-700'
                      }`}
                      style={{ fontFamily: Fonts.Poppins.Bold }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 5 }}
              />
            </View>

            {searchQuery.trim() && (
              <Animatable.View 
                animation="fadeIn"
                className="px-6 mb-5"
              >
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: Fonts.Poppins.Medium }}
                >
                  {getFilteredItems().length} result{getFilteredItems().length !== 1 ? 's' : ''} found for "{searchQuery}"
                </Text>
              </Animatable.View>
            )}

            {selectedCategory === 'all' 
              ? renderAllCategoriesView() 
              : renderCategoryMenuGrid()
            }

            <View className="h-[70px]" />
          </View>
        </ScrollView>
      </View>

      {loading && (
        <View className="absolute inset-0 bg-white/95 items-center justify-center">
          <ActivityIndicator size="large" color="#D42129" />
          <Text 
            className="mt-5 text-gray-700 text-base"
            style={{ fontFamily: Fonts.Poppins.SemiBold }}
          >
            Loading menu...
          </Text>
        </View>
      )}
    </View>
  );
}