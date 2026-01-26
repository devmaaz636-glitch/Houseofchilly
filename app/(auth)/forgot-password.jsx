import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Fonts } from "../../constants/Typography";
import logo from "../../assets/images/logo.png";

export default function ForgotPassword() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* Logo – fixed at top */}
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
        />

        {/* Button */}
        <TouchableOpacity className="bg-[#D42129] py-4 rounded-2xl items-center">
          <Text
            style={{
              fontFamily: Fonts.Poppins.Medium,
              color: "#fff",
              fontSize: 14,
            }}
          >
            Send Reset Link
          </Text>
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
            Didn’t receive any code?{" "}
            <Text
              style={{
                color: "#D42129",
                fontFamily: Fonts.Poppins.Medium,
              }}
            >
              Resend
            </Text>
          </Text>
        </View>

        {/* Back */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-8 items-center"
        >
          <Text
            style={{
              fontFamily: Fonts.Poppins.Regular,
              color: "#D42129",
              fontSize: 14,
            }}
          >
            Back to Sign In
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}
