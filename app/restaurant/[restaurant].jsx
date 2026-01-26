import {
  View,
  Text,
  Platform,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import DatePickerComponent from "../../components/restaurant/DatePickerComponents";
import GuestPickerComponent from "../../components/restaurant/GuestPickerComponent";
import FindSlots from "../../components/restaurant/FindSlots";
import MenuComponent from "../../components/restaurant/MenuComponent";
import CartComponent from "../../components/restaurant/CartComponent";
import { useCart } from "../../store/cartContext";
import { useFavorites } from "../../store/favoritesContext";

export default function Restaurant() {
  const { restaurant } = useLocalSearchParams();
  const flatListRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [restaurantId, setRestaurantId] = useState(null);

  const [slotsData, setSlotsData] = useState({});
  const [cartVisible, setCartVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(2);
  const [date, setDate] = useState(new Date());

  const { getCartItemCount } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleNextImage = () => {
    const carouselLength = carouselData[0]?.images.length;
    if (currentIndex < carouselLength - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }

    if (currentIndex == carouselLength - 1) {
      const nextIndex = 0;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };
  const handlePrevImage = () => {
    const carouselLength = carouselData[0]?.images.length;
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }

    if (currentIndex == 0) {
      const prevIndex = carouselLength - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const carouselItem = ({ item }) => {
    return (
      <View style={{ width: windowWidth - 2 }} className="h-64 relative">
        <View
          style={{
            position: "absolute",
            top: "50%",
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 50,
            padding: 5,
            zIndex: 10,
            right: "6%",
          }}
        >
          <Ionicons
            onPress={handleNextImage}
            name="arrow-forward"
            size={24}
            color="white"
          />
        </View>
        <View
          style={{
            position: "absolute",
            top: "50%",
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 50,
            padding: 5,
            zIndex: 10,
            left: "2%",
          }}
        >
          <Ionicons
            onPress={handlePrevImage}
            name="arrow-back"
            size={24}
            color="white"
          />
        </View>
        <View
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            left: "50%",
            transform: [{ translateX: -50 }],
            zIndex: 10,
            bottom: 15,
          }}
        >
          {carouselData[0].images?.map((_, i) => (
            <View
              key={i}
              className={`bg-white h-2 w-2 ${
                i == currentIndex && "h-3 w-3"
              } p-1 mx-1 rounded-full`}
            />
          ))}
        </View>
        <Image
          source={{ uri: item }}
          style={{
            opacity: 0.5,
            backgroundColor: "black",
            marginRight: 20,
            marginLeft: 5,
            borderRadius: 25,
          }}
          className="h-64"
        />
      </View>
    );
  };

  const getRestaurantData = async () => {
    try {
      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("name", "==", restaurant)
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (restaurantSnapshot.empty) {
        console.log("No matching restaurant found");
        return;
      }

      for (const docSnap of restaurantSnapshot.docs) {
        const restaurantData = docSnap.data();
        setRestaurantData(restaurantData);
        setRestaurantId(docSnap.id);

        const carouselQuery = query(
          collection(db, "carousel"),
          where("res_id", "==", docSnap.ref)
        );
        const carouselSnapshot = await getDocs(carouselQuery);
        const carouselImages = [];
        if (carouselSnapshot.empty) {
          console.log("No matching carousel found");
        } else {
          carouselSnapshot.forEach((carouselDoc) => {
            carouselImages.push(carouselDoc.data());
          });
          setCarouselData(carouselImages);
        }

        const slotsQuery = query(
          collection(db, "slots"),
          where("ref_id", "==", docSnap.ref)
        );
        const slotsSnapshot = await getDocs(slotsQuery);
        const slots = [];
        if (!slotsSnapshot.empty) {
          slotsSnapshot.forEach((slotDoc) => {
            slots.push(slotDoc.data());
          });
          setSlotsData(slots[0]?.slot);
        }
      }
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };
  const handleLocation = async () => {
    const url = "https://www.google.com/maps/dir//390+Farnham+Rd,+Slough+SL2+1JD,+United+Kingdom/@33.5941801,73.1467615,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x487665e16bdcd3a7:0xfafcec6304edda91!2m2!1d-0.6161262!2d51.5283038?entry=ttu&g_ep=EgoyMDI2MDEwNi4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URL", url);
    }
  };
  useEffect(() => {
    getRestaurantData();
  }, []);

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 55 },
        Platform.OS == "ios" && { paddingBottom: 20 },
      ]}
    >
      {/* Cart Button - Floating */}
      {getCartItemCount() > 0 && (
        <TouchableOpacity
          onPress={() => setCartVisible(true)}
          className="absolute bottom-20 right-4 z-50 bg-[#f49b33] rounded-full p-4 shadow-lg"
          style={{ elevation: 8 }}
        >
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {getCartItemCount()}
            </Text>
          </View>
          <Ionicons name="cart" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <ScrollView className="h-full">
        <View className="flex-1 my-2 p-2">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-xl text-[#f49b33] mr-2 font-semibold">
                {restaurant}
              </Text>
              <View className="border-b border-[#f49b33] mt-1" />
            </View>
            {restaurantId && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await toggleFavorite(restaurantId, restaurant);
                  } catch (error) {
                    Alert.alert("Error", "Failed to update favorite. Please try again.");
                  }
                }}
                className="ml-2 p-2"
              >
                <Ionicons
                  name={isFavorite(restaurantId) ? "heart" : "heart-outline"}
                  size={28}
                  color={isFavorite(restaurantId) ? "#f49b33" : "#fff"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className="h-64 max-w-[98%] mx-2 rounded-[25px]">
          <FlatList
            ref={flatListRef}
            data={carouselData[0]?.images}
            renderItem={carouselItem}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            style={{ borderRadius: 25 }}
          />
        </View>
        <View className="flex-1 flex-row mt-2 p-2">
          <Ionicons name="location-sharp" size={24} color="#f49b33" />
          <Text className="max-w-[75%] text-white">
            {restaurantData?.address} |{"  "}
            <Text
              onPress={handleLocation}
              className="underline flex items-center mt-1 text-[#f49b33] italic font-semibold"
            >
              Get Direction
            </Text>
          </Text>
        </View>
        <View className="flex-1 flex-row p-2">
          <Ionicons name="time" size={20} color="#f49b33" />
          <Text className="max-w-[75%] mx-2 font-semibold text-white">
            {restaurantData?.opening} - {restaurantData?.closing}
          </Text>
        </View>

        {/* Tabs - Menu and Booking */}
        <View className="flex-row mx-2 mb-4 bg-[#474747] rounded-lg p-1">
          <TouchableOpacity
            onPress={() => {
              setShowMenu(true);
              setShowBooking(false);
            }}
            className={`flex-1 py-3 rounded-lg ${
              showMenu ? "bg-[#f49b33]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center font-bold ${
                showMenu ? "text-white" : "text-white/70"
              }`}
            >
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
              setShowBooking(true);
            }}
            className={`flex-1 py-3 rounded-lg ${
              showBooking ? "bg-[#f49b33]" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-center font-bold ${
                showBooking ? "text-white" : "text-white/70"
              }`}
            >
              Book Table
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Section */}
        {showMenu && restaurantId && (
          <View className="mx-2 mb-4">
            <Text className="text-white text-2xl font-bold mb-4">
              Our Menu
            </Text>
            <MenuComponent
              restaurantId={restaurantId}
              restaurantName={restaurant}
            />
          </View>
        )}

        {/* Booking Section */}
        {showBooking && (
          <>
            <View className="flex-1 border m-2 p-2 border-[#f49b33] rounded-lg">
              <View className="flex-1 flex-row m-2 p-2 justify-end items-center">
                <View className="flex-1 flex-row">
                  <Ionicons name="calendar" size={20} color="#f49b33" />
                  <Text className="text-white mx-2 text-base">
                    Select booking date
                  </Text>
                </View>
                <DatePickerComponent date={date} setDate={setDate} />
              </View>
              <View className="flex-1 flex-row bg-[#474747] rounded-lg  m-2 p-2 justify-end items-center">
                <View className="flex-1 flex-row">
                  <Ionicons name="people" size={20} color="#f49b33" />
                  <Text className="text-white mx-2 text-base">
                    Select number of guests
                  </Text>
                </View>
                <GuestPickerComponent
                  selectedNumber={selectedNumber}
                  setSelectedNumber={setSelectedNumber}
                />
              </View>
            </View>
            <View className="flex-1">
              <FindSlots
                restaurant={restaurant}
                date={date}
                selectedNumber={selectedNumber}
                slots={slotsData}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* Cart Modal */}
      <CartComponent visible={cartVisible} onClose={() => setCartVisible(false)} />
    </SafeAreaView>
  );
}