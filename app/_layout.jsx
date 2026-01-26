import { Stack } from "expo-router";
import "../global.css";
import { CartProvider } from "../store/cartContext";
import { FavoritesProvider } from "../store/favoritesContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Stack screenOptions={{headerShown:false}}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="restaurant/[restaurant]" />
          <Stack.Screen name="menu/[id]" />
          <Stack.Screen name="checkout" />
        </Stack>
      </FavoritesProvider>
    </CartProvider>
  );
}
