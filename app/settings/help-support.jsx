import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";

const HelpSupport = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "general",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const email = await AsyncStorage.getItem("userEmail");
    setUserEmail(email);
  };

  const handleSubmitSupport = async () => {
    if (!formData.subject || !formData.message) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const email = userEmail || (await AsyncStorage.getItem("userEmail"));

      await addDoc(collection(db, "supportTickets"), {
        userEmail: email,
        subject: formData.subject,
        message: formData.message,
        category: formData.category,
        status: "open",
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        "Success",
        "Your support request has been submitted. We'll get back to you soon!",
        [
          {
            text: "OK",
            onPress: () =>
              setFormData({ subject: "", message: "", category: "general" }),
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting support:", error);
      Alert.alert("Error", "Failed to submit support request.");
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    {
      question: "How do I place an order?",
      answer:
        "Browse restaurants, add items to your cart, and proceed to checkout. Fill in your delivery details and payment information.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery time varies by distance and restaurant. Typically 30-60 minutes. You can see estimated delivery time during checkout.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Yes, you can cancel orders that are pending or confirmed. Go to the Delivery tab and tap 'Cancel Order'.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept credit cards, debit cards, and digital wallets. You can save payment methods in Settings for faster checkout.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Go to the Delivery tab to see real-time order status and tracking information.",
    },
  ];

  const contactMethods = [
    {
      icon: "mail",
      title: "Email Support",
      subtitle: "info@houseofchilli.pk",
      action: () => Linking.openURL("mailto:support@houseofchilly.com"),
    },
    {
      icon: "call",
      title: "Phone Support",
      subtitle: "1-800-HOUSEOFCHILLY",
      action: () => Linking.openURL("tel:+923318555546"),
    },
   {
  icon: "logo-whatsapp",
  title: "WhatsApp",
  subtitle: "Available 24/7",
  action: () =>
    Linking.openURL(
      "https://api.whatsapp.com/send/?phone=923318555546&text&type=phone_number&app_absent=0"
    ),
},

  ];

  return (
    <SafeAreaView className="flex-1 bg-[#FFFFFF]">
      {/* HEADER */}
      <View className="px-4 pt-4 pb-2 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-[#000000] text-2xl font-bold">Help & Support</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Contact Methods */}
        <View className="px-4 py-4">
          <Text className="text-[#666666] text-sm font-semibold mb-3">
            CONTACT US
          </Text>
          {contactMethods.map((method, index) => (
           <TouchableOpacity
  key={index}
  onPress={method.action}
  className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-md"
>
  <View className="bg-[#CF2526] p-3 rounded-full mr-4">
    <Ionicons name={method.icon} size={24} color="#fff" />
  </View>
  <View className="flex-1">
    <Text className="text-gray-900 text-lg font-semibold">{method.title}</Text>
    <Text className="text-gray-500 text-sm">{method.subtitle}</Text>
  </View>
  <Ionicons name="chevron-forward" size={20} color="#000" />
</TouchableOpacity>

          ))}
        </View>

        {/* FAQ Section */}
        <View className="px-4 py-4">
          <Text className="text-[#000000] text-sm font-semibold mb-3">
            FREQUENTLY ASKED QUESTIONS
          </Text>
          {faqItems.map((faq, index) => (
            <View
              key={index}
              className="bg-[#ffffff] rounded-xl p-4 mb-3 shadow-md"
            >
              <Text className="text-[#000000] font-semibold mb-2">
                {faq.question}
              </Text>
              <Text className="text-[#666666] text-sm">{faq.answer}</Text>
            </View>
          ))}
        </View>

        {/* Support Form */}
        <View className="px-4 py-4">
          <Text className="text-[#000000] text-sm font-semibold mb-3">
            SEND US A MESSAGE
          </Text>
          <View className="bg-[#ffffff] rounded-xl p-4 shadow-md">
            {/* Category Selector */}
            <View className="mb-4">
              <Text className="text-[#000000] text-sm mb-2 font-bold">Category</Text>
              <View className="flex-row flex-wrap">
                {["general", "order", "payment", "technical"].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-2 rounded-lg mr-2 mb-2 ${
                      formData.category === cat
                        ? "bg-[#CF2526]"
                        : "bg-[#CF2526]"
                    }`}
                  >
                    <Text className="text-[#666666] text-sm font-semibold capitalize">
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Subject Input */}
           <View className="mb-4">
  <Text className="text-black text-sm mb-2 font-bold">Subject *</Text>
  <TextInput
    className="bg-[#ffffff] text-[#000000] p-4 rounded-lg shadow-md"
    placeholder="Enter subject"
    placeholderTextColor="#666666"
    value={formData.subject || ""}
    onChangeText={(text) =>
      setFormData({ ...formData, subject: text })
    }
  />
</View>


            {/* Message Input */}
            <View className="mb-4">
              <Text className="text-[#000000] text-sm mb-2 font-bold">Message *</Text>
              <TextInput
                className="bg-[#ffffff] text-[#000000] p-4 rounded-lg shadow-md"
                placeholder="Describe your issue..."
                placeholderTextColor="#666666"
                value={formData.message || ""}
                onChangeText={(text) =>
                  setFormData({ ...formData, message: text })
                }
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmitSupport}
              disabled={loading}
              className="bg-[#CF2526] py-4 rounded-xl flex-row items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="send" size={24} color="#fff" />
                  <Text className="text-white text-lg font-bold ml-2">
                    Send Message
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupport;
