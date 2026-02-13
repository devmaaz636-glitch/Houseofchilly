/**
 * CUSTOM FONTS CONFIGURATION
 * 
 * Font definitions for the app
 * These fonts are loaded in app/_layout.jsx
 */

export const fonts = {
  // Shrikhand - Decorative/Display font
  shrikhand: 'Shrikhand-Regular',
  
  // Urbanist - Modern sans-serif
  urbanist: 'Urbanist-Regular',
  urbanistMedium: 'Urbanist-Medium',
  
  // Poppins - Clean, readable sans-serif
  poppins: 'Poppins-Regular',
  poppinsMedium: 'Poppins-Medium',
};

/**
 * Font mapping for easier access
 */
export const fontNames = {
  // Shrikhand variants
  shrikhand: fonts.shrikhand,
  
  // Urbanist variants
  urbanist: fonts.urbanist,
  urbanistMedium: fonts.urbanistMedium,
  
  // Poppins variants
  poppins: fonts.poppins,
  poppinsMedium: fonts.poppinsMedium,
};

/**
 * Get font family by key
 * @param {string} key - Font key (e.g., 'shrikhand', 'urbanist', 'poppins')
 * @returns {string} Font family name
 */
export const getFont = (key) => {
  return fontNames[key] || fonts.poppins; // Default to Poppins
};

export default fonts;

