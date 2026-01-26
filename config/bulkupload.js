// config/bulkupload.js
// 
// LEGACY FILE - Use utils/restaurantManager.js instead for better functionality
// This file is kept for backward compatibility
//
import { uploadAllRestaurants } from "../utils/restaurantManager";

/**
 * @deprecated Use uploadAllRestaurants from utils/restaurantManager.js instead
 * 
 * Upload all restaurants to Firebase
 * 
 * Usage:
 * import uploadData from './config/bulkupload';
 * await uploadData();
 */
const uploadData = async () => {
  console.warn("⚠️  Using deprecated bulkupload.js. Consider using utils/restaurantManager.js instead.");
  
  const result = await uploadAllRestaurants({
    overwrite: false,
    skipExisting: true,
  });

  if (result.success) {
    console.log("Restaurants uploaded to Firebase ✅");
    console.log(`Added: ${result.added}, Updated: ${result.updated}, Skipped: ${result.skipped}`);
  } else {
    console.log("Upload error ❌", result.error);
  }
  
  return result;
};

export default uploadData;
