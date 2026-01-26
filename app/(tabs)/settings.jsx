import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

const Settings = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [loading, setLoading] = useState(false);

  // Reload user data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  useEffect(() => {
    loadUserData();
    loadSettings();
  }, []);

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      const name = await AsyncStorage.getItem("userName");
      const savedImage = await AsyncStorage.getItem("userProfileImage");
      
      setUserEmail(email);
      setUserName(name || "");
      setProfileImage(savedImage);

      // Also try to load from Firestore
      if (email) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          if (userData.fullName) {
            setUserName(userData.fullName);
            await AsyncStorage.setItem("userName", userData.fullName);
          }
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
            await AsyncStorage.setItem("userProfileImage", userData.profileImage);
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadSettings = async () => {
    const notifications = await AsyncStorage.getItem("notificationsEnabled");
    const email = await AsyncStorage.getItem("emailUpdates");
    setNotificationsEnabled(notifications !== "false");
    setEmailUpdates(email !== "false");
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await signOut(auth);
            await AsyncStorage.clear();
            router.replace("/(auth)/signin");
          } catch (error) {
            Alert.alert("Error", "Failed to sign out. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightElement, iconColor }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-3 mx-4 shadow-sm"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center flex-1">
        <Ionicons name={icon} size={24} color={iconColor || "#CF2526"} className="mr-3" />
        <View className="flex-1">
          <Text className="text-black text-base font-semibold">{title}</Text>
          {subtitle && (
            <Text className="text-[#666666] text-sm mt-1">{subtitle}</Text>
          )}
        </View>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  if (!userEmail) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View className="mx-4 mb-6 items-center mt-4">
          {/* Dynamic Profile Image */}
          <View className="w-28 h-28 rounded-full mb-4 overflow-hidden bg-[#CF2526] items-center justify-center">
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons name="person" size={56} color="#fff" />
            )}
          </View>
          
          <Text className="text-lg font-bold text-black">
            {userName || "User"}
          </Text>
          <Text className="text-sm text-[#666666] mt-1 mb-5">
            {userEmail}
          </Text>
          
          <TouchableOpacity
            className="bg-white border border-[#CF2526] px-10 py-3 rounded-xl"
            onPress={() => router.push("/settings/edit-profile")}
          >
            <Text className="text-sm text-center text-[#666666] font-semibold">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings Items */}
       <SettingItem
  icon="person-outline"
  iconColor="#CF2526"   
  title="Personal Information"
  subtitle="Manage your profile details"
  onPress={() => router.push("/settings/edit-profile")}
  rightElement={<Ionicons name="chevron-forward" size={20} color="#000" />}
/>


        <SettingItem
          icon="receipt-outline"
           iconColor="#CF2526"  
          title="My Orders"
          subtitle="View your order history"
          onPress={() => router.push("/orders")}
          rightElement={<Ionicons name="chevron-forward" size={20} color="#000" />}
        />

        <SettingItem
          icon="card-outline"
           iconColor="#CF2526"  
          title="Payment Methods"
          subtitle="Manage your payment options"
          onPress={() => router.push("/settings/payment-methods")}
          rightElement={<Ionicons name="chevron-forward" size={20} color="#000" />}
        />

        <SettingItem
          icon="location-outline"
           iconColor="#CF2526"  
          title="Saved Addresses"
          subtitle="Manage your delivery addresses"
          onPress={() => router.push("/settings/saved-addresses")}
          rightElement={<Ionicons name="chevron-forward" size={20} color="#000" />}
        />

        <SettingItem
          icon="help-circle-outline"
           iconColor="#CF2526"  
          title="Help & Support"
          subtitle="Get help or contact support"
          onPress={() => router.push("/settings/help-support")}
          rightElement={<Ionicons name="chevron-forward" size={20} color="#000" />}
        />

        <SettingItem
          icon="star-outline"
           iconColor="#CF2526"  
          title="Rate App"
          subtitle="Rate us on the app store & playstore"
          onPress={() => Alert.alert("Rate App", "Thank you for using House of Chilly!")}
          rightElement={<Ionicons name="chevron-forward" size={20} color="#000" />}
        />

        {/* Sign Out as a card */}
        <SettingItem
          icon="log-out-outline"
           iconColor="#CF2526"  
          title="Sign Out"
          rightElement={<Ionicons name="chevron-forward" size={20} color="#000" />}
          subtitle=""
          onPress={handleSignOut}
         
        />

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;