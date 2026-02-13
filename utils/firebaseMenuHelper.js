/**
 * Firebase Menu Helper
 * 
 * This file contains helper functions and example data structure for menu items in Firebase.
 * 
 * MENU ITEM STRUCTURE IN FIRESTORE:
 * Collection: "menu"
 * Document structure:
 * {
 *   restaurantId: "restaurant_document_id", // The ID of the restaurant document
 *   restaurantName: "Restaurant Name", // Name of the restaurant (optional, for easier querying)
 *   name: "Dish Name",
 *   description: "Dish description",
 *   price: 15.99, // Number
 *   category: "Appetizers", // Category like "Appetizers", "Main Course", "Desserts", "Beverages"
 *   image: "https://image-url.com/image.jpg", // Optional
 *   available: true, // Boolean - whether item is currently available
 *   createdAt: "2024-01-01T00:00:00.000Z" // ISO timestamp
 * }
 * 
 * Example menu items for bulk upload:
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
 * To upload menu items to Firebase, use this in your Firebase console or create a script:
 * 
 * import { collection, addDoc } from "firebase/firestore";
 * import { db } from "../config/firebaseConfig";
 * 
 * const uploadMenuItems = async () => {
 *   for (const item of exampleMenuItems) {
 *     try {
 *       await addDoc(collection(db, "menu"), {
 *         ...item,
 *         createdAt: new Date().toISOString()
 *       });
 *       console.log(`Added ${item.name}`);
 *     } catch (error) {
 *       console.error(`Error adding ${item.name}:`, error);
 *     }
 *   }
 * };
 * 
 * Make sure to:
 * 1. Replace "your_restaurant_doc_id_here" with the actual restaurant document ID
 * 2. Replace "PathanAfghan Restaurant" with the actual restaurant name
 * 3. Update the example items with real menu data
 */

