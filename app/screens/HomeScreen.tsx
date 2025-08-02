// app/screens/HomeScreen.tsx
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-3xl font-bold text-blue-600 mb-4 text-center">
          🎉 Welcome to RoadRescue!
        </Text>
        <Text className="text-base text-gray-600 text-center leading-6">
          Authentication completed successfully!{"\n\n"}
          Main app dashboard will go here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
