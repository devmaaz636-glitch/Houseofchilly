# 📸 Image System Guide

## ✅ Fixed: Dynamic Require() Issue

The error was caused by trying to use dynamic `require()` paths, which React Native doesn't support. All image paths must be known at build time.

## 📁 File Structure

```
House Of Chilly/
├── assets/
│   └── images/
│       ├── royalsindhibiryani.png
│       ├── royalsindhibiryani2.png
│       ├── chickenwhitekarahi2.png
│       ├── chikenwhitekarahi.png
│       ├── kabab.png
│       ├── kabab2.png
│       ├── logo.png
│       ├── deliveryicon.png
│       ├── locationicon.png
│       └── ... (other images)
│
├── utils/
│   └── imageMap.js          ← Image mapping system
│
├── config/
│   └── menuItems.js         ← Menu items with imported images
│
├── app/
│   ├── (tabs)/
│   │   └── home.jsx         ← Home screen
│   └── menu/
│       └── [id].jsx         ← Menu detail page
│
└── constants/
    └── Typography.js        ← Font definitions
```

---

## 🔧 How It Works

### 1. **Image Map (`utils/imageMap.js`)**
This file creates a static mapping of image names to imported images:

```javascript
// All images imported statically (build-time)
import royalsindhibiryani from '../assets/images/royalsindhibiryani.png';

// Static map object
export const imageMap = {
  'royalsindhibiryani.png': royalsindhibiryani,
  // ... more images
};

// Helper function
export const getImage = (imageName) => {
  // Returns the correct image based on name
};
```

### 2. **Menu Items (`config/menuItems.js`)**
Menu items directly import images:

```javascript
import royalsindhibiryani from '../assets/images/royalsindhibiryani.png';

export const menuItems = [
  {
    id: 'royal-sindhi-biryani',
    name: 'Royal Sindhi Biryani',
    image: royalsindhibiryani,  // ← Direct import
    // ...
  }
];
```

### 3. **Usage in Components**

**Home Screen:**
```javascript
import { getImage } from "../../utils/imageMap";

// For Firebase data
const item = {
  imageAsset: 'royalsindhibiryani.png',  // ← Store filename in DB
};

// Convert to image
item.image = getImage(item.imageAsset);
```

**Menu Detail:**
```javascript
import { getImage } from "../../utils/imageMap";

// Same pattern
const image = getImage(data.imageAsset);
```

---

## 📊 Database Structure

When storing menu items in Firebase, use this structure:

```javascript
{
  id: "royal-sindhi-biryani",
  name: "Royal Sindhi Biryani",
  imageAsset: "royalsindhibiryani.png",  // ← Just the filename
  price: 18.99,
  category: "biryani",
  description: "Authentic Sindhi biryani...",
  featured: true
}
```

**Important:** Store `imageAsset` as just the filename (e.g., `"royalsindhibiryani.png"`), not the full path.

---

## ➕ Adding New Images

### Step 1: Add image to `assets/images/`
```
assets/images/new-image.png
```

### Step 2: Add to `utils/imageMap.js`
```javascript
import newImage from '../assets/images/new-image.png';

export const imageMap = {
  // ... existing images
  'new-image.png': newImage,  // ← Add this
};
```

### Step 3: Use in your code
```javascript
import { getImage } from "../../utils/imageMap";

const image = getImage('new-image.png');
```

---

## 🎯 Usage Examples

### Example 1: Local Menu Items
```javascript
import { menuItems } from '../../config/menuItems';

// Images are already imported, ready to use
menuItems[0].image  // ✅ Works directly
```

### Example 2: Firebase Data
```javascript
import { getImage } from '../../utils/imageMap';

// Fetch from Firebase
const data = {
  imageAsset: 'royalsindhibiryani.png'
};

// Convert to image
const image = getImage(data.imageAsset);

// Use in component
<Image source={image || require('../../assets/images/logo.png')} />
```

### Example 3: Fallback Image
```javascript
<Image
  source={item.image || require("../../assets/images/logo.png")}
  resizeMode="cover"
/>
```

---

## ⚠️ Important Rules

1. **Never use dynamic require()**
   ```javascript
   // ❌ DON'T DO THIS
   require(`../../assets/images/${variable}`)
   
   // ✅ DO THIS INSTEAD
   getImage(variable)
   ```

2. **Always import images statically**
   ```javascript
   // ✅ Correct
   import myImage from '../assets/images/myImage.png';
   ```

3. **Store filenames in database**
   ```javascript
   // ✅ Store just filename
   imageAsset: "royalsindhibiryani.png"
   
   // ❌ Don't store full paths
   imageAsset: "../../assets/images/royalsindhibiryani.png"
   ```

---

## 🔍 Troubleshooting

### Image not showing?
1. Check image exists in `assets/images/`
2. Added to `imageMap` in `utils/imageMap.js`
3. Using `getImage()` helper function
4. Check console for warnings

### Build error?
- Make sure all `require()` paths are static
- Check all imports in `imageMap.js` are correct

---

## 📝 Quick Reference

| What | File | How |
|------|------|-----|
| Add new image | `utils/imageMap.js` | Import and add to map |
| Use in component | Any component | `getImage('filename.png')` |
| Local menu items | `config/menuItems.js` | Direct import |
| Firebase items | Component | Use `getImage(data.imageAsset)` |

---

This system ensures all images work correctly with React Native's bundler requirements!

