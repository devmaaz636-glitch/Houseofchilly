# 🍽️ Restaurant Management Guide

This guide explains how to manage restaurants in the Firebase database.

## 📋 Table of Contents
1. [Database Structure](#database-structure)
2. [Quick Start](#quick-start)
3. [Usage Examples](#usage-examples)
4. [API Reference](#api-reference)

---

## 📊 Database Structure

### Firebase Collection: `restaurants`

Each document represents a restaurant/menu category.

**Document Structure:**
```javascript
{
  name: "Biryani",                    // Required: Restaurant/Menu name
  seats: 70,                          // Optional: Number of seats
  image: "https://...",               // Required: Image URL
  address: "Main Service Rd E...",    // Required: Address
  restaurantTiming: {                 // Required: Timing object
    opening: "12:00",
    closing: "00:30"
  },
  // Alternative (also supported):
  opening: "12:00",                   // Alternative timing format
  closing: "00:30",
  createdAt: "2024-01-01T00:00:00Z",  // Auto-added: Creation timestamp
  updatedAt: "2024-01-01T00:00:00Z"   // Auto-added: Update timestamp
}
```

---

## 🚀 Quick Start

### 1. Import the Utility

```javascript
import restaurantManager from '../utils/restaurantManager';
// OR import specific functions:
import { 
  uploadAllRestaurants, 
  addRestaurant, 
  updateRestaurant 
} from '../utils/restaurantManager';
```

### 2. Upload All Restaurants

Upload all restaurants from `restaurants.js` to Firebase:

```javascript
// Upload all restaurants (skips existing)
const result = await restaurantManager.uploadAllRestaurants();

// Upload and overwrite existing
const result = await restaurantManager.uploadAllRestaurants({
  overwrite: true,
  skipExisting: false
});
```

---

## 💡 Usage Examples

### Example 1: Upload All Restaurants (One-Time Setup)

**Create a script file:** `scripts/uploadRestaurants.js`

```javascript
import { uploadAllRestaurants } from '../utils/restaurantManager';

const uploadRestaurants = async () => {
  console.log('Starting restaurant upload...');
  
  const result = await uploadAllRestaurants({
    overwrite: false,      // Don't overwrite existing
    skipExisting: true,    // Skip restaurants that already exist
  });
  
  if (result.success) {
    console.log('✅ Upload complete!');
    console.log(`Added: ${result.added}`);
    console.log(`Updated: ${result.updated}`);
    console.log(`Skipped: ${result.skipped}`);
  } else {
    console.error('❌ Upload failed:', result.error);
  }
};

uploadRestaurants();
```

**Run it:**
```bash
# If using Node.js
node scripts/uploadRestaurants.js

# Or in your React Native app, call it from a button/function
```

---

### Example 2: Add a New Restaurant (Admin Panel)

```javascript
import { addRestaurant } from '../utils/restaurantManager';

const handleAddRestaurant = async () => {
  const newRestaurant = {
    name: "Pizza",
    seats: 50,
    image: "https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg",
    address: "123 Main Street, City",
    restaurantTiming: {
      opening: "11:00",
      closing: "23:00"
    }
  };

  const result = await addRestaurant(newRestaurant);
  
  if (result.success) {
    Alert.alert('Success', `Restaurant added! ID: ${result.id}`);
  } else {
    Alert.alert('Error', result.error);
  }
};
```

---

### Example 3: Update Restaurant Details

```javascript
import { updateRestaurant, updateRestaurantByName } from '../utils/restaurantManager';

// Update by ID
const handleUpdateById = async () => {
  const result = await updateRestaurant('restaurant_1', {
    seats: 100,
    address: 'New Address',
    restaurantTiming: {
      opening: '10:00',
      closing: '22:00'
    }
  });
  
  if (result.success) {
    console.log('Restaurant updated!');
  }
};

// Update by name (easier if you don't know the ID)
const handleUpdateByName = async () => {
  const result = await updateRestaurantByName('Biryani', {
    seats: 80,
    image: 'https://new-image-url.com/image.jpg'
  });
  
  if (result.success) {
    console.log('Restaurant updated!');
  }
};
```

---

### Example 4: Delete a Restaurant

```javascript
import { deleteRestaurant } from '../utils/restaurantManager';

const handleDelete = async () => {
  // Confirm deletion
  Alert.alert(
    'Delete Restaurant',
    'Are you sure you want to delete this restaurant?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteRestaurant('restaurant_1');
          if (result.success) {
            Alert.alert('Success', 'Restaurant deleted');
          } else {
            Alert.alert('Error', result.error);
          }
        }
      }
    ]
  );
};
```

---

### Example 5: Fetch Restaurants

```javascript
import { getAllRestaurants, getRestaurant, getRestaurantByName } from '../utils/restaurantManager';

// Get all restaurants
const loadAllRestaurants = async () => {
  const restaurants = await getAllRestaurants();
  console.log(`Found ${restaurants.length} restaurants`);
  return restaurants;
};

// Get single restaurant by ID
const loadRestaurant = async () => {
  const restaurant = await getRestaurant('restaurant_1');
  if (restaurant) {
    console.log('Restaurant:', restaurant);
  }
};

// Get restaurant by name
const loadByName = async () => {
  const restaurant = await getRestaurantByName('Biryani');
  if (restaurant) {
    console.log('Found:', restaurant);
  }
};
```

---

### Example 6: Create an Admin Panel Component

**File:** `app/admin/manage-restaurants.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  uploadAllRestaurants, 
  addRestaurant, 
  updateRestaurant, 
  deleteRestaurant,
  getAllRestaurants 
} from '../../utils/restaurantManager';

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    const data = await getAllRestaurants();
    setRestaurants(data);
    setLoading(false);
  };

  const handleUploadAll = async () => {
    Alert.alert(
      'Upload All Restaurants',
      'This will upload all restaurants from restaurants.js to Firebase.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upload',
          onPress: async () => {
            setLoading(true);
            const result = await uploadAllRestaurants();
            setLoading(false);
            
            if (result.success) {
              Alert.alert('Success', 
                `Uploaded: ${result.added}\nUpdated: ${result.updated}\nSkipped: ${result.skipped}`
              );
              loadRestaurants();
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  const handleDelete = async (id, name) => {
    Alert.alert(
      'Delete Restaurant',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteRestaurant(id);
            if (result.success) {
              Alert.alert('Success', 'Restaurant deleted');
              loadRestaurants();
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <ScrollView className="p-4">
        <Text className="text-3xl text-white font-bold mb-4">Manage Restaurants</Text>
        
        <TouchableOpacity
          onPress={handleUploadAll}
          className="bg-[#f49b33] p-4 rounded-lg mb-4"
        >
          <Text className="text-white text-center font-bold">
            Upload All Restaurants
          </Text>
        </TouchableOpacity>

        <Text className="text-xl text-white mb-2">Total: {restaurants.length}</Text>

        {restaurants.map((restaurant) => (
          <View key={restaurant.id} className="bg-[#474747] p-4 rounded-lg mb-2">
            <Text className="text-white text-lg font-bold">{restaurant.name}</Text>
            <Text className="text-white/70 text-sm">{restaurant.address}</Text>
            <TouchableOpacity
              onPress={() => handleDelete(restaurant.id, restaurant.name)}
              className="bg-red-500 p-2 rounded mt-2"
            >
              <Text className="text-white text-center">Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## 📚 API Reference

### `uploadAllRestaurants(options)`

Upload all restaurants from `restaurants.js` to Firebase.

**Parameters:**
- `options.overwrite` (boolean, default: `false`) - Overwrite existing restaurants
- `options.skipExisting` (boolean, default: `true`) - Skip restaurants that already exist
- `options.restaurants` (Array, default: from `restaurants.js`) - Custom restaurant array

**Returns:** `Promise<Object>`
```javascript
{
  success: boolean,
  added: number,
  updated: number,
  skipped: number,
  errors: number,
  errorDetails: Array
}
```

---

### `addRestaurant(restaurantData, customId)`

Add a new restaurant to Firebase.

**Parameters:**
- `restaurantData` (Object) - Restaurant data
- `customId` (string, optional) - Custom document ID

**Returns:** `Promise<Object>`
```javascript
{
  success: boolean,
  id: string,        // Document ID
  message?: string,
  error?: string
}
```

---

### `updateRestaurant(restaurantId, updateData)`

Update an existing restaurant by ID.

**Parameters:**
- `restaurantId` (string) - Document ID
- `updateData` (Object) - Data to update (partial object)

**Returns:** `Promise<Object>`

---

### `updateRestaurantByName(restaurantName, updateData)`

Update an existing restaurant by name.

**Parameters:**
- `restaurantName` (string) - Restaurant name
- `updateData` (Object) - Data to update

**Returns:** `Promise<Object>`

---

### `deleteRestaurant(restaurantId)`

Delete a restaurant from Firebase.

**Parameters:**
- `restaurantId` (string) - Document ID

**Returns:** `Promise<Object>`

---

### `getRestaurant(restaurantId)`

Get a single restaurant by ID.

**Parameters:**
- `restaurantId` (string) - Document ID

**Returns:** `Promise<Object|null>`

---

### `getAllRestaurants()`

Get all restaurants from Firebase.

**Returns:** `Promise<Array>`

---

### `getRestaurantByName(restaurantName)`

Get a restaurant by name.

**Parameters:**
- `restaurantName` (string) - Restaurant name

**Returns:** `Promise<Object|null>`

---

## 🔥 Firebase Console

You can also manage restaurants directly in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `dine-time-61d3d`
3. Go to **Firestore Database**
4. Open the `restaurants` collection
5. Add, edit, or delete documents manually

---

## ⚠️ Important Notes

1. **Duplicate Prevention:** The system checks for duplicate restaurant names (case-insensitive)
2. **Timestamps:** `createdAt` and `updatedAt` are automatically managed
3. **Error Handling:** All functions return success/error objects for easy error handling
4. **Validation:** Required fields are validated before saving
5. **Case Sensitivity:** Restaurant name matching is case-insensitive

---

## 🎯 Best Practices

1. **Use IDs for Updates:** Use document IDs for updates when possible (faster)
2. **Batch Operations:** For multiple operations, consider Firebase batch writes
3. **Error Handling:** Always check `result.success` before proceeding
4. **Backup:** Export data regularly from Firebase Console
5. **Validation:** Validate data on both client and server side

---

## 🆘 Troubleshooting

### Error: "Restaurant with name already exists"
- Use `updateRestaurantByName()` instead of `addRestaurant()`
- Or check existing restaurants first with `getRestaurantByName()`

### Error: "Restaurant not found"
- Check if the document ID is correct
- Use `getAllRestaurants()` to see all available restaurants

### Upload is slow
- This is normal for large datasets
- Consider using batch operations for better performance

---

## 📞 Support

For issues or questions, check the code comments in `utils/restaurantManager.js` or refer to Firebase documentation.

