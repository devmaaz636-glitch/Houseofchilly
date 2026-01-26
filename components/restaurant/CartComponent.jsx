import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCart } from "../../store/cartContext";
import { useRouter } from "expo-router";

const CartComponent = ({ visible, onClose }) => {
  const {
    cart,
    restaurantId,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Cart Empty", "Please add items to cart first");
      return;
    }
    onClose();
    router.push("/checkout");
  };

  const handleRemoveItem = (itemId, itemName) => {
    Alert.alert("Remove Item", `Remove ${itemName} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFromCart(itemId),
      },
    ]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#00000080] justify-end">
        <View className="bg-[#2b2b2b] rounded-t-3xl max-h-[85%]">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-[#474747]">
            <View className="flex-row items-center">
              <View className="bg-[#f49b33] p-2 rounded-full mr-3">
                <Ionicons name="cart" size={24} color="#fff" />
              </View>
              <View>
                <Text className="text-white text-xl font-bold">Your Cart</Text>
                <Text className="text-white/70 text-sm">
                  {getCartItemCount()} {getCartItemCount() === 1 ? "item" : "items"}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={32} color="#f49b33" />
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
              <View className="py-16 items-center px-4">
                <Ionicons name="cart-outline" size={80} color="#474747" />
                <Text className="text-white text-xl font-bold mt-4">
                  Your cart is empty
                </Text>
                <Text className="text-white/70 text-center mt-2">
                  Add items from the menu to get started
                </Text>
              </View>
            ) : (
              <View className="p-4">
                {cart.map((item) => (
                  <View
                    key={item.id}
                    className="bg-[#474747] rounded-xl p-4 mb-3 flex-row"
                  >
                    <Image
                      source={{
                        uri: item.image || "https://via.placeholder.com/100",
                      }}
                      className="w-20 h-20 rounded-lg mr-3"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-2">
                          <Text className="text-white text-base font-bold mb-1">
                            {item.name}
                          </Text>
                          <Text className="text-[#f49b33] font-bold">
                            ${item.price?.toFixed(2)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveItem(item.id, item.name)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#ff4444"
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Quantity Controls */}
                      <View className="flex-row items-center justify-between mt-2">
                        <View className="flex-row items-center bg-[#2b2b2b] rounded-lg">
                          <TouchableOpacity
                            onPress={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-2"
                          >
                            <Ionicons name="remove" size={20} color="#fff" />
                          </TouchableOpacity>
                          <Text className="text-white font-bold px-4 py-2">
                            {item.quantity}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-2"
                          >
                            <Ionicons name="add" size={20} color="#fff" />
                          </TouchableOpacity>
                        </View>
                        <Text className="text-white font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          {cart.length > 0 && (
            <View className="border-t border-[#474747] p-4 bg-[#2b2b2b]">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-lg font-bold">Total:</Text>
                <Text className="text-[#f49b33] text-2xl font-bold">
                  ${getCartTotal().toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleCheckout}
                className="bg-[#f49b33] py-4 rounded-xl flex-row items-center justify-center"
              >
                <Text className="text-white text-lg font-bold mr-2">
                  Proceed to Checkout
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CartComponent;

