import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

const COLORS = {
  primary: "#CF2526",
  white: "#fff",
  inactive: "#999",
  border: "#e0e0e0",
};

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 90 : 75;
const SAFE_AREA_BOTTOM = Platform.OS === "ios" ? 34 : 0;

const TabLayout = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState(2);
  const animatedIndex = useSharedValue(2);

  React.useEffect(() => {
    animatedIndex.value = withSpring(activeTab, {
      damping: 20,
      stiffness: 90,
    });
  }, [activeTab]);

  const ElevatedIcon = ({
    icon: Icon,
    iconName,
    size,
    color,
    focused,
    index,
  }) => {
    React.useEffect(() => {
      if (focused) setActiveTab(index);
    }, [focused]);

    if (focused) {
      return (
        <View style={styles.elevatedIconContainer}>
          <Icon name={iconName} size={24} color={COLORS.white} />
        </View>
      );
    }

    return <Icon name={iconName} size={size ?? 24} color={color} />;
  };

  // Animated border that covers the active tab icon area
  const AnimatedBorderIndicator = () => {
    const animatedStyle = useAnimatedStyle(() => {
      const tabWidth = 100 / 5;
      const leftPosition = tabWidth * animatedIndex.value;

      return {
        left: `${leftPosition}%`,
        width: `${tabWidth}%`,
      };
    });

    return (
      <Animated.View style={[styles.borderIndicator, animatedStyle]}>
        <View style={styles.borderContent} />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.inactive,

          sceneStyle: {
            paddingBottom: TAB_BAR_HEIGHT + SAFE_AREA_BOTTOM + 15,
            backgroundColor: COLORS.white,
          },

          tabBarBackground: () => <View style={styles.tabBarBackground} />,

          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarItemStyle: styles.tabBarItem,
        }}
      >
        {/* Animated Border Indicator - positioned as overlay */}
        <AnimatedBorderIndicator />

        <Tabs.Screen
          name="home"
          options={{
            title: "Menu",
            tabBarIcon: ({ color, size, focused }) => (
              <ElevatedIcon
                icon={Ionicons}
                iconName="book-outline"
                size={size}
                color={color}
                focused={focused}
                index={0}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="contact"
          options={{
            title: "Contact",
            tabBarIcon: ({ color, size, focused }) => (
              <ElevatedIcon
                icon={Feather}
                iconName="phone"
                size={size}
                color={color}
                focused={focused}
                index={1}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="delivery"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <ElevatedIcon
                icon={Ionicons}
                iconName="home-outline"
                size={size}
                color={color}
                focused={focused}
                index={2}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Cart",
            tabBarBadge: 2,
            tabBarBadgeStyle: styles.badge,
            tabBarIcon: ({ color, size, focused }) => (
              <ElevatedIcon
                icon={Ionicons}
                iconName="cart-outline"
                size={size}
                color={color}
                focused={focused}
                index={3}
              />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push("/menu/chicken-burger");
            },
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <ElevatedIcon
                icon={Ionicons}
                iconName="person-outline"
                size={size}
                color={color}
                focused={focused}
                index={4}
              />
            ),
          }}
        />

        <Tabs.Screen name="profile" options={{ href: null }} />
      </Tabs>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },

  borderIndicator: {
    position: "absolute",
    top: -10,
    height: 70,
    zIndex: 100,
    paddingHorizontal: 5,
  },

  borderContent: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.primary,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  elevatedIconContainer: {
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === "ios" ? 30 : 25,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  tabBarBackground: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
  },

  tabBar: {
    backgroundColor: COLORS.white,
    height: TAB_BAR_HEIGHT,
    paddingBottom: Platform.OS === "ios" ? 25 : 12,
    paddingTop: 8,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "visible",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },

  tabBarItem: {
    paddingVertical: 6,
  },

  badge: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    fontSize: 10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    marginLeft: 10,
  },
});

export default TabLayout;