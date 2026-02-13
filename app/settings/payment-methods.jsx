import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const cardImg = require("../../assets/images/card.png");

const PaymentMethods = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    cardId: "",
    expiry: "",
    cvv: "",
  });

  const handleSave = () => {
    if (
      !cardData.cardNumber ||
      !cardData.cardName ||
      !cardData.cardId ||
      !cardData.expiry ||
      !cardData.cvv
    ) {
      Alert.alert("Error", "Please fill all card details");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Payment method saved!");
      router.back();
    }, 1200);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Safe area for top */}
      <SafeAreaView className="bg-white">
        {/* Header */}
        <View 
          className="px-4 flex-row items-center justify-center relative border-b border-dashed border-gray-300 "
          style={{
            paddingTop: Platform.OS === 'android' ? 16 : 8,
            paddingBottom: 16,
            marginTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4"
            style={{ 
              zIndex: 10,
              top: Platform.OS === 'android' ? 16 : 8,
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#666" className="bg-white shadow-md rounded-full"/>
          </TouchableOpacity>

          <Text className="text-gray-900 text-xl font-bold ">
            Payment Methods
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="px-5 py-4">
          {/* CARD IMAGE */}
          <View className="items-center mb-6">
            <Image
              source={cardImg}
              style={{
                width: width * 0.9,
                height: width * 0.55,
                borderRadius: 18,
              }}
              resizeMode="contain"
            />
          </View>

          {/* CARD NUMBER */}
          <View className="mb-4">
            <Text className="text-gray-900 font-semibold mb-2 text-base">
              Card Number
            </Text>
            <TextInput
              className="bg-white border border-[#D0D5DD] text-gray-900 p-4 rounded-lg text-base"
              placeholder="1234 5678 9012 3456"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={16}
              value={cardData.cardNumber}
              onChangeText={(text) =>
                setCardData({ ...cardData, cardNumber: text })
              }
            />
          </View>

          {/* CARD HOLDER NAME */}
          <View className="mb-4">
            <Text className="text-gray-900 font-semibold mb-2 text-base">
              Card Holder Name
            </Text>
            <TextInput
              className="bg-white border border-[#D0D5DD] text-gray-900 p-4 rounded-lg text-base"
              placeholder="Enter name on card"
              placeholderTextColor="#9CA3AF"
              value={cardData.cardName}
              onChangeText={(text) =>
                setCardData({ ...cardData, cardName: text })
              }
            />
          </View>

          {/* CARD ID */}
          <View className="mb-4">
            <Text className="text-gray-900 font-semibold mb-2 text-base">
              Card ID
            </Text>
            <TextInput
              className="bg-white border border-[#D0D5DD] text-gray-900 p-4 rounded-lg text-base"
              placeholder="Enter card ID"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={cardData.cardId}
              onChangeText={(text) =>
                setCardData({ ...cardData, cardId: text })
              }
            />
          </View>

          {/* EXPIRY DATE */}
          <View className="mb-4">
            <Text className="text-gray-900 font-semibold mb-2 text-base">
              Expiry Date
            </Text>
            <TextInput
              className="bg-white border border-[#D0D5DD] text-gray-900 p-4 rounded-lg text-base"
              placeholder="MM/YY"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={5}
              value={cardData.expiry}
              onChangeText={(text) =>
                setCardData({ ...cardData, expiry: text })
              }
            />
          </View>

          {/* CVV */}
          <View className="mb-6">
            <Text className="text-gray-900 font-semibold mb-2 text-base">
              CVV
            </Text>
            <TextInput
              className="bg-white border border-[#D0D5DD] text-gray-900 p-4 rounded-lg text-base"
              placeholder="123"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={3}
              value={cardData.cvv}
              onChangeText={(text) =>
                setCardData({ ...cardData, cvv: text })
              }
            />
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="bg-[#CF2526] py-4 rounded-xl flex-row items-center justify-center mb-8"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="card-outline" size={22} color="#fff" />
                <Text className="text-white text-lg font-bold ml-2">
                  Save Card
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PaymentMethods;