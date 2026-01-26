/**
 * IMAGE MAP - Maps image asset names to require() imports
 * This ensures all image paths are known at build time
 */

// Import all images statically
import royalsindhibiryani from '../assets/images/royalsindhibiryani.png';
import royalsindhibiryani2 from '../assets/images/royalsindhibiryani2.png';
import chickenwhitekarahi from '../assets/images/chickenwhitekarahi2.png';
import chikenwhitekarahi from '../assets/images/chikenwhitekarahi.png';
import kabab from '../assets/images/kabab.png';
import kabab2 from '../assets/images/kabab2.png';
import logo from '../assets/images/logo.png';
import deliveryicon from '../assets/images/deliveryicon.png';
import locationicon from '../assets/images/locationicon.png';
import homeBanner from '../assets/images/homeBanner.png';
import bghome from '../assets/images/bghome.png';
import home1 from '../assets/images/home1.png';
import menus from '../assets/images/menus.png';
import topicon from '../assets/images/top-icon.png';

// Create image map - Key is the filename (without path), Value is the imported image
export const imageMap = {
  'royalsindhibiryani.png': royalsindhibiryani,
  'royalsindhibiryani2.png': royalsindhibiryani2,
  'chickenwhitekarahi2.png': chickenwhitekarahi,
  'chikenwhitekarahi.png': chikenwhitekarahi,
  'kabab.png': kabab,
  'kabab2.png': kabab2,
  'logo.png': logo,
  'deliveryicon.png': deliveryicon,
  'locationicon.png': locationicon,
  'homeBanner.png': homeBanner,
  'bghome.png': bghome,
  'home1.png': home1,
  'menus.png': menus,
  'top-icon.png': topicon,
};

/**
 * Get image by asset name
 * @param {string} imageName - Image filename (e.g., 'royalsindhibiryani.png' or 'royalsindhibiryani')
 * @returns {ImageSource} Image source or null if not found
 */
export const getImage = (imageName) => {
  if (!imageName) return null;
  
  // If it's already a require() object, return it
  if (typeof imageName === 'object' && imageName.uri !== undefined) {
    return imageName;
  }
  
  // If it's a string URL (http/https), return as URI
  if (typeof imageName === 'string' && (imageName.startsWith('http://') || imageName.startsWith('https://'))) {
    return { uri: imageName };
  }
  
  // Try with .png extension
  if (!imageName.endsWith('.png') && !imageName.endsWith('.jpg') && !imageName.endsWith('.jpeg')) {
    const withExtension = imageName + '.png';
    if (imageMap[withExtension]) {
      return imageMap[withExtension];
    }
  }
  
  // Try exact match
  if (imageMap[imageName]) {
    return imageMap[imageName];
  }
  
  // Return null if not found
  console.warn(`Image not found: ${imageName}`);
  return null;
};

export default imageMap;

