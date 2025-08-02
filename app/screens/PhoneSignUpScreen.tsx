// app/screens/PhoneSignUpScreen.tsx
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Buttons/Button";

interface PhoneSignUpScreenProps {
  onContinue: (phoneNumber: string) => void;
  onBack: () => void;
}

export default function PhoneSignUpScreen({
  onContinue,
  onBack,
}: PhoneSignUpScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  const handleSignUp = () => {
    if (phoneNumber.trim() && isAgreed) {
      onContinue(phoneNumber);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header with Back Button */}
      <View className="flex-row items-center p-6 pb-0">
        <TouchableOpacity onPress={onBack} className="mr-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 pt-4">
        {/* Title Section */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Join RoadRescue Today ✨
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            Let's get started! Enter your phone number to create your RoadRescue
            account.
          </Text>
        </View>

        {/* Phone Number Input */}
        <View className="mb-6">
          <Text className="text-base font-medium text-gray-900 mb-3">
            Phone Number
          </Text>

          {/* Phone Input with Country Code */}
          <View className="flex-row border border-gray-200 rounded-xl overflow-hidden">
            {/* Country Code Selector */}
            <TouchableOpacity className="flex-row items-center px-4 py-4 bg-gray-50 border-r border-gray-200">
              <Text className="text-lg mr-2">🇺🇸</Text>
              <Text className="text-base font-medium text-gray-700 mr-1">
                +1
              </Text>
              <Text className="text-gray-400">▼</Text>
            </TouchableOpacity>

            {/* Phone Number Input */}
            <TextInput
              className="flex-1 px-4 py-4 text-base text-gray-900"
              placeholder="Phone Number"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
        </View>

        {/* Terms & Conditions Checkbox */}
        <TouchableOpacity
          onPress={() => setIsAgreed(!isAgreed)}
          className="flex-row items-start mb-8"
        >
          <View
            className={`w-5 h-5 mr-3 mt-0.5 border-2 rounded ${isAgreed ? "bg-blue-500 border-blue-500" : "border-gray-300"} items-center justify-center`}
          >
            {isAgreed && (
              <Text className="text-white text-xs font-bold">✓</Text>
            )}
          </View>
          <Text className="text-sm text-gray-700 flex-1 leading-5">
            I agree to RoadRescue{" "}
            <Text className="text-blue-600 font-medium">
              Terms & Conditions
            </Text>
            .
          </Text>
        </TouchableOpacity>

        {/* Already have account */}
        <View className="flex-row justify-center mb-8">
          <Text className="text-gray-600">Already have an account? </Text>
          <TouchableOpacity>
            <Text className="text-blue-600 font-medium">Sign in</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Sign Up Button */}
        <View className="pb-6">
          <Button
            title="Sign up"
            onPress={handleSignUp}
            disabled={!phoneNumber.trim() || !isAgreed}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
