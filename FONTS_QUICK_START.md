# 🚀 Fonts Quick Start Guide

## ✅ Setup Complete!

Your custom fonts are now configured. Follow these steps:

---

## 📋 Step 1: Add Font Files

Place these font files in `assets/fonts/` directory:

```
assets/fonts/
├── Shrikhand-Regular.ttf
├── Urbanist-Regular.ttf
├── Urbanist-Medium.ttf
├── Poppins-Regular.ttf
└── Poppins-Medium.ttf
```

---

## 📋 Step 2: Restart Development Server

After adding the font files, restart your server:

```bash
# Stop current server (Ctrl+C or Cmd+C)
npx expo start --clear
```

---

## 📋 Step 3: Use Fonts in Your Code

### Option A: Tailwind Classes (Easiest)
```jsx
<Text className="font-shrikhand text-3xl">Heading</Text>
<Text className="font-urbanist">Body Text</Text>
<Text className="font-poppins-medium">Medium Text</Text>
```

### Option B: Style Prop
```jsx
<Text style={{ fontFamily: 'Shrikhand-Regular' }}>Heading</Text>
<Text style={{ fontFamily: 'Poppins-Regular' }}>Body Text</Text>
```

---

## 🎨 Quick Font Reference

| Font | Tailwind Class | Style Name |
|------|---------------|------------|
| **Shrikhand** | `font-shrikhand` | `Shrikhand-Regular` |
| **Urbanist** | `font-urbanist` | `Urbanist-Regular` |
| **Urbanist Medium** | `font-urbanist-medium` | `Urbanist-Medium` |
| **Poppins** | `font-poppins` | `Poppins-Regular` |
| **Poppins Medium** | `font-poppins-medium` | `Poppins-Medium` |

---

## 📝 Example Usage

```jsx
import { Text, View } from 'react-native';

export default function Example() {
  return (
    <View>
      {/* Decorative heading */}
      <Text className="font-shrikhand text-4xl text-[#fb9b33]">
        House of Chilly
      </Text>
      
      {/* Subtitle */}
      <Text className="font-urbanist-medium text-2xl text-white">
        Welcome
      </Text>
      
      {/* Body text */}
      <Text className="font-poppins text-base text-white/80">
        This is body text using Poppins font.
      </Text>
    </View>
  );
}
```

---

## 📚 Full Documentation

- **Setup Guide**: See `assets/fonts/FONTS_SETUP.md`
- **Usage Guide**: See `utils/FONT_USAGE_GUIDE.md`
- **Font Config**: See `config/fonts.js`

---

## ✅ Files Modified

1. ✅ `app/_layout.jsx` - Font loading setup
2. ✅ `tailwind.config.js` - Font family classes
3. ✅ `config/fonts.js` - Font configuration helper

---

## ⚠️ Troubleshooting

**Fonts not loading?**
1. Check font files are in `assets/fonts/` directory
2. Restart server with `--clear` flag
3. Rebuild app (fonts load on first build)

**Tailwind classes not working?**
1. Restart development server
2. Check `tailwind.config.js` has font families

**Need help?**
- Check `utils/FONT_USAGE_GUIDE.md` for detailed examples
- Check console for font loading errors

