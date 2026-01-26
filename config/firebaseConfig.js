// // // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // // import { getAnalytics } from "firebase/analytics";
// // // TODO: Add SDKs for Firebase products that you want to use
// // // https://firebase.google.com/docs/web/setup#available-libraries
// // import { getFirestore } from 'firebase/firestore'
// // // Your web app's Firebase configuration
// // // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// // const firebaseConfig = {
// //   apiKey: "AIzaSyDtmNohl3gs9fm1CwbYgiTdXQ0JE_e_fCE",
// //   authDomain: "dine-time-61d3d.firebaseapp.com",
// //   projectId: "dine-time-61d3d",
// //   storageBucket: "dine-time-61d3d.firebasestorage.app",
// //   messagingSenderId: "730438339686",
// //   appId: "1:730438339686:web:c4553534ce8dd46a5cb1a7",
// //   measurementId: "G-Q3ZV4SMDZ7"
// // };

// // // Initialize Firebase
// // export const app = initializeApp(firebaseConfig);
// // export const db= getFirestore(app);
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";


// const firebaseConfig = {
//   apiKey: "AIzaSyDtmNohl3gs9fm1CwbYgiTdXQ0JE_e_fCE",
//   authDomain: "dine-time-61d3d.firebaseapp.com",
//   projectId: "dine-time-61d3d",
//   storageBucket: "dine-time-61d3d.firebasestorage.app",
//   messagingSenderId: "730438339686",
//   appId: "1:730438339686:web:c4553534ce8dd46a5cb1a7",
//   measurementId: "G-Q3ZV4SMDZ7"
// };


// let app;
// if (getApps().length === 0) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApp();
// }

// // Initialize Auth with AsyncStorage persistence
// let auth;
// try {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
//   });
// } catch (error) {
//   // If auth is already initialized, get the existing instance
//   auth = getAuth(app);
// }

// // Initialize Firestore
// const db = getFirestore(app);

// export { auth, db };
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDtmNohl3gs9fm1CwbYgiTdXQ0JE_e_fCE",
  authDomain: "dine-time-61d3d.firebaseapp.com",
  projectId: "dine-time-61d3d",
  storageBucket: "dine-time-61d3d.firebasestorage.app",
  messagingSenderId: "730438339686",
  appId: "1:730438339686:web:c4553534ce8dd46a5cb1a7",
  measurementId: "G-Q3ZV4SMDZ7"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth with AsyncStorage persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // If auth is already initialized, get the existing instance
  auth = getAuth(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };

/**
 * ============================================================================
 * FIRESTORE INDEX SETUP INSTRUCTIONS
 * ============================================================================
 * 
 * Your app needs a composite index for the orders query to work efficiently.
 * The app will work without it (using fallback), but performance will be better with the index.
 * 
 * OPTION 1 - AUTOMATIC (RECOMMENDED):
 * 1. Click this link (or copy the URL from the error log):
 *    https://console.firebase.google.com/v1/r/project/dine-time-61d3d/firestore/indexes?create_composite=Ck5wcm9qZWN0cy9kaW5lLXRpbWUtNjFkM2QvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL29yZGVycy9pbmRleGVzL18QARoJCgVlbWFpbBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI
 * 
 * 2. Click "Create Index"
 * 3. Wait 2-5 minutes for the index to build
 * 4. Restart your app
 * 
 * OPTION 2 - MANUAL:
 * 1. Go to Firebase Console: https://console.firebase.google.com
 * 2. Select your project: dine-time-61d3d
 * 3. Go to Firestore Database
 * 4. Click on "Indexes" tab
 * 5. Click "Create Index"
 * 6. Set up the index as follows:
 *    - Collection ID: orders
 *    - Fields to index:
 *      * email (Ascending)
 *      * createdAt (Descending)
 *    - Query scope: Collection
 * 7. Click "Create"
 * 8. Wait for the index to build (2-5 minutes)
 * 
 * OPTION 3 - USING FIREBASE CLI:
 * Add this to your firestore.indexes.json file:
 * 
 * {
 *   "indexes": [
 *     {
 *       "collectionGroup": "orders",
 *       "queryScope": "COLLECTION",
 *       "fields": [
 *         { "fieldPath": "email", "order": "ASCENDING" },
 *         { "fieldPath": "createdAt", "order": "DESCENDING" }
 *       ]
 *     }
 *   ]
 * }
 * 
 * Then run: firebase deploy --only firestore:indexes
 * 
 * ============================================================================
 */

/**
 * ============================================================================
 * FIREBASE MENU HELPER
 * ============================================================================
 * 
 * This section contains helper functions and example data structure for menu items.
 * 
 * MENU ITEM STRUCTURE IN FIRESTORE:
 * Collection: "menu"
 * Document structure:
 * {
 *   restaurantId: "restaurant_document_id",
 *   restaurantName: "Restaurant Name",
 *   name: "Dish Name",
 *   description: "Dish description",
 *   price: 15.99,
 *   category: "Appetizers" | "Main Course" | "Desserts" | "Beverages",
 *   image: "https://image-url.com/image.jpg",
 *   available: true,
 *   createdAt: "2024-01-01T00:00:00.000Z"
 * }
 */

export const exampleMenuItems = [
  {
    restaurantId: "your_restaurant_doc_id_here",
    restaurantName: "PathanAfghan Restaurant",
    name: "Chicken Kebab",
    description: "Grilled chicken marinated in special spices",
    price: 18.99,
    category: "Main Course",
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
    available: true,
  },
  {
    restaurantId: "your_restaurant_doc_id_here",
    restaurantName: "PathanAfghan Restaurant",
    name: "Beef Kebab",
    description: "Tender beef grilled to perfection",
    price: 22.99,
    category: "Main Course",
    image: "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg",
    available: true,
  },
  {
    restaurantId: "your_restaurant_doc_id_here",
    restaurantName: "PathanAfghan Restaurant",
    name: "Hummus",
    description: "Creamy chickpea dip with olive oil",
    price: 8.99,
    category: "Appetizers",
    image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
    available: true,
  },
  {
    restaurantId: "your_restaurant_doc_id_here",
    restaurantName: "PathanAfghan Restaurant",
    name: "Baklava",
    description: "Sweet pastry with honey and nuts",
    price: 6.99,
    category: "Desserts",
    image: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg",
    available: true,
  },
  {
    restaurantId: "your_restaurant_doc_id_here",
    restaurantName: "PathanAfghan Restaurant",
    name: "Mint Tea",
    description: "Traditional mint tea",
    price: 3.99,
    category: "Beverages",
    image: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg",
    available: true,
  },
];

/**
 * Helper function to upload menu items to Firestore
 * Usage:
 * 
 * import { uploadMenuItems } from '../config/firebaseConfig';
 * 
 * // In your component or script:
 * const handleUpload = async () => {
 *   await uploadMenuItems(exampleMenuItems);
 * };
 */
export const uploadMenuItems = async (items) => {
  const { collection, addDoc } = await import("firebase/firestore");
  
  console.log("Starting menu items upload...");
  let successCount = 0;
  let errorCount = 0;

  for (const item of items) {
    try {
      await addDoc(collection(db, "menu"), {
        ...item,
        createdAt: new Date().toISOString(),
      });
      console.log(`✓ Added ${item.name}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error adding ${item.name}:`, error);
      errorCount++;
    }
  }

  console.log(`\nUpload complete: ${successCount} successful, ${errorCount} failed`);
  return { successCount, errorCount };
};

/**
 * ============================================================================
 * ORDER STRUCTURE IN FIRESTORE
 * ============================================================================
 * 
 * Collection: "orders"
 * Document structure:
 * {
 *   email: "user@example.com",
 *   restaurantId: "restaurant_doc_id",
 *   restaurantName: "Restaurant Name",
 *   items: [
 *     {
 *       id: "item_id",
 *       name: "Item Name",
 *       price: 15.99,
 *       quantity: 2
 *     }
 *   ],
 *   totalAmount: 31.98,
 *   status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled",
 *   address: "Delivery address",
 *   phoneNumber: "+1234567890",
 *   deliveryDriver: "Driver Name", // Optional
 *   trackingNumber: "TRK123456", // Optional
 *   createdAt: "2024-01-01T00:00:00.000Z",
 *   updatedAt: "2024-01-01T00:00:00.000Z"
 * }
 * 
 * IMPORTANT: Make sure to create the composite index mentioned above for optimal performance!
 */