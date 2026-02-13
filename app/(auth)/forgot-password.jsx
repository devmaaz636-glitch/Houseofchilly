import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Fonts } from "../../constants/Typography";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
import { forgotPassword } from "../../utils/api"; 

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Send Reset Link
  const sendResetLink = async () => {
    // Validation
    if (!email.trim()) {
      return Alert.alert("Error", "Please enter your email");
    }

    if (!isValidEmail(email.trim())) {
      return Alert.alert("Error", "Please enter a valid email address");
    }

    if (loading) return; // Prevent double-click

    try {
      setLoading(true);

      const data = await forgotPassword(email.trim());
      
      Alert.alert(
        "Success ✅", 
        data.msg || "Reset link sent! Check your email.",
        [{ text: "OK" }]
      );
      
    } catch (err) {
      console.error("Forgot Password Error:", err);
      
      const errorMessage = 
        err.msg || 
        err.message || 
        "Failed to send reset link. Please try again.";
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* Logo */}
      <View className="items-center mt-6 mb-10">
        <Image
          source={logo}
          className="w-28 h-28"
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View className="flex-1">
        
        {/* Heading */}
        <Text
          style={{
            fontFamily: "Shrikhand",
            fontWeight: "400",
            fontStyle: "italic",
            fontSize: 20,
            lineHeight: 20,
            letterSpacing: -0.4,
            color: "#D42129",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Forgot Password
        </Text>

        {/* Description */}
        <Text
          style={{
            fontFamily: Fonts.Poppins.Regular,
            fontSize: 14,
            color: "#666666",
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          Please enter the email address below to verify your account
        </Text>

        {/* Email Input */}
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
          style={{ fontFamily: Fonts.Urbanist.Regular }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        {/* Send Button */}
        <TouchableOpacity
          onPress={sendResetLink}
          disabled={loading}
          className={`py-4 rounded-2xl items-center ${loading ? 'bg-[#D42129]/70' : 'bg-[#D42129]'}`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                fontFamily: Fonts.Poppins.Medium,
                color: "#fff",
                fontSize: 14,
              }}
            >
              Send Reset Link
            </Text>
          )}
        </TouchableOpacity>

        {/* Resend */}
        <View className="mt-5 items-center">
          <Text
            style={{
              fontFamily: Fonts.Poppins.Regular,
              color: "#666666",
              fontSize: 13,
            }}
          >
            Didn't receive any code?{" "}
            <Text
              onPress={() => !loading && sendResetLink()}
              style={{
                color: loading ? "#D42129" : "#D42129",
                fontFamily: Fonts.Poppins.Medium,
                opacity: loading ? 0.5 : 1,
              }}
            >
              Resend
            </Text>
          </Text>
        </View>

        {/* Back to Sign In */}
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={loading}
          className="mt-8 items-center"
        >
          <Text
            style={{
              fontFamily: Fonts.Poppins.Regular,
              color: "#D42129",
              fontSize: 14,
              opacity: loading ? 0.5 : 1,
            }}
          >
            Back to Sign In
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}