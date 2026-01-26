import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

const SavedAddresses = () => {
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userEmail) fetchAddresses();
  }, [userEmail]);

  const loadUser = async () => {
    const email = await AsyncStorage.getItem("userEmail");
    setUserEmail(email);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "savedAddresses"),
        where("userEmail", "==", userEmail)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAddresses(list);
    } catch (e) {
      Alert.alert("Error", "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      address: "",
      city: "",
      postalCode: "",
    });
    setEditingAddress(null);
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode) {
      Alert.alert("Error", "Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      if (editingAddress) {
        await updateDoc(doc(db, "savedAddresses", editingAddress.id), formData);
        Alert.alert("Updated", "Address updated");
      } else {
        await addDoc(collection(db, "savedAddresses"), {
          userEmail,
          ...formData,
          createdAt: new Date(),
        });
        Alert.alert("Success", "Address added");
      }

      setShowModal(false);
      resetForm();
      fetchAddresses();
    } catch {
      Alert.alert("Error", "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete", "Delete this address?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await deleteDoc(doc(db, "savedAddresses", id));
          fetchAddresses();
        },
      },
    ]);
  };

  const editAddress = (a) => {
    setEditingAddress(a);
    setFormData(a);
    setShowModal(true);
  };

  if (!userEmail) {
    return (
      <SafeAreaView className="flex-1 bg-[#2b2b2b] justify-center items-center">
        <Text className="text-white text-xl mb-4">Sign in to view addresses</Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signin")}
          className="bg-[#CF2526] px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const fieldLabels = {
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    address: "Address",
    city: "City",
    postalCode: "Postal Code",
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFFFFF]">
      {/* HEADER */}
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#666666" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-[#000000] text-2xl font-bold">Saved Addresses</Text>
        </View>
        <View className="w-6" /> {/* placeholder for centering */}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f49b33" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView className="px-4 mt-4">
          {addresses.map((a) => (
            <View
              key={a.id}
              className="bg-white rounded-xl p-4 mb-4 shadow-md border-l-4"
              style={{ borderLeftColor: "#CF2526" }}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-lg">
                    {a.fullName || ""}
                  </Text>
                  {a.phoneNumber ? (
                    <Text className="text-gray-500 text-sm mt-1">{a.phoneNumber}</Text>
                  ) : null}
                  <Text className="text-gray-500 text-sm mt-1">{a.address || ""}</Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    {a.city || ""}, {a.postalCode || ""}
                  </Text>
                  <View className="w-10 h-1 mt-2 rounded" />
                </View>

                <View className="flex-row ml-2">
                  <TouchableOpacity onPress={() => editAddress(a)} className="p-2">
                    <Ionicons name="pencil" size={22} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(a.id)} className="p-2">
                    <Ionicons name="trash" size={22} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-[#CF2526] py-4 rounded-xl items-center mb-10"
          >
            <Text className="text-white font-bold text-lg">Add New Address</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* MODAL */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white p-6 rounded-t-3xl shadow-md mx-4 mb-6">
            {/* Cross Button */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-900 text-xl font-bold">
                {editingAddress ? "Edit Address" : "Add Address"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {["fullName", "phoneNumber", "address", "city", "postalCode"].map((field) => (
              <TextInput
                key={field}
                placeholder={fieldLabels[field]}
                placeholderTextColor="#888"
                value={formData[field] || ""}
                onChangeText={(t) => setFormData({ ...formData, [field]: t })}
                className="bg-white text-gray-900 p-4 rounded-xl mb-3 shadow-sm border border-gray-200"
              />
            ))}

            <TouchableOpacity
              onPress={handleSave}
              className="bg-[#CF2526] py-4 rounded-xl items-center mt-2"
            >
              <Text className="text-white font-bold text-lg">Save Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SavedAddresses;
