import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  ImageBackground,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const logo = require("../assets/images/logo.png");
const entryImg = require("../assets/images/Frame.png");
const bgHome = require("../assets/images/bghome.png");

export default function Index() {
  const router = useRouter();

  const handleGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" />

      <ImageBackground source={bgHome} className="flex-1" resizeMode="cover">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center px-4">
            
            {/* Logo */}
            <View className="mb-6 items-center justify-center">
              <Image
                source={logo}
                className="w-[180px] h-[200px]"
                resizeMode="contain"
              />
            </View>

            {/* Buttons */}
            <View className="w-3/4 mt-2">
              <TouchableOpacity
                onPress={() => router.push("/signup")}
                className="py-3 my-2 bg-[#D42129] rounded-xl"
                activeOpacity={0.85}
              >
                <Text
                  className="text-lg font-semibold text-center text-white"
                  style={{ textShadowColor: "transparent" }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGuest}
                className="py-3 my-2 border-2 border-[#D42129] rounded-xl"
                activeOpacity={0.85}
              >
                <Text
                  className="text-lg font-semibold text-white text-center"
                  style={{ textShadowColor: "transparent" }}
                >
                  Continue as Guest
                </Text>
              </TouchableOpacity>
            </View>

            {/* OR Divider */}
            <View className="flex-row items-center my-6 w-3/4">
              <View className="flex-1 h-[1px] bg-[#1fa649]" />
              <Text
                className="mx-3 text-white font-medium"
                style={{ textShadowColor: "transparent" }}
              >
                OR
              </Text>
              <View className="flex-1 h-[1px] bg-[#1fa649]" />
            </View>

            {/* Sign In Link */}
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push("/signin")}
            >
              <Text
                className="text-white text-sm font-medium"
                style={{ textShadowColor: "transparent" }}
              >
                Already a User?
              </Text>

              <Text
                className="text-[#D42129] text-sm font-semibold underline ml-1"
                style={{
                  textShadowColor: "transparent",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 0,
                  elevation: 0,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            {/* Bottom Illustration */}
            <View className="flex-1 px-4 mt-8">
              <Image
                source={entryImg}
                className="w-full h-full"
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
