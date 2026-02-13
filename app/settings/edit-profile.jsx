import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where, updateDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

const EditProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: "",
  });

  useEffect(() => {
    loadUserData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant photo library access to change your profile picture."
      );
    } 
  };

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      const name = await AsyncStorage.getItem("userName");
      const savedImage = await AsyncStorage.getItem("userProfileImage");
      
      setUserEmail(email);
      setProfileImage(savedImage);
      setFormData({
        fullName: name || "",
        email: email || "",
        phoneNumber: "",
        deliveryAddress: "",
      });

      if (email) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setFormData({
            fullName: userData.fullName || name || "",
            email: userData.email || email || "",
            phoneNumber: userData.phoneNumber || "",
            deliveryAddress: userData.deliveryAddress || "",
          });
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        // Save to AsyncStorage for persistence
        await AsyncStorage.setItem("userProfileImage", imageUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.fullName || !formData.email) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const email = await AsyncStorage.getItem("userEmail");

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      const userData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        deliveryAddress: formData.deliveryAddress,
        profileImage: profileImage,
        updatedAt: new Date().toISOString(),
      };

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), userData);
      } else {
        await addDoc(collection(db, "users"), {
          ...userData,
          email: formData.email,
          createdAt: new Date().toISOString(),
        });
      }

      await AsyncStorage.setItem("userName", formData.fullName);
      if (profileImage) {
        await AsyncStorage.setItem("userProfileImage", profileImage);
      }

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!userEmail) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <View className="bg-gray-50 p-8 rounded-2xl items-center w-full">
          <Ionicons name="lock-closed" size={60} color="#CF2526" />
          <Text className="text-gray-900 text-xl font-bold mt-4">Sign In Required</Text>
          <TouchableOpacity
            onPress={() => router.push("/signin")}
            className="bg-[#CF2526] px-8 py-4 rounded-lg w-full mt-6"
          >
            <Text className="text-white text-lg font-bold text-center">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      
   <View className="px-4 pt-4 pb-2 flex-row items-center relative border-b border-dashed border-gray-300">

  <TouchableOpacity 
    className="mr-3 bg-white p-2 rounded-full shadow-md" 
    onPress={() => router.back()}
  >
    <Ionicons name="chevron-back" size={24} color="#666666" />
  </TouchableOpacity>

 
  <View className="flex-1 items-center justify-center">
    <Text className="text-gray-900 text-2xl font-bold text-center">
      Edit Profile
    </Text>
  </View>
</View>

      <ScrollView className="flex-1">
        <View className="px-4 py-4">
          {/* Profile Picture */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full items-center justify-center mb-4 overflow-hidden bg-[#CF2526]">
              {profileImage ? (
                <Image 
                  source={{ uri: profileImage }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={48} color="#fff" />
              )}
            </View>
            <TouchableOpacity 
              className="bg-white px-6 py-2 rounded-lg border border-[#CF2526]"
              onPress={handlePickImage}
            >
              <Text className="text-[#666666] font-semibold">Change Your Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields - All styled consistently */}
          <View className="mb-4">
            <Text className="text-gray-900 font-semibold mb-2 text-base">Full Name *</Text>
            <TextInput
              className="bg-white border border-gray-300 text-gray-900 p-4 rounded-lg text-base"
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-900 font-semibold mb-2 text-base">Email *</Text>
            <TextInput
              className="bg-white border border-gray-300 text-gray-900 p-4 rounded-lg text-base"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
            />
            <Text className="text-gray-500 text-xs mt-1">
              Email cannot be changed
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-900 font-semibold mb-2 ">Phone Number</Text>
            <TextInput
              className="bg-white border border-gray-300 text-gray-900 p-4 rounded-lg text-base"
              placeholder="Enter your phone number"
              placeholderTextColor="white"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
            />
          </View>

          <View className="mb-6">
            <Text className="text-gray-900 font-semibold mb-2 text-base">Delivery Address</Text>
            <TextInput
              className="bg-white border border-gray-300 text-gray-900 p-4 rounded-lg text-base"
              placeholder="Enter your delivery address"
              placeholderTextColor="#9CA3AF"
              value={formData.deliveryAddress}
              onChangeText={(text) => setFormData({ ...formData, deliveryAddress: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            onPress={handleSaveProfile}
            disabled={loading}
            className="bg-[#CF2526] py-4 rounded-xl flex-row items-center justify-center mb-6"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text className="text-white text-lg font-bold ml-2">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;