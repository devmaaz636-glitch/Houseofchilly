/**
 * EXAMPLE USAGE OF RESTAURANT MANAGER
 * 
 * This file shows practical examples of how to use the restaurant manager
 * in your React Native app. Copy these examples into your components.
 */

import { 
  uploadAllRestaurants,
  addRestaurant,
  updateRestaurant,
  updateRestaurantByName,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurant,
  getRestaurantByName
} from './restaurantManager';
import { Alert } from 'react-native';

// ============================================================================
// EXAMPLE 1: Upload All Restaurants (One-Time Setup)
// ============================================================================
export const exampleUploadAllRestaurants = async () => {
  try {
    // Show loading indicator
    console.log('Starting upload...');
    
    // Upload all restaurants (skips existing ones)
    const result = await uploadAllRestaurants({
      overwrite: false,      // Don't overwrite existing
      skipExisting: true,    // Skip if already exists
    });
    
    if (result.success) {
      Alert.alert(
        'Upload Complete',
        `✅ Added: ${result.added}\n` +
        `🔄 Updated: ${result.updated}\n` +
        `⏭️  Skipped: ${result.skipped}\n` +
        `❌ Errors: ${result.errors}`
      );
    } else {
      Alert.alert('Upload Failed', result.error || 'Unknown error');
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

// ============================================================================
// EXAMPLE 2: Add New Restaurant (Admin Form)
// ============================================================================
export const exampleAddRestaurant = async () => {
  const newRestaurant = {
    name: "Pizza Palace",
    seats: 50,
    image: "https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg",
    address: "123 Main Street, Islamabad",
    restaurantTiming: {
      opening: "11:00",
      closing: "23:00"
    }
  };

  const result = await addRestaurant(newRestaurant);
  
  if (result.success) {
    Alert.alert('Success', `Restaurant "${newRestaurant.name}" added!`);
    console.log('Restaurant ID:', result.id);
  } else {
    Alert.alert('Error', result.error);
  }
};

// ============================================================================
// EXAMPLE 3: Update Restaurant (Settings/Edit Screen)
// ============================================================================
export const exampleUpdateRestaurant = async () => {
  // Update by ID (recommended - faster)
  const result = await updateRestaurant('restaurant_1', {
    seats: 100,
    address: 'New Address, Islamabad',
    restaurantTiming: {
      opening: '10:00',
      closing: '22:00'
    }
  });
  
  if (result.success) {
    Alert.alert('Success', 'Restaurant updated!');
  } else {
    Alert.alert('Error', result.error);
  }

  // OR update by name (easier if you don't know the ID)
  const resultByName = await updateRestaurantByName('Biryani', {
    seats: 80,
    image: 'https://new-image-url.com/image.jpg'
  });
  
  if (resultByName.success) {
    Alert.alert('Success', 'Restaurant updated!');
  }
};

// ============================================================================
// EXAMPLE 4: Delete Restaurant (Admin Panel)
// ============================================================================
export const exampleDeleteRestaurant = async (restaurantId, restaurantName) => {
  Alert.alert(
    'Delete Restaurant',
    `Are you sure you want to delete "${restaurantName}"? This action cannot be undone.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const result = await deleteRestaurant(restaurantId);
          
          if (result.success) {
            Alert.alert('Success', 'Restaurant deleted successfully');
            // Refresh your restaurant list here
          } else {
            Alert.alert('Error', result.error);
          }
        }
      }
    ]
  );
};

// ============================================================================
// EXAMPLE 5: Fetch and Display All Restaurants
// ============================================================================
export const exampleLoadRestaurants = async () => {
  try {
    const restaurants = await getAllRestaurants();
    console.log(`Found ${restaurants.length} restaurants:`);
    
    restaurants.forEach((restaurant) => {
      console.log(`- ${restaurant.name} (${restaurant.id})`);
    });
    
    return restaurants;
  } catch (error) {
    console.error('Error loading restaurants:', error);
    Alert.alert('Error', 'Failed to load restaurants');
    return [];
  }
};

// ============================================================================
// EXAMPLE 6: Get Single Restaurant (Restaurant Detail Page)
// ============================================================================
export const exampleLoadSingleRestaurant = async (restaurantId) => {
  // By ID
  const restaurant = await getRestaurant(restaurantId);
  
  if (restaurant) {
    console.log('Restaurant details:', restaurant);
    return restaurant;
  } else {
    Alert.alert('Not Found', 'Restaurant not found');
    return null;
  }

  // OR by name
  const restaurantByName = await getRestaurantByName('Biryani');
  if (restaurantByName) {
    console.log('Found:', restaurantByName);
  }
};

// ============================================================================
// EXAMPLE 7: Complete Admin Panel Function
// ============================================================================
export const exampleAdminPanel = async () => {
  // 1. Load all restaurants
  const restaurants = await getAllRestaurants();
  console.log('Current restaurants:', restaurants.length);
  
  // 2. Add a new restaurant
  const addResult = await addRestaurant({
    name: "Test Restaurant",
    seats: 30,
    image: "https://example.com/image.jpg",
    address: "Test Address",
    restaurantTiming: { opening: "09:00", closing: "21:00" }
  });
  
  // 3. Update if it already exists
  if (!addResult.success && addResult.error?.includes('already exists')) {
    await updateRestaurantByName("Test Restaurant", {
      seats: 40,
      address: "Updated Address"
    });
  }
  
  // 4. Reload and verify
  const updatedRestaurants = await getAllRestaurants();
  console.log('Updated count:', updatedRestaurants.length);
};

// ============================================================================
// EXAMPLE 8: Button Handler in React Component
// ============================================================================
export const exampleComponentUsage = () => {
  // In your component:
  
  // const [restaurants, setRestaurants] = useState([]);
  // const [loading, setLoading] = useState(false);
  
  // const handleUpload = async () => {
  //   setLoading(true);
  //   const result = await uploadAllRestaurants();
  //   setLoading(false);
  //   
  //   if (result.success) {
  //     Alert.alert('Success', 'All restaurants uploaded!');
  //     // Refresh your list
  //     const updated = await getAllRestaurants();
  //     setRestaurants(updated);
  //   }
  // };
  
  // const handleDelete = async (id, name) => {
  //   Alert.alert(
  //     'Delete',
  //     `Delete ${name}?`,
  //     [
  //       { text: 'Cancel' },
  //       {
  //         text: 'Delete',
  //         onPress: async () => {
  //           const result = await deleteRestaurant(id);
  //           if (result.success) {
  //             const updated = await getAllRestaurants();
  //             setRestaurants(updated);
  //           }
  //         }
  //       }
  //     ]
  //   );
  // };
  
  // return (
  //   <View>
  //     <Button title="Upload All" onPress={handleUpload} />
  //     {restaurants.map(r => (
  //       <Button 
  //         key={r.id} 
  //         title={`Delete ${r.name}`} 
  //         onPress={() => handleDelete(r.id, r.name)} 
  //       />
  //     ))}
  //   </View>
  // );
};

// ============================================================================
// EXAMPLE 9: Batch Operations
// ============================================================================
export const exampleBatchOperations = async () => {
  const restaurantsToUpdate = [
    { name: 'Biryani', seats: 75 },
    { name: 'Karahi', seats: 60 },
    { name: 'Handi', seats: 100 }
  ];
  
  // Update multiple restaurants
  const updatePromises = restaurantsToUpdate.map(async (restaurant) => {
    return await updateRestaurantByName(restaurant.name, {
      seats: restaurant.seats
    });
  });
  
  const results = await Promise.all(updatePromises);
  
  const successCount = results.filter(r => r.success).length;
  console.log(`Updated ${successCount} out of ${restaurantsToUpdate.length} restaurants`);
};

// Export all examples for easy access
export default {
  exampleUploadAllRestaurants,
  exampleAddRestaurant,
  exampleUpdateRestaurant,
  exampleDeleteRestaurant,
  exampleLoadRestaurants,
  exampleLoadSingleRestaurant,
  exampleAdminPanel,
  exampleBatchOperations,
};

