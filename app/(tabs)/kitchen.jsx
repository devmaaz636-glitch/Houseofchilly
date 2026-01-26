// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   doc,
//   updateDoc,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "../../config/firebaseConfig";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useRouter } from "expo-router";

// const Kitchen = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("pending"); // pending, preparing, ready, completed
//   const [restaurantId, setRestaurantId] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     checkKitchenAccess();
//   }, []);

//   useEffect(() => {
//     if (restaurantId) {
//       fetchOrders();
//       const unsubscribe = setupRealtimeListener();
//       return () => unsubscribe();
//     }
//   }, [restaurantId, activeTab]);

//   const checkKitchenAccess = async () => {
//     try {
//       // Check if user has kitchen access (you can set this in user profile or use a flag)
//       const kitchenAccess = await AsyncStorage.getItem("kitchenAccess");
//       const restaurantIdStorage = await AsyncStorage.getItem("kitchenRestaurantId");
//       const restaurantNameStorage = await AsyncStorage.getItem("kitchenRestaurantName");
      
//       if (kitchenAccess === "true" && (restaurantIdStorage || restaurantNameStorage)) {
//         // Use restaurantId if available, otherwise use restaurantName
//         setRestaurantId(restaurantIdStorage || restaurantNameStorage);
//       } else {
//         // For demo: allow access if user is signed in
//         // In production, you'd check user role/permissions
//         const userEmail = await AsyncStorage.getItem("userEmail");
//         if (userEmail) {
//           // Allow kitchen access - will match orders by restaurantName or restaurantId
//           // In production, get from user profile/role
//           setRestaurantId("all"); // Use "all" to show all orders, or set specific restaurant
//           await AsyncStorage.setItem("kitchenRestaurantId", "all");
//           await AsyncStorage.setItem("kitchenAccess", "true");
//         }
//       }
//     } catch (error) {
//       console.error("Error checking kitchen access:", error);
//     }
//   };

//   const setupRealtimeListener = () => {
//     if (!restaurantId) return () => {};

//     const ordersRef = collection(db, "orders");
//     let ordersQuery;

//     try {
//       if (activeTab === "pending") {
//         // Get pending and confirmed orders
//         ordersQuery = query(
//           ordersRef,
//           where("status", "in", ["pending", "confirmed"]),
//           orderBy("createdAt", "asc")
//         );
//       } else if (activeTab === "preparing") {
//         ordersQuery = query(
//           ordersRef,
//           where("status", "==", "preparing"),
//           orderBy("createdAt", "asc")
//         );
//       } else if (activeTab === "ready") {
//         ordersQuery = query(
//           ordersRef,
//           where("status", "==", "ready"),
//           orderBy("createdAt", "asc")
//         );
//       } else if (activeTab === "completed") {
//         ordersQuery = query(
//           ordersRef,
//           where("status", "in", ["delivered", "out_for_delivery"]),
//           orderBy("createdAt", "desc")
//         );
//       } else {
//         ordersQuery = query(
//           ordersRef,
//           where("status", "==", "ready"),
//           orderBy("createdAt", "asc")
//         );
//       }

//       return onSnapshot(ordersQuery, (snapshot) => {
//         let orderList = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // Filter by restaurant if not "all"
//         if (restaurantId !== "all") {
//           orderList = orderList.filter(
//             (order) =>
//               order.restaurantId === restaurantId ||
//               order.restaurantName === restaurantId ||
//               order.restaurantName?.toLowerCase().includes(restaurantId?.toLowerCase() || "")
//           );
//         }

//         setOrders(orderList);
//         setLoading(false);
//       }, (error) => {
//         console.error("Realtime listener error:", error);
//         // Fallback to manual fetch
//         fetchOrders();
//       });
//     } catch (error) {
//       console.error("Query error:", error);
//       // Fallback to manual fetch if query fails (e.g., missing index)
//       fetchOrders();
//       return () => {};
//     }
//   };

//   const fetchOrders = async () => {
//     if (!restaurantId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       const ordersRef = collection(db, "orders");
//       let ordersQuery;

//       try {
//         if (activeTab === "pending") {
//           ordersQuery = query(
//             ordersRef,
//             where("status", "in", ["pending", "confirmed"]),
//             orderBy("createdAt", "asc")
//           );
//         } else if (activeTab === "preparing") {
//           ordersQuery = query(
//             ordersRef,
//             where("status", "==", "preparing"),
//             orderBy("createdAt", "asc")
//           );
//         } else if (activeTab === "ready") {
//           ordersQuery = query(
//             ordersRef,
//             where("status", "==", "ready"),
//             orderBy("createdAt", "asc")
//           );
//         } else if (activeTab === "completed") {
//           ordersQuery = query(
//             ordersRef,
//             where("status", "in", ["delivered", "out_for_delivery"]),
//             orderBy("createdAt", "desc")
//           );
//         } else {
//           ordersQuery = query(
//             ordersRef,
//             where("status", "==", "ready"),
//             orderBy("createdAt", "asc")
//           );
//         }

//         const ordersSnapshot = await getDocs(ordersQuery);
//         let orderList = ordersSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // Filter by restaurant if not "all"
//         if (restaurantId !== "all") {
//           orderList = orderList.filter(
//             (order) =>
//               order.restaurantId === restaurantId ||
//               order.restaurantName === restaurantId ||
//               order.restaurantName?.toLowerCase().includes(restaurantId?.toLowerCase() || "")
//           );
//         }

//         setOrders(orderList);
//       } catch (queryError) {
//         // If query fails (e.g., missing index), fetch all and filter manually
//         console.log("Query failed, fetching all orders:", queryError);
//         const allOrdersSnapshot = await getDocs(ordersRef);
//         let allOrders = allOrdersSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // Filter by status
//         if (activeTab === "pending") {
//           allOrders = allOrders.filter((order) =>
//             order.status === "pending" || order.status === "confirmed"
//           );
//         } else if (activeTab === "preparing") {
//           allOrders = allOrders.filter((order) => order.status === "preparing");
//         } else if (activeTab === "ready") {
//           allOrders = allOrders.filter((order) => order.status === "ready");
//         } else if (activeTab === "completed") {
//           allOrders = allOrders.filter((order) =>
//             order.status === "delivered" || order.status === "out_for_delivery"
//           );
//         } else {
//           allOrders = allOrders.filter((order) => order.status === "ready");
//         }

//         // Filter by restaurant if not "all"
//         if (restaurantId !== "all") {
//           allOrders = allOrders.filter(
//             (order) =>
//               order.restaurantId === restaurantId ||
//               order.restaurantName === restaurantId ||
//               order.restaurantName?.toLowerCase().includes(restaurantId?.toLowerCase() || "")
//           );
//         }

//         // Sort by createdAt
//         allOrders.sort((a, b) => {
//           const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//           const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//           return dateA - dateB;
//         });

//         setOrders(allOrders);
//       }
//     } catch (error) {
//       console.error("Fetch orders error:", error);
//       Alert.alert("Error", "Failed to load orders. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const orderRef = doc(db, "orders", orderId);
//       const updateData = {
//         status: newStatus,
//         updatedAt: new Date().toISOString(),
//       };

//       if (newStatus === "out_for_delivery") {
//         updateData.deliveryDriver = "Driver Name"; // In production, assign actual driver
//         updateData.trackingNumber = `TRK${Date.now()}`;
//       }

//       if (newStatus === "delivered") {
//         updateData.deliveredAt = new Date().toISOString();
//         updateData.deliveryStatus = "delivered";
//       }

//       await updateDoc(orderRef, updateData);
//       Alert.alert("Success", `Order status updated to ${newStatus.replace("_", " ").toUpperCase()}`);
//     } catch (error) {
//       console.error("Error updating order:", error);
//       Alert.alert("Error", "Failed to update order status.");
//     }
//   };

//   const handleStatusUpdate = (orderId, currentStatus) => {
//     let newStatus;
//     let confirmMessage;

//     if (currentStatus === "pending") {
//       // First confirm the order
//       newStatus = "confirmed";
//       confirmMessage = "Confirm this order?";
//     } else if (currentStatus === "confirmed") {
//       // Then start preparing
//       newStatus = "preparing";
//       confirmMessage = "Start preparing this order?";
//     } else if (currentStatus === "preparing") {
//       // Mark as ready
//       newStatus = "ready";
//       confirmMessage = "Mark this order as ready for delivery?";
//     } else if (currentStatus === "ready") {
//       // Dispatch for delivery
//       newStatus = "out_for_delivery";
//       confirmMessage = "Dispatch this order for delivery?";
//     } else if (currentStatus === "out_for_delivery") {
//       // Mark as delivered/completed
//       newStatus = "delivered";
//       confirmMessage = "Mark this order as delivered/completed?";
//     } else {
//       Alert.alert("Info", "This order cannot be updated further.");
//       return;
//     }

//     Alert.alert("Confirm", confirmMessage, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Confirm",
//         onPress: () => updateOrderStatus(orderId, newStatus),
//       },
//     ]);
//   };

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return "";
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return "#f49b33";
//       case "confirmed":
//         return "#4CAF50";
//       case "preparing":
//         return "#2196F3";
//       case "ready":
//         return "#9C27B0";
//       case "out_for_delivery":
//         return "#FF9800";
//       case "delivered":
//         return "#4CAF50";
//       default:
//         return "#f49b33";
//     }
//   };

//   const handleCompleteOrder = (orderId) => {
//     Alert.alert(
//       "Complete Order",
//       "Mark this order as delivered/completed?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Complete",
//           onPress: () => updateOrderStatus(orderId, "delivered"),
//         },
//       ]
//     );
//   };

//   const renderOrderItem = ({ item }) => (
//     <View className="mx-4 mb-4 bg-[#474747] rounded-xl p-4 border-l-4" style={{ borderLeftColor: getStatusColor(item.status) }}>
//       {/* Header */}
//       <View className="flex-row justify-between items-center mb-3">
//         <View className="flex-1">
//           <View className="flex-row items-center mb-2">
//             <View className="bg-[#f49b33] p-2 rounded-full mr-3">
//               <Ionicons name="receipt" size={20} color="#fff" />
//             </View>
//             <View className="flex-1">
//               <Text className="text-white text-lg font-bold">
//                 Order #{item.orderNumber || item.id.substring(0, 8).toUpperCase()}
//               </Text>
//               <Text className="text-white/70 text-sm">
//                 {item.restaurantName && `${item.restaurantName} • `}
//                 {formatDate(item.createdAt)}
//               </Text>
//             </View>
//           </View>
//           <View className="bg-[#2b2b2b] px-3 py-1 rounded-full self-start">
//             <Text
//               className="text-xs font-semibold"
//               style={{ color: getStatusColor(item.status) }}
//             >
//               {item.status?.toUpperCase() || "PENDING"}
//             </Text>
//           </View>
//         </View>
//         <Text className="text-[#f49b33] text-xl font-bold ml-2">
//           ${item.totalAmount?.toFixed(2)}
//         </Text>
//       </View>

//       {/* Customer Info */}
//       <View className="mb-3 pb-3 border-b border-[#5a5a5a]">
//         <View className="flex-row items-center mb-2">
//           <Ionicons name="person-outline" size={16} color="#f49b33" />
//           <Text className="text-white ml-2 text-sm">
//             {item.fullName || "Customer"}
//           </Text>
//         </View>
//         {item.phoneNumber && (
//           <View className="flex-row items-center">
//             <Ionicons name="call-outline" size={16} color="#f49b33" />
//             <Text className="text-white ml-2 text-sm">{item.phoneNumber}</Text>
//           </View>
//         )}
//       </View>

//       {/* Order Items */}
//       <View className="mb-3">
//         <Text className="text-white/70 text-sm mb-2 font-semibold">
//           Items ({item.items?.length || 0}):
//         </Text>
//         {item.items?.map((orderItem, idx) => (
//           <View
//             key={idx}
//             className="flex-row justify-between items-center mb-2 bg-[#2b2b2b] p-2 rounded-lg"
//           >
//             <View className="flex-1">
//               <Text className="text-white font-semibold">{orderItem.name}</Text>
//               <Text className="text-white/70 text-xs">
//                 Qty: {orderItem.quantity} × ${orderItem.price?.toFixed(2)}
//               </Text>
//             </View>
//             <Text className="text-white font-bold">
//               ${(orderItem.price * orderItem.quantity).toFixed(2)}
//             </Text>
//           </View>
//         ))}
//       </View>

//       {/* Special Instructions */}
//       {item.specialInstructions && (
//         <View className="mb-3 p-2 bg-[#2b2b2b] rounded-lg">
//           <Text className="text-[#f49b33] text-xs font-semibold mb-1">
//             Special Instructions:
//           </Text>
//           <Text className="text-white/80 text-sm">{item.specialInstructions}</Text>
//         </View>
//       )}

//       {/* Delivery Address */}
//       {item.address && (
//         <View className="mb-3 pb-3 border-b border-[#5a5a5a]">
//           <View className="flex-row items-start">
//             <Ionicons name="location-outline" size={16} color="#f49b33" style={{ marginTop: 2 }} />
//             <Text className="text-white ml-2 text-sm flex-1" numberOfLines={2}>
//               {item.address}
//             </Text>
//           </View>
//         </View>
//       )}

//       {/* Action Buttons */}
//       {item.status !== "delivered" && (
//         <>
//           <TouchableOpacity
//             className={`py-3 rounded-lg mb-2 ${
//               item.status === "ready"
//                 ? "bg-green-500"
//                 : item.status === "preparing"
//                 ? "bg-blue-500"
//                 : item.status === "confirmed"
//                 ? "bg-[#4CAF50]"
//                 : item.status === "out_for_delivery"
//                 ? "bg-[#FF9800]"
//                 : "bg-[#f49b33]"
//             }`}
//             onPress={() => handleStatusUpdate(item.id, item.status)}
//           >
//             <Text className="text-white font-bold text-center text-lg">
//               {item.status === "pending"
//                 ? "Confirm Order"
//                 : item.status === "confirmed"
//                 ? "Start Preparing"
//                 : item.status === "preparing"
//                 ? "Mark as Ready"
//                 : item.status === "ready"
//                 ? "Dispatch for Delivery"
//                 : item.status === "out_for_delivery"
//                 ? "Mark as Delivered"
//                 : "Update Status"}
//             </Text>
//           </TouchableOpacity>
//           {(item.status === "ready" || item.status === "out_for_delivery") && (
//             <TouchableOpacity
//               className="py-3 rounded-lg bg-[#4CAF50]"
//               onPress={() => handleCompleteOrder(item.id)}
//             >
//               <Text className="text-white font-bold text-center text-lg">
//                 ✓ Complete Order
//               </Text>
//             </TouchableOpacity>
//           )}
//         </>
//       )}
//       {item.status === "delivered" && (
//         <View className="py-3 rounded-lg bg-[#4CAF50]/30 border-2 border-[#4CAF50]">
//           <View className="flex-row items-center justify-center">
//             <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
//             <Text className="text-[#4CAF50] font-bold text-center text-lg ml-2">
//               Order Completed
//             </Text>
//           </View>
//           {item.deliveredAt && (
//             <Text className="text-white/70 text-center text-sm mt-1">
//               Delivered on {formatDate(item.deliveredAt)}
//             </Text>
//           )}
//         </View>
//       )}
//     </View>
//   );

//   const renderEmptyState = () => (
//     <View className="flex-1 justify-center items-center px-6 py-16">
//       <View className="bg-[#474747] p-8 rounded-2xl items-center">
//         <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
//           <Ionicons name="restaurant-outline" size={60} color="#f49b33" />
//         </View>
//         <Text className="text-white text-xl font-bold mb-2">
//           No Orders {activeTab === "pending" ? "Pending" : activeTab === "preparing" ? "Preparing" : activeTab === "ready" ? "Ready" : "Completed"}
//         </Text>
//         <Text className="text-white/70 text-center">
//           {activeTab === "pending"
//             ? "New orders will appear here"
//             : activeTab === "preparing"
//             ? "Orders being prepared will appear here"
//             : activeTab === "ready"
//             ? "Ready orders will appear here"
//             : "Completed orders will appear here"}
//         </Text>
//       </View>
//     </View>
//   );

//   if (loading && !orders.length && !restaurantId) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
//         <ActivityIndicator size="large" color="#f49b33" />
//         <Text className="text-white mt-4">Loading kitchen orders...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (!restaurantId) {
//     return (
//       <SafeAreaView className="flex-1 bg-[#2b2b2b] justify-center items-center px-6">
//         <View className="bg-[#474747] p-8 rounded-2xl items-center w-full">
//           <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
//             <Ionicons name="lock-closed" size={60} color="#f49b33" />
//           </View>
//           <Text className="text-white text-xl font-bold mb-2">
//             Kitchen Access Required
//           </Text>
//           <Text className="text-white/70 text-center mb-6">
//             Please contact your administrator to enable kitchen access
//           </Text>
//           <TouchableOpacity
//             onPress={() => router.push("/(tabs)/home")}
//             className="bg-[#f49b33] px-8 py-4 rounded-lg w-full"
//           >
//             <Text className="text-white text-lg font-bold text-center">
//               Go to Home
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-[#2b2b2b]">
//       {/* Header */}
//       <View className="px-4 pt-4 pb-2">
//         <Text className="text-white text-2xl font-bold mb-1">Kitchen Dashboard</Text>
//         <Text className="text-white/70">
//           {orders.length} {activeTab === "pending" ? "pending/confirmed" : activeTab === "preparing" ? "preparing" : activeTab === "ready" ? "ready" : "completed"} {orders.length === 1 ? "order" : "orders"}
//         </Text>
//       </View>

//       {/* Tabs */}
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         className="mx-4 mb-4"
//         contentContainerStyle={{ paddingRight: 20 }}
//       >
//         <View className="flex-row bg-[#474747] rounded-lg p-1">
//           <TouchableOpacity
//             onPress={() => {
//               setActiveTab("pending");
//               setLoading(true);
//             }}
//             className={`py-3 px-4 rounded-lg ${
//               activeTab === "pending" ? "bg-[#f49b33]" : "bg-transparent"
//             }`}
//           >
//             <Text
//               className={`text-center font-bold text-xs ${
//                 activeTab === "pending" ? "text-white" : "text-white/70"
//               }`}
//             >
//               Pending/Confirmed ({orders.length})
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setActiveTab("preparing");
//               setLoading(true);
//             }}
//             className={`py-3 px-4 rounded-lg ${
//               activeTab === "preparing" ? "bg-[#f49b33]" : "bg-transparent"
//             }`}
//           >
//             <Text
//               className={`text-center font-bold text-xs ${
//                 activeTab === "preparing" ? "text-white" : "text-white/70"
//               }`}
//             >
//               Preparing ({orders.length})
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setActiveTab("ready");
//               setLoading(true);
//             }}
//             className={`py-3 px-4 rounded-lg ${
//               activeTab === "ready" ? "bg-[#f49b33]" : "bg-transparent"
//             }`}
//           >
//             <Text
//               className={`text-center font-bold text-xs ${
//                 activeTab === "ready" ? "text-white" : "text-white/70"
//               }`}
//             >
//               Ready ({orders.length})
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => {
//               setActiveTab("completed");
//               setLoading(true);
//             }}
//             className={`py-3 px-4 rounded-lg ${
//               activeTab === "completed" ? "bg-[#4CAF50]" : "bg-transparent"
//             }`}
//           >
//             <Text
//               className={`text-center font-bold text-xs ${
//                 activeTab === "completed" ? "text-white" : "text-white/70"
//               }`}
//             >
//               Completed ({orders.length})
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Orders List */}
//       <FlatList
//         data={orders}
//         onRefresh={fetchOrders}
//         refreshing={loading}
//         refreshControl={
//           <RefreshControl
//             refreshing={loading}
//             onRefresh={fetchOrders}
//             tintColor="#f49b33"
//           />
//         }
//         keyExtractor={(item) => item.id}
//         renderItem={renderOrderItem}
//         ListEmptyComponent={renderEmptyState}
//         contentContainerStyle={{
//           paddingTop: 16,
//           paddingBottom: 20,
//           flexGrow: 1,
//         }}
//       />
//     </SafeAreaView>
//   );
// };

// export default Kitchen;

