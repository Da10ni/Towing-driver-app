// app/screens/OTPVerificationScreen.tsx
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OTPVerificationScreenProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onBack: () => void;
}

export default function OTPVerificationScreen({
  phoneNumber,
  onVerify,
  onBack,
}: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Handle number press
  const handleNumberPress = (number: string) => {
    const newOtp = [...otp];
    const emptyIndex = newOtp.findIndex((digit) => digit === "");

    if (emptyIndex !== -1) {
      newOtp[emptyIndex] = number;
      setOtp(newOtp);

      // Auto verify when all 6 digits entered
      if (emptyIndex === 5) {
        onVerify(newOtp.join(""));
      }
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    const newOtp = [...otp];
    const lastFilledIndex = newOtp
      .map((digit) => digit !== "")
      .lastIndexOf(true);

    if (lastFilledIndex !== -1) {
      newOtp[lastFilledIndex] = "";
      setOtp(newOtp);
    }
  };

  // Handle resend
  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    // Add resend logic here later
  };

  // Number pad layout
  const numberPad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["•", "0", "⌫"],
  ];

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
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Enter OTP Code 🔐
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            Check your messages! We've sent a one-time code to {phoneNumber}.
            Enter the code below to verify your account and continue.
          </Text>
        </View>

        {/* OTP Input Display */}
        <View className="flex-row justify-center space-x-3 mb-6">
          {otp.map((digit, index) => (
            <View
              key={index}
              className={`w-12 h-12 border-2 rounded-xl items-center justify-center ${
                digit ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
            >
              <Text className="text-xl font-bold text-gray-900">{digit}</Text>
            </View>
          ))}
        </View>

        {/* Resend Timer */}
        <View className="items-center mb-8">
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text className="text-blue-600 font-medium text-base">
                Resend code
              </Text>
            </TouchableOpacity>
          ) : (
            <Text className="text-gray-500 text-base">
              You can resend the code in {timer} seconds
            </Text>
          )}
        </View>

        {/* Custom Number Pad */}
        <View className="flex-1 justify-center">
          {numberPad.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row justify-center mb-4">
              {row.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  onPress={() => {
                    if (item === "⌫") {
                      handleBackspace();
                    } else if (item !== "•") {
                      handleNumberPress(item);
                    }
                  }}
                  className="w-20 h-16 items-center justify-center mx-4 rounded-xl active:bg-gray-100"
                  disabled={item === "•"}
                >
                  <Text
                    className={`text-2xl font-medium ${
                      item === "•" ? "text-transparent" : "text-gray-900"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
