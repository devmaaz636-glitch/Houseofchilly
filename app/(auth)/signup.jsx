// import {
//   Image,
//   ScrollView,
//   StatusBar,
//   TouchableOpacity,
//   View,
//   Text,
//   TextInput,
//   Alert,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
// import { doc, getFirestore, setDoc } from "firebase/firestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { Formik } from "formik";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import React, { useState } from "react";

// import logo from "../../assets/images/logo.png";
// import entryimg from "../../assets/images/Frame.png";
// import validationSchema from "../../utils/signupSchema";

// const Signup = () => {
//   const router = useRouter();
//   const auth = getAuth();
//   const db = getFirestore();
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSignup = async (values) => {
//     try {
//       const userCredentials = await createUserWithEmailAndPassword(
//         auth,
//         values.email,
//         values.password
//       );

//       const user = userCredentials.user;

//       await setDoc(doc(db, "users", user.uid), {
//         email: values.email,
//         createdAt: new Date(),
//       });

//       await AsyncStorage.setItem("userEmail", values.email);

//       router.replace("/signin");
//     } catch (error) {
//       if (error.code === "auth/email-already-in-use") {
//         Alert.alert(
//           "Sign Up Failed",
//           "This email is already registered."
//         );
//       } else {
//         Alert.alert("Error", "Something went wrong. Try again.");
//       }
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-[#2b2b2b]">
//       <StatusBar barStyle="light-content" backgroundColor="#2b2b2b" />

//       <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//         <View className="px-4 pt-6 items-center flex-1">
//           {/* Logo */}
//           <Image source={logo} style={{ width: 240, height: 240 }} />

//           <Text className="text-white text-xl font-bold mt-2 mb-6 text-center">
//             Let’s Get You Started
//           </Text>

//           <View className="w-5/6">
//             <Formik
//               initialValues={{ email: "", password: "" }}
//               validationSchema={validationSchema}
//               onSubmit={handleSignup}
//             >
//               {({
//                 handleChange,
//                 handleBlur,
//                 handleSubmit,
//                 values,
//                 errors,
//                 touched,
//               }) => (
//                 <View>
//                   {/* Email */}
//                   <Text className="text-[#f49b33] mb-1 font-semibold">
//                     Email
//                   </Text>

//                   <View className="flex-row items-center border border-white rounded-lg px-3 mb-1">
//                     <Ionicons
//                       name="mail-outline"
//                       size={20}
//                       color="#f49b33"
//                     />
//                     <TextInput
//                       className="flex-1 px-3 py-3 text-white"
//                       placeholder="Enter your email"
//                       placeholderTextColor="#bdbdbd"
//                       keyboardType="email-address"
//                       onChangeText={handleChange("email")}
//                       onBlur={handleBlur("email")}
//                       value={values.email}
//                     />
//                   </View>

//                   {errors.email && touched.email && (
//                     <Text className="text-red-500 mb-2">
//                       {errors.email}
//                     </Text>
//                   )}

//                   {/* Password */}
//                   <Text className="text-[#f49b33] mb-1 font-semibold">
//                     Password
//                   </Text>

//                   <View className="flex-row items-center border border-white rounded-lg px-3 mb-1">
//                     <Ionicons
//                       name="lock-closed-outline"
//                       size={20}
//                       color="#f49b33"
//                     />

//                     <TextInput
//                       className="flex-1 px-3 py-3 text-white"
//                       placeholder="Enter your password"
//                       placeholderTextColor="#bdbdbd"
//                       secureTextEntry={!showPassword}
//                       onChangeText={handleChange("password")}
//                       onBlur={handleBlur("password")}
//                       value={values.password}
//                     />

//                     <TouchableOpacity
//                       onPress={() => setShowPassword(!showPassword)}
//                     >
//                       <Ionicons
//                         name={showPassword ? "eye-off" : "eye"}
//                         size={20}
//                         color="#bdbdbd"
//                       />
//                     </TouchableOpacity>
//                   </View>

//                   {errors.password && touched.password && (
//                     <Text className="text-red-500 mb-2">
//                       {errors.password}
//                     </Text>
//                   )}

//                   {/* Sign Up Button */}
//                   <TouchableOpacity
//                     onPress={handleSubmit}
//                     className="py-4 mb-4 bg-[#f49b33] rounded-2xl flex-row items-center justify-center"
//                     activeOpacity={0.85}
//                   >
//                     <Ionicons
//                       name="person-add"
//                       size={22}
//                       color="#2b2b2b"
//                     />
//                     <Text className="text-xl font-bold ml-2 text-[#2b2b2b]">
//                       Sign Up
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </Formik>
//           </View>

//           {/* Navigate to Sign In */}
//           <TouchableOpacity
//             className="flex-row items-center mb-4"
//             onPress={() => router.push("/signin")}
//           >
//             <Text className="text-white font-semibold text-base">
//               Already a User?{" "}
//             </Text>
//             <Text className="text-base font-bold text-[#f49b33]">
//               Sign In
//             </Text>
//             <Ionicons
//               name="arrow-forward"
//               size={18}
//               color="#f49b33"
//               style={{ marginLeft: 4 }}
//             />
//           </TouchableOpacity>

//           {/* Bottom Image */}
//           <View className="w-full px-4 flex-1">
//             <Image
//               source={entryimg}
//               className="w-full h-full"
//               resizeMode="contain"
//             />
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Signup;
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
} from "react-native";
import { Formik } from "formik";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";

import { Fonts } from "../../constants/Typography";
import logo from "../../assets/images/logo.png";
import validationSchema from "../../utils/signupSchema";

const Signup = () => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (values) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredentials.user;

      await setDoc(doc(db, "users", user.uid), {
        email: values.email,
        createdAt: new Date(),
      });

      await AsyncStorage.setItem("userEmail", values.email);
      router.replace("/signin");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Sign Up Failed", "This email is already registered.");
      } else {
        Alert.alert("Error", "Something went wrong. Try again.");
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
    lineHeight: 28,       // match 100% of font-size
    letterSpacing: -0.56, // -2% of 28px ≈ -0.56px
    textAlignVertical: "bottom",
    color: "#D42129",
  }}
>
  Create Account
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
            Please fill your details to access your account.
          </Text>

          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSignup}
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
                <Text style={{ fontFamily: Fonts.Poppins.Regular, fontSize: 15, marginBottom: 4, fontWeight:"bold" }}>
                  Password
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#666" />
                  <TextInput
                    style={{ flex: 1, fontFamily: Fonts.Urbanist.Regular, color: "#000", paddingVertical: 12, paddingHorizontal: 8 }}
                    placeholder="Enter password..."
                    placeholderTextColor="#666666"
                    secureTextEntry={!showPassword}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password */}
                <Text style={{ fontFamily: Fonts.Poppins.Regular, fontSize: 15, marginBottom: 4, fontWeight:"bold" }}>
                  Confirm Password
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-xl px-3 mb-6">
                  <Ionicons name="lock-closed-outline" size={20} color="#666" />
                  <TextInput
                    style={{ flex: 1, fontFamily: Fonts.Urbanist.Regular, color: "#000", paddingVertical: 12, paddingHorizontal: 8 }}
                    placeholder="Confirm password..."
                    placeholderTextColor="#666666"
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Sign Up */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={{ backgroundColor: "#D42129", paddingVertical: 14, borderRadius: 24, alignItems: "center", marginBottom: 20 }}
                >
                  <Text style={{ fontFamily: Fonts.Poppins.Regular, fontSize: 14, color: "#FFFFFF" }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>

                {/* OR Divider */}
                <View className="flex-row items-center my-4">
                  <View className="flex-1 h-[1px] bg-gray-300" />
                  <Text style={{ fontFamily: Fonts.Poppins.Medium, fontSize: 12, color: "#666", marginHorizontal: 8 }}>OR</Text>
                  <View className="flex-1 h-[1px] bg-gray-300" />
                </View>

                {/* Google Sign-in */}
                <TouchableOpacity
                  style={{
                    marginBottom: 16,
                    alignSelf: "center",
                  }}
                  activeOpacity={0.85}
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
                    <Ionicons name="logo-google" size={22} color="#D42129" style={{ marginRight: 10 }} />
                    <Text style={{ fontFamily: Fonts.Poppins.Medium, fontSize: 14, color: "#000000" }}>
                      Sign in with Google
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Footer */}
                <View className="flex-row justify-center mt-20">
                  <Text style={{ fontFamily: Fonts.Poppins.Regular, color: "#666", fontSize: 15, fontWeight:"bold"}}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/signin")}>
                    <Text style={{ fontFamily: Fonts.Poppins.Medium, color: "#D42129", fontSize: 15, fontWeight:"bold" }}>
                      Sign In
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

export default Signup;


