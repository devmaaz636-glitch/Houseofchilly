/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Shrikhand - Decorative/Display font
        shrikhand: ['Shrikhand-Regular', 'system-ui'],
        
        // Urbanist - Modern sans-serif
        urbanist: ['Urbanist-Regular', 'system-ui'],
        'urbanist-medium': ['Urbanist-Medium', 'system-ui'],
        
        // Poppins - Clean, readable sans-serif
        poppins: ['Poppins-Regular', 'system-ui'],
        'poppins-medium': ['Poppins-Medium', 'system-ui'],
      },
    },
  },
  plugins: [],
};
