// app/screens/splashScreens/welcomeScreen.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { useNavigation } from "expo-router";
import Logo from "./components/Branding/Logo";
import LoadingSpinner from "./components/Loaders/LoadingSpinner";
import { StatusBar } from "expo-status-bar";

export default function WelcomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  // Auto-hide splash screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // navigation.navigate("Onboarding" as never); // production
      navigation.navigate("PhoneSignUp" as never); // devalopment 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <StatusBar style="light" />

      <View className="flex-1 justify-center items-center px-8 relative">
        {/* Logo Section */}
        <View className="items-center mb-6">
          <Logo size="large" showText={true} textColor="#FFFFFF" />
        </View>

        {/* Loading Spinner Section */}
        {isLoading && (
          <View className="items-center justify-center pb-12 ">
            <LoadingSpinner size={40} color="#FFFFFF" />
          </View>
        )}

        {/* Show message when loading is done */}
        {!isLoading && (
          <View className="items-center">
            <Text className="text-white text-lg">Welcome to GoRide!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
