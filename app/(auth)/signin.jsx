import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

import { auth, db } from "../../config/firebaseConfig";
import logo from "../../assets/images/logo.png";
import { Fonts } from "../../constants/Typography";

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

// Validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Signin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Sign-In Configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  // Handle Google Sign-In Response
  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleSignIn(authentication);
    }
  }, [response]);

  const handleGoogleSignIn = async (authentication) => {
    try {
      setGoogleLoading(true);
      
      // Create Google credential
      const credential = GoogleAuthProvider.credential(
        authentication.idToken,
        authentication.accessToken
      );

      // Sign in with credential
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      // Check if user document exists, if not create one
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userDocRef, {
          email: user.email,
          fullName: user.displayName || "",
          profileImage: user.photoURL || "",
          phoneNumber: user.phoneNumber || "",
          createdAt: new Date().toISOString(),
          authProvider: "google",
        });
      }

      // Save user data to AsyncStorage
      await AsyncStorage.setItem("userEmail", user.email);
      await AsyncStorage.setItem("userName", user.displayName || "");
      if (user.photoURL) {
        await AsyncStorage.setItem("userProfileImage", user.photoURL);
      }
      await AsyncStorage.removeItem("isGuest");

      Alert.alert("Success", "Signed in with Google successfully!");
      router.replace("/home");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Google Sign-In Failed", error.message || "Something went wrong");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignin = async (values) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredentials.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        Alert.alert("Error", "User data not found");
        return;
      }

      await AsyncStorage.setItem("userEmail", values.email);
      await AsyncStorage.removeItem("isGuest");

      router.replace("/home");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        Alert.alert("Sign In Failed", "Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Sign In Failed", "No user found with this email");
      } else if (error.code === "auth/invalid-credential") {
        Alert.alert("Sign In Failed", "Invalid email or password");
      } else {
        Alert.alert("Sign In Error", "Something went wrong. Try again.");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="px-6 pt-20 items-center flex-1">
          {/* Logo */}
          <Image
            source={logo}
            style={{ width: 100, height: 60, resizeMode: "contain", marginBottom: 30 }}
          />

          {/* Title */}
          <Text
            className="text-[28px] mb-4 italic"
            style={{
              fontFamily: Fonts.Shrikhand,
              fontWeight: "600",
              lineHeight: 28,
              letterSpacing: -0.56,
              textAlignVertical: "bottom",
              color: "#D42129",
            }}
          >
            Welcome Back
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              fontFamily: Fonts.Poppins.Regular,
              fontSize: 14,
              color: "#666666",
              textAlign: "center",
              marginBottom: 25,
            }}
          >
            Please sign in to access your account.
          </Text>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSignin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View className="w-full">
                {/* Email */}
                <Text style={{ fontFamily: Fonts.Poppins.Regular, fontSize: 15, marginBottom: 4, fontWeight: "bold" }}>
                  Email
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-4">
                  <Ionicons name="mail-outline" size={20} color="#666" />
                  <TextInput
                    style={{ flex: 1, fontFamily: Fonts.Urbanist.Medium, color: "#666666", paddingVertical: 12, paddingHorizontal: 8 }}
                    placeholder="Enter your email..."
                    placeholderTextColor="#666666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />
                </View>
                {errors.email && touched.email && (
                  <Text style={{ fontFamily: Fonts.Poppins.Regular, fontSize: 12, color: "red", marginBottom: 4 }}>
                    {errors.email}
                  </Text>
                )}

                {/* Password */}
                <Text style={{ fontFamily: Fonts.Poppins.Regular, fontSize: 15, marginBottom: 4, fontWeight: "bold" }}>
                  Password
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-6">
                  <Ionicons name="lock-closed-outline" size={20} color="#666" />
                  <TextInput
                    style={{ flex: 1, fontFamily: Fonts.Urbanist.Regular, color: "#000", paddingVertical: 12, paddingHorizontal: 8 }}
                    placeholder="Enter password..."
                    placeholderTextColor="#666666"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Forgot Password */}
                <View className="w-full items-end mb-4">
                  <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                    <Text
                      style={{
                        fontFamily: Fonts.Poppins.Medium,
                        fontSize: 12,
                        lineHeight: 20,
                        color: "#344054",
                        textAlign: "right",
                      }}
                    >
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{ backgroundColor: "#D42129", paddingVertical: 14, borderRadius: 24, alignItems: "center", marginBottom: 30 }}
                >
                  <Text style={{ fontFamily: Fonts.Poppins.Regular, fontSize: 14, color: "#FFFFFF" }}>
                    Sign In
                  </Text>
                </TouchableOpacity>

                {/* OR Divider */}
                <View className="flex-row items-center my-4">
                  <View className="flex-1 h-[1px] bg-gray-300" />
                  <Text style={{ fontFamily: Fonts.Poppins.Medium, fontSize: 12, color: "#666", marginHorizontal: 8 }}>OR</Text>
                  <View className="flex-1 h-[1px] bg-gray-300" />
                </View>

                {/* Google Sign-In Button */}
                <TouchableOpacity
                  style={{
                    marginBottom: 16,
                    alignSelf: "center",
                  }}
                  activeOpacity={0.85}
                  disabled={!request || googleLoading}
                  onPress={() => promptAsync()}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      borderRadius: 20,
                      paddingHorizontal: 24,
                      paddingVertical: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    {googleLoading ? (
                      <ActivityIndicator size="small" color="#DB4437" style={{ marginRight: 10 }} />
                    ) : (
                      <Image
                        source={{ uri: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" }}
                        style={{ width: 22, height: 22, marginRight: 10 }}
                      />
                    )}
                    <Text style={{ fontFamily: Fonts.Poppins.Medium, fontSize: 14, color: "#000000" }}>
                      Sign in with Google
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Footer */}
                <View className="flex-row justify-center mt-10">
                  <Text style={{ fontFamily: Fonts.Poppins.Regular, color: "#666", fontSize: 15, fontWeight: "bold" }}>
                    Don't have an account?{" "}
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/signup")}>
                    <Text style={{ fontFamily: Fonts.Poppins.Medium, color: "#D42129", fontSize: 15, fontWeight: "bold" }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;