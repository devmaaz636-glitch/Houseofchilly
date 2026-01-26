# Custom Fonts Setup Guide

## 📁 Font Files Location

Place your font files (.ttf) in this directory:
```
assets/fonts/
├── Shrikhand-Regular.ttf
├── Urbanist-Regular.ttf
├── Urbanist-Medium.ttf
├── Poppins-Regular.ttf
└── Poppins-Medium.ttf
```

## ✅ Font Files Checklist

Make sure these files are in `assets/fonts/`:
- [ ] Shrikhand-Regular.ttf
- [ ] Urbanist-Regular.ttf
- [ ] Urbanist-Medium.ttf
- [ ] Poppins-Regular.ttf
- [ ] Poppins-Medium.ttf

## 🚀 After Adding Fonts

1. **Restart your development server:**
   ```bash
   # Stop current server (Ctrl+C)
   npx expo start --clear
   ```

2. **Rebuild your app** (fonts load on first build after adding)

## 📝 Font Names in Code

Use these exact font names in your code:

- **Shrikhand**: `Shrikhand-Regular`
- **Urbanist Regular**: `Urbanist-Regular`
- **Urbanist Medium**: `Urbanist-Medium`
- **Poppins Regular**: `Poppins-Regular`
- **Poppins Medium**: `Poppins-Medium`

## 💡 Usage Examples

### Using in Tailwind/NativeWind classes:
```jsx
<Text className="font-shrikhand">Hello World</Text>
<Text className="font-urbanist">Hello World</Text>
<Text className="font-urbanist-medium">Hello World</Text>
<Text className="font-poppins">Hello World</Text>
<Text className="font-poppins-medium">Hello World</Text>
```

### Using with style prop:
```jsx
<Text style={{ fontFamily: 'Shrikhand-Regular' }}>Hello World</Text>
<Text style={{ fontFamily: 'Urbanist-Regular' }}>Hello World</Text>
```

### Using in Animatable.Text:
```jsx
<Animatable.Text style={{ fontFamily: 'Poppins-Medium' }}>
  Hello World
</Animatable.Text>
```

