/**
 * MENU ITEMS CONFIGURATION
 * Menu items using assets images from local folder
 */

// Import images from assets
import royalsindhibiryani from '../assets/images/royalsindhibiryani.png';
import royalsindhibiryani2 from '../assets/images/royalsindhibiryani2.png';
import chickenwhitekarahi from '../assets/images/chickenwhitekarahi.png';
import chikenwhitekarahi from '../assets/images/chikenwhitekarahi.png';
import kabab from '../assets/images/kabab.png';
import kabab2 from '../assets/images/kabab2.png';
import logo from '../assets/images/logo.png';

import deliveryicon from '../assets/images/deliveryicon.png';
import locationicon from '../assets/images/locationicon.png';

// Carousel/Promotional banners
export const promotionalBanners = [
  {
    id: 'banner-1',
    title: '50% OFF TASTY HYDERABADI & SINDHI BIRYANI',
    image: royalsindhibiryani2,
    discount: 50,
    buttonText: 'ORDER NOW',
  },
];

// Menu categories
export const categories = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'cold-beverage', name: 'Cold Beverage', icon: '🥤' },
  { id: 'hot-beverages', name: 'Hot Beverages', icon: '☕' },
  { id: 'sushi', name: 'Sushi', icon: '🍣' },
  { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
  { id: 'lassi', name: 'Lassi', icon: '🥛' },
  { id: 'biryani', name: 'Biryani', icon: '🍛' },
  { id: 'karahi', name: 'Karahi', icon: '🍲' },
  { id: 'handi', name: 'Handi', icon: '🥘' },
  { id: 'roll-paratha', name: 'Roll Paratha', icon: '🌯' },
  { id: 'bbq', name: 'B.B.Q', icon: '🍖' },
  { id: 'chinese', name: 'Chinese', icon: '🥢' },
  { id: 'appetizer', name: 'Appetizer', icon: '🥗' },
  { id: 'sides', name: 'Sides', icon: '🍟' },
  { id: 'sandwiches', name: 'Sandwiches', icon: '🥪' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'soups', name: 'Soups', icon: '🍲' },
  { id: 'salads', name: 'Salads', icon: '🥬' },
  { id: 'tandoor', name: 'Tandoor', icon: '🔥' },
  { id: 'dessert', name: 'Dessert', icon: '🍰' },
];

// Menu items using assets images
export const menuItems = [
  // Biryani
  {
    id: 'royal-sindhi-biryani',
    name: 'Royal Sindhi Biryani',
    category: 'biryani',
    image: royalsindhibiryani,
    price: 18.99,
    description: 'Authentic Sindhi biryani with tender chicken and aromatic spices',
    featured: true, // Large card display
    available: true,
  },
  {
    id: 'special-biryani',
    name: 'Special Biryani',
    category: 'biryani',
    image: royalsindhibiryani2,
    price: 20.99,
    description: 'Special recipe biryani with extra spices',
    featured: false,
    available: true,
  },
  // Karahi
  {
    id: 'chicken-white-karahi',
    name: 'Chicken White Karahi',
    category: 'karahi',
    image: chickenwhitekarahi,
    price: 16.99,
    description: 'Creamy white karahi with tender chicken pieces',
    featured: false,
    available: true,
  },
  {
    id: 'chicken-karahi',
    name: 'Chicken Karahi',
    category: 'karahi',
    image: chikenwhitekarahi,
    price: 15.99,
    description: 'Traditional karahi with authentic flavors',
    featured: false,
    available: true,
  },
  // Kebab/Roll
  {
    id: 'bun-kebab-double-decker',
    name: 'Bun Kebab Double Decker',
    category: 'roll-paratha',
    image: kabab2,
    price: 12.99,
    description: 'Double layered bun with spicy kebab patties',
    featured: false,
    available: true,
  },
  {
    id: 'seekh-kebab',
    name: 'Seekh Kebab',
    category: 'bbq',
    image: kabab,
    price: 14.99,
    description: 'Grilled seekh kebabs with special marinade',
    featured: false,
    available: true,
  },
  // Cold Beverage
  {
    id: 'cold-drink-1',
    name: 'Cola',
    category: 'cold-beverage',
    image: logo,
    price: 2.99,
    description: 'Refreshing cola drink',
    featured: false,
    available: true,
  },
  {
    id: 'cold-drink-2',
    name: 'Orange Juice',
    category: 'cold-beverage',
    image: logo,
    price: 3.99,
    description: 'Fresh orange juice',
    featured: false,
    available: true,
  },
  // Hot Beverages
  {
    id: 'hot-drink-1',
    name: 'Green Tea',
    category: 'hot-beverages',
    image: logo,
    price: 2.49,
    description: 'Aromatic green tea',
    featured: false,
    available: true,
  },
  {
    id: 'hot-drink-2',
    name: 'Coffee',
    category: 'hot-beverages',
    image: logo,
    price: 3.49,
    description: 'Hot brewed coffee',
    featured: false,
    available: true,
  },
  // Breakfast
  {
    id: 'breakfast-1',
    name: 'Halwa Puri',
    category: 'breakfast',
    image: logo,
    price: 8.99,
    description: 'Traditional halwa puri breakfast',
    featured: false,
    available: true,
  },
  {
    id: 'breakfast-2',
    name: 'Paratha',
    category: 'breakfast',
    image: logo,
    price: 5.99,
    description: 'Crispy paratha with butter',
    featured: false,
    available: true,
  },
  // Lassi
  {
    id: 'lassi-1',
    name: 'Sweet Lassi',
    category: 'lassi',
    image: logo,
    price: 3.99,
    description: 'Traditional sweet lassi',
    featured: false,
    available: true,
  },
  {
    id: 'lassi-2',
    name: 'Salted Lassi',
    category: 'lassi',
    image: logo,
    price: 3.99,
    description: 'Refreshing salted lassi',
    featured: false,
    available: true,
  },
  // Handi
  {
    id: 'handi-1',
    name: 'Chicken Handi',
    category: 'handi',
    image: logo,
    price: 17.99,
    description: 'Delicious chicken handi',
    featured: false,
    available: true,
  },
  {
    id: 'handi-2',
    name: 'Mutton Handi',
    category: 'handi',
    image: logo,
    price: 22.99,
    description: 'Tender mutton handi',
    featured: false,
    available: true,
  },
  // Chinese
  {
    id: 'chinese-1',
    name: 'Chicken Chow Mein',
    category: 'chinese',
    image: logo,
    price: 12.99,
    description: 'Spicy chicken chow mein',
    featured: false,
    available: true,
  },
  {
    id: 'chinese-2',
    name: 'Fried Rice',
    category: 'chinese',
    image: logo,
    price: 11.99,
    description: 'Chinese fried rice',
    featured: false,
    available: true,
  },
  // Appetizer
  {
    id: 'appetizer-1',
    name: 'Spring Rolls',
    category: 'appetizer',
    image: logo,
    price: 6.99,
    description: 'Crispy spring rolls',
    featured: false,
    available: true,
  },
  {
    id: 'appetizer-2',
    name: 'Samosa',
    category: 'appetizer',
    image: logo,
    price: 4.99,
    description: 'Hot samosas',
    featured: false,
    available: true,
  },
  // Sandwiches
  {
    id: 'sandwich-1',
    name: 'Chicken Sandwich',
    category: 'sandwiches',
    image: logo,
    price: 7.99,
    description: 'Grilled chicken sandwich',
    featured: false,
    available: true,
  },
  {
    id: 'sandwich-2',
    name: 'Club Sandwich',
    category: 'sandwiches',
    image: logo,
    price: 9.99,
    description: 'Classic club sandwich',
    featured: false,
    available: true,
  },
  // Burgers
  {
    id: 'burger-1',
    name: 'Chicken Burger',
    category: 'burgers',
    image: logo,
    price: 8.99,
    description: 'Juicy chicken burger',
    featured: false,
    available: true,
  },
  {
    id: 'burger-2',
    name: 'Beef Burger',
    category: 'burgers',
    image: logo,
    price: 10.99,
    description: 'Classic beef burger',
    featured: false,
    available: true,
  },
  // Soups
  {
    id: 'soup-1',
    name: 'Chicken Soup',
    category: 'soups',
    image: logo,
    price: 5.99,
    description: 'Hot chicken soup',
    featured: false,
    available: true,
  },
  {
    id: 'soup-2',
    name: 'Vegetable Soup',
    category: 'soups',
    image: logo,
    price: 4.99,
    description: 'Healthy vegetable soup',
    featured: false,
    available: true,
  },
  // Salads
  {
    id: 'salad-1',
    name: 'Garden Salad',
    category: 'salads',
    image: logo,
    price: 6.99,
    description: 'Fresh garden salad',
    featured: false,
    available: true,
  },
  {
    id: 'salad-2',
    name: 'Caesar Salad',
    category: 'salads',
    image: logo,
    price: 7.99,
    description: 'Classic caesar salad',
    featured: false,
    available: true,
  },
  // Tandoor
  {
    id: 'tandoor-1',
    name: 'Tandoori Chicken',
    category: 'tandoor',
    image: logo,
    price: 16.99,
    description: 'Spicy tandoori chicken',
    featured: false,
    available: true,
  },
  {
    id: 'tandoor-2',
    name: 'Tandoori Roti',
    category: 'tandoor',
    image: logo,
    price: 1.99,
    description: 'Fresh tandoori roti',
    featured: false,
    available: true,
  },
  // Dessert
  {
    id: 'dessert-1',
    name: 'Gulab Jamun',
    category: 'dessert',
    image: logo,
    price: 5.99,
    description: 'Sweet gulab jamun',
    featured: false,
    available: true,
  },
  {
    id: 'dessert-2',
    name: 'Ice Cream',
    category: 'dessert',
    image: logo,
    price: 4.99,
    description: 'Vanilla ice cream',
    featured: false,
    available: true,
  },
];

export default {
  promotionalBanners,
  categories,
  menuItems,
};

