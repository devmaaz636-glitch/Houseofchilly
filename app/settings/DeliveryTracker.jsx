// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Linking,
//   ScrollView,
//   Dimensions,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import deliverytracking from "../../assets/images/deliverytracking.png";

// const { width } = Dimensions.get("window");

// const DeliveryTracker = () => {
//   const router = useRouter();
//   const { order } = useLocalSearchParams();
//   const orderData = order ? JSON.parse(order) : null;

//   const [statusIndex, setStatusIndex] = useState(0);
//   const steps = [
//     { label: "Order", icon: "receipt-outline" },
//     { label: "Pick up", icon: "basket-outline" },
//     { label: "On Way", icon: "bicycle-outline" },
//     { label: "Delivered", icon: "checkmark-circle-outline" },
//   ];

//   useEffect(() => {
//     if (!orderData) return;

//     switch (orderData.status) {
//       case "pending":
//         setStatusIndex(0);
//         break;
//       case "picked":
//         setStatusIndex(1);
//         break;
//       case "onway":
//         setStatusIndex(2);
//         break;
//       case "delivered":
//         setStatusIndex(3);
//         break;
//       default:
//         setStatusIndex(0);
//     }
//   }, [orderData?.status]);

//   // Calculate estimated delivery time (add 30-45 mins to order time)
//   const getEstimatedTime = () => {
//     if (!orderData) return "";
//     const orderTime = new Date(orderData.createdAt);
//     const estimatedTime = new Date(orderTime.getTime() + 35 * 60000); // +35 minutes
//     return estimatedTime.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//   };

//   if (!orderData) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.errorContainer}>
//           <Ionicons name="alert-circle-outline" size={64} color="#CF2526" />
//           <Text style={styles.errorText}>No order data available</Text>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             style={styles.errorButton}
//           >
//             <Text style={styles.errorButtonText}>Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             style={styles.backButton}
//           >
//             <Ionicons name="chevron-back" size={26} color="#000" />
//           </TouchableOpacity>

//           <View style={styles.headerTitleContainer}>
//             <Text style={styles.headerTitle}>Time Tracker</Text>
//             <View style={styles.headerUnderline} />
//           </View>

//           {/* Placeholder for alignment */}
//           <View style={styles.headerRight} />
//         </View>

//         {/* Logo */}
//         <View style={styles.logoContainer}>
//           <Image
//             source={require("../../assets/images/logo.png")}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </View>

//         {/* Delivery Confirmed Card */}
//         <View style={styles.confirmationCard}>
//           <Text style={styles.confirmationTitle}>Delivery Confirmed</Text>
//           <Text style={styles.confirmationDate}>
//             {new Date(orderData.createdAt).toLocaleDateString("en-US", {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//             })}
//           </Text>
//           <Text style={styles.confirmationTime}>{getEstimatedTime()}</Text>
//           <Text style={styles.confirmationSubtext}>
//             Estimated Time To Arrival
//           </Text>

//           {/* Order Details */}
//           <View style={styles.orderDetails}>
//             <View style={styles.orderDetailRow}>
//               <Text style={styles.orderDetailLabel}>Order ID:</Text>
//               <Text style={styles.orderDetailValue}>
//                 #{orderData.id || "N/A"}
//               </Text>
//             </View>
//             {orderData.deliveryAddress && (
//               <View style={styles.orderDetailRow}>
//                 <Text style={styles.orderDetailLabel}>Delivery to:</Text>
//                 <Text style={styles.orderDetailValue} numberOfLines={2}>
//                   {orderData.deliveryAddress}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Delivery Status Section */}
//         <View style={styles.statusSection}>
//           <View style={styles.statusHeader}>
//             <View>
//               <Text style={styles.statusTitle}>Delivery Status</Text>
//               <Text style={styles.statusSubtitle}>
//                 {orderData.deliveryService || "Fast Delivery Service"}
//               </Text>
//             </View>
//             <Image
//               source={deliverytracking}
//               style={styles.deliveryIcon}
//               resizeMode="contain"
//             />
//           </View>

//           {/* Progress Tracker */}
//           <View style={styles.progressContainer}>
//             {/* Background Line */}
//             <View style={styles.progressLineBackground} />
//             {/* Active Line */}
//             <View
//               style={[
//                 styles.progressLineActive,
//                 {
//                   width: `${(statusIndex / (steps.length - 1)) * 100}%`,
//                 },
//               ]}
//             />

//             {/* Progress Nodes */}
//             <View style={styles.progressNodes}>
//               {steps.map((step, index) => (
//                 <View key={index} style={styles.progressNode}>
//                   {/* Outer Circle */}
//                   <View
//                     style={[
//                       styles.nodeOuter,
//                       {
//                         borderColor:
//                           index <= statusIndex ? "#CF2526" : "#E5E5E5",
//                       },
//                     ]}
//                   >
//                     {/* Inner Circle or Icon */}
//                     {index <= statusIndex && (
//                       <View style={styles.nodeInner} />
//                     )}
//                   </View>

//                   {/* Step Label */}
//                   <Text
//                     style={[
//                       styles.stepLabel,
//                       {
//                         fontWeight: index <= statusIndex ? "600" : "400",
//                         color: index <= statusIndex ? "#000" : "#999",
//                       },
//                     ]}
//                   >
//                     {step.label}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </View>

//           {/* Current Status Message */}
//           <View style={styles.statusMessage}>
//             <Ionicons
//               name={steps[statusIndex]?.icon || "information-circle-outline"}
//               size={20}
//               color="#CF2526"
//             />
//             <Text style={styles.statusMessageText}>
//               {statusIndex === 0 && "Your order has been placed successfully"}
//               {statusIndex === 1 && "Rider has picked up your order"}
//               {statusIndex === 2 && "Your order is on the way"}
//               {statusIndex === 3 && "Order delivered successfully!"}
//             </Text>
//           </View>
//         </View>

//         {/* Bottom Section */}
//         <View style={styles.bottomSection}>
//           {/* Thank You Button */}
//           <TouchableOpacity
//             style={styles.thankYouButton}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.thankYouButtonText}>
//               Thanks for your patience
//             </Text>
//           </TouchableOpacity>

//           {/* WhatsApp Support */}
//           <TouchableOpacity
//             onPress={() =>
//               Linking.openURL(
//                 "https://api.whatsapp.com/send/?phone=923318555546&text&type=phone_number&app_absent=0"
//               )
//             }
//             style={styles.whatsappContainer}
//             activeOpacity={0.7}
//           >
//             <View style={styles.whatsappTextContainer}>
//               <Text style={styles.whatsappText}>
//                 <Text style={styles.whatsappTextBold}>Need Help?</Text>
//                 <Text style={styles.whatsappTextRegular}>
//                   {" "}
//                   Chat on WhatsApp
//                 </Text>
//               </Text>
//               <View style={styles.whatsappUnderline} />
//             </View>
//             <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   // Header Styles
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 12,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   headerTitleContainer: {
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     fontStyle: "italic",
//     color: "#000",
//   },
//   headerUnderline: {
//     height: 2,
//     width: 80,
//     backgroundColor: "#CF2526",
//     marginTop: 4,
//   },
//   headerRight: {
//     width: 40,
//   },
//   // Logo Styles
//   logoContainer: {
//     alignItems: "center",
//     marginTop: 16,
//   },
//   logo: {
//     width: 128,
//     height: 80,
//   },
//   // Confirmation Card Styles
//   confirmationCard: {
//     marginHorizontal: 20,
//     marginTop: 24,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 24,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#F0F0F0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   confirmationTitle: {
//     color: "#CF2526",
//     fontWeight: "bold",
//     fontSize: 22,
//   },
//   confirmationDate: {
//     color: "#999",
//     fontSize: 14,
//     marginTop: 8,
//   },
//   confirmationTime: {
//     color: "#CF2526",
//     fontWeight: "800",
//     fontSize: 40,
//     marginTop: 8,
//   },
//   confirmationSubtext: {
//     color: "#666",
//     fontSize: 13,
//     marginTop: 4,
//   },
//   orderDetails: {
//     marginTop: 20,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: "#F0F0F0",
//     width: "100%",
//   },
//   orderDetailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   orderDetailLabel: {
//     fontSize: 13,
//     color: "#666",
//     fontWeight: "500",
//   },
//   orderDetailValue: {
//     fontSize: 13,
//     color: "#000",
//     fontWeight: "600",
//     flex: 1,
//     textAlign: "right",
//     marginLeft: 8,
//   },
//   // Status Section Styles
//   statusSection: {
//     marginTop: 32,
//     paddingHorizontal: 20,
//   },
//   statusHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   statusTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   statusSubtitle: {
//     fontSize: 13,
//     color: "#666",
//     marginTop: 4,
//   },
//   deliveryIcon: {
//     width: 64,
//     height: 64,
//   },
//   // Progress Tracker Styles
//   progressContainer: {
//     marginTop: 24,
//     position: "relative",
//     paddingHorizontal: 8,
//   },
//   progressLineBackground: {
//     position: "absolute",
//     left: 20,
//     right: 20,
//     top: 11,
//     height: 2,
//     backgroundColor: "#E5E5E5",
//     zIndex: 0,
//   },
//   progressLineActive: {
//     position: "absolute",
//     left: 20,
//     top: 11,
//     height: 2,
//     backgroundColor: "#CF2526",
//     zIndex: 1,
//   },
//   progressNodes: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     zIndex: 2,
//   },
//   progressNode: {
//     flex: 1,
//     alignItems: "center",
//   },
//   nodeOuter: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFFFFF",
//   },
//   nodeInner: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#CF2526",
//   },
//   stepLabel: {
//     marginTop: 8,
//     fontSize: 12,
//     textAlign: "center",
//   },
//   // Status Message Styles
//   statusMessage: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 24,
//     padding: 16,
//     backgroundColor: "#FFF5F5",
//     borderRadius: 12,
//     borderLeftWidth: 3,
//     borderLeftColor: "#CF2526",
//   },
//   statusMessageText: {
//     marginLeft: 12,
//     fontSize: 14,
//     color: "#333",
//     flex: 1,
//     fontWeight: "500",
//   },
//   // Bottom Section Styles
//   bottomSection: {
//     marginTop: "auto",
//     paddingHorizontal: 20,
//     paddingTop: 32,
//     paddingBottom: 16,
//   },
//   thankYouButton: {
//     backgroundColor: "#CF2526",
//     borderRadius: 25,
//     paddingVertical: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#CF2526",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   thankYouButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   whatsappContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 16,
//     paddingVertical: 8,
//   },
//   whatsappTextContainer: {
//     alignItems: "center",
//     marginRight: 6,
//   },
//   whatsappText: {
//     fontSize: 14,
//   },
//   whatsappTextBold: {
//     color: "#CF2526",
//     fontWeight: "600",
//   },
//   whatsappTextRegular: {
//     color: "#666",
//     fontWeight: "400",
//   },
//   whatsappUnderline: {
//     height: 1,
//     backgroundColor: "#CF2526",
//     width: "100%",
//     marginTop: 2,
//   },
//   // Error State Styles
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 40,
//   },
//   errorText: {
//     fontSize: 18,
//     color: "#666",
//     marginTop: 16,
//     textAlign: "center",
//   },
//   errorButton: {
//     marginTop: 24,
//     backgroundColor: "#CF2526",
//     paddingHorizontal: 32,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   errorButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// export default DeliveryTracker;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const DeliveryTracker = () => {
  const router = useRouter();
  const { order } = useLocalSearchParams();
  const orderData = order ? JSON.parse(order) : null;

  const [statusIndex, setStatusIndex] = useState(0);
  const scrollY = new Animated.Value(0);

  // Complete status flow
  const steps = [
    {
      label: "Order Placed",
      icon: "receipt-outline",
      description: "Your order has been confirmed",
      key: "pending",
    },
    {
      label: "Picked Up",
      icon: "basket-outline",
      description: "Rider collected your order",
      key: "picked",
    },
    {
      label: "On the Way",
      icon: "bicycle-outline",
      description: "Order is being delivered",
      key: "onway",
    },
    {
      label: "Delivered",
      icon: "checkmark-circle-outline",
      description: "Order successfully delivered",
      key: "delivered",
    },
  ];

  useEffect(() => {
    if (!orderData) return;

    const statusMap = {
      pending: 0,
      picked: 1,
      onway: 2,
      delivered: 3,
    };

    setStatusIndex(statusMap[orderData.status] || 0);
  }, [orderData?.status]);

  // Calculate estimated delivery time
  const getEstimatedTime = () => {
    if (!orderData) return "";
    const orderTime = new Date(orderData.createdAt);
    const estimatedTime = new Date(orderTime.getTime() + 35 * 60000);
    return estimatedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get current status details
  const getCurrentStatusDetails = () => {
    const currentStep = steps[statusIndex];
    return {
      title: currentStep.label,
      description: currentStep.description,
      icon: currentStep.icon,
    };
  };

  if (!orderData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-10">
          <Ionicons name="alert-circle-outline" size={64} color="#CF2526" />
          <Text className="text-lg text-gray-600 mt-4 text-center font-medium">
            No order data available
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-[#CF2526] px-8 py-3 rounded-full shadow-lg"
          >
            <Text className="text-white font-bold text-base">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStatus = getCurrentStatusDetails();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Fixed Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shadow-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <View className="items-center flex-1 mx-4">
          <Text className="text-lg font-bold text-black">Order Tracking</Text>
          <View className="border-b border-dashed border-gray-300 w-16 mt-1" />
        </View>

        <View className="w-10" />
      </View>

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Logo */}
        <View className="items-center py-5 bg-white">
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-24 h-14"
            resizeMode="contain"
          />
        </View>

        {/* Current Status Card */}
        <View className="mx-5 mt-5 bg-white rounded-2xl p-6 items-center shadow-md">
          <View className="mb-4">
            <View className="w-20 h-20 rounded-full bg-red-50 items-center justify-center border-3 border-[#CF2526]">
              <Ionicons name={currentStatus.icon} size={32} color="#CF2526" />
            </View>
          </View>
          
          <Text className="text-2xl font-bold text-[#CF2526] mb-2 text-center">
            {currentStatus.title}
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-5">
            {currentStatus.description}
          </Text>
          
          <View className="h-px w-full bg-gray-100 my-5" />
          
          <View className="items-center">
            <Text className="text-xs text-gray-500 mb-1">Estimated Arrival</Text>
            <Text className="text-4xl font-extrabold text-[#CF2526]">
              {getEstimatedTime()}
            </Text>
          </View>
        </View>

        {/* Order Details Card */}
        <View className="mx-5 mt-5 bg-white rounded-2xl p-5 shadow-md">
          <Text className="text-lg font-bold text-black mb-4">Order Details</Text>

          {/* Order ID */}
          <View className="flex-row mb-4">
            <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
              <Ionicons name="receipt-outline" size={20} color="#666" />
            </View>
            <View className="flex-1 justify-center">
              <Text className="text-xs text-gray-500 mb-1 font-medium">Order ID</Text>
              <Text className="text-base text-gray-800 font-semibold">
                #{orderData.id || "N/A"}
              </Text>
            </View>
          </View>

          {/* Order Date */}
          <View className="flex-row mb-4">
            <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </View>
            <View className="flex-1 justify-center">
              <Text className="text-xs text-gray-500 mb-1 font-medium">Order Date</Text>
              <Text className="text-base text-gray-800 font-semibold leading-5">
                {new Date(orderData.createdAt).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {" at "}
                {new Date(orderData.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </Text>
            </View>
          </View>

          {/* Delivery Address */}
          {orderData.deliveryAddress && (
            <View className="flex-row mb-4">
              <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
                <Ionicons name="location-outline" size={20} color="#666" />
              </View>
              <View className="flex-1 justify-center">
                <Text className="text-xs text-gray-500 mb-1 font-medium">
                  Delivery Address
                </Text>
                <Text className="text-base text-gray-800 font-semibold leading-5">
                  {orderData.deliveryAddress}
                </Text>
              </View>
            </View>
          )}

          {/* Items */}
          {orderData.items && orderData.items.length > 0 && (
            <View className="flex-row mb-4">
              <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-3">
                <Ionicons name="cart-outline" size={20} color="#666" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-2 font-medium">
                  Items ({orderData.items.length})
                </Text>
                {orderData.items.map((item, index) => (
                  <View
                    key={index}
                    className="flex-row justify-between py-1.5 pl-3 border-l-2 border-[#CF2526] mt-2"
                  >
                    <Text className="text-sm text-gray-800 flex-1">
                      {item.quantity}x {item.name}
                    </Text>
                    <Text className="text-sm text-[#CF2526] font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Total Amount */}
          <View className="flex-row justify-between pt-4 mt-4 border-t border-gray-100">
            <Text className="text-base font-bold text-black">Total Amount</Text>
            <Text className="text-lg font-bold text-black">
              Rs. {orderData.totalAmount?.toFixed(2) || "0.00"}
            </Text>
          </View>
        </View>

        {/* Delivery Progress Section */}
        <View className="mx-5 mt-5 bg-white rounded-2xl p-5 shadow-md">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-black">Delivery Progress</Text>
            <View className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-xl">
              <Ionicons name="bicycle" size={14} color="#CF2526" />
              <Text className="text-xs text-[#CF2526] font-semibold ml-1">
                {orderData.deliveryService || "Express Delivery"}
              </Text>
            </View>
          </View>

          {/* Vertical Progress Timeline */}
          <View className="pl-2.5">
            {steps.map((step, index) => {
              const isCompleted = index <= statusIndex;
              const isActive = index === statusIndex;

              return (
                <View key={index} className="flex-row pb-8 relative">
                  {/* Timeline Line */}
                  {index < steps.length - 1 && (
                    <View
                      className={`absolute left-[21px] top-8 bottom-[-8px] w-0.5 ${
                        isCompleted ? "bg-[#CF2526]" : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Timeline Node */}
                  <View className="w-11 items-center pt-0.5">
                    <View
                      className={`w-6 h-6 rounded-full border-2 bg-white items-center justify-center ${
                        isCompleted
                          ? "border-[#CF2526] bg-[#CF2526]"
                          : "border-gray-200"
                      } ${isActive ? "border-3 w-7 h-7" : ""}`}
                    >
                      {isCompleted ? (
                        isActive ? (
                          <View className="w-3 h-3 rounded-full bg-white" />
                        ) : (
                          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        )
                      ) : null}
                    </View>
                  </View>

                  {/* Timeline Content */}
                  <View className="flex-1 pt-0">
                    <View className="flex-row items-center mb-1">
                      <Ionicons
                        name={step.icon}
                        size={20}
                        color={isCompleted ? "#CF2526" : "#999"}
                      />
                      <Text
                        className={`text-base font-semibold ml-2 ${
                          isCompleted ? "text-black" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </Text>
                    </View>
                    <Text
                      className={`text-xs ml-7 ${
                        isCompleted ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </Text>
                    {orderData.trackingHistory &&
                      orderData.trackingHistory[index] && (
                        <Text className="text-xs text-[#CF2526] ml-7 mt-1 font-medium">
                          {new Date(
                            orderData.trackingHistory[index].timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </Text>
                      )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Rider Information */}
        {orderData.riderName && statusIndex >= 1 && statusIndex < 3 && (
          <View className="mx-5 mt-5 bg-white rounded-2xl p-5 shadow-md">
            <Text className="text-lg font-bold text-black mb-4">
              Delivery Partner
            </Text>
            <View className="flex-row items-center">
              <View className="w-14 h-14 rounded-full bg-red-50 items-center justify-center mr-3">
                <Ionicons name="person" size={32} color="#CF2526" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-black mb-1">
                  {orderData.riderName}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text className="text-sm text-gray-600 ml-1 font-semibold">
                    4.8
                  </Text>
                </View>
              </View>
              {orderData.riderPhone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${orderData.riderPhone}`)}
                  className="w-11 h-11 rounded-full bg-[#CF2526] items-center justify-center shadow-lg"
                >
                  <Ionicons name="call" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Delivery Proof */}
        {statusIndex === 3 && orderData.deliveryProof && (
          <View className="mx-5 mt-5 bg-white rounded-2xl p-5 shadow-md">
            <Text className="text-lg font-bold text-black mb-4">
              Delivery Proof
            </Text>
            <Image
              source={{ uri: orderData.deliveryProof }}
              className="w-full h-48 rounded-xl mb-3"
              resizeMode="cover"
            />
            <Text className="text-sm text-gray-600 text-center">
              Package delivered successfully at your doorstep
            </Text>
          </View>
        )}

        {/* Bottom Section */}
        <View className="mt-5 px-5 pb-8">
          {/* Primary Action Button */}
          {statusIndex === 3 ? (
            <TouchableOpacity
              className="bg-[#CF2526] rounded-full py-4 items-center justify-center flex-row shadow-lg"
              onPress={() => router.push("/")}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-bold text-base">
                Rate Your Order
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-[#CF2526] rounded-full py-4 items-center justify-center shadow-lg"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">
                {statusIndex === 0 && "Preparing your order..."}
                {statusIndex === 1 && "Order picked up"}
                {statusIndex === 2 && "On the way to you"}
              </Text>
            </TouchableOpacity>
          )}

          {/* WhatsApp Support */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://api.whatsapp.com/send/?phone=923318555546&text&type=phone_number&app_absent=0"
              )
            }
            className="flex-row items-center justify-between mt-4 py-4 px-5 bg-white rounded-xl border border-gray-100"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <View>
                <View className="flex-row items-center">
                  <Text className="text-sm">
                    <Text className="text-[#CF2526] font-semibold">Need Help?</Text>
                    <Text className="text-gray-600"> Chat on WhatsApp</Text>
                  </Text>
                  <Ionicons
                    name="logo-whatsapp"
                    size={18}
                    color="#25D366"
                    style={{ marginLeft: 6 }}
                  />
                </View>
                <View className="h-px bg-[#CF2526] w-full mt-0.5" />
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          {/* Cancel Order Button */}
          {statusIndex === 0 && (
            <TouchableOpacity
              className="mt-3 py-3.5 items-center rounded-xl border border-red-600"
              onPress={() => {
                console.log("Cancel order");
              }}
            >
              <Text className="text-red-600 font-semibold text-base">
                Cancel Order
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default DeliveryTracker;