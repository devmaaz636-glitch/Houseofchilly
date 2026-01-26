import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

const Delivery = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [error, setError] = useState(null);
  const router = useRouter();
  const unsubscribeRef = useRef(null);
  const isMountedRef = useRef(true);

  // Fetch user email on mount
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (isMountedRef.current) {
          setUserEmail(email);
          if (!email) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching user email:", err);
        if (isMountedRef.current) {
          setError("Failed to load user information");
          setLoading(false);
        }
      }
    };
    fetchUserEmail();
  }, []);

  // Fetch orders with fallback
  const fetchOrdersManually = useCallback(async () => {
    if (!userEmail) return;

    try {
      const ordersRef = collection(db, "orders");
      
      // Try with orderBy first
      try {
        const ordersQuery = query(
          ordersRef,
          where("email", "==", userEmail),
          orderBy("createdAt", "desc")
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const orderList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        if (isMountedRef.current) {
          setAllOrders(orderList);
          setError(null);
        }
      } catch (indexError) {
        // If orderBy fails (index not created), try without orderBy
        console.log("OrderBy failed, fetching without sort:", indexError);
        const simpleQuery = query(
          ordersRef,
          where("email", "==", userEmail)
        );
        const ordersSnapshot = await getDocs(simpleQuery);
        const orderList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort manually by createdAt
        orderList.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        
        if (isMountedRef.current) {
          setAllOrders(orderList);
          setError(null);
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (isMountedRef.current) {
        setError("Failed to load orders. Please try again.");
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [userEmail]);

  // Setup real-time listener when user email is available
  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const setupRealtimeListener = () => {
      try {
        const ordersRef = collection(db, "orders");
        
        // Try to create query with orderBy
        let ordersQuery;
        try {
          ordersQuery = query(
            ordersRef,
            where("email", "==", userEmail),
            orderBy("createdAt", "desc")
          );
        } catch (err) {
          // If orderBy fails, use simple query
          console.log("Using simple query without orderBy");
          ordersQuery = query(
            ordersRef,
            where("email", "==", userEmail)
          );
        }

        const unsubscribe = onSnapshot(
          ordersQuery,
          (snapshot) => {
            if (!isMountedRef.current) return;

            const orderList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Sort manually if needed
            orderList.sort((a, b) => {
              const dateA = new Date(a.createdAt || 0);
              const dateB = new Date(b.createdAt || 0);
              return dateB - dateA;
            });

            setAllOrders(orderList);
            setLoading(false);
            setRefreshing(false);
            setError(null);
          },
          (err) => {
            console.error("Firestore listener error:", err);
            // If real-time listener fails, fallback to manual fetch
            if (isMountedRef.current) {
              console.log("Listener failed, using manual fetch");
              fetchOrdersManually();
            }
          }
        );

        return unsubscribe;
      } catch (err) {
        console.error("Error setting up listener:", err);
        if (isMountedRef.current) {
          // Fallback to manual fetch
          fetchOrdersManually();
        }
        return () => {};
      }
    };

    unsubscribeRef.current = setupRealtimeListener();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [userEmail, fetchOrdersManually]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Memoized filtered orders based on active tab
  const filteredOrders = useMemo(() => {
    if (activeTab === "active") {
      return allOrders.filter(
        (order) => order.status !== "delivered" && order.status !== "cancelled"
      );
    } else {
      return allOrders.filter(
        (order) => order.status === "delivered" || order.status === "cancelled"
      );
    }
  }, [allOrders, activeTab]);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setError(null);
    fetchOrdersManually();
  }, [fetchOrdersManually]);

  // Format date utility
  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date unavailable";
      }
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return dateString || "Date unavailable";
    }
  }, []);

  // Status utilities
  const getStatusColor = useCallback((status) => {
    const statusMap = {
      pending: "#f49b33",
      confirmed: "#4CAF50",
      preparing: "#2196F3",
      ready: "#9C27B0",
      out_for_delivery: "#FF9800",
      delivered: "#00BCD4",
      cancelled: "#f44336",
    };
    return statusMap[status?.toLowerCase()] || "#f49b33";
  }, []);

  const getStatusIcon = useCallback((status) => {
    const iconMap = {
      pending: "time-outline",
      confirmed: "checkmark-circle-outline",
      preparing: "restaurant-outline",
      ready: "checkmark-done-circle-outline",
      out_for_delivery: "bicycle-outline",
      delivered: "checkmark-circle",
      cancelled: "close-circle",
    };
    return iconMap[status?.toLowerCase()] || "time-outline";
  }, []);

  const getStatusSteps = useCallback((status) => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: "receipt-outline" },
      { key: "confirmed", label: "Confirmed", icon: "checkmark-circle-outline" },
      { key: "preparing", label: "Preparing", icon: "restaurant-outline" },
      { key: "ready", label: "Ready", icon: "checkmark-done-circle-outline" },
      { key: "out_for_delivery", label: "Out for Delivery", icon: "bicycle-outline" },
      { key: "delivered", label: "Delivered", icon: "checkmark-circle" },
    ];

    const statusLower = status?.toLowerCase();
    let currentIndex = steps.findIndex((s) => s.key === statusLower);

    // Handle cancelled status - show only order placed phase
    if (statusLower === "cancelled") {
      currentIndex = -1; // Special handling below
    }

    // Handle delivered status - all steps are completed
    if (statusLower === "delivered") {
      currentIndex = steps.length - 1; // Last step (delivered) is current
    }

    // If status not found, default to pending
    if (currentIndex === -1 && statusLower !== "cancelled") {
      currentIndex = 0;
    }

    return steps.map((step, index) => {
      if (statusLower === "cancelled") {
        // For cancelled orders, show only "Order Placed" as completed/cancelled
        if (step.key === "pending") {
          return {
            ...step,
            completed: true, // Show as completed but cancelled
            current: false,
            cancelled: true,
          };
        }
        // All other steps not reached
        return {
          ...step,
          completed: false,
          current: false,
          cancelled: true,
        };
      }

      // For delivered status, all steps are completed (including delivered step)
      if (statusLower === "delivered") {
        const isCompleted = index <= currentIndex; // All steps up to and including delivered
        const isCurrent = index === currentIndex; // Delivered step is current
        
        return {
          ...step,
          completed: isCompleted,
          current: isCurrent,
          cancelled: false,
        };
      }

      // For all other statuses (pending, confirmed, preparing, ready, out_for_delivery)
      const isCompleted = currentIndex >= 0 && index <= currentIndex;
      const isCurrent = index === currentIndex;
      
      return {
        ...step,
        completed: isCompleted,
        current: isCurrent,
        cancelled: false,
      };
    });
  }, []);

  // Memoized render function for order items
  const renderOrderItem = useCallback(
    ({ item }) => {
      const statusSteps = getStatusSteps(item.status);
      const statusColor = getStatusColor(item.status);
      const statusIcon = getStatusIcon(item.status);
      const isCompleted = item.status === "delivered" || item.status === "cancelled";
      const isCancelled = item.status === "cancelled";

      return (
        <View className="mx-4 mb-4 bg-[#474747] rounded-xl p-4 border-l-4" style={{ borderLeftColor: statusColor }}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center flex-1">
              <View
                className="p-2 rounded-full mr-3"
                style={{ backgroundColor: statusColor + "30" }}
              >
                <Ionicons name={statusIcon} size={24} color={statusColor} />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">
                  {item.restaurantName || "Restaurant"}
                </Text>
                <View className="mt-1 bg-[#2b2b2b] px-2 py-1 rounded-full self-start">
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: statusColor }}
                  >
                    {item.status?.toUpperCase().replace("_", " ") || "PENDING"}
                  </Text>
                </View>
                {item.orderNumber && (
                  <Text className="text-white/60 text-xs mt-1">
                    Order: {item.orderNumber}
                  </Text>
                )}
              </View>
            </View>
            <View className="items-end">
              <Text className="text-[#CF2526] text-xl font-bold">
                ${item.totalAmount?.toFixed(2) || "0.00"}
              </Text>
              {item.subtotal && item.deliveryFee !== undefined && (
                <Text className="text-white/60 text-xs mt-1 text-right">
                  ${item.subtotal.toFixed(2)} + {item.deliveryFee === 0 ? "FREE" : `$${item.deliveryFee.toFixed(2)}`}
                </Text>
              )}
            </View>
          </View>

          {/* Complete Order Journey - All Phases */}
          <View className="mb-4 bg-[#2b2b2b] rounded-lg p-4">
            <Text className="text-white font-bold text-base mb-4">
              {isCompleted ? "Complete Order Journey" : "Current Delivery Progress"}
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              <View className="flex-row">
                {statusSteps.map((step, index) => {
                  let stepColor = "#5a5a5a";
                  let stepBg = "#5a5a5a";
                  let iconName = step.icon || "ellipse-outline";
                  let iconColor = "#fff";
                  let borderColor = "transparent";

                  if (isCancelled) {
                    // Cancelled orders - show all phases with cancelled status
                    if (step.key === "pending") {
                      stepBg = "#f44336";
                      stepColor = "#f44336";
                      iconName = "close-circle";
                      iconColor = "#fff";
                    } else {
                      stepBg = "#5a5a5a";
                      stepColor = "#5a5a5a";
                      iconName = step.icon || "close";
                      iconColor = "#888";
                    }
                  } else if (step.completed) {
                    // All completed steps show as green checkmarks
                    if (step.current && item.status === "delivered") {
                      // Delivered step (final step) - show with checkmark-circle icon
                      stepBg = "#4CAF50";
                      stepColor = "#4CAF50";
                      iconName = "checkmark-circle";
                      iconColor = "#fff";
                      borderColor = "#4CAF50";
                    } else {
                      // All other completed steps (previous phases)
                      stepBg = "#4CAF50";
                      stepColor = "#4CAF50";
                      iconName = "checkmark";
                      iconColor = "#fff";
                    }
                  } else if (step.current) {
                    // Current step for active orders (not completed yet)
                    stepBg = statusColor;
                    stepColor = statusColor;
                    iconName = step.icon || "time";
                    iconColor = "#fff";
                    borderColor = "#fff";
                  }

                  return (
                    <View key={step.key} className="items-center mr-4" style={{ minWidth: 75 }}>
                      <View className="relative">
                        <View
                          className={`w-12 h-12 rounded-full items-center justify-center ${
                            step.current && !isCompleted && !isCancelled ? "border-2" : ""
                          }`}
                          style={{ 
                            backgroundColor: stepBg,
                            borderColor: borderColor
                          }}
                        >
                          <Ionicons
                            name={iconName}
                            size={step.completed ? 20 : step.current ? 18 : 16}
                            color={iconColor}
                          />
                        </View>
                        {/* Current step indicator for active orders */}
                        {step.current && !isCompleted && !isCancelled && (
                          <View className="absolute -top-1 -right-1 bg-[#f49b33] w-4 h-4 rounded-full border-2 border-[#2b2b2b]" />
                        )}
                        {/* Special indicator for delivered status (final step) */}
                        {step.current && item.status === "delivered" && (
                          <View className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white items-center justify-center">
                            <Ionicons name="checkmark" size={12} color="#fff" />
                          </View>
                        )}
                      </View>
                      <Text
                        className={`text-xs mt-2 text-center font-semibold ${
                          step.current && item.status === "delivered"
                            ? "text-green-400"
                            : step.current && !isCancelled
                            ? "text-[#f49b33]"
                            : step.completed && !isCancelled
                            ? "text-green-400"
                            : isCancelled && step.key === "pending"
                            ? "text-red-400"
                            : "text-white/60"
                        }`}
                        style={{ maxWidth: 75 }}
                        numberOfLines={2}
                      >
                        {step.label}
                      </Text>
                      {/* Status badges */}
                      {step.current && !isCompleted && !isCancelled && (
                        <View className="mt-1 bg-[#f49b33]/20 px-2 py-0.5 rounded">
                          <Text className="text-[#f49b33] text-xs font-bold">
                            Current
                          </Text>
                        </View>
                      )}
                      {step.current && item.status === "delivered" && (
                        <View className="mt-1 bg-green-500/20 px-2 py-0.5 rounded">
                          <Text className="text-green-400 text-xs font-bold">
                            Completed ✓
                          </Text>
                        </View>
                      )}
                      {isCancelled && step.key === "pending" && (
                        <View className="mt-1 bg-red-500/20 px-2 py-0.5 rounded">
                          <Text className="text-red-400 text-xs font-bold">
                            Cancelled
                          </Text>
                        </View>
                      )}
                      {step.completed && !step.current && !isCancelled && (
                        <View className="mt-1">
                          <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                        </View>
                      )}
                      {/* Connector line to next step */}
                      {index < statusSteps.length - 1 && (
                        <View
                          className={`absolute top-6 left-16 w-8 h-0.5 ${
                            step.completed && !isCancelled
                              ? "bg-green-500"
                              : isCancelled && step.key === "pending"
                              ? "bg-red-500/50"
                              : step.current && !isCancelled
                              ? "bg-green-500"
                              : "bg-[#5a5a5a]"
                          }`}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
            
            {/* Status message based on current phase */}
            {!isCompleted && (
              <View className="mt-4 pt-3 border-t border-[#5a5a5a]">
                <View className="flex-row items-start bg-[#474747] p-3 rounded-lg">
                  <Ionicons name={statusIcon} size={20} color={statusColor} style={{ marginTop: 2 }} />
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold text-sm mb-1">
                      {item.status === "pending" && "⏳ Order Placed"}
                      {item.status === "confirmed" && "✅ Order Confirmed"}
                      {item.status === "preparing" && "👨‍🍳 Preparing Your Order"}
                      {item.status === "ready" && "📦 Order Ready"}
                      {item.status === "out_for_delivery" && "🚴 Order Out for Delivery"}
                    </Text>
                    <Text className="text-white/70 text-xs">
                      {item.status === "pending" && "Your order has been placed and is awaiting restaurant confirmation"}
                      {item.status === "confirmed" && "Restaurant has confirmed your order and will start preparation soon"}
                      {item.status === "preparing" && "The kitchen is preparing your delicious meal"}
                      {item.status === "ready" && "Your order is ready and will be dispatched for delivery shortly"}
                      {item.status === "out_for_delivery" && `Your order is on the way! ${item.deliveryDriver ? `Driver: ${item.deliveryDriver}` : "Driver will arrive soon"}`}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Completed order message */}
            {isCancelled && (
              <View className="mt-4 pt-3 border-t border-[#5a5a5a]">
                <View className="flex-row items-start bg-red-500/20 border border-red-500/30 p-3 rounded-lg">
                  <Ionicons name="alert-circle" size={20} color="#f44336" style={{ marginTop: 2 }} />
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold text-sm mb-1">
                      ❌ Order Cancelled
                    </Text>
                    <Text className="text-white/70 text-xs">
                      This order was cancelled
                      {item.cancelledAt && ` on ${formatDate(item.cancelledAt)}`}
                      {item.cancellationReason && ` - ${item.cancellationReason}`}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {item.status === "delivered" && (
              <View className="mt-4 pt-3 border-t border-[#5a5a5a]">
                <View className="flex-row items-start bg-green-500/20 border border-green-500/30 p-3 rounded-lg">
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={{ marginTop: 2 }} />
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold text-sm mb-1">
                      ✅ Order Successfully Delivered!
                    </Text>
                    <Text className="text-white/70 text-xs">
                      All phases completed! Your order was placed, confirmed, prepared, ready, dispatched, and delivered successfully.
                      {item.estimatedDeliveryTime && ` Delivered on ${formatDate(item.estimatedDeliveryTime)}`}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Order Items */}
          <View className="mb-3 pb-3 border-b border-[#5a5a5a]">
            <Text className="text-white/70 text-sm mb-2">Items:</Text>
            {item.items?.map((orderItem, idx) => (
              <View key={idx} className="flex-row justify-between mb-1">
                <Text className="text-white/80 text-sm">
                  {orderItem.name} x {orderItem.quantity}
                </Text>
                <Text className="text-white text-sm">
                  ${(orderItem.price * orderItem.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Delivery Info */}
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={18} color="#f49b33" />
              <Text className="text-white ml-2 text-sm flex-1">
                {formatDate(item.createdAt)}
              </Text>
            </View>

            {item.address && (
              <View className="flex-row items-start">
                <Ionicons
                  name="location-outline"
                  size={18}
                  color="#f49b33"
                  style={{ marginTop: 2 }}
                />
                <Text
                  className="text-white ml-2 text-sm flex-1"
                  numberOfLines={2}
                >
                  {item.address}
                </Text>
              </View>
            )}

            {item.phoneNumber && (
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={18} color="#f49b33" />
                <Text className="text-white ml-2 text-sm flex-1">
                  {item.phoneNumber}
                </Text>
              </View>
            )}

            {item.deliveryDriver && (
              <View className="flex-row items-center mt-2 pt-2 border-t border-[#5a5a5a]">
                <Ionicons name="bicycle" size={18} color="#CF2526" />
                <Text className="text-white ml-2 text-sm flex-1">
                  Driver: {item.deliveryDriver}
                </Text>
              </View>
            )}

            {item.trackingNumber && (
              <View className="flex-row items-center">
                <Ionicons name="qr-code-outline" size={18} color="#f49b33" />
                <Text className="text-white ml-2 text-sm flex-1">
                  Tracking: {item.trackingNumber}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Tracking Number",
                      `Tracking Number: ${item.trackingNumber}\nOrder Number: ${item.orderNumber || "N/A"}\n\nYou can share this with customer support if needed.`,
                      [
                        { text: "OK", style: "cancel" },
                        {
                          text: "Share",
                          onPress: async () => {
                            try {
                              const shareMessage = `Track my order:\nTracking: ${item.trackingNumber}\nOrder: ${item.orderNumber || ""}\nRestaurant: ${item.restaurantName || ""}`;
                              await Linking.openURL(`sms:?body=${encodeURIComponent(shareMessage)}`);
                            } catch (error) {
                              Alert.alert("Error", "Failed to share tracking number");
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons name="share-outline" size={16} color="#f49b33" />
                </TouchableOpacity>
              </View>
            )}

            {item.orderNumber && (
              <View className="flex-row items-center">
                <Ionicons name="receipt-outline" size={18} color="#f49b33" />
                <Text className="text-white ml-2 text-sm flex-1">
                  Order: {item.orderNumber}
                </Text>
              </View>
            )}

            {item.estimatedDeliveryTime && (
              <View className="flex-row items-center mt-2 pt-2 border-t border-[#5a5a5a]">
                <Ionicons name="time" size={18} color="#f49b33" />
                <View className="ml-2 flex-1">
                  <Text className="text-white text-sm font-semibold">
                    Estimated Delivery
                  </Text>
                  <Text className="text-white/70 text-xs">
                    {formatDate(item.estimatedDeliveryTime)}
                    {item.estimatedDeliveryMinutes && ` (${item.estimatedDeliveryMinutes} min)`}
                  </Text>
                </View>
              </View>
            )}

            {item.deliveryDistance && (
              <View className="flex-row items-center">
                <Ionicons name="map-outline" size={18} color="#f49b33" />
                <Text className="text-white ml-2 text-sm flex-1">
                  Distance: {item.deliveryDistance} km
                </Text>
              </View>
            )}

            {item.city && (
              <View className="flex-row items-center">
                <Ionicons name="business-outline" size={18} color="#f49b33" />
                <Text className="text-white ml-2 text-sm flex-1">
                  {item.city} {item.postalCode && `- ${item.postalCode}`}
                </Text>
              </View>
            )}

            {item.deliveryFee !== undefined && (
              <View className="flex-row items-center mt-2 pt-2 border-t border-[#5a5a5a]">
                <Text className="text-white/70 text-sm flex-1">Delivery Fee:</Text>
                <Text className={`text-sm font-bold ${item.deliveryFee === 0 ? "text-green-400" : "text-white"}`}>
                  {item.deliveryFee === 0 ? "FREE" : `$${item.deliveryFee.toFixed(2)}`}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 mt-4">
            {item.status === "delivered" && (
              <TouchableOpacity
                className="flex-1 bg-[#f49b33] py-3 rounded-lg"
                onPress={() => router.push(`/order/${item.id}`)}
              >
                <Text className="text-white font-bold text-center">
                  Order Details
                </Text>
              </TouchableOpacity>
            )}
            {(item.status === "pending" || item.status === "confirmed") && (
              <TouchableOpacity
                className="flex-1 bg-red-600 py-3 rounded-lg"
                onPress={() => {
                  Alert.alert(
                    "Cancel Order",
                    "Are you sure you want to cancel this order?",
                    [
                      { text: "No", style: "cancel" },
                      {
                        text: "Yes, Cancel",
                        style: "destructive",
                        onPress: async () => {
                          try {
                            const orderRef = doc(db, "orders", item.id);
                            await updateDoc(orderRef, {
                              status: "cancelled",
                              cancelledAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                              cancellationReason: "Cancelled by customer",
                            });
                            Alert.alert("Success", "Your order has been cancelled successfully.");
                          } catch (error) {
                            console.error("Cancel order error:", error);
                            Alert.alert("Error", "Failed to cancel order. Please try again.");
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <Text className="text-white font-bold text-center">
                  Cancel Order
                </Text>
              </TouchableOpacity>
            )}
            {item.status === "out_for_delivery" && item.deliveryDriver && (
              <TouchableOpacity
                className="flex-1 bg-green-600 py-3 rounded-lg"
                onPress={async () => {
                  Alert.alert(
                    "Contact Driver",
                    `Driver: ${item.deliveryDriver}\n\nWhat would you like to do?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Call",
                        onPress: () => {
                          if (item.phoneNumber) {
                            Linking.openURL(`tel:${item.phoneNumber}`);
                          } else {
                            Alert.alert("Error", "Phone number not available");
                          }
                        },
                      },
                      {
                        text: "Message",
                        onPress: () => {
                          if (item.phoneNumber) {
                            Linking.openURL(`sms:${item.phoneNumber}`);
                          } else {
                            Alert.alert("Error", "Phone number not available");
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="call" size={20} color="#fff" />
                  <Text className="text-white font-bold ml-2 text-center">
                    Contact Driver
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            
            {item.status === "ready" && (
              <View className="bg-[#9C27B0]/20 border border-[#9C27B0] rounded-lg p-3 mt-3">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#9C27B0" />
                  <Text className="text-white ml-2 flex-1 text-sm">
                    Your order is ready! It will be dispatched soon.
                  </Text>
                </View>
              </View>
            )}
            
            {item.status === "preparing" && (
              <View className="bg-[#2196F3]/20 border border-[#2196F3] rounded-lg p-3 mt-3">
                <View className="flex-row items-center">
                  <Ionicons name="restaurant" size={20} color="#2196F3" />
                  <Text className="text-white ml-2 flex-1 text-sm">
                    Your order is being prepared at the restaurant.
                  </Text>
                </View>
              </View>
            )}
            
            {item.status === "ready" && (
              <View className="bg-[#9C27B0]/20 border border-[#9C27B0] rounded-lg p-3 mt-3">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={20} color="#9C27B0" />
                  <Text className="text-white ml-2 flex-1 text-sm">
                    Your order is ready! It will be dispatched soon.
                  </Text>
                </View>
              </View>
            )}
            
            {item.status === "preparing" && (
              <View className="bg-[#2196F3]/20 border border-[#2196F3] rounded-lg p-3 mt-3">
                <View className="flex-row items-center">
                  <Ionicons name="restaurant" size={20} color="#2196F3" />
                  <Text className="text-white ml-2 flex-1 text-sm">
                    Your order is being prepared at the restaurant.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      );
    },
    [getStatusSteps, getStatusColor, getStatusIcon, formatDate, router]
  );

  const renderEmptyState = useCallback(() => (
    <View className="flex-1 justify-center items-center px-6 py-16">
      <View className="bg-[#474747] p-8 rounded-2xl items-center">
        <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
          <Ionicons
            name={
              activeTab === "active"
                ? "bicycle-outline"
                : "checkmark-circle-outline"
            }
            size={60}
            color="#CF2526"
          />
        </View>
        <Text className="text-white text-xl font-bold mb-2">
          {activeTab === "active"
            ? "No Active Deliveries"
            : "No Completed Deliveries"}
        </Text>
        <Text className="text-white/70 text-center mb-6">
          {activeTab === "active"
            ? "Your active delivery orders will appear here"
            : "Your completed delivery history will appear here"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          className="bg-[#f49b33] px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Browse Restaurants</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [activeTab, router]);

  const keyExtractor = useCallback((item) => item.id, []);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Loading state
  if (loading && allOrders.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
        <ActivityIndicator size="large" color="#f49b33" />
        <Text className="text-white mt-4">Loading deliveries...</Text>
      </SafeAreaView>
    );
  }

  // Not signed in state
  if (!userEmail) {
    return (
      <SafeAreaView className="flex-1 bg-[#2b2b2b]">
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-[#474747] p-8 rounded-2xl items-center w-full">
            <View className="bg-[#f49b33]/20 p-6 rounded-full mb-4">
              <Ionicons name="lock-closed" size={60} color="#f49b33" />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              Sign In Required
            </Text>
            <Text className="text-white/70 text-center mb-6">
              Please sign in to track your deliveries
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/signin")}
              className="bg-[#f49b33] px-8 py-4 rounded-lg w-full"
            >
              <Text className="text-white text-lg font-bold text-center">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && allOrders.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-[#2b2b2b]">
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-[#474747] p-8 rounded-2xl items-center w-full">
            <View className="bg-red-500/20 p-6 rounded-full mb-4">
              <Ionicons name="alert-circle" size={60} color="#f44336" />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              Something Went Wrong
            </Text>
            <Text className="text-white/70 text-center mb-6">{error}</Text>
            <TouchableOpacity
              onPress={handleRefresh}
              className="bg-[#f49b33] px-8 py-4 rounded-lg w-full"
            >
              <Text className="text-white text-lg font-bold text-center">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Main content
  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-white text-2xl font-bold mb-1">
          Delivery Tracking
        </Text>
        <Text className="text-white/70">
          {activeTab === "active"
            ? `${filteredOrders.length} active ${
                filteredOrders.length === 1 ? "delivery" : "deliveries"
              }`
            : `${filteredOrders.length} completed ${
                filteredOrders.length === 1 ? "delivery" : "deliveries"
              }`}
        </Text>
      </View>

      {/* Error Banner (if error but orders exist) */}
      {error && allOrders.length > 0 && (
        <View className="mx-4 mb-2 bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex-row items-center">
          <Ionicons name="alert-circle" size={20} color="#f44336" />
          <Text className="text-red-400 ml-2 flex-1 text-sm">
            Live updates unavailable. Pull to refresh.
          </Text>
        </View>
      )}

      {/* Tabs */}
      <View className="flex-row mx-4 mb-4 bg-[#474747] rounded-lg p-1">
        <TouchableOpacity
          onPress={() => handleTabChange("active")}
          className={`flex-1 py-3 rounded-lg ${
            activeTab === "active" ? "bg-[#f49b33]" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-center font-bold ${
              activeTab === "active" ? "text-white" : "text-white/70"
            }`}
          >
            Active (
            {
              allOrders.filter(
                (o) => o.status !== "delivered" && o.status !== "cancelled"
              ).length
            }
            )
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabChange("completed")}
          className={`flex-1 py-3 rounded-lg ${
            activeTab === "completed" ? "bg-[#f49b33]" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-center font-bold ${
              activeTab === "completed" ? "text-white" : "text-white/70"
            }`}
          >
            Completed (
            {
              allOrders.filter(
                (o) => o.status === "delivered" || o.status === "cancelled"
              ).length
            }
            )
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={keyExtractor}
        renderItem={renderOrderItem}
        ListEmptyComponent={renderEmptyState}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#CF2526"
          />
        }
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 20,
          flexGrow: 1,
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={5}
        windowSize={10}
      />
    </SafeAreaView>
  );
};

export default Delivery;