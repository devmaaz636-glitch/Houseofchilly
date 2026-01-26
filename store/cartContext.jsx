import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      const savedRestaurantId = await AsyncStorage.getItem('restaurantId');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      if (savedRestaurantId) {
        setRestaurantId(savedRestaurantId);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      if (restaurantId) {
        await AsyncStorage.setItem('restaurantId', restaurantId);
      } else {
        await AsyncStorage.removeItem('restaurantId');
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item, newRestaurantId) => {
    setCart((prevCart) => {
      // If cart is empty or restaurant is different, clear cart and set new restaurant
      if (prevCart.length === 0 || (prevCart[0]?.restaurantId && prevCart[0].restaurantId !== newRestaurantId)) {
        setRestaurantId(newRestaurantId);
        return [{
          ...item,
          restaurantId: newRestaurantId,
          quantity: 1,
        }];
      }

      // Set restaurant ID if not set
      if (!restaurantId) {
        setRestaurantId(newRestaurantId);
      }

      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // New item, add to cart
        return [...prevCart, { ...item, restaurantId: newRestaurantId, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== itemId);
      // Clear restaurant ID if cart is empty
      if (newCart.length === 0) {
        setRestaurantId(null);
      }
      return newCart;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    restaurantId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

