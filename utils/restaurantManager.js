/**
 * RESTAURANT MANAGEMENT UTILITY
 * 
 * This utility provides functions to manage restaurants in Firebase Firestore.
 * Use this for:
 * - Uploading all restaurants to database
 * - Adding new restaurants
 * - Updating existing restaurants
 * - Deleting restaurants
 * - Fetching restaurants
 * 
 * Usage Example:
 * import { uploadAllRestaurants, addRestaurant, updateRestaurant, deleteRestaurant } from '../utils/restaurantManager';
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { restaurants as defaultRestaurants } from "../store/restaurants";

/**
 * ============================================================================
 * DATABASE STRUCTURE
 * ============================================================================
 * 
 * Collection: "restaurants"
 * Document ID: Can be custom (e.g., "restaurant_1") or auto-generated
 * 
 * Document Structure:
 * {
 *   name: string (required) - Restaurant/Menu name (e.g., "Biryani", "Karahi")
 *   seats: number (optional) - Number of seats available
 *   image: string (required) - URL to restaurant image
 *   address: string (required) - Restaurant address
 *   restaurantTiming: {
 *     opening: string (required) - Opening time (e.g., "12:00")
 *     closing: string (required) - Closing time (e.g., "00:30")
 *   },
 *   opening: string (optional) - Alternative to restaurantTiming.opening
 *   closing: string (optional) - Alternative to restaurantTiming.closing
 *   createdAt: string (optional) - ISO timestamp
 *   updatedAt: string (optional) - ISO timestamp
 * }
 */

/**
 * Upload all restaurants from restaurants.js to Firebase
 * This will add or update restaurants in the database
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.overwrite - If true, overwrites existing restaurants (default: false)
 * @param {boolean} options.skipExisting - If true, skips restaurants that already exist (default: true)
 * @param {Array} options.restaurants - Custom restaurant array (default: uses restaurants.js)
 * @returns {Promise<Object>} - Upload statistics
 */
export const uploadAllRestaurants = async (options = {}) => {
  const {
    overwrite = false,
    skipExisting = true,
    restaurants = defaultRestaurants,
  } = options;

  console.log("🚀 Starting restaurant upload to Firebase...");
  console.log(`📊 Total restaurants to upload: ${restaurants.length}`);

  let successCount = 0;
  let updateCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const errors = [];

  try {
    // First, get all existing restaurants to check for duplicates
    const existingRestaurants = new Map();
    if (skipExisting || overwrite) {
      const existingSnapshot = await getDocs(collection(db, "restaurants"));
      existingSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.name) {
          existingRestaurants.set(data.name.toLowerCase(), {
            id: docSnap.id,
            data: docSnap.data(),
          });
        }
      });
      console.log(`📋 Found ${existingRestaurants.size} existing restaurants in database`);
    }

    // Process each restaurant
    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];
      const restaurantName = restaurant.name?.toLowerCase();

      try {
        // Check if restaurant already exists
        const existing = existingRestaurants.get(restaurantName);

        if (existing && skipExisting && !overwrite) {
          // Skip existing restaurant
          console.log(`⏭️  Skipping "${restaurant.name}" (already exists)`);
          skipCount++;
          continue;
        }

        // Prepare restaurant data with timestamps
        const restaurantData = {
          ...restaurant,
          updatedAt: new Date().toISOString(),
        };

        // Add createdAt only for new restaurants
        if (!existing || overwrite) {
          restaurantData.createdAt = existing?.data?.createdAt || new Date().toISOString();
        } else {
          restaurantData.createdAt = existing.data.createdAt;
        }

        // Determine document ID
        let docId;
        if (existing && overwrite) {
          // Update existing restaurant
          docId = existing.id;
        } else if (existing) {
          // Update existing restaurant (even if skipExisting was true, we might update)
          docId = existing.id;
        } else {
          // New restaurant - use name-based ID or auto-generate
          docId = `restaurant_${i + 1}`;
        }

        // Save to Firebase
        await setDoc(doc(collection(db, "restaurants"), docId), restaurantData, {
          merge: !overwrite, // Merge if not overwriting
        });

        if (existing && overwrite) {
          console.log(`✅ Updated "${restaurant.name}" (ID: ${docId})`);
          updateCount++;
        } else if (existing) {
          console.log(`✅ Updated "${restaurant.name}" (ID: ${docId})`);
          updateCount++;
        } else {
          console.log(`✅ Added "${restaurant.name}" (ID: ${docId})`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing "${restaurant.name}":`, error);
        errors.push({ restaurant: restaurant.name, error: error.message });
        errorCount++;
      }
    }

    // Print summary
    console.log("\n" + "=".repeat(50));
    console.log("📊 UPLOAD SUMMARY");
    console.log("=".repeat(50));
    console.log(`✅ Added: ${successCount}`);
    console.log(`🔄 Updated: ${updateCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log("=".repeat(50));

    if (errors.length > 0) {
      console.log("\n❌ ERRORS:");
      errors.forEach((err) => {
        console.log(`  - ${err.restaurant}: ${err.error}`);
      });
    }

    return {
      success: true,
      added: successCount,
      updated: updateCount,
      skipped: skipCount,
      errors: errorCount,
      errorDetails: errors,
    };
  } catch (error) {
    console.error("❌ Fatal error during upload:", error);
    return {
      success: false,
      error: error.message,
      added: successCount,
      updated: updateCount,
      skipped: skipCount,
      errors: errorCount,
      errorDetails: errors,
    };
  }
};

/**
 * Add a new restaurant to Firebase
 * 
 * @param {Object} restaurantData - Restaurant data object
 * @param {string} restaurantData.name - Restaurant name (required)
 * @param {string} restaurantData.image - Image URL (required)
 * @param {string} restaurantData.address - Address (required)
 * @param {Object|string} restaurantData.restaurantTiming - Timing object or opening time string
 * @param {string} customId - Optional custom document ID (default: auto-generated)
 * @returns {Promise<Object>} - Result object with success status and document ID
 */
export const addRestaurant = async (restaurantData, customId = null) => {
  try {
    // Validate required fields
    if (!restaurantData.name) {
      throw new Error("Restaurant name is required");
    }
    if (!restaurantData.image) {
      throw new Error("Restaurant image URL is required");
    }
    if (!restaurantData.address) {
      throw new Error("Restaurant address is required");
    }

    // Check if restaurant with same name already exists
    const existingQuery = query(
      collection(db, "restaurants"),
      where("name", "==", restaurantData.name)
    );
    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      throw new Error(`Restaurant with name "${restaurantData.name}" already exists`);
    }

    // Prepare data
    const dataToSave = {
      ...restaurantData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Use custom ID or generate one
    const docId = customId || `restaurant_${Date.now()}`;

    // Save to Firebase
    await setDoc(doc(collection(db, "restaurants"), docId), dataToSave);

    console.log(`✅ Restaurant "${restaurantData.name}" added successfully (ID: ${docId})`);

    return {
      success: true,
      id: docId,
      message: "Restaurant added successfully",
    };
  } catch (error) {
    console.error("❌ Error adding restaurant:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update an existing restaurant in Firebase
 * 
 * @param {string} restaurantId - Document ID of the restaurant
 * @param {Object} updateData - Data to update (partial object allowed)
 * @returns {Promise<Object>} - Result object with success status
 */
export const updateRestaurant = async (restaurantId, updateData) => {
  try {
    // Check if restaurant exists
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
      throw new Error(`Restaurant with ID "${restaurantId}" not found`);
    }

    // Prepare update data
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // Update in Firebase
    await updateDoc(restaurantRef, dataToUpdate);

    console.log(`✅ Restaurant "${restaurantId}" updated successfully`);

    return {
      success: true,
      message: "Restaurant updated successfully",
    };
  } catch (error) {
    console.error("❌ Error updating restaurant:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update a restaurant by name (finds restaurant and updates it)
 * 
 * @param {string} restaurantName - Name of the restaurant
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Result object with success status
 */
export const updateRestaurantByName = async (restaurantName, updateData) => {
  try {
    // Find restaurant by name
    const restaurantQuery = query(
      collection(db, "restaurants"),
      where("name", "==", restaurantName)
    );
    const snapshot = await getDocs(restaurantQuery);

    if (snapshot.empty) {
      throw new Error(`Restaurant "${restaurantName}" not found`);
    }

    if (snapshot.size > 1) {
      console.warn(`⚠️  Multiple restaurants found with name "${restaurantName}". Updating first one.`);
    }

    const restaurantDoc = snapshot.docs[0];
    return await updateRestaurant(restaurantDoc.id, updateData);
  } catch (error) {
    console.error("❌ Error updating restaurant by name:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete a restaurant from Firebase
 * 
 * @param {string} restaurantId - Document ID of the restaurant
 * @returns {Promise<Object>} - Result object with success status
 */
export const deleteRestaurant = async (restaurantId) => {
  try {
    // Check if restaurant exists
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
      throw new Error(`Restaurant with ID "${restaurantId}" not found`);
    }

    // Delete from Firebase
    await deleteDoc(restaurantRef);

    console.log(`✅ Restaurant "${restaurantId}" deleted successfully`);

    return {
      success: true,
      message: "Restaurant deleted successfully",
    };
  } catch (error) {
    console.error("❌ Error deleting restaurant:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get a restaurant by ID
 * 
 * @param {string} restaurantId - Document ID
 * @returns {Promise<Object|null>} - Restaurant data or null if not found
 */
export const getRestaurant = async (restaurantId) => {
  try {
    const restaurantRef = doc(db, "restaurants", restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (!restaurantSnap.exists()) {
      return null;
    }

    return {
      id: restaurantSnap.id,
      ...restaurantSnap.data(),
    };
  } catch (error) {
    console.error("❌ Error fetching restaurant:", error);
    return null;
  }
};

/**
 * Get all restaurants from Firebase
 * 
 * @returns {Promise<Array>} - Array of all restaurants
 */
export const getAllRestaurants = async () => {
  try {
    const snapshot = await getDocs(collection(db, "restaurants"));
    const restaurants = [];

    snapshot.forEach((doc) => {
      restaurants.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log(`✅ Fetched ${restaurants.length} restaurants`);
    return restaurants;
  } catch (error) {
    console.error("❌ Error fetching restaurants:", error);
    return [];
  }
};

/**
 * Get restaurant by name
 * 
 * @param {string} restaurantName - Restaurant name
 * @returns {Promise<Object|null>} - Restaurant data or null if not found
 */
export const getRestaurantByName = async (restaurantName) => {
  try {
    const restaurantQuery = query(
      collection(db, "restaurants"),
      where("name", "==", restaurantName)
    );
    const snapshot = await getDocs(restaurantQuery);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error("❌ Error fetching restaurant by name:", error);
    return null;
  }
};

// Export default for convenience
export default {
  uploadAllRestaurants,
  addRestaurant,
  updateRestaurant,
  updateRestaurantByName,
  deleteRestaurant,
  getRestaurant,
  getAllRestaurants,
  getRestaurantByName,
};

