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
  StyleSheet,
  Linking,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import deliverytracking from "../../assets/images/deliverytracking.png";

const { width } = Dimensions.get("window");

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
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#CF2526" />
          <Text style={styles.errorText}>No order data available</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.errorButton}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStatus = getCurrentStatusDetails();

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View className="border-b border-dashed border-gray-300 mt-1" />
        </View>

        <View style={styles.headerRight} />
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Current Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconContainer}>
            <View style={styles.statusIconCircle}>
              <Ionicons name={currentStatus.icon} size={32} color="#CF2526" />
            </View>
          </View>
          <Text style={styles.statusCardTitle}>{currentStatus.title}</Text>
          <Text style={styles.statusCardDescription}>
            {currentStatus.description}
          </Text>
          <View style={styles.statusCardDivider} />
          <View style={styles.estimatedTimeContainer}>
            <Text style={styles.estimatedTimeLabel}>Estimated Arrival</Text>
            <Text style={styles.estimatedTime}>{getEstimatedTime()}</Text>
          </View>
        </View>

        {/* Order Details Card */}
        <View style={styles.orderDetailsCard}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="receipt-outline" size={20} color="#666" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>#{orderData.id || "N/A"}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Order Date</Text>
              <Text style={styles.detailValue}>
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

          {orderData.deliveryAddress && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="location-outline" size={20} color="#666" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Delivery Address</Text>
                <Text style={styles.detailValue}>
                  {orderData.deliveryAddress}
                </Text>
              </View>
            </View>
          )}

          {orderData.items && orderData.items.length > 0 && (
            <View style={styles.detailRow}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="cart-outline" size={20} color="#666" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>
                  Items ({orderData.items.length})
                </Text>
                {orderData.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemName}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              ${orderData.totalAmount?.toFixed(2) || "0.00"}
            </Text>
          </View>
        </View>

        {/* Delivery Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Delivery Progress</Text>
            <View style={styles.deliveryServiceBadge}>
              <Ionicons name="bicycle" size={14} color="#CF2526" />
              <Text style={styles.deliveryServiceText}>
                {orderData.deliveryService || "Express Delivery"}
              </Text>
            </View>
          </View>

          {/* Vertical Progress Timeline */}
          <View style={styles.timelineContainer}>
            {steps.map((step, index) => {
              const isCompleted = index <= statusIndex;
              const isActive = index === statusIndex;

              return (
                <View key={index} style={styles.timelineItem}>
                  {/* Timeline Line */}
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        isCompleted && styles.timelineLineActive,
                      ]}
                    />
                  )}

                  {/* Timeline Node */}
                  <View style={styles.timelineNodeContainer}>
                    <View
                      style={[
                        styles.timelineNode,
                        isCompleted && styles.timelineNodeActive,
                        isActive && styles.timelineNodeCurrent,
                      ]}
                    >
                      {isCompleted ? (
                        isActive ? (
                          <View style={styles.timelineNodeInner} />
                        ) : (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FFFFFF"
                          />
                        )
                      ) : null}
                    </View>
                  </View>

                  {/* Timeline Content */}
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Ionicons
                        name={step.icon}
                        size={20}
                        color={isCompleted ? "#CF2526" : "#999"}
                      />
                      <Text
                        style={[
                          styles.timelineTitle,
                          isCompleted && styles.timelineTitleActive,
                        ]}
                      >
                        {step.label}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.timelineDescription,
                        isCompleted && styles.timelineDescriptionActive,
                      ]}
                    >
                      {step.description}
                    </Text>
                    {orderData.trackingHistory &&
                      orderData.trackingHistory[index] && (
                        <Text style={styles.timelineTimestamp}>
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

        {/* Rider Information (if available) */}
        {orderData.riderName && statusIndex >= 1 && statusIndex < 3 && (
          <View style={styles.riderCard}>
            <Text style={styles.sectionTitle}>Delivery Partner</Text>
            <View style={styles.riderInfo}>
              <View style={styles.riderAvatar}>
                <Ionicons name="person" size={32} color="#CF2526" />
              </View>
              <View style={styles.riderDetails}>
                <Text style={styles.riderName}>{orderData.riderName}</Text>
                <View style={styles.riderRating}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.riderRatingText}>4.8</Text>
                </View>
              </View>
              {orderData.riderPhone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${orderData.riderPhone}`)}
                  style={styles.callButton}
                >
                  <Ionicons name="call" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Delivery Image Section (for delivered orders) */}
        {statusIndex === 3 && orderData.deliveryProof && (
          <View style={styles.proofCard}>
            <Text style={styles.sectionTitle}>Delivery Proof</Text>
            <Image
              source={{ uri: orderData.deliveryProof }}
              style={styles.proofImage}
              resizeMode="cover"
            />
            <Text style={styles.proofText}>
              Package delivered successfully at your doorstep
            </Text>
          </View>
        )}

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Thank You Button */}
          {statusIndex === 3 ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                // Navigate to rate order or home
                router.push("/");
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
              <Text style={styles.primaryButtonText}>Rate Your Order</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>
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
            style={styles.whatsappContainer}
            activeOpacity={0.7}
          >
            <View style={styles.whatsappContent}>
              <Ionicons
                name="logo-whatsapp"
                size={20}
                color="#25D366"
                style={styles.whatsappIcon}
              />
              <View>
                <Text style={styles.whatsappText}>
                  <Text style={styles.whatsappTextBold}>Need Help?</Text>
                  <Text style={styles.whatsappTextRegular}>
                    {" "}
                    Chat on WhatsApp
                  </Text>
                </Text>
                <View style={styles.whatsappUnderline} />
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </TouchableOpacity>

          {/* Cancel Order Button (only for pending status) */}
          {statusIndex === 0 && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                // Handle order cancellation
                console.log("Cancel order");
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  fixedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    zIndex: 1000,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerUnderline: {
    height: 2,
    width: 60,
    backgroundColor: "#CF2526",
    marginTop: 4,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  // Logo
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 100,
    height: 60,
  },
  // Status Card
  statusCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statusIconContainer: {
    marginBottom: 16,
  },
  statusIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#CF2526",
  },
  statusCardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#CF2526",
    marginBottom: 8,
  },
  statusCardDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  statusCardDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "#F0F0F0",
    marginVertical: 20,
  },
  estimatedTimeContainer: {
    alignItems: "center",
  },
  estimatedTimeLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 32,
    fontWeight: "800",
    color: "#CF2526",
  },
  // Order Details Card
  orderDetailsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
    lineHeight: 20,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#CF2526",
    marginTop: 8,
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: "#CF2526",
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#CF2526",
  },
  // Progress Section
  progressSection: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  deliveryServiceBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  deliveryServiceText: {
    fontSize: 12,
    color: "#CF2526",
    fontWeight: "600",
    marginLeft: 4,
  },
  // Timeline
  timelineContainer: {
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: "row",
    paddingBottom: 32,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 21,
    top: 32,
    bottom: -8,
    width: 2,
    backgroundColor: "#E5E5E5",
  },
  timelineLineActive: {
    backgroundColor: "#CF2526",
  },
  timelineNodeContainer: {
    width: 44,
    alignItems: "center",
    paddingTop: 2,
  },
  timelineNode: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineNodeActive: {
    borderColor: "#CF2526",
    backgroundColor: "#CF2526",
  },
  timelineNodeCurrent: {
    borderWidth: 3,
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  timelineNodeInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
  },
  timelineContent: {
    flex: 1,
    paddingTop: 0,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginLeft: 8,
  },
  timelineTitleActive: {
    color: "#000",
  },
  timelineDescription: {
    fontSize: 13,
    color: "#999",
    marginLeft: 28,
  },
  timelineDescriptionActive: {
    color: "#666",
  },
  timelineTimestamp: {
    fontSize: 12,
    color: "#CF2526",
    marginLeft: 28,
    marginTop: 4,
    fontWeight: "500",
  },
  // Rider Card
  riderCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  riderInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  riderAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  riderDetails: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  riderRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  riderRatingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    fontWeight: "600",
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#CF2526",
    alignItems: "center",
    justifyContent: "center",
  },
  // Delivery Proof
  proofCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  proofImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  proofText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  // Bottom Section
  bottomSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  primaryButton: {
    backgroundColor: "#CF2526",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#CF2526",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  whatsappContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  whatsappContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  whatsappIcon: {
    marginRight: 12,
  },
  whatsappText: {
    fontSize: 14,
  },
  whatsappTextBold: {
    color: "#CF2526",
    fontWeight: "600",
  },
  whatsappTextRegular: {
    color: "#666",
  },
  whatsappUnderline: {
    height: 1,
    backgroundColor: "#CF2526",
    width: "100%",
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DC143C",
  },
  cancelButtonText: {
    color: "#DC143C",
    fontWeight: "600",
    fontSize: 15,
  },
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  errorButton: {
    marginTop: 24,
    backgroundColor: "#CF2526",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  errorButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DeliveryTracker;