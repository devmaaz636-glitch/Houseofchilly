import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        setFavoriteIds([]);
        return;
      }

      setLoading(true);
      const favoritesRef = collection(db, 'favorites');
      const favoritesQuery = query(
        favoritesRef,
        where('userEmail', '==', userEmail)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);

      const ids = [];
      favoritesSnapshot.forEach((doc) => {
        ids.push(doc.data().restaurantId);
      });

      setFavoriteIds(ids);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (restaurantId, restaurantName) => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('User not logged in');
      }

      // Check if already favorited
      if (favoriteIds.includes(restaurantId)) {
        return false; // Already favorited
      }

      // Check if favorite already exists
      const favoritesRef = collection(db, 'favorites');
      const favoritesQuery = query(
        favoritesRef,
        where('userEmail', '==', userEmail),
        where('restaurantId', '==', restaurantId)
      );
      const existingFavorites = await getDocs(favoritesQuery);

      if (!existingFavorites.empty) {
        // Already favorited
        return false;
      }

      // Add to Firestore
      const favoriteRef = doc(collection(db, 'favorites'));
      await setDoc(favoriteRef, {
        userEmail,
        restaurantId,
        restaurantName,
        createdAt: new Date().toISOString(),
      });

      // Update local state
      setFavoriteIds([...favoriteIds, restaurantId]);
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (restaurantId) => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('User not logged in');
      }

      // Find and delete from Firestore
      const favoritesRef = collection(db, 'favorites');
      const favoritesQuery = query(
        favoritesRef,
        where('userEmail', '==', userEmail),
        where('restaurantId', '==', restaurantId)
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);

      const deletePromises = [];
      favoritesSnapshot.forEach((docSnap) => {
        deletePromises.push(deleteDoc(doc(db, 'favorites', docSnap.id)));
      });

      await Promise.all(deletePromises);

      // Update local state
      setFavoriteIds(favoriteIds.filter((id) => id !== restaurantId));
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const toggleFavorite = async (restaurantId, restaurantName) => {
    if (favoriteIds.includes(restaurantId)) {
      return await removeFavorite(restaurantId);
    } else {
      return await addFavorite(restaurantId, restaurantName);
    }
  };

  const isFavorite = (restaurantId) => {
    return favoriteIds.includes(restaurantId);
  };

  const value = {
    favoriteIds,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refreshFavorites: loadFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

