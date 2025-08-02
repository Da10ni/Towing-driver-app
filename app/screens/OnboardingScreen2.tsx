// app/screens/OnboardingScreen2.tsx
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Buttons/Button";

interface OnboardingScreen2Props {
  onContinue: () => void;
  onSkip: () => void;
}

export default function OnboardingScreen2({
  onContinue,
  onSkip,
}: OnboardingScreen2Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#FFFFFF" />

      {/* Skip Button */}
      <View className="flex-row justify-end p-6">
        <Button
          title="Skip"
          variant="outline"
          size="small"
          fullWidth={false}
          onPress={onSkip}
        />
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6">
        {/* Image Section */}
        <View className="flex-1 justify-center items-center">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center",
            }}
            className="w-80 h-80 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Text Content */}
        <View className="pb-8">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
            Choose Your Ride - Tailored to Your Needs
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6 mb-8">
            Select from a variety of transportation options - motorbike /
            scooter or car - and we like divide with just a few taps.
          </Text>

          {/* Pagination Dots */}
          <View className="flex-row justify-center space-x-2 mb-8">
            <View className="w-2 h-2 bg-gray-300 rounded-full" />
            <View className="w-8 h-2 bg-blue-500 rounded-full" />
            <View className="w-2 h-2 bg-gray-300 rounded-full" />
          </View>

          {/* Continue Button */}
          <Button title="Continue" onPress={onContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
}
