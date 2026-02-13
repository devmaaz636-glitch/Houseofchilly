// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   Linking,
// } from "react-native";
// import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
//   getDocs,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../../config/firebaseConfig";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from "@expo/vector-icons/Ionicons";

// const Delivery = () => {
//   const [userEmail, setUserEmail] = useState(null);
//   const [allOrders, setAllOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeTab, setActiveTab] = useState("active");
//   const [error, setError] = useState(null);
//   const router = useRouter();
//   const unsubscribeRef = useRef(null);
//   const isMountedRef = useRef(true);

//   // Fetch user email on mount
//   useEffect(() => {
//     const fetchUserEmail = async () => {
//       try {
//         const email = await AsyncStorage.getItem("userEmail");
//         if (isMountedRef.current) {
//           setUserEmail(email);
//           if (!email) {
//             setLoading(false);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching user email:", err);
//         if (isMountedRef.current) {
//           setError("Failed to load user information");
//           setLoading(false);
//         }
//       }
//     };
//     fetchUserEmail();
//   }, []);

//   // Fetch orders with fallback
//   const fetchOrdersManually = useCallback(async () => {
//     if (!userEmail) return;

//     try {
//       const ordersRef = collection(db, "orders");
      
//       // Try with orderBy first
//       try {
//         const ordersQuery = query(
//           ordersRef,
//           where("email", "==", userEmail),
//           orderBy("createdAt", "desc")
//         );
//         const ordersSnapshot = await getDocs(ordersQuery);
//         const orderList = ordersSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
        
//         if (isMountedRef.current) {
//           setAllOrders(orderList);
//           setError(null);
//         }
//       } catch (indexError) {
//         // If orderBy fails (index not created), try without orderBy
//         console.log("OrderBy failed, fetching without sort:", indexError);
//         const simpleQuery = query(
//           ordersRef,
//           where("email", "==", userEmail)
//         );
//         const ordersSnapshot = await getDocs(simpleQuery);
//         const orderList = ordersSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
        
//         // Sort manually by createdAt
//         orderList.sort((a, b) => {
//           const dateA = new Date(a.createdAt || 0);
//           const dateB = new Date(b.createdAt || 0);
//           return dateB - dateA;
//         });
        
//         if (isMountedRef.current) {
//           setAllOrders(orderList);
//           setError(null);
//         }
//       }
//     } catch (err) {
//       console.error("Error fetching orders:", err);
//       if (isMountedRef.current) {
//         setError("Failed to load orders. Please try again.");
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     }
//   }, [userEmail]);

//   // Setup real-time listener when user email is available
//   useEffect(() => {
//     if (!userEmail) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     const setupRealtimeListener = () => {
//       try {
//         const ordersRef = collection(db, "orders");
        
//         // Try to create query with orderBy
//         let ordersQuery;
//         try {
//           ordersQuery = query(
//             ordersRef,
//             where("email", "==", userEmail),
//             orderBy("createdAt", "desc")
//           );
//         } catch (err) {
//           // If orderBy fails, use simple query
//           console.log("Using simple query without orderBy");
//           ordersQuery = query(
//             ordersRef,
//             where("email", "==", userEmail)
//           );
//         }

//         const unsubscribe = onSnapshot(
//           ordersQuery,
//           (snapshot) => {
//             if (!isMountedRef.current) return;

//             const orderList = snapshot.docs.map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//             }));

//             // Sort manually if needed
//             orderList.sort((a, b) => {
//               const dateA = new Date(a.createdAt || 0);
//               const dateB = new Date(b.createdAt || 0);
//               return dateB - dateA;
//             });

//             setAllOrders(orderList);
//             setLoading(false);
//             setRefreshing(false);
//             setError(null);
//           },
//           (err) => {
//             console.error("Firestore listener error:", err);
//             // If real-time listener fails, fallback to manual fetch
//             if (isMountedRef.current) {
//               console.log("Listener failed, using manual fetch");
//               fetchOrdersManually();
//             }
//           }
//         );

//         return unsubscribe;
//       } catch (err) {
//         console.error("Error setting up listener:", err);
//         if (isMountedRef.current) {
//           // Fallback to manual fetch
//           fetchOrdersManually();
//         }
//         return () => {};
//       }
//     };

//     unsubscribeRef.current = setupRealtimeListener();

//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//       }
//     };
//   }, [userEmail, fetchOrdersManually]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false;
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//       }
//     };
//   }, []);

//   // Memoized filtered orders based on active tab
//   const filteredOrders = useMemo(() => {
//     if (activeTab === "active") {
//       return allOrders.filter(
//         (order) => order.status !== "delivered" && order.status !== "cancelled"
//       );
//     } else {
//       return allOrders.filter(
//         (order) => order.status === "delivered" || order.status === "cancelled"
//       );
//     }
//   }, [allOrders, activeTab]);

//   // Handle manual refresh
//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     setError(null);
//     fetchOrdersManually();
//   }, [fetchOrdersManually]);

//   // Format date utility
//   const formatDate = useCallback((dateString) => {
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) {
//         return "Date unavailable";
//       }
//       const options = {
//         weekday: "short",
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       };
//       return date.toLocaleDateString("en-US", options);
//     } catch {
//       return dateString || "Date unavailable";
//     }
//   }, []);

//   // Status utilities
//   const getStatusColor = useCallback((status) => {
//     const statusMap = {
//       pending: "#f49b33",
//       confirmed: "#4CAF50",
//       preparing: "#2196F3",
//       ready: "#9C27B0",
//       out_for_delivery: "#FF9800",
//       delivered: "#00BCD4",
//       cancelled: "#f44336",
//     };
//     return statusMap[status?.toLowerCase()] || "#f49b33";
//   }, []);

//   const getStatusIcon = useCallback((status) => {
//     const iconMap = {
//       pending: "time-outline",
//       confirmed: "checkmark-circle-outline",
//       preparing: "restaurant-outline",
//       ready: "checkmark-done-circle-outline",
//       out_for_delivery: "bicycle-outline",
//       delivered: "checkmark-circle",
//       cancelled: "close-circle",
//     };
//     return iconMap[status?.toLowerCase()] || "time-outline";
//   }, []);

//   const getStatusSteps = useCallback((status) => {
//     const steps = [
//       { key: "pending", label: "Order Placed", icon: "receipt-outline" },
//       { key: "confirmed", label: "Confirmed", icon: "checkmark-circle-outline" },
//       { key: "preparing", label: "Preparing", icon: "restaurant-outline" },
//       { key: "ready", label: "Ready", icon: "checkmark-done-circle-outline" },
//       { key: "out_for_delivery", label: "Out for Delivery", icon: "bicycle-outline" },
//       { key: "delivered", label: "Delivered", icon: "checkmark-circle" },
//     ];

//     const statusLower = status?.toLowerCase();
//     let currentIndex = steps.findIndex((s) => s.key === statusLower);

//     // Handle cancelled status - show only order placed phase
//     if (statusLower === "cancelled") {
//       currentIndex = -1; // Special handling below
//     }

//     // Handle delivered status - all steps are completed
//     if (statusLower === "delivered") {
//       currentIndex = steps.length - 1; // Last step (delivered) is current
//     }

//     // If status not found, default to pending
//     if (currentIndex === -1 && statusLower !== "cancelled") {
//       currentIndex = 0;
//     }

//     return steps.map((step, index) => {
//       if (statusLower === "cancelled") {
//         // For cancelled orders, show only "Order Placed" as completed/cancelled
//         if (step.key === "pending") {
//           return {
//             ...step,
//             completed: true, // Show as completed but cancelled
//             current: false,
//             cancelled: true,
//           };
//         }
//         // All other steps not reached
//         return {
//           ...step,
//           completed: false,
//           current: false,
//           cancelled: true,
//         };
//       }

//       // For delivered status, all steps are completed (including delivered step)
//       if (statusLower === "delivered") {
//         const isCompleted = index <= currentIndex; // All steps up to and including delivered
//         const isCurrent = index === currentIndex; // Delivered step is current
        
//         return {
//           ...step,
//           completed: isCompleted,
//           current: isCurrent,
//           cancelled: false,
//         };
//       }

//       // For all other statuses (pending, confirmed, preparing, ready, out_for_delivery)
//       const isCompleted = currentIndex >= 0 && index <= currentIndex;
//       const isCurrent = index === currentIndex;
      
//       return {
//         ...step,
//         completed: isCompleted,
//         current: isCurrent,
//         cancelled: false,
//       };
//     });
//   }, []);

//   // Memoized render function for order items
//   const renderOrderItem = useCallback(
//     ({ item }) => {
//       const statusSteps = getStatusSteps(item.status);
//       const statusColor = getStatusColor(item.status);
//       const statusIcon = getStatusIcon(item.status);
//       const isCompleted = item.status === "delivered" || item.status === "cancelled";
//       const isCancelled = item.status === "cancelled";

//       return (
//         <View className="mx-4 mb-4 bg-[#474747] rounded-xl p-4 border-l-4" style={{ borderLeftColor: statusColor }}>
//           {/* Header */}
//           <View className="flex-row justify-between items-center mb-3">
//             <View className="flex-row items-center flex-1">
//               <View
//                 className="p-2 rounded-full mr-3"
//                 style={{ backgroundColor: statusColor + "30" }}
//               >
//                 <Ionicons name={statusIcon} size={24} color={statusColor} />
//               </View>
//               <View className="flex-1">
//                 <Text className="text-white text-lg font-bold">
//                   {item.restaurantName || "Restaurant"}
//                 </Text>
//                 <View className="mt-1 bg-[#2b2b2b] px-2 py-1 rounded-full self-start">
//                   <Text
//                     className="text-xs font-semibold"
//                     style={{ color: statusColor }}
//                   >
//                     {item.status?.toUpperCase().replace("_", " ") || "PENDING"}
//                   </Text>
//                 </View>
//                 {item.orderNumber && (
//                   <Text className="text-white/60 text-xs mt-1">
//                     Order: {item.orderNumber}
//                   </Text>
//                 )}
//               </View>
//             </View>
//             <View className="items-end">
//               <Text className="text-[#CF2526] text-xl font-bold">
//                 ${item.totalAmount?.toFixed(2) || "0.00"}
//               </Text>
//               {item.subtotal && item.deliveryFee !== undefined && (
//                 <Text className="text-white/60 text-xs mt-1 text-right">
//                   ${item.subtotal.toFixed(2)} + {item.deliveryFee === 0 ? "FREE" : `$${item.deliveryFee.toFixed(2)}`}
//                 </Text>
//               )}
//             </View>
//           </View>

//           {/* Complete Order Journey - All Phases */}
//           <View className="mb-4 bg-[#2b2b2b] rounded-lg p-4">
//             <Text className="text-white font-bold text-base mb-4">
//               {isCompleted ? "Complete Order Journey" : "Current Delivery Progress"}
//             </Text>
//             <ScrollView 
//               horizontal 
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={{ paddingRight: 20 }}
//             >
//               <View className="flex-row">
//                 {statusSteps.map((step, index) => {
//                   let stepColor = "#5a5a5a";
//                   let stepBg = "#5a5a5a";
//                   let iconName = step.icon || "ellipse-outline";
//                   let iconColor = "#fff";
//                   let borderColor = "transparent";

//                   if (isCancelled) {
//                     // Cancelled orders - show all phases with cancelled status
//                     if (step.key === "pending") {
//                       stepBg = "#f44336";
//                       stepColor = "#f44336";
//                       iconName = "close-circle";
//                       iconColor = "#fff";
//                     } else {
//                       stepBg = "#5a5a5a";
//                       stepColor = "#5a5a5a";
//                       iconName = step.icon || "close";
//                       iconColor = "#888";
//                     }
//                   } else if (step.completed) {
//                     // All completed steps show as green checkmarks
//                     if (step.current && item.status === "delivered") {
//                       // Delivered step (final step) - show with checkmark-circle icon
//                       stepBg = "#4CAF50";
//                       stepColor = "#4CAF50";
//                       iconName = "checkmark-circle";
//                       iconColor = "#fff";
//                       borderColor = "#4CAF50";
//                     } else {
//                       // All other completed steps (previous phases)
//                       stepBg = "#4CAF50";
//                       stepColor = "#4CAF50";
//                       iconName = "checkmark";
//                       iconColor = "#fff";
//                     }
//                   } else if (step.current) {
//                     // Current step for active orders (not completed yet)
//                     stepBg = statusColor;
//                     stepColor = statusColor;
//                     iconName = step.icon || "time";
//                     iconColor = "#fff";
//                     borderColor = "#fff";
//                   }

//                   return (
//                     <View key={step.key} className="items-center mr-4" style={{ minWidth: 75 }}>
//                       <View className="relative">
//                         <View
//                           className={`w-12 h-12 rounded-full items-center justify-center ${
//                             step.current && !isCompleted && !isCancelled ? "border-2" : ""
//                           }`}
//                           style={{ 
//                             backgroundColor: stepBg,
//                             borderColor: borderColor
//                           }}
//                         >
//                           <Ionicons
//                             name={iconName}
//                             size={step.completed ? 20 : step.current ? 18 : 16}
//                             color={iconColor}
//                           />
//                         </View>
//                         {/* Current step indicator for active orders */}
//                         {step.current && !isCompleted && !isCancelled && (
//                           <View className="absolute -top-1 -right-1 bg-[#f49b33] w-4 h-4 rounded-full border-2 border-[#2b2b2b]" />
//                         )}
//                         {/* Special indicator for delivered status (final step) */}
//                         {step.current && item.status === "delivered" && (
//                           <View className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white items-center justify-center">
//                             <Ionicons name="checkmark" size={12} color="#fff" />
//                           </View>
//                         )}
//                       </View>
//                       <Text
//                         className={`text-xs mt-2 text-center font-semibold ${
//                           step.current && item.status === "delivered"
//                             ? "text-green-400"
//                             : step.current && !isCancelled
//                             ? "text-[#f49b33]"
//                             : step.completed && !isCancelled
//                             ? "text-green-400"
//                             : isCancelled && step.key === "pending"
//                             ? "text-red-400"
//                             : "text-white/60"
//                         }`}
//                         style={{ maxWidth: 75 }}
//                         numberOfLines={2}
//                       >
//                         {step.label}
//                       </Text>
//                       {/* Status badges */}
//                       {step.current && !isCompleted && !isCancelled && (
//                         <View className="mt-1 bg-[#f49b33]/20 px-2 py-0.5 rounded">
//                           <Text className="text-[#f49b33] text-xs font-bold">
//                             Current
//                           </Text>
//                         </View>
//                       )}
//                       {step.current && item.status === "delivered" && (
//                         <View className="mt-1 bg-green-500/20 px-2 py-0.5 rounded">
//                           <Text className="text-green-400 text-xs font-bold">
//                             Completed ✓
//                           </Text>
//                         </View>
//                       )}
//                       {isCancelled && step.key === "pending" && (
//                         <View className="mt-1 bg-red-500/20 px-2 py-0.5 rounded">
//                           <Text className="text-red-400 text-xs font-bold">
//                             Cancelled
//                           </Text>
//                         </View>
//                       )}
//                       {step.completed && !step.current && !isCancelled && (
//                         <View className="mt-1">
//                           <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
//                         </View>
//                       )}
//                       {/* Connector line to next step */}
//                       {index < statusSteps.length - 1 && (
//                         <View
//                           className={`absolute top-6 left-16 w-8 h-0.5 ${
//                             step.completed && !isCancelled
//                               ? "bg-green-500"
//                               : isCancelled && step.key === "pending"
//                               ? "bg-red-500/50"
//                               : step.current && !isCancelled
//                               ? "bg-green-500"
//                               : "bg-[#5a5a5a]"
//                           }`}
//                         />
//                       )}
//                     </View>
//                   );
//                 })}
//               </View>
//             </ScrollView>
            
//             {/* Status message based on current phase */}
//             {!isCompleted && (
//               <View className="mt-4 pt-3 border-t border-[#5a5a5a]">
//                 <View className="flex-row items-start bg-[#474747] p-3 rounded-lg">
//                   <Ionicons name={statusIcon} size={20} color={statusColor} style={{ marginTop: 2 }} />
//                   <View className="ml-3 flex-1">
//                     <Text className="text-white font-semibold text-sm mb-1">
//                       {item.status === "pending" && "⏳ Order Placed"}
//                       {item.status === "confirmed" && "✅ Order Confirmed"}
//                       {item.status === "preparing" && "👨‍🍳 Preparing Your Order"}
//                       {item.status === "ready" && "📦 Order Ready"}
//                       {item.status === "out_for_delivery" && "🚴 Order Out for Delivery"}
//                     </Text>
//                     <Text className="text-white/70 text-xs">
//                       {item.status === "pending" && "Your order has been placed and is awaiting restaurant confirmation"}
//                       {item.status === "confirmed" && "Restaurant has confirmed your order and will start preparation soon"}
//                       {item.status === "preparing" && "The kitchen is preparing your delicious meal"}
//                       {item.status === "ready" && "Your order is ready and will be dispatched for delivery shortly"}
//                       {item.status === "out_for_delivery" && `Your order is on the way! ${item.deliveryDriver ? `Driver: ${item.deliveryDriver}` : "Driver will arrive soon"}`}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             )}

//             {/* Completed order message */}
//             {isCancelled && (
//               <View className="mt-4 pt-3 border-t border-[#5a5a5a]">
//                 <View className="flex-row items-start bg-red-500/20 border border-red-500/30 p-3 rounded-lg">
//                   <Ionicons name="alert-circle" size={20} color="#f44336" style={{ marginTop: 2 }} />
//                   <View className="ml-3 flex-1">
//                     <Text className="text-white font-semibold text-sm mb-1">
//                       ❌ Order Cancelled
//                     </Text>
//                     <Text className="text-white/70 text-xs">
//                       This order was cancelled
//                       {item.cancelledAt && ` on ${formatDate(item.cancelledAt)}`}
//                       {item.cancellationReason && ` - ${item.cancellationReason}`}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             )}

//             {item.status === "delivered" && (
//               <View className="mt-4 pt-3 border-t border-[#5a5a5a]">
//                 <View className="flex-row items-start bg-green-500/20 border border-green-500/30 p-3 rounded-lg">
//                   <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={{ marginTop: 2 }} />
//                   <View className="ml-3 flex-1">
//                     <Text className="text-white font-semibold text-sm mb-1">
//                       ✅ Order Successfully Delivered!
//                     </Text>
//                     <Text className="text-white/70 text-xs">
//                       All phases completed! Your order was placed, confirmed, prepared, ready, dispatched, and delivered successfully.
//                       {item.estimatedDeliveryTime && ` Delivered on ${formatDate(item.estimatedDeliveryTime)}`}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             )}
//           </View>

//           {/* Order Items */}
//           <View className="mb-3 pb-3 border-b border-[#5a5a5a]">
//             <Text className="text-white/70 text-sm mb-2">Items:</Text>
//             {item.items?.map((orderItem, idx) => (
//               <View key={idx} className="flex-row justify-between mb-1">
//                 <Text className="text-white/80 text-sm">
//                   {orderItem.name} x {orderItem.quantity}
//                 </Text>
//                 <Text className="text-white text-sm">
//                   ${(orderItem.price * orderItem.quantity).toFixed(2)}
//                 </Text>
//               </View>
//             ))}
//           </View>

//           {/* Delivery Info */}
//           <View className="space-y-2">
//             <View className="flex-row items-center">
//               <Ionicons name="calendar-outline" size={18} color="#f49b33" />
//               <Text className="text-white ml-2 text-sm flex-1">
//                 {formatDate(item.createdAt)}
//               </Text>
//             </View>

//             {item.address && (
//               <View className="flex-row items-start">
//                 <Ionicons
//                   name="location-outline"
//                   size={18}
//                   color="#f49b33"
//                   style={{ marginTop: 2 }}
//                 />
//                 <Text
//                   className="text-white ml-2 text-sm flex-1"
//                   numberOfLines={2}
//                 >
//                   {item.address}
//                 </Text>
//               </View>
//             )}

//             {item.phoneNumber && (
//               <View className="flex-row items-center">
//                 <Ionicons name="call-outline" size={18} color="#f49b33" />
//                 <Text className="text-white ml-2 text-sm flex-1">
//                   {item.phoneNumber}
//                 </Text>
//               </View>
//             )}

//             {item.deliveryDriver && (
//               <View className="flex-row items-center mt-2 pt-2 border-t border-[#5a5a5a]">
//                 <Ionicons name="bicycle" size={18} color="#CF2526" />
//                 <Text className="text-white ml-2 text-sm flex-1">
//                   Driver: {item.deliveryDriver}
//                 </Text>
//               </View>
//             )}

//             {item.trackingNumber && (
//               <View className="flex-row items-center">
//                 <Ionicons name="qr-code-outline" size={18} color="#f49b33" />
//                 <Text className="text-white ml-2 text-sm flex-1">
//                   Tracking: {item.trackingNumber}
//                 </Text>
//                 <TouchableOpacity
//                   onPress={() => {
//                     Alert.alert(
//                       "Tracking Number",
//                       `Tracking Number: ${item.trackingNumber}\nOrder Number: ${item.orderNumber || "N/A"}\n\nYou can share this with customer support if needed.`,
//                       [
//                         { text: "OK", style: "cancel" },
//                         {
//                           text: "Share",
//                           onPress: async () => {
//                             try {
//                               const shareMessage = `Track my order:\nTracking: ${item.trackingNumber}\nOrder: ${item.orderNumber || ""}\nRestaurant: ${item.restaurantName || ""}`;
//                               await Linking.openURL(`sms:?body=${encodeURIComponent(shareMessage)}`);
//                             } catch (error) {
//                               Alert.alert("Error", "Failed to share tracking number");
//                             }
//                           },
//                         },
//                       ]
//                     );
//                   }}
//                 >
//                   <Ionicons name="share-outline" size={16} color="#f49b33" />
//                 </TouchableOpacity>
//               </View>
//             )}

//             {item.orderNumber && (
//               <View className="flex-row items-center">
//                 <Ionicons name="receipt-outline" size={18} color="#f49b33" />
//                 <Text className="text-white ml-2 text-sm flex-1">
//                   Order: {item.orderNumber}
//                 </Text>
//               </View>
//             )}

//             {item.estimatedDeliveryTime && (
//               <View className="flex-row items-center mt-2 pt-2 border-t border-[#5a5a5a]">
//                 <Ionicons name="time" size={18} color="#f49b33" />
//                 <View className="ml-2 flex-1">
//                   <Text className="text-white text-sm font-semibold">
//                     Estimated Delivery
//                   </Text>
//                   <Text className="text-white/70 text-xs">
//                     {formatDate(item.estimatedDeliveryTime)}
//                     {item.estimatedDeliveryMinutes && ` (${item.estimatedDeliveryMinutes} min)`}
//                   </Text>
//                 </View>
//               </View>
//             )}

//             {item.deliveryDistance && (
//               <View className="flex-row items-center">
//                 <Ionicons name="map-outline" size={18} color="#f49b33" />
//                 <Text className="text-white ml-2 text-sm flex-1">
//                   Distance: {item.deliveryDistance} km
//                 </Text>
//               </View>
//             )}

//             {item.city && (
//               <View className="flex-row items-center">
//                 <Ionicons name="business-outline" size={18} color="#f49b33" />
//                 <Text className="text-white ml-2 text-sm flex-1">
//                   {item.city} {item.postalCode && `- ${item.postalCode}`}
//                 </Text>
//               </View>
//             )}

//             {item.deliveryFee !== undefined && (
//               <View className="flex-row items-center mt-2 pt-2 border-t border-[#5a5a5a]">
//                 <Text className="text-white/70 text-sm flex-1">Delivery Fee:</Text>
//                 <Text className={`text-sm font-bold ${item.deliveryFee === 0 ? "text-green-400" : "text-white"}`}>
//                   {item.deliveryFee === 0 ? "FREE" : `$${item.deliveryFee.toFixed(2)}`}
//                 </Text>
//               </View>
//             )}
//           </View>

//           {/* Action Buttons */}
//           <View className="flex-row gap-2 mt-4">
//             {item.status === "delivered" && (
//               <TouchableOpacity
//                 className="flex-1 bg-[#f49b33] py-3 rounded-lg"
//                 onPress={() => router.push(`/order/${item.id}`)}
//               >
//                 <Text className="text-white font-bold text-center">
//                   Order Details
//                 </Text>
//               </TouchableOpacity>
//             )}
//             {(item.status === "pending" || item.status === "confirmed") && (
//               <TouchableOpacity
//                 className="flex-1 bg-red-600 py-3 rounded-lg"
//                 onPress={() => {
//                   Alert.alert(
//                     "Cancel Order",
//                     "Are you sure you want to cancel this order?",
//                     [
//                       { text: "No", style: "cancel" },
//                       {
//                         text: "Yes, Cancel",
//                         style: "destructive",
//                         onPress: async () => {
//                           try {
//                             const orderRef = doc(db, "orders", item.id);
//                             await updateDoc(orderRef, {
//                               status: "cancelled",
//                               cancelledAt: new Date().toISOString(),
//                               updatedAt: new Date().toISOString(),
//                               cancellationReason: "Cancelled by customer",
//                             });
//                             Alert.alert("Success", "Your order has been cancelled successfully.");
//                           } catch (error) {
//                             console.error("Cancel order error:", error);
//                             Alert.alert("Error", "Failed to cancel order. Please try again.");
//                           }
//                         },
//                       },
//                     ]
//                   );
//                 }}
//               >
//                 <Text className="text-white font-bold text-center">
//                   Cancel Order
//                 </Text>
//               </TouchableOpacity>
//             )}
//             {item.status === "out_for_delivery" && item.deliveryDriver && (
//               <TouchableOpacity
//                 className="flex-1 bg-green-600 py-3 rounded-lg"
//                 onPress={async () => {
//                   Alert.alert(
//                     "Contact Driver",
//                     `Driver: ${item.deliveryDriver}\n\nWhat would you like to do?`,
//                     [
//                       { text: "Cancel", style: "cancel" },
//                       {
//                         text: "Call",
//                         onPress: () => {
//                           if (item.phoneNumber) {
//                             Linking.openURL(`tel:${item.phoneNumber}`);
//                           } else {
//                             Alert.alert("Error", "Phone number not available");
//                           }
//                         },
//                       },
//                       {
//                         text: "Message",
//                         onPress: () => {
//                           if (item.phoneNumber) {
//                             Linking.openURL(`sms:${item.phoneNumber}`);
//                           } else {
//                             Alert.alert("Error", "Phone number not available");
//                           }
//                         },
//                       },
//                     ]
//                   );
//                 }}
//               >
//                 <View className="flex-row items-center justify-center">
//                   <Ionicons name="call" size={20} color="#fff" />
//                   <Text className="text-white font-bold ml-2 text-center">
//                     Contact Driver
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//             )}
            
//             {item.status === "ready" && (
//               <View className="bg-[#9C27B0]/20 border border-[#9C27B0] rounded-lg p-3 mt-3">
//                 <View className="flex-row items-center">
//                   <Ionicons name="checkmark-circle" size={20} color="#9C27B0" />
//                   <Text className="text-white ml-2 flex-1 text-sm">
//                     Your order is ready! It will be dispatched soon.
//                   </Text>
//                 </View>
//               </View>
//             )}
            
//             {item.status === "preparing" && (
//               <View className="bg-[#2196F3]/20 border border-[#2196F3] rounded-lg p-3 mt-3">
//                 <View className="flex-row items-center">
//                   <Ionicons name="restaurant" size={20} color="#2196F3" />
//                   <Text className="text-white ml-2 flex-1 text-sm">
//                     Your order is being prepared at the restaurant.
//                   </Text>
//                 </View>
//               </View>
//             )}
            
//             {item.status === "ready" && (
//               <View className="bg-[#9C27B0]/20 border border-[#9C27B0] rounded-lg p-3 mt-3">
//                 <View className="flex-row items-center">
//                   <Ionicons name="checkmark-circle" size={20} color="#9C27B0" />
//                   <Text className="text-white ml-2 flex-1 text-sm">
//                     Your order is ready! It will be dispatched soon.
//                   </Text>
//                 </View>
//               </View>
//             )}
            
//             {item.status === "preparing" && (
//               <View className="bg-[#2196F3]/20 border border-[#2196F3] rounded-lg p-3 mt-3">
//                 <View className="flex-row items-center">
//                   <Ionicons name="restaurant" size={20} color="#2196F3" />
//                   <Text className="text-white ml-2 flex-1 text-sm">
//                     Your order is being prepared at the restaurant.
//                   </Text>
//                 </View>
//               </View>
//             )}
//           </View>
//         </View>
//       );
//     },
//     [getStatusSteps, getStatusColor, getStatusIcon, formatDate, router]
//   );

//   const renderEmptyState = useCallback(() => (
//     <View className="flex-1 justify-center items-center px-6 py-16">
//       <View className="bg-[#474747] p-8 rounded-2xl items-center">
//         <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
//           <Ionicons
//             name={
//               activeTab === "active"
//                 ? "bicycle-outline"
//                 : "checkmark-circle-outline"
//             }
//             size={60}
//             color="#CF2526"
//           />
//         </View>
//         <Text className="text-white text-xl font-bold mb-2">
//           {activeTab === "active"
//             ? "No Active Deliveries"
//             : "No Completed Deliveries"}
//         </Text>
//         <Text className="text-white/70 text-center mb-6">
//           {activeTab === "active"
//             ? "Your active delivery orders will appear here"
//             : "Your completed delivery history will appear here"}
//         </Text>
//         <TouchableOpacity
//           onPress={() => router.push("/(tabs)/home")}
//           className="bg-[#f49b33] px-6 py-3 rounded-lg"
//         >
//           <Text className="text-white font-bold">Browse Restaurants</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   ), [activeTab, router]);

//   const keyExtractor = useCallback((item) => item.id, []);

//   // Handle tab change
//   const handleTabChange = useCallback((tab) => {
//     setActiveTab(tab);
//   }, []);

//   // Loading state
//   if (loading && allOrders.length === 0) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
//         <ActivityIndicator size="large" color="#f49b33" />
//         <Text className="text-white mt-4">Loading deliveries...</Text>
//       </SafeAreaView>
//     );
//   }

//   // Not signed in state
//   if (!userEmail) {
//     return (
//       <SafeAreaView className="flex-1 bg-[#2b2b2b]">
//         <View className="flex-1 justify-center items-center px-6">
//           <View className="bg-[#474747] p-8 rounded-2xl items-center w-full">
//             <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
//               <Ionicons name="lock-closed" size={60} color="#f49b33" />
//             </View>
//             <Text className="text-white text-xl font-bold mb-2">
//               Sign In Required
//             </Text>
//             <Text className="text-white/70 text-center mb-6">
//               Please sign in to track your deliveries
//             </Text>
//             <TouchableOpacity
//               onPress={() => router.push("/(auth)/signin")}
//               className="bg-[#f49b33] px-8 py-4 rounded-lg w-full"
//             >
//               <Text className="text-white text-lg font-bold text-center">
//                 Sign In
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Error state
//   if (error && allOrders.length === 0) {
//     return (
//       <SafeAreaView className="flex-1 bg-[#2b2b2b]">
//         <View className="flex-1 justify-center items-center px-6">
//           <View className="bg-[#474747] p-8 rounded-2xl items-center w-full">
//             <View className="bg-red-500/20 p-6 rounded-full mb-4">
//               <Ionicons name="alert-circle" size={60} color="#f44336" />
//             </View>
//             <Text className="text-white text-xl font-bold mb-2">
//               Something Went Wrong
//             </Text>
//             <Text className="text-white/70 text-center mb-6">{error}</Text>
//             <TouchableOpacity
//               onPress={handleRefresh}
//               className="bg-[#f49b33] px-8 py-4 rounded-lg w-full"
//             >
//               <Text className="text-white text-lg font-bold text-center">
//                 Try Again
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Main content
//   return (
//     <SafeAreaView className="flex-1 bg-[#2b2b2b]">
//       {/* Header */}
//       <View className="px-4 pt-4 pb-2">
//         <Text className="text-white text-2xl font-bold mb-1">
//           Delivery Tracking
//         </Text>
//         <Text className="text-white/70">
//           {activeTab === "active"
//             ? `${filteredOrders.length} active ${
//                 filteredOrders.length === 1 ? "delivery" : "deliveries"
//               }`
//             : `${filteredOrders.length} completed ${
//                 filteredOrders.length === 1 ? "delivery" : "deliveries"
//               }`}
//         </Text>
//       </View>

//       {/* Error Banner (if error but orders exist) */}
//       {error && allOrders.length > 0 && (
//         <View className="mx-4 mb-2 bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex-row items-center">
//           <Ionicons name="alert-circle" size={20} color="#f44336" />
//           <Text className="text-red-400 ml-2 flex-1 text-sm">
//             Live updates unavailable. Pull to refresh.
//           </Text>
//         </View>
//       )}

//       {/* Tabs */}
//       <View className="flex-row mx-4 mb-4 bg-[#474747] rounded-lg p-1">
//         <TouchableOpacity
//           onPress={() => handleTabChange("active")}
//           className={`flex-1 py-3 rounded-lg ${
//             activeTab === "active" ? "bg-[#f49b33]" : "bg-transparent"
//           }`}
//         >
//           <Text
//             className={`text-center font-bold ${
//               activeTab === "active" ? "text-white" : "text-white/70"
//             }`}
//           >
//             Active (
//             {
//               allOrders.filter(
//                 (o) => o.status !== "delivered" && o.status !== "cancelled"
//               ).length
//             }
//             )
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={() => handleTabChange("completed")}
//           className={`flex-1 py-3 rounded-lg ${
//             activeTab === "completed" ? "bg-[#f49b33]" : "bg-transparent"
//           }`}
//         >
//           <Text
//             className={`text-center font-bold ${
//               activeTab === "completed" ? "text-white" : "text-white/70"
//             }`}
//           >
//             Completed (
//             {
//               allOrders.filter(
//                 (o) => o.status === "delivered" || o.status === "cancelled"
//               ).length
//             }
//             )
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Orders List */}
//       <FlatList
//         data={filteredOrders}
//         keyExtractor={keyExtractor}
//         renderItem={renderOrderItem}
//         ListEmptyComponent={renderEmptyState}
//         onRefresh={handleRefresh}
//         refreshing={refreshing}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             tintColor="#CF2526"
//           />
//         }
//         contentContainerStyle={{
//           paddingTop: 16,
//           paddingBottom: 20,
//           flexGrow: 1,
//         }}
//         removeClippedSubviews={true}
//         maxToRenderPerBatch={10}
//         updateCellsBatchingPeriod={50}
//         initialNumToRender={5}
//         windowSize={10}
//       />
//     </SafeAreaView>
//   ); 
// };

// export default Delivery;
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
import menufirstimage from '../../assets/images/menufirstimage.png'
import menu2ndimage from '../../assets/images/menu2ndimage.png'
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
const bannerWidth = screenWidth - 24; 
const bannerHeight = (bannerWidth * 160) / 350;


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
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showAllBestSeller, setShowAllBestSeller] = useState(false);

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

  // Get Best Seller items based on selected category
  const getBestSellerItems = () => {
    let itemsToShow;
    
    if (selectedCategory === 'all') {
      // Show top items from biryani category when "All" is selected
      itemsToShow = menuItemsData
        .filter(item => item.category === 'biryani')
        .slice(0, 4);
    } else {
      // Show items from the selected category
      itemsToShow = menuItemsData
        .filter(item => item.category === selectedCategory)
        .slice(0, 4);
    }

    return itemsToShow;
  };

  const displayedBestSellerItems = showAllBestSeller 
    ? getBestSellerItems() 
    : getBestSellerItems().slice(0, 4);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setAnimationKey(prev => prev + 1);
    setShowAllMenu(false);
    setShowAllBestSeller(false);
  };

  // Get category name for Best Seller heading
  const getBestSellerCategoryName = () => {
    if (selectedCategory === 'all') {
      return 'Biryani';
    }
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.name : 'Menu';
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
        style={{ fontFamily: Fonts.Poppins.SemiBold}}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Render featured menu layout - 1 large on left, 2 stacked on right
  const renderFeaturedMenu = () => {
    const leftCardWidth = (screenWidth - 40) * 0.52;
    const rightCardWidth = (screenWidth - 40) * 0.48;
    const rightCardHeight = (leftCardWidth * 1.7) / 2 - 5;

    // Get first 3 items from filtered menu
    const featuredItems = filteredMenuItems.slice(0, 3);
    
    if (featuredItems.length === 0) {
      return (
        <View className="px-4 py-12 items-center">
          <Text
            className="text-gray-400 text-base"
            style={{ fontFamily: Fonts.Poppins.Medium }}
          >
            No items in this category
          </Text>
        </View>
      );
    }

    const leftItem = featuredItems[0];
    const rightTopItem = featuredItems[1];
    const rightBottomItem = featuredItems[2];

    // Background images for the cards
    const bgImages = [menufirstimage, home1, menu2ndimage];

    return (
      <Animatable.View
        key={`featured-menu-${animationKey}`}
        animation="fadeIn"
        duration={500}
        className="px-3 mb-6"
      >
        <View className="flex-row" style={{ gap: 8 }}>
          {/* LEFT - Large Card */}
          <Animatable.View
            animation="fadeInLeft"
            duration={600}
            style={{ width: leftCardWidth }}
          >
            <TouchableOpacity
              onPress={() => router.push(`/menu/${leftItem.id}`)}
              activeOpacity={0.9}
              className="rounded-2xl overflow-hidden"
              style={{
                height: leftCardWidth * 1.7,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <ImageBackground
                source={bgImages[0]}
                className="w-full h-full"
                resizeMode="cover"
              >
                <View 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.15)'
                  }}
                />
                
                <View className="flex-1 p-4 justify-between items-center">
                  <View className="w-full items-center">
                    <Text
                      style={{
                        fontFamily: Fonts.Poppins.Bold,
                        fontSize: 16,
                        lineHeight: 20,
                        color: '#FFFFFF',
                        textAlign: 'center',
                        textShadowColor: 'rgba(0, 0, 0, 0.4)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 4,
                        fontWeight: '700',
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {leftItem.name}
                    </Text>
                  </View>

                  <Animatable.View 
                    animation={{
                      0: { opacity: 0, rotate: '-10deg', scale: 0.8 },
                      0.5: { opacity: 0.5, rotate: '5deg', scale: 0.95 },
                      1: { opacity: 1, rotate: '0deg', scale: 1 },
                    }}
                    duration={1200}
                    delay={300}
                    className="items-center justify-center" 
                    style={{ flex: 1, width: '100%' }}
                  >
                    <Image
                      source={leftItem.image || logo}
                      style={{ 
                        width: leftCardWidth * 0.65,
                        height: leftCardWidth * 0.55,
                      }}
                      resizeMode="contain"
                    />
                  </Animatable.View>

                  <View className="w-full items-center">
                    <TouchableOpacity
                      className="bg-red-600 py-2 rounded-full"
                      onPress={(e) => {
                        e.stopPropagation();
                        router.push(`/menu/${leftItem.id}`);
                      }}
                      activeOpacity={0.8}
                      style={{
                        width: '75%',
                        shadowColor: '#D42129',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.4,
                        shadowRadius: 4,
                        elevation: 4,
                      }}
                    >
                      <Text
                        className="text-white font-bold text-xs text-center uppercase"
                        style={{ 
                          fontFamily: Fonts.Poppins.Bold,
                          letterSpacing: 0.6,
                        }}
                      >
                        ORDER NOW
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Animatable.View>

          {/* RIGHT - Two Stacked Cards */}
          <View style={{ width: rightCardWidth, gap: 8 }}>
            {/* Top Right Card */}
            {rightTopItem && (
              <Animatable.View
                animation="fadeInRight"
                duration={600}
                delay={100}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/menu/${rightTopItem.id}`)}
                  activeOpacity={0.9}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    height: rightCardHeight,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <ImageBackground
                    source={bgImages[1]}
                    className="w-full h-full"
                    resizeMode="cover"
                  >
                    <View 
                      className="absolute inset-0"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.15)'
                      }}
                    />
                    
                    <View className="flex-1 p-3 justify-between items-center">
                      <View className="w-full items-center">
                        <Text
                          style={{
                            fontFamily: Fonts.Poppins.Bold,
                            fontSize: 13,
                            lineHeight: 16,
                            color: '#FFFFFF',
                            textAlign: 'center',
                            textShadowColor: 'rgba(0, 0, 0, 0.4)',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 3,
                            fontWeight: '700',
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {rightTopItem.name}
                        </Text>
                      </View>

                      <Animatable.View 
                        animation={{
                          0: { opacity: 0, scale: 0.7 },
                          0.5: { opacity: 0.7, scale: 1.05 },
                          1: { opacity: 1, scale: 1 },
                        }}
                        duration={1000}
                        delay={400}
                        className="items-center justify-center" 
                        style={{ flex: 1, width: '100%' }}
                      >
                        <Image
                          source={rightTopItem.image || logo}
                          style={{ 
                            width: rightCardWidth * 0.55,
                            height: rightCardHeight * 0.45,
                          }}
                          resizeMode="contain"
                        />
                      </Animatable.View>

                      <View className="w-full items-center">
                        <TouchableOpacity
                          className="bg-red-600 py-1.5 rounded-full"
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push(`/menu/${rightTopItem.id}`);
                          }}
                          activeOpacity={0.8}
                          style={{
                            width: '80%',
                            shadowColor: '#D42129',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 3,
                            elevation: 3,
                          }}
                        >
                          <Text
                            className="text-white font-bold text-[10px] text-center uppercase"
                            style={{ 
                              fontFamily: Fonts.Poppins.Bold,
                              letterSpacing: 0.4,
                            }}
                          >
                            ORDER NOW
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </Animatable.View>
            )}

            {/* Bottom Right Card */}
            {rightBottomItem && (
              <Animatable.View
                animation="fadeInRight"
                duration={600}
                delay={200}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/menu/${rightBottomItem.id}`)}
                  activeOpacity={0.9}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    height: rightCardHeight,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <ImageBackground
                    source={bgImages[2]}
                    className="w-full h-full"
                    resizeMode="cover"
                  >
                    <View 
                      className="absolute inset-0"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.15)'
                      }}
                    />
                    
                    <View className="flex-1 p-3 justify-between items-center">
                      <View className="w-full items-center">
                        <Text
                          style={{
                            fontFamily: Fonts.Poppins.Bold,
                            fontSize: 13,
                            lineHeight: 16,
                            color: '#FFFFFF',
                            textAlign: 'center',
                            textShadowColor: 'rgba(0, 0, 0, 0.4)',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 3,
                            fontWeight: '700',
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {rightBottomItem.name}
                        </Text>
                      </View>

                      <Animatable.View 
                        animation={{
                          0: { opacity: 0, translateY: 20, scale: 0.8 },
                          0.6: { opacity: 0.8, translateY: -5, scale: 1.05 },
                          1: { opacity: 1, translateY: 0, scale: 1 },
                        }}
                        duration={1000}
                        delay={500}
                        className="items-center justify-center" 
                        style={{ flex: 1, width: '100%' }}
                      >
                        <Image
                          source={rightBottomItem.image || logo}
                          style={{ 
                            width: rightCardWidth * 0.55,
                            height: rightCardHeight * 0.45,
                          }}
                          resizeMode="contain"
                        />
                      </Animatable.View>

                      <View className="w-full items-center">
                        <TouchableOpacity
                          className="bg-red-600 py-1.5 rounded-full"
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push(`/menu/${rightBottomItem.id}`);
                          }}
                          activeOpacity={0.8}
                          style={{
                            width: '80%',
                            shadowColor: '#D42129',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 3,
                            elevation: 3,
                          }}
                        >
                          <Text
                            className="text-white font-bold text-[10px] text-center uppercase"
                            style={{ 
                              fontFamily: Fonts.Poppins.Bold,
                              letterSpacing: 0.4,
                            }}
                          >
                            ORDER NOW
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </Animatable.View>
            )}
          </View>
        </View>
      </Animatable.View>
    );
  };

  
  const renderAllMenuGrid = () => {
    const cardWidth = (screenWidth - 36) / 2; 

    return (
      <Animatable.View
        key={`menu-grid-${animationKey}`}
        animation="fadeIn"
        duration={500}
        className="px-3 mb-6"
      >
        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          {filteredMenuItems.map((item, index) => (
            <Animatable.View
              key={`menu-${item.id}-${index}`}
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
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="p-4">
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

                  <Text
                    className="text-center text-[14px] font-semibold text-[#D42129] bg-[#D421291A] rounded-full px-3 py-[2px] self-center mb-3"
                    style={{ fontFamily: Fonts.Poppins.SemiBold }}
                  >
                    Rs. {item.price}
                  </Text>

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
          ))}
        </View>
      </Animatable.View>
    );
  };

  const renderBestSellerItems = () => {
    const cardWidth = (screenWidth - 36) / 2;
    const bestSellers = displayedBestSellerItems;

    if (bestSellers.length === 0) {
      return null;
    }

    return (
      <View className="px-3 mb-6">
        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          {bestSellers.map((item, index) => (
            <Animatable.View
              key={`bestseller-${item.id}-${index}`}
              animation="fadeIn"
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
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="p-4">
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

                  <Text
                    className="text-center text-[14px] font-semibold text-[#D42129] bg-[#D421291A] rounded-full px-3 py-[2px] self-center mb-3"
                    style={{ fontFamily: Fonts.Poppins.SemiBold }}
                  >
                    Rs. {item.price}
                  </Text>

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
        <View
          className="self-center rounded-2xl overflow-hidden relative"
          style={{ 
            width: bannerWidth, 
            height: bannerHeight,
          }}
        >
          <ImageBackground
            source={banner.image}
            className="w-full h-full absolute"
            resizeMode="cover"
          />
          
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
        className="flex-row items-center justify-between px-3 py-3 bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
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

        <View className="items-center justify-center">
          <Image
            source={logo}
             className="w-[80px] h-[90px]"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 items-end">
          <TouchableOpacity 
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
        <View className="flex-row px-3 py-4 gap-3">
          <TouchableOpacity
            onPress={() => setOrderType('pickup')}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-full ${
              orderType === 'pickup' 
                ? 'bg-white border-2 border-gray-50' 
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
            className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-full ${
              orderType === 'delivery'
                ? 'bg-white border-2 border-gray-50'
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
          <View className="px-3 mb-4">
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
          <View className="px-3 mb-4 flex-row items-center justify-between">
            <View>
              <Text
                className="text-2xl font-bold italic"
                style={{ fontFamily: Fonts.Shrikhand, color: "#1F2937" }}
              >
                Explore Menu
              </Text>
              <View className="mt-1 w-20 h-[3px] bg-[#CF2526] rounded-full" />
            </View>
            {filteredMenuItems.length > 3 && (
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => setShowAllMenu(!showAllMenu)}
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
                  {showAllMenu ? 'Show Less' : 'See All'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          />

          {showAllMenu ? renderAllMenuGrid() : renderFeaturedMenu()}
        </View>

        {/* Best Seller Section - Dynamic based on category */}
        {displayedBestSellerItems.length > 0 && (
          <View className="mb-4">
            <View className="px-3 mb-4 flex-row items-center justify-between">
              <View>
                <Text
                  className="text-2xl font-bold italic"
                  style={{ fontFamily: Fonts.Shrikhand, color: "#1F2937" }}
                >
                  Best {getBestSellerCategoryName()}
                </Text>
                <View className="mt-1 w-20 h-[3px] bg-[#CF2526] rounded-full" />
              </View>
            </View>
            {renderBestSellerItems()}
          </View>
        )}

        <View className="h-[100px]" />
      </ScrollView>

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