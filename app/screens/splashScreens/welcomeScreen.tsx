// app/screens/splashScreens/welcomeScreen.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import LoadingSpinner from "../../components/Loaders/LoadingSpinner";
import Logo from "../../components/Branding/Logo";

interface WelcomeScreenProps {
  onComplete?: () => void; // Made optional with ?
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Auto-hide splash screen after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Only call onComplete if it exists
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

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
