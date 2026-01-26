# 📝 Font Usage Guide

This guide shows you how to use custom fonts throughout your app.

## 🎨 Available Fonts

1. **Shrikhand** - Decorative display font
   - Use for: Headings, titles, decorative text
   - Variant: `Shrikhand-Regular`

2. **Urbanist** - Modern sans-serif
   - Use for: Body text, UI elements
   - Variants: `Urbanist-Regular`, `Urbanist-Medium`

3. **Poppins** - Clean, readable sans-serif
   - Use for: Body text, readable content
   - Variants: `Poppins-Regular`, `Poppins-Medium`

---

## 💻 Usage Methods

### Method 1: Using Tailwind/NativeWind Classes (Recommended)

```jsx
import { Text } from 'react-native';

// Shrikhand font
<Text className="font-shrikhand text-2xl">Welcome to House of Chilly</Text>

// Urbanist fonts
<Text className="font-urbanist">Regular Urbanist text</Text>
<Text className="font-urbanist-medium">Medium Urbanist text</Text>

// Poppins fonts
<Text className="font-poppins">Regular Poppins text</Text>
<Text className="font-poppins-medium">Medium Poppins text</Text>

// Combining with other Tailwind classes
<Text className="font-shrikhand text-3xl text-[#fb9b33]">
  Special Heading
</Text>
```

### Method 2: Using Style Prop

```jsx
import { Text } from 'react-native';

<Text style={{ fontFamily: 'Shrikhand-Regular' }}>
  Welcome
</Text>

<Text style={{ fontFamily: 'Urbanist-Regular' }}>
  Body text
</Text>

<Text style={{ fontFamily: 'Poppins-Medium' }}>
  Medium weight text
</Text>
```

### Method 3: Using Font Config Helper

```jsx
import { Text } from 'react-native';
import { getFont } from '../config/fonts';

<Text style={{ fontFamily: getFont('shrikhand') }}>
  Using font helper
</Text>

<Text style={{ fontFamily: getFont('poppinsMedium') }}>
  Medium Poppins
</Text>
```

### Method 4: With Animatable.Text

```jsx
import * as Animatable from 'react-native-animatable';

<Animatable.Text 
  style={{ fontFamily: 'Shrikhand-Regular' }}
  animation="fadeIn"
>
  Animated Text
</Animatable.Text>

// Or with Tailwind
<Animatable.Text 
  className="font-shrikhand text-2xl"
  animation="fadeIn"
>
  Animated Text
</Animatable.Text>
```

---

## 🎯 Practical Examples

### Example 1: Home Screen Banner

```jsx
// app/(tabs)/home.jsx
<Animatable.Text
  animation="fadeIn"
  duration={1000}
  style={{ fontFamily: 'Shrikhand-Regular' }}
  className="text-center text-3xl text-white"
>
  Tasty Hyderabadi & Sindhi Biryani
</Animatable.Text>
```

### Example 2: Restaurant Card Title

```jsx
<Text className="font-poppins-medium text-lg font-bold text-white">
  {restaurant.name}
</Text>
<Text className="font-poppins text-sm text-white/70">
  {restaurant.address}
</Text>
```

### Example 3: Button Text

```jsx
<TouchableOpacity className="bg-[#f49b33] px-6 py-3 rounded-lg">
  <Text className="font-urbanist-medium text-white text-base font-bold">
    Order Now
  </Text>
</TouchableOpacity>
```

### Example 4: Menu Item Names

```jsx
<View>
  <Text className="font-poppins-medium text-xl text-white mb-1">
    Chicken Biryani
  </Text>
  <Text className="font-poppins text-sm text-white/70">
    Tender chicken marinated in special spices
  </Text>
  <Text className="font-urbanist-medium text-lg text-[#f49b33] font-bold">
    $18.99
  </Text>
</View>
```

### Example 5: Form Labels

```jsx
<View>
  <Text className="font-poppins-medium text-base text-white mb-2">
    Full Name
  </Text>
  <TextInput
    className="font-poppins text-base text-white bg-[#474747] p-3 rounded-lg"
    placeholder="Enter your name"
    placeholderTextColor="#999"
  />
</View>
```

---

## 🎨 Font Combinations Guide

### For Headings/Titles:
```jsx
// Eye-catching display font
<Text className="font-shrikhand text-4xl">Main Title</Text>
```

### For Subheadings:
```jsx
// Medium weight for emphasis
<Text className="font-urbanist-medium text-2xl">Subtitle</Text>
```

### For Body Text:
```jsx
// Regular weight, easy to read
<Text className="font-poppins text-base">Regular body text</Text>
```

### For Important Info:
```jsx
// Medium weight for visibility
<Text className="font-poppins-medium text-lg">Important information</Text>
```

---

## 📱 Complete Component Example

```jsx
import { View, Text, TouchableOpacity } from 'react-native';

export default function ExampleComponent() {
  return (
    <View className="p-4">
      {/* Main heading with Shrikhand */}
      <Text className="font-shrikhand text-3xl text-[#fb9b33] mb-4">
        House of Chilly
      </Text>
      
      {/* Subtitle with Urbanist */}
      <Text className="font-urbanist-medium text-xl text-white mb-2">
        Welcome to our restaurant
      </Text>
      
      {/* Body text with Poppins */}
      <Text className="font-poppins text-base text-white/80 mb-4">
        Experience authentic Hyderabadi and Sindhi cuisine in a warm, 
        welcoming atmosphere. Our chefs prepare each dish with traditional 
        recipes and fresh ingredients.
      </Text>
      
      {/* Button with Urbanist Medium */}
      <TouchableOpacity className="bg-[#f49b33] px-6 py-3 rounded-lg">
        <Text className="font-urbanist-medium text-white text-center text-lg font-bold">
          View Menu
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## ✅ Quick Reference

| Font | Tailwind Class | Style Prop | Use Case |
|------|---------------|------------|----------|
| Shrikhand | `font-shrikhand` | `Shrikhand-Regular` | Headings, titles |
| Urbanist Regular | `font-urbanist` | `Urbanist-Regular` | Body text |
| Urbanist Medium | `font-urbanist-medium` | `Urbanist-Medium` | Emphasized text |
| Poppins Regular | `font-poppins` | `Poppins-Regular` | Readable content |
| Poppins Medium | `font-poppins-medium` | `Poppins-Medium` | Important info |

---

## ⚠️ Important Notes

1. **Font Loading**: Fonts are loaded in `app/_layout.jsx`. The app won't render until fonts are loaded.

2. **Font Names**: Use exact font names as defined (e.g., `Shrikhand-Regular`, not `Shrikhand`).

3. **Fallback**: System fonts are used as fallback if custom fonts fail to load.

4. **Performance**: Fonts are loaded once when the app starts, so there's no performance impact during usage.

5. **Testing**: Always test your app after adding fonts to ensure they load correctly.

---

## 🐛 Troubleshooting

### Fonts not showing?
1. Make sure font files are in `assets/fonts/` directory
2. Restart your development server: `npx expo start --clear`
3. Rebuild your app
4. Check console for font loading errors

### Font name not working?
- Use the exact font names as listed in this guide
- Check `config/fonts.js` for available font keys

### Tailwind classes not working?
- Make sure `tailwind.config.js` has been updated
- Restart your development server after changing Tailwind config

