// import React, { createContext, useContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const CartContext = createContext();

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [restaurantId, setRestaurantId] = useState(null);

//   // Load cart from AsyncStorage on mount
//   useEffect(() => {
//     loadCart();
//   }, []);

//   // Save cart to AsyncStorage whenever it changes
//   useEffect(() => {
//     saveCart();
//   }, [cart]);

//   const loadCart = async () => {
//     try {
//       const savedCart = await AsyncStorage.getItem('cart');
//       const savedRestaurantId = await AsyncStorage.getItem('restaurantId');
//       if (savedCart) {
//         setCart(JSON.parse(savedCart));
//       }
//       if (savedRestaurantId) {
//         setRestaurantId(savedRestaurantId);
//       }
//     } catch (error) {
//       console.error('Error loading cart:', error);
//     }
//   };

//   const saveCart = async () => {
//     try {
//       await AsyncStorage.setItem('cart', JSON.stringify(cart));
//       if (restaurantId) {
//         await AsyncStorage.setItem('restaurantId', restaurantId);
//       } else {
//         await AsyncStorage.removeItem('restaurantId');
//       }
//     } catch (error) {
//       console.error('Error saving cart:', error);
//     }
//   };

//   const addToCart = (item, newRestaurantId) => {
//     setCart((prevCart) => {
//       // If cart is empty or restaurant is different, clear cart and set new restaurant
//       if (prevCart.length === 0 || (prevCart[0]?.restaurantId && prevCart[0].restaurantId !== newRestaurantId)) {
//         setRestaurantId(newRestaurantId);
//         return [{
//           ...item,
//           restaurantId: newRestaurantId,
//           quantity: 1,
//         }];
//       }

//       // Set restaurant ID if not set
//       if (!restaurantId) {
//         setRestaurantId(newRestaurantId);
//       }

//       // Check if item already exists in cart
//       const existingItemIndex = prevCart.findIndex(
//         (cartItem) => cartItem.id === item.id
//       );

//       if (existingItemIndex >= 0) {
//         // Item exists, increase quantity
//         const updatedCart = [...prevCart];
//         updatedCart[existingItemIndex].quantity += 1;
//         return updatedCart;
//       } else {
//         // New item, add to cart
//         return [...prevCart, { ...item, restaurantId: newRestaurantId, quantity: 1 }];
//       }
//     });
//   };

//   const removeFromCart = (itemId) => {
//     setCart((prevCart) => {
//       const newCart = prevCart.filter((item) => item.id !== itemId);
//       // Clear restaurant ID if cart is empty
//       if (newCart.length === 0) {
//         setRestaurantId(null);
//       }
//       return newCart;
//     });
//   };

//   const updateQuantity = (itemId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(itemId);
//       return;
//     }

//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.id === itemId ? { ...item, quantity } : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCart([]);
//     setRestaurantId(null);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const getCartItemCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   const value = {
//     cart,
//     restaurantId,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemCount,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

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
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveCart();
    }
  }, [cart, restaurantId, isLoading]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      const savedRestaurantId = await AsyncStorage.getItem('restaurantId');
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
      
      if (savedRestaurantId) {
        setRestaurantId(savedRestaurantId);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
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

  const addToCart = (item, newRestaurantId = null) => {
    try {
      setCart((prevCart) => {
        // Get the restaurant ID from the item or parameter
        const itemRestaurantId = newRestaurantId || item.restaurantId;
        
        // If cart is empty, start fresh
        if (prevCart.length === 0) {
          setRestaurantId(itemRestaurantId);
          return [{
            ...item,
            restaurantId: itemRestaurantId,
            quantity: item.quantity || 1,
            price: parseFloat(item.price) || 0,
          }];
        }

        // Check if trying to add from different restaurant
        const currentRestaurantId = prevCart[0]?.restaurantId;
        if (currentRestaurantId && itemRestaurantId && currentRestaurantId !== itemRestaurantId) {
          // Clear cart and add new item from different restaurant
          setRestaurantId(itemRestaurantId);
          return [{
            ...item,
            restaurantId: itemRestaurantId,
            quantity: item.quantity || 1,
            price: parseFloat(item.price) || 0,
          }];
        }

        // Set restaurant ID if not set
        if (!restaurantId && itemRestaurantId) {
          setRestaurantId(itemRestaurantId);
        }

        // Check if item already exists in cart (including side items with same ID)
        const existingItemIndex = prevCart.findIndex(
          (cartItem) => cartItem.id === item.id && cartItem.type === item.type
        );

        if (existingItemIndex >= 0) {
          // Item exists, increase quantity
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + (item.quantity || 1),
          };
          return updatedCart;
        } else {
          // New item, add to cart
          return [
            ...prevCart,
            {
              ...item,
              restaurantId: itemRestaurantId,
              quantity: item.quantity || 1,
              price: parseFloat(item.price) || 0,
            }
          ];
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = (itemId, itemType = 'menu') => {
    try {
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => 
          !(item.id === itemId && item.type === itemType)
        );
        // Clear restaurant ID if cart is empty
        if (newCart.length === 0) {
          setRestaurantId(null);
        }
        return newCart;
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = (itemId, quantity, itemType = 'menu') => {
    try {
      const parsedQuantity = parseInt(quantity, 10);
      
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        removeFromCart(itemId, itemType);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId && item.type === itemType 
            ? { ...item, quantity: parsedQuantity } 
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const incrementQuantity = (itemId, itemType = 'menu') => {
    try {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId && item.type === itemType 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
    } catch (error) {
      console.error('Error incrementing quantity:', error);
    }
  };

  const decrementQuantity = (itemId, itemType = 'menu') => {
    try {
      setCart((prevCart) => {
        const item = prevCart.find((item) => 
          item.id === itemId && item.type === itemType
        );
        if (!item) return prevCart;

        if (item.quantity <= 1) {
         
          const newCart = prevCart.filter((item) => 
            !(item.id === itemId && item.type === itemType)
          );
          if (newCart.length === 0) {
            setRestaurantId(null);
          }
          return newCart;
        }

        return prevCart.map((item) =>
          item.id === itemId && item.type === itemType 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      });
    } catch (error) {
      console.error('Error decrementing quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      setCart([]);
      setRestaurantId(null);
      await AsyncStorage.removeItem('cart');
      await AsyncStorage.removeItem('restaurantId');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    try {
      return cart.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity, 10) || 0;
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  };

  const getCartItemCount = () => {
    try {
      return cart.reduce((count, item) => {
        const quantity = parseInt(item.quantity, 10) || 0;
        return count + quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating item count:', error);
      return 0;
    }
  };

  const isItemInCart = (itemId, itemType = 'menu') => {
    return cart.some((item) => item.id === itemId && item.type === itemType);
  };

  const getItemQuantity = (itemId, itemType = 'menu') => {
    const item = cart.find((item) => item.id === itemId && item.type === itemType);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    restaurantId,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isItemInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};