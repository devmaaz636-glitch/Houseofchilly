// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Alert,
// } from "react-native";
// import React from "react";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useCart } from "../../store/cartContext";
// import { useRouter } from "expo-router";

// const CartComponent = ({ visible, onClose }) => {
//   const {
//     cart,
//     restaurantId,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemCount,
//   } = useCart();
//   const router = useRouter();

//   const handleCheckout = () => {
//     if (cart.length === 0) {
//       Alert.alert("Cart Empty", "Please add items to cart first");
//       return;
//     }
//     onClose();
//     router.push("/checkout");
//   };

//   const handleRemoveItem = (itemId, itemName) => {
//     Alert.alert("Remove Item", `Remove ${itemName} from cart?`, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Remove",
//         style: "destructive",
//         onPress: () => removeFromCart(itemId),
//       },
//     ]);
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View className="flex-1 bg-[#00000080] justify-end">
//         <View className="bg-[#2b2b2b] rounded-t-3xl max-h-[85%]">
//           {/* Header */}
//           <View className="flex-row justify-between items-center p-4 border-b border-[#474747]">
//             <View className="flex-row items-center">
//               <View className="bg-[#f49b33] p-2 rounded-full mr-3">
//                 <Ionicons name="cart" size={24} color="#fff" />
//               </View>
//               <View>
//                 <Text className="text-white text-xl font-bold">Your Cart</Text>
//                 <Text className="text-white/70 text-sm">
//                   {getCartItemCount()} {getCartItemCount() === 1 ? "item" : "items"}
//                 </Text>
//               </View>
//             </View>
//             <TouchableOpacity onPress={onClose}>
//               <Ionicons name="close-circle" size={32} color="#f49b33" />
//             </TouchableOpacity>
//           </View>

//           {/* Cart Items */}
//           <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//             {cart.length === 0 ? (
//               <View className="py-16 items-center px-4">
//                 <Ionicons name="cart-outline" size={80} color="#474747" />
//                 <Text className="text-white text-xl font-bold mt-4">
//                   Your cart is empty
//                 </Text>
//                 <Text className="text-white/70 text-center mt-2">
//                   Add items from the menu to get started
//                 </Text>
//               </View>
//             ) : (
//               <View className="p-4">
//                 {cart.map((item) => (
//                   <View
//                     key={item.id}
//                     className="bg-[#474747] rounded-xl p-4 mb-3 flex-row"
//                   >
//                     <Image
//                       source={{
//                         uri: item.image || "https://via.placeholder.com/100",
//                       }}
//                       className="w-20 h-20 rounded-lg mr-3"
//                       resizeMode="cover"
//                     />
//                     <View className="flex-1">
//                       <View className="flex-row justify-between items-start mb-2">
//                         <View className="flex-1 mr-2">
//                           <Text className="text-white text-base font-bold mb-1">
//                             {item.name}
//                           </Text>
//                           <Text className="text-[#f49b33] font-bold">
//                             ${item.price?.toFixed(2)}
//                           </Text>
//                         </View>
//                         <TouchableOpacity
//                           onPress={() => handleRemoveItem(item.id, item.name)}
//                         >
//                           <Ionicons
//                             name="trash-outline"
//                             size={20}
//                             color="#ff4444"
//                           />
//                         </TouchableOpacity>
//                       </View>

//                       {/* Quantity Controls */}
//                       <View className="flex-row items-center justify-between mt-2">
//                         <View className="flex-row items-center bg-[#2b2b2b] rounded-lg">
//                           <TouchableOpacity
//                             onPress={() =>
//                               updateQuantity(item.id, item.quantity - 1)
//                             }
//                             className="px-3 py-2"
//                           >
//                             <Ionicons name="remove" size={20} color="#fff" />
//                           </TouchableOpacity>
//                           <Text className="text-white font-bold px-4 py-2">
//                             {item.quantity}
//                           </Text>
//                           <TouchableOpacity
//                             onPress={() =>
//                               updateQuantity(item.id, item.quantity + 1)
//                             }
//                             className="px-3 py-2"
//                           >
//                             <Ionicons name="add" size={20} color="#fff" />
//                           </TouchableOpacity>
//                         </View>
//                         <Text className="text-white font-bold">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             )}
//           </ScrollView>

//           {/* Footer */}
//           {cart.length > 0 && (
//             <View className="border-t border-[#474747] p-4 bg-[#2b2b2b]">
//               <View className="flex-row justify-between items-center mb-4">
//                 <Text className="text-white text-lg font-bold">Total:</Text>
//                 <Text className="text-[#f49b33] text-2xl font-bold">
//                   ${getCartTotal().toFixed(2)}
//                 </Text>
//               </View>
//               <TouchableOpacity
//                 onPress={handleCheckout}
//                 className="bg-[#f49b33] py-4 rounded-xl flex-row items-center justify-center"
//               >
//                 <Text className="text-white text-lg font-bold mr-2">
//                   Proceed to Checkout
//                 </Text>
//                 <Ionicons name="arrow-forward" size={20} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default CartComponent;

import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCart } from "../../store/cartContext";
import { useRouter } from "expo-router";

const CartComponent = ({ visible, onClose }) => {
  const {
    cart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getCartTotal,
    getCartItemCount,
  } = useCart();

  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const menuItems = cart.filter((item) => item.type === "menu" || !item.type);
  const sideItems = cart.filter((item) => item.type === "side");

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 50; // example
  const discount = subtotal * 0.05; // 5%
  const total = subtotal + deliveryFee - discount;

  // Select/Deselect all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleItem = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  useEffect(() => {
    setSelectAll(selectedIds.length === cart.length && cart.length > 0);
  }, [selectedIds, cart]);

  const handleRemoveItem = (item) => {
    Alert.alert(
      "Remove Item",
      `Remove ${item.name} from cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeFromCart(item.id, item.type) },
      ]
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Cart Empty", "Add items first");
      return;
    }
    onClose();
    router.push("/checkout");
  };

  const getImageSource = (img) => {
    if (!img) return require("../../assets/images/logo.png");
    if (typeof img === "string") return { uri: img };
    return img;
  };

  const renderItem = (item) => (
    <View
      key={item.id}
      className="bg-white shadow-md rounded-xl p-4 mb-3 flex-row items-center"
    >
      {/* Checkbox */}
      <TouchableOpacity onPress={() => toggleItem(item.id)}>
        <Ionicons
          name={selectedIds.includes(item.id) ? "checkbox-outline" : "square-outline"}
          size={20}
          color="#CF2526"
        />
      </TouchableOpacity>

      {/* Image */}
      <Image
        source={getImageSource(item.image)}
        className="w-20 h-20 rounded-lg mx-3"
        resizeMode="cover"
      />

      {/* Name & Price */}
      <View className="flex-1 justify-between">
        <Text className="text-black font-bold text-base" numberOfLines={1}>
          {item.name}
        </Text>
        <View className="bg-[#D421291A] rounded-full px-2 py-[1px] self-start mt-1">
          <Text className="text-[14px] font-semibold text-[#D42129]">
            Rs. {item.price.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Delete + Quantity */}
      <View className="justify-start items-end ml-2">
        <TouchableOpacity onPress={() => handleRemoveItem(item)}>
          <Ionicons name="trash-outline" size={24} color="black" />
        </TouchableOpacity>

        <View className="flex-row items-center mt-3">
          <TouchableOpacity
            onPress={() => decrementQuantity(item.id, item.type)}
            className="bg-white p-2 rounded-full shadow-md"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            <Ionicons name="remove" size={16} color="#000" />
          </TouchableOpacity>

          <Text className="text-black px-3 font-bold text-sm">{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => incrementQuantity(item.id, item.type)}
            className="bg-white p-2 rounded-full shadow-md"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 3,
            }}
          >
            <Ionicons name="add" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: "#00000080", justifyContent: "flex-end" }}>
        <View className="bg-white rounded-t-3xl max-h-[85%]">
          {/* Header */}
          <View className="flex-row items-center p-4 border-b border-dashed border-gray-300">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md"
            >
              <Ionicons name="chevron-back" size={26} color="#000" />
            </TouchableOpacity>

            <View className="flex-1 items-center">
              <Text className="text-black text-xl font-bold">
                Cart ({getCartItemCount()})
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-md"
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
              <View className="items-center mt-10">
                <Ionicons name="cart-outline" size={80} color="#666" />
                <Text className="text-black text-center mt-4 text-lg">Cart is empty</Text>
                <Text className="text-gray-400 text-center mt-2">Add items to get started</Text>
              </View>
            ) : (
              <>
                {/* Menu Items with Select All */}
                {menuItems.length > 0 && (
                  <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-black font-bold text-lg">Menu Items</Text>
                      <TouchableOpacity onPress={toggleSelectAll} className="flex-row items-center">
                        <Ionicons
                          name={selectAll ? "checkbox-outline" : "square-outline"}
                          size={20}
                          color="#CF2526"
                        />
                        <Text className="ml-2 text-black font-semibold">Select All</Text>
                      </TouchableOpacity>
                    </View>
                    {menuItems.map(renderItem)}
                  </View>
                )}

                {/* Side Items */}
                {sideItems.length > 0 && sideItems.map(renderItem)}
              </>
            )}
          </ScrollView>

          {/* Footer */}
          {cart.length > 0 && (
            <View className="p-4 bg-white"> 
              {[{ label: "Subtotal", value: subtotal },
                { label: "Delivery Fee", value: deliveryFee },
                { label: "Discount (5%)", value: discount }].map((item, index) => (
                <View key={index} className="flex-row justify-between py-2 border-b border-dashed border-gray-300">
                  <Text className="text-gray-700">{item.label}</Text>
                  <Text className="text-gray-700">Rs. {item.value.toFixed(2)}</Text>
                </View>
              ))}

              <View className="flex-row justify-between py-3 mt-2 border-t border-gray-400">
                <Text className="text-black text-lg font-bold">Total</Text>
                <Text className="text-black text-lg font-bold">Rs. {total.toFixed(2)}</Text>
              </View>

            <TouchableOpacity
  onPress={handleCheckout}
  className="bg-[#CF2526] py-4 px-6 rounded-full items-center mt-3 self-center w-[50%]"
>
  <Text className="text-white font-bold text-lg">
    Checkout
  </Text>
</TouchableOpacity>

            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CartComponent;


