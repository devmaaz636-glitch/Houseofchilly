// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   TextInput,
//   Platform,
//   ActivityIndicator,
//   Image,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import { Formik } from "formik";
// import * as Yup from "yup";
// import { useCart } from "../store/cartContext";
// import { addDoc, collection, doc, getDoc } from "firebase/firestore";
// import { db } from "../config/firebaseConfig";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from "@expo/vector-icons/Ionicons";

// const validationSchema = Yup.object().shape({
//   fullName: Yup.string().required("Full name is required"),
//   phoneNumber: Yup.string()
//     .required("Phone number is required")
//     .matches(/^[0-9]{10,}$/, "Phone number must be at least 10 digits"),
//   address: Yup.string()
//     .required("Delivery address is required")
//     .min(10, "Please provide a complete address"),
//   city: Yup.string().required("City is required"),
//   postalCode: Yup.string()
//     .required("Postal code is required")
//     .matches(/^[0-9]{5}$/, "Please enter a valid 5-digit postal code"),
//   specialInstructions: Yup.string(),
// });

// // Delivery fee calculation
// const calculateDeliveryFee = (subtotal) => {
//   // Rs. 150 base delivery fee
//   let fee = 150;
  
//   // Free delivery for orders over Rs. 1500
//   if (subtotal >= 1500) {
//     fee = 0;
//   }
  
//   return fee;
// };

// // Calculate estimated delivery time in minutes
// const calculateEstimatedTime = () => {
//   // Base time: 30-45 minutes
//   return 35;
// };

// const Checkout = () => {
//   const router = useRouter();
//   const { cart, restaurantId, getCartTotal, clearCart } = useCart();
//   const [loading, setLoading] = useState(false);
//   const [userEmail, setUserEmail] = useState(null);
//   const [isGuest, setIsGuest] = useState(false);
//   const [restaurantName, setRestaurantName] = useState("");
//   const [deliveryFee, setDeliveryFee] = useState(150);
//   const [estimatedTime, setEstimatedTime] = useState(35);

//   useEffect(() => {
//     loadUserData();
//     loadRestaurantData();
//   }, []);

//   useEffect(() => {
//     if (cart.length > 0) {
//       const subtotal = getCartTotal();
//       const fee = calculateDeliveryFee(subtotal);
//       const time = calculateEstimatedTime();
//       setDeliveryFee(fee);
//       setEstimatedTime(time);
//     } else {
//       setDeliveryFee(150);
//       setEstimatedTime(35);
//     }
//   }, [cart]);

//   const loadUserData = async () => {
//     const email = await AsyncStorage.getItem("userEmail");
//     const guestStatus = await AsyncStorage.getItem("isGuest");
//     setUserEmail(email);
//     setIsGuest(guestStatus === "true");
//   };

//   const loadRestaurantData = async () => {
//     if (restaurantId) {
//       try {
//         const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId));
//         if (restaurantDoc.exists()) {
//           setRestaurantName(restaurantDoc.data().name);
//         }
//       } catch (error) {
//         console.error("Error loading restaurant:", error);
//       }
//     }
//   };

//   const getImageSource = (img) => {
//     if (!img) return require("../assets/images/logo.png");
//     if (typeof img === "object" && img.uri === undefined) return img;
//     if (typeof img === "string") return { uri: img };
//     return require("../assets/images/logo.png");
//   };

//   const handlePlaceOrder = async (values) => {
//     if (cart.length === 0) {
//       Alert.alert("Error", "Your cart is empty");
//       return;
//     }

//     setLoading(true);
//     try {
//       const subtotal = getCartTotal();
//       const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
//       const finalTotal = subtotal + deliveryFee - discount;

//       const orderData = {
//         email: userEmail || values.phoneNumber + "@guest.com",
//         fullName: values.fullName,
//         phoneNumber: values.phoneNumber,
//         address: `${values.address}, ${values.city}, ${values.postalCode}`,
//         streetAddress: values.address,
//         city: values.city,
//         postalCode: values.postalCode,
//         specialInstructions: values.specialInstructions || "",
//         restaurantId: restaurantId,
//         restaurantName: restaurantName || "Unknown Restaurant",
//         items: cart.map((item) => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           image: item.image,
//         })),
//         subtotal: subtotal,
//         deliveryFee: deliveryFee,
//         discount: discount,
//         totalAmount: finalTotal,
//         status: "pending",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         isGuest: isGuest || !userEmail,
//         trackingNumber: `TRK${Date.now()}`,
//         deliveryType: "delivery",
//         estimatedDeliveryTime: new Date(Date.now() + estimatedTime * 60000).toISOString(),
//         estimatedDeliveryMinutes: estimatedTime,
//         deliveryStatus: "pending",
//         orderNumber: `ORD${Date.now()}`,
//       };

//       await addDoc(collection(db, "orders"), orderData);

//       const savedOrderNumber = orderData.orderNumber;
//       const savedTrackingNumber = orderData.trackingNumber;

//       clearCart();
      
//       Alert.alert(
//         "Order Placed Successfully! 🎉",
//         `Order Number: ${savedOrderNumber}\nTracking: ${savedTrackingNumber}\n\nEstimated Delivery: ${estimatedTime} minutes\nTotal: Rs. ${finalTotal.toFixed(2)}\n\nYou can track your order in the Delivery tab.`,
//         [
//           {
//             text: "Track Order",
//             onPress: () => router.push("/(tabs)/delivery"),
//           },
//           {
//             text: "OK",
//             style: "cancel",
//             onPress: () => router.push("/(tabs)/history"),
//           },
//         ]
//       );
//     } catch (error) {
//       console.error("Error placing order:", error);
//       Alert.alert("Error", "Failed to place order. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const subtotal = getCartTotal();
//   const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
//   const total = subtotal + deliveryFee - discount;

//   if (cart.length === 0) {
//     return (
//       <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
//         <View className="bg-gray-50 p-8 rounded-3xl items-center shadow-lg">
//           <Ionicons name="cart-outline" size={80} color="#f49b33" />
//           <Text className="text-gray-800 text-2xl font-bold mt-4">
//             Your cart is empty
//           </Text>
//           <Text className="text-gray-500 text-center mt-2 mb-6">
//             Add items to your cart to proceed with checkout
//           </Text>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             className="bg-[#f49b33] px-8 py-4 rounded-2xl shadow-lg"
//           >
//             <Text className="text-white font-bold text-lg">Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView
//       className="flex-1 bg-white"
//       style={[
//         Platform.OS === "android" && { paddingBottom: 20 },
//       ]}
//     >
//       {/* Header */}
//     <View className="flex-row items-center justify-center px-5 py-4 bg-white border-b border-dashed border-gray-300 relative">

//   {/* Back Button (fixed left) */}
//   <TouchableOpacity
//     onPress={() => router.back()}
//     className="absolute left-5 p-2 rounded-full bg-white shadow-md"
//     style={{ elevation: 5 }}
//   >
//     <Ionicons name="chevron-back" size={24} color="black" />
//   </TouchableOpacity>

//   {/* Center Title */}
//   <Text className="text-2xl font-bold text-black text-center">
//     Payment
//   </Text>

// </View>


//       <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
//         {/* Order Summary Card */}
//         <View className="mx-4 mt-6 bg-white rounded-3xl shadow-lg p-5 border border-gray-100">
//           <Text className="text-xl font-bold mb-4 text-gray-800">
//            Location
//           </Text>
          
//           {/* Restaurant Info */}
//           {restaurantName && (
//             <View className="mb-4 pb-4 border-b border-gray-100">
//               <Text className="text-gray-500 text-sm mb-1">Restaurant</Text>
//               <Text className="text-gray-800 font-semibold text-base">
//                 {restaurantName}
//               </Text>
//             </View>
//           )}

//           {/* Items List */}
//           <View className="mb-4">
//             <Text className="text-gray-500 text-sm mb-3">Items</Text>
//             {cart.map((item, index) => (
//               <View key={`${item.id}-${index}`} className="flex-row mb-3 bg-gray-50 rounded-2xl p-3">
//                 <Image
//                   source={getImageSource(item.image)}
//                   className="w-16 h-16 rounded-xl mr-3"
//                   resizeMode="cover"
//                 />
//                 <View className="flex-1">
//                   <Text className="text-gray-800 font-semibold mb-1" numberOfLines={1}>
//                     {item.name}
//                   </Text>
//                   <Text className="text-gray-500 text-sm">
//                     Qty: {item.quantity} × Rs. {Number(item.price).toFixed(2)}
//                   </Text>
//                   <Text className="text-[#f49b33] font-bold mt-1">
//                     Rs. {(item.price * item.quantity).toFixed(2)}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>

//           {/* Price Breakdown */}
//           <View className="border-t border-gray-100 pt-4">
//             {/* Subtotal */}
//             <View className="flex-row justify-between items-center mb-3">
//               <Text className="text-gray-600">Subtotal</Text>
//               <Text className="text-gray-800 font-semibold">
//                 Rs. {subtotal.toFixed(2)}
//               </Text>
//             </View>

//             {/* Delivery Fee */}
//             <View className="flex-row justify-between items-center mb-3">
//               <View className="flex-row items-center">
//                 <Ionicons name="bicycle" size={16} color="#f49b33" />
//                 <Text className="text-gray-600 ml-2">Delivery Fee</Text>
//                 {deliveryFee === 0 && (
//                   <View className="ml-2 bg-green-500 px-2 py-0.5 rounded-full">
//                     <Text className="text-white text-xs font-bold">FREE</Text>
//                   </View>
//                 )}
//               </View>
//               <Text className={`font-semibold ${deliveryFee === 0 ? "text-green-500" : "text-gray-800"}`}>
//                 Rs. {deliveryFee.toFixed(2)}
//               </Text>
//             </View>

//             {/* Discount */}
//             {discount > 0 && (
//               <View className="flex-row justify-between items-center mb-3">
//                 <View className="flex-row items-center">
//                   <Ionicons name="pricetag" size={16} color="#10b981" />
//                   <Text className="text-gray-600 ml-2">Discount (10%)</Text>
//                 </View>
//                 <Text className="text-green-500 font-semibold">
//                   - Rs. {discount.toFixed(2)}
//                 </Text>
//               </View>
//             )}

//             {/* Delivery Info */}
//             {subtotal < 1500 && deliveryFee > 0 && (
//               <Text className="text-[#f49b33] text-xs mb-3">
//                 💡 Add Rs. {(1500 - subtotal).toFixed(2)} more for free delivery!
//               </Text>
//             )}
//             {subtotal < 1000 && discount === 0 && (
//               <Text className="text-[#f49b33] text-xs mb-3">
//                 💡 Add Rs. {(1000 - subtotal).toFixed(2)} more to get 10% discount!
//               </Text>
//             )}

//             {/* Total */}
//             <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200 bg-orange-50 -mx-5 px-5 py-3 rounded-2xl">
//               <Text className="text-gray-800 text-xl font-bold">Total</Text>
//               <Text className="text-[#f49b33] text-2xl font-bold">
//                 Rs. {total.toFixed(2)}
//               </Text>
//             </View>

//             {/* Estimated Time */}
//             <View className="flex-row items-center mt-4 bg-blue-50 p-3 rounded-xl">
//               <Ionicons name="time-outline" size={20} color="#3b82f6" />
//               <Text className="text-gray-700 text-sm ml-2 font-medium">
//                 Estimated Delivery: {estimatedTime} minutes
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Delivery Information Form */}
//         <View className="mx-4 mt-6 mb-6 bg-white rounded-3xl shadow-lg p-5 border border-gray-100">
//           <Text className="text-xl font-bold mb-4 text-gray-800">
//             Delivery Information
//           </Text>

//           <Formik
//             initialValues={{
//               fullName: "",
//               phoneNumber: "",
//               address: "",
//               city: "",
//               postalCode: "",
//               specialInstructions: "",
//             }}
//             validationSchema={validationSchema}
//             onSubmit={handlePlaceOrder}
//           >
//             {({
//               handleChange,
//               handleBlur,
//               handleSubmit,
//               values,
//               errors,
//               touched,
//             }) => (
//               <View>
//                 {/* Full Name */}
//                 <View className="mb-4">
//                   <Text className="text-gray-700 mb-2 font-semibold">
//                     Full Name *
//                   </Text>
//                   <TextInput
//                     className="h-14 border-2 border-gray-200 text-gray-800 rounded-2xl px-4 bg-gray-50 focus:border-[#f49b33]"
//                     placeholder="Enter your full name"
//                     placeholderTextColor="#9ca3af"
//                     onChangeText={handleChange("fullName")}
//                     onBlur={handleBlur("fullName")}
//                     value={values.fullName}
//                   />
//                   {touched.fullName && errors.fullName && (
//                     <Text className="text-red-500 text-xs mt-1">
//                       {errors.fullName}
//                     </Text>
//                   )}
//                 </View>

//                 {/* Phone Number */}
//                 <View className="mb-4">
//                   <Text className="text-gray-700 mb-2 font-semibold">
//                     Phone Number *
//                   </Text>
//                   <TextInput
//                     className="h-14 border-2 border-gray-200 text-gray-800 rounded-2xl px-4 bg-gray-50 focus:border-[#f49b33]"
//                     placeholder="03XX XXXXXXX"
//                     placeholderTextColor="#9ca3af"
//                     keyboardType="phone-pad"
//                     onChangeText={handleChange("phoneNumber")}
//                     onBlur={handleBlur("phoneNumber")}
//                     value={values.phoneNumber}
//                   />
//                   {touched.phoneNumber && errors.phoneNumber && (
//                     <Text className="text-red-500 text-xs mt-1">
//                       {errors.phoneNumber}
//                     </Text>
//                   )}
//                 </View>

//                 {/* Address */}
//                 <View className="mb-4">
//                   <Text className="text-gray-700 mb-2 font-semibold">
//                     Street Address *
//                   </Text>
//                   <TextInput
//                     className="h-24 border-2 border-gray-200 text-gray-800 rounded-2xl px-4 py-3 bg-gray-50 focus:border-[#f49b33]"
//                     placeholder="House/Street/Sector (e.g., House 123, Street 5, F-7)"
//                     placeholderTextColor="#9ca3af"
//                     multiline
//                     numberOfLines={3}
//                     textAlignVertical="top"
//                     onChangeText={handleChange("address")}
//                     onBlur={handleBlur("address")}
//                     value={values.address}
//                   />
//                   {touched.address && errors.address && (
//                     <Text className="text-red-500 text-xs mt-1">
//                       {errors.address}
//                     </Text>
//                   )}
//                 </View>

//                 {/* City */}
//                 <View className="mb-4">
//                   <Text className="text-gray-700 mb-2 font-semibold">
//                     City *
//                   </Text>
//                   <TextInput
//                     className="h-14 border-2 border-gray-200 text-gray-800 rounded-2xl px-4 bg-gray-50 focus:border-[#f49b33]"
//                     placeholder="e.g., Islamabad, Karachi, Lahore"
//                     placeholderTextColor="#9ca3af"
//                     onChangeText={handleChange("city")}
//                     onBlur={handleBlur("city")}
//                     value={values.city}
//                   />
//                   {touched.city && errors.city && (
//                     <Text className="text-red-500 text-xs mt-1">
//                       {errors.city}
//                     </Text>
//                   )}
//                 </View>

//                 {/* Postal Code */}
//                 <View className="mb-4">
//                   <Text className="text-gray-700 mb-2 font-semibold">
//                     Postal Code *
//                   </Text>
//                   <TextInput
//                     className="h-14 border-2 border-gray-200 text-gray-800 rounded-2xl px-4 bg-gray-50 focus:border-[#f49b33]"
//                     placeholder="e.g., 44000"
//                     placeholderTextColor="#9ca3af"
//                     keyboardType="number-pad"
//                     maxLength={5}
//                     onChangeText={handleChange("postalCode")}
//                     onBlur={handleBlur("postalCode")}
//                     value={values.postalCode}
//                   />
//                   {touched.postalCode && errors.postalCode && (
//                     <Text className="text-red-500 text-xs mt-1">
//                       {errors.postalCode}
//                     </Text>
//                   )}
//                 </View>

//                 {/* Special Instructions */}
//                 <View className="mb-6">
//                   <Text className="text-gray-700 mb-2 font-semibold">
//                     Special Instructions (Optional)
//                   </Text>
//                   <TextInput
//                     className="h-24 border-2 border-gray-200 text-gray-800 rounded-2xl px-4 py-3 bg-gray-50 focus:border-[#f49b33]"
//                     placeholder="Any special delivery instructions..."
//                     placeholderTextColor="#9ca3af"
//                     multiline
//                     numberOfLines={3}
//                     textAlignVertical="top"
//                     onChangeText={handleChange("specialInstructions")}
//                     onBlur={handleBlur("specialInstructions")}
//                     value={values.specialInstructions}
//                   />
//                 </View>

//                 {/* Place Order Button */}
//                 <TouchableOpacity
//                   onPress={handleSubmit}
//                   disabled={loading}
//                   className={`bg-[#f49b33] py-5 rounded-2xl flex-row items-center justify-center shadow-xl ${
//                     loading && "opacity-50"
//                   }`}
//                   style={{
//                     shadowColor: '#f49b33',
//                     shadowOffset: { width: 0, height: 8 },
//                     shadowOpacity: 0.3,
//                     shadowRadius: 16,
//                     elevation: 12,
//                   }}
//                 >
//                   {loading ? (
//                     <>
//                       <ActivityIndicator color="#fff" size="small" />
//                       <Text className="text-white text-lg font-bold ml-3">
//                         Placing Order...
//                       </Text>
//                     </>
//                   ) : (
//                     <>
//                       <Ionicons name="checkmark-circle" size={24} color="#fff" />
//                       <Text className="text-white text-lg font-bold ml-2">
//                         Place Order - Rs. {total.toFixed(2)}
//                       </Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             )}
//           </Formik>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Checkout;

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useCart } from "../store/cartContext";
import { Formik } from "formik";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const Checkout = () => {
  const router = useRouter();
  const { getCartTotal, cart, clearCart, restaurantId } = useCart();

  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [home, setHome] = useState({
    phone: "+92 300 1234567",
    address: "Street 12, Phase 5, DHA Lahore",
  });
  const [office, setOffice] = useState({
    phone: "+92 321 9876543",
    address: "Office #21, 3rd Floor, IT Tower, Islamabad",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(150);

  useEffect(() => {
    if (restaurantId) loadRestaurantData();
  }, []);

  useEffect(() => {
    const subtotal = getCartTotal();
    setDeliveryFee(subtotal >= 1500 ? 0 : 150);
  }, [cart]);

  const subtotal = getCartTotal();
  const discount = subtotal * 0.05;
  const total = subtotal + deliveryFee - discount;

  const loadRestaurantData = async () => {
    try {
      const docSnap = await getDoc(doc(db, "restaurants", restaurantId));
      if (docSnap.exists()) console.log(docSnap.data().name);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveAddress = (values) => {
    editingAddress === "home" ? setHome(values) : setOffice(values);
    setModalVisible(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) return alert("Please select a payment method");
    if (cart.length === 0) return alert("Your cart is empty");

    setLoading(true);
    try {
      const addressData = selectedAddress === "home" ? home : office;

      const orderData = {
        address: addressData.address,
        phoneNumber: addressData.phone,
        totalAmount: total,
        paymentMethod:
          selectedPayment === "cash" ? "Cash on Delivery" : selectedPayment,
        restaurantId,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();

      // Pass order as params using useLocalSearchParams in next screen
      router.push({
        pathname: "/settings/payment-confirm",
        params: { order: JSON.stringify(orderData) },
      });
    } catch (e) {
      console.log(e);
      alert("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  const RadioButton = ({ selected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
        selected ? "border-[#CF2526]" : "border-gray-400"
      }`}
    >
      {selected && <View className="w-2.5 h-2.5 bg-[#CF2526] rounded-full" />}
    </TouchableOpacity>
  );

  const paymentOptions = [
    {
      id: "mastercard",
      title: "Mastercard",
      num: "**** 4567",
      icon: "cc-mastercard",
      type: "disabled",
      iconColor: "#D42129",
    },
    {
      id: "visa",
      title: "Visa Card",
      num: "**** 9876",
      icon: "cc-visa",
      type: "disabled",
      iconColor: "#147AD6",
    },
    {
      id: "cash",
      title: "Cash on Delivery",
      num: "No extra charges",
      icon: "money",
      type: "available",
      bgColor: "#D421291A",
      iconColor: "#CF2526",
    },
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={Platform.OS === "android" ? { paddingBottom: 20 } : {}}
    >
      {/* HEADER */}
      <View className="flex-row items-center justify-center px-5 py-4 border-b border-dashed border-gray-300 relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-5 p-2 rounded-full bg-white shadow-md"
        >
          <Ionicons name="chevron-back" size={24} color="#000"/>
        </TouchableOpacity>
        <Text className="text-2xl font-bold">Payment</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* LOCATION */}
        <Text className="text-xl font-bold mt-6 mb-4 text-gray-800">Location</Text>

        {["home", "office"].map((type) => {
          const data = type === "home" ? home : office;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedAddress(type)}
              className={`bg-white rounded-2xl p-4 mb-4 border ${
                selectedAddress === type ? "border-[#CF2526]" : "border-gray-100"
              }`}
            >
              <View className="flex-row justify-between mb-2">
                <View className="flex-row items-center">
                  <RadioButton
                    selected={selectedAddress === type}
                    onPress={() => setSelectedAddress(type)}
                  />
                  <Text className="ml-2 font-bold text-gray-700 capitalize">{type}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setEditingAddress(type);
                    setModalVisible(true);
                  }}
                  className="flex-row items-center"
                >
                  <Feather name="edit-3" size={16} color="#CF2526" />
                  <Text className="text-[#CF2526] ml-1">Edit</Text>
                </TouchableOpacity>
              </View>

              <Text className="text-gray-700 text-sm">{data.phone}</Text>
              <Text className="text-gray-700 text-sm mt-1">{data.address}</Text>
            </TouchableOpacity>
          );
        })}

        {/* PAYMENT METHODS */}
        <Text className="text-xl font-bold mt-6 mb-4 text-gray-800">
          Payment Method
        </Text>

        {paymentOptions.map((item) => {
          const isSelected = selectedPayment === item.id;
          return (
            <View
              key={item.id}
              className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center justify-between"
            >
              <View className="flex-row items-center justify-center w-12 h-12">
                <FontAwesome name={item.icon} size={26} color={item.iconColor} />
              </View>

              <View className="ml-3 flex-1">
                <Text className="font-bold text-gray-700">{item.title}</Text>
                {item.num ? <Text className="text-gray-500 text-xs">{item.num}</Text> : null}
              </View>

              {isSelected ? (
                <View
                  className={`rounded-full px-2 py-1 ${
                    item.type === "available" ? "bg-[#D421291A]" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      item.type === "available" ? "text-[#D42129]" : "text-gray-600"
                    }`}
                  >
                    {item.type === "available" ? "Available Now" : "Coming Soon"}
                  </Text>
                </View>
              ) : (
                <RadioButton
                  selected={isSelected}
                  onPress={() => {
                    if (item.type === "disabled") {
                      Alert.alert("Coming Soon", "This payment method is not available now.");
                    }
                    setSelectedPayment(item.id);
                  }}
                />
              )}
            </View>
          );
        })}

        {/* ORDER SUMMARY */}
        <View className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
          <Text className="text-lg font-bold mb-4">Order Summary</Text>

          <View className="flex-row justify-between items-center py-3 border-b border-dashed border-gray-300">
            <Text className="text-gray-700">Subtotal</Text>
            <Text className="text-gray-700">Rs. {subtotal.toFixed(2)}</Text>
          </View>

          <View className="flex-row justify-between items-center py-3 border-b border-dashed border-gray-300">
            <Text className="text-gray-700">Delivery</Text>
            <Text className="text-gray-700">Rs. {deliveryFee.toFixed(2)}</Text>
          </View>

          <View className="flex-row justify-between items-center py-3 ">
            <Text className="text-gray-700">Discount (5%)</Text>
            <Text className="text-gray-700">- Rs. {discount.toFixed(2)}</Text>
          </View>

          <View className="border-t border-dashed border-gray-300" />

          <View className="flex-row justify-between items-center py-3">
            <Text className="font-bold text-lg">Total</Text>
            <Text className="font-bold text-lg text-black">Rs. {total.toFixed(2)}</Text>
          </View>
        </View>

        {/* PAY BUTTON */}
        <View className="items-center mb-10">
          <TouchableOpacity
            onPress={handlePlaceOrder}
            disabled={loading}
            className="bg-[#CF2526] py-4 rounded-full flex-row items-center justify-center w-3/4"
          >
            {loading && (
              <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
            )}
            <Text className="text-white text-lg font-bold">Pay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white rounded-2xl p-5 w-full">
            <Formik
              initialValues={editingAddress === "home" ? home : office}
              onSubmit={handleSaveAddress}
            >
              {({ handleChange, handleSubmit, values }) => (
                <>
                  <TextInput
                    className="border p-3 rounded-xl mb-3"
                    value={values.phone}
                    onChangeText={handleChange("phone")}
                  />
                  <TextInput
                    className="border p-3 rounded-xl mb-3"
                    value={values.address}
                    onChangeText={handleChange("address")}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="bg-[#CF2526] p-3 rounded-full"
                  >
                    <Text className="text-white text-center">Save</Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Checkout;





  
