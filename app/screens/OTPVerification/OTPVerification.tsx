// app/screens/OTPVerificationScreen.tsx
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Vibration,
  Modal,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../components/Loaders/LoadingSpinner";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "@/app/utils/configs/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth";

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber, countryCode } = (route.params as any) || {};
  const [boxAnimations] = useState(
    Array.from({ length: 6 }, () => ({
      shake: new Animated.Value(0),
      scale: new Animated.Value(1),
      rotate: new Animated.Value(0),
      fall: new Animated.Value(0), // For falling numbers
      opacity: new Animated.Value(1), // For fading out
    }))
  );

  const verifyPhoneNumber = httpsCallable(functions, "verifyPhoneNumber");
  const resendVerificationCode = httpsCallable(
    functions,
    "resendVerificationCode"
  );

  const handleBack = () => {
    navigation.goBack();
  };

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

  // Break/shake animation with falling numbers
  const startBreakAnimation = () => {
    // Start break animation for each box with different delays
    boxAnimations.forEach((animation, index) => {
      setTimeout(() => {
        // Box shake + rotate + scale animation
        Animated.parallel([
          // Box shaking
          Animated.sequence([
            Animated.timing(animation.shake, {
              toValue: 15,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animation.shake, {
              toValue: -15,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animation.shake, {
              toValue: 10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animation.shake, {
              toValue: -10,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animation.shake, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          // Box scaling
          Animated.sequence([
            Animated.timing(animation.scale, {
              toValue: 1.1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(animation.scale, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(animation.scale, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          // Box rotating
          Animated.sequence([
            Animated.timing(animation.rotate, {
              toValue: 8,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animation.rotate, {
              toValue: -8,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animation.rotate, {
              toValue: 5,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animation.rotate, {
              toValue: -3,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(animation.rotate, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
          // Number falling down
          Animated.sequence([
            Animated.delay(200), // Wait a bit before falling
            Animated.parallel([
              Animated.timing(animation.fall, {
                toValue: 100, // Fall down 100 units
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(animation.opacity, {
                toValue: 0, // Fade out while falling
                duration: 600,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]).start(() => {
          // Reset animations after completion
          animation.fall.setValue(0);
          animation.opacity.setValue(1);
        });
      }, index * 80); // Stagger the animation for each box
    });
  };

  // Handle number press
  const handleNumberPress = async (number: string) => {
    const newOtp = [...otp];
    const emptyIndex = newOtp.findIndex((digit) => digit === "");

    if (emptyIndex !== -1 && !isLoading) {
      newOtp[emptyIndex] = number;
      setOtp(newOtp);

      const fullPhoneNumber = `${countryCode}${phoneNumber}`;

      // Auto verify when all 5 digits entered
      if (emptyIndex === 5) {
        setIsLoading(true);
        setError(null);
        const enteredPin = newOtp.join("");
        try {
          const result: any = await verifyPhoneNumber({
            phoneNumber: fullPhoneNumber,
            code: enteredPin,
          });

          if (result.data.success) {
            await signInWithCustomToken(auth, result.data.customToken);

            setIsLoading(false);
            Alert.alert("Success", "Phone number verified successfully!", [
              {
                text: "Continue",
                onPress: () => navigation.navigate("NameEntry" as never),
              },
            ]);
          } else {
            throw new Error(result.data.message || "Invalid verification code");
          }
        } catch (err: any) {
          // Failure - show error animation
          setIsLoading(false);
          setError(err.message || "Invalid verification code");
          startBreakAnimation();
          Vibration.vibrate([0, 100, 50, 100]);

          // Clear OTP after error with delay for animation
          setTimeout(() => {
            setOtp(["", "", "", "", "", ""]); // Fixed: 6 digits
          }, 1200);
        }
      }
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (!isLoading) {
      const newOtp = [...otp];
      const lastFilledIndex = newOtp
        .map((digit) => digit !== "")
        .lastIndexOf(true);

      if (lastFilledIndex !== -1) {
        newOtp[lastFilledIndex] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the same phone formatting as sendCode
      const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
      const fullPhoneNumber = `${countryCode}${cleanPhoneNumber}`;

      console.log("Resending code to:", fullPhoneNumber);

      const result: any = await resendVerificationCode({
        phoneNumber: fullPhoneNumber,
      });

      if (result.data.success) {
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        Alert.alert("Success", "Verification code resent successfully!");
      } else {
        throw new Error(result.data.message || "Failed to resend code");
      }
    } catch (err: any) {
      console.error("Resend code error:", err);
      setError(err.message || "Failed to resend verification code");
      Alert.alert("Error", err.message || "Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
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
        <TouchableOpacity
          onPress={handleBack}
          className="mr-4"
          disabled={isLoading}
        >
          <Text
            className={`text-2xl ${isLoading ? "text-gray-400" : "text-gray-700"}`}
          >
            ←
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6 pt-4">
        {/* Title Section */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Enter PIN Code 🔐
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            Check your messages! We've sent a 5-digit code to {phoneNumber}.
            Enter the code below to verify your account and continue.
          </Text>
        </View>

        {/* OTP Input Display with break and falling animation */}
        <View className="flex-row justify-center space-x-3 mb-6 gap-1">
          {otp.map((digit, index) => (
            <View key={index} className="relative">
              {/* Main Box */}
              <Animated.View
                style={{
                  transform: [
                    { translateX: boxAnimations[index].shake },
                    { scale: boxAnimations[index].scale },
                    {
                      rotate: boxAnimations[index].rotate.interpolate({
                        inputRange: [-10, 10],
                        outputRange: ["-10deg", "10deg"],
                      }),
                    },
                  ],
                }}
                className={`w-12 h-12 border-2 rounded-xl items-center justify-center ${
                  digit
                    ? "border-blue-500 bg-blue-50"
                    : isLoading
                      ? "border-gray-300"
                      : "border-gray-200"
                }`}
              >
                {/* Number that falls */}
                <Animated.Text
                  style={{
                    transform: [
                      { translateY: boxAnimations[index].fall },
                      {
                        rotate: boxAnimations[index].fall.interpolate({
                          inputRange: [0, 100],
                          outputRange: ["0deg", "360deg"], // Rotate while falling
                        }),
                      },
                    ],
                    opacity: boxAnimations[index].opacity,
                  }}
                  className="text-xl font-bold text-gray-900"
                >
                  {digit}
                </Animated.Text>
              </Animated.View>
            </View>
          ))}
        </View>

        {/* Resend Timer */}
        {!isLoading && (
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
        )}

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
                  className={`w-20 h-16 items-center active:bg-gray-100 justify-center mx-4 rounded-xl`}
                  disabled={item === "•" || isLoading}
                >
                  <Text
                    className={`text-2xl font-medium ${
                      item === "•"
                        ? "text-transparent"
                        : isLoading
                          ? "text-gray-400"
                          : "text-gray-900"
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

      {/* Full Page Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/30 flex-1 justify-center items-center z-50">
          <View className="bg-white w-[60%] h-[20%] rounded-3xl justify-center p-8 items-center shadow-2xl">
            {/* Custom Dots Loader */}
            <View className="mb-6">
              <View className="flex-row space-x-2 gap-1">
                <View className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <View
                  className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0s" }}
                />
                <View
                  className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <View
                  className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </View>
            </View>

            {/* Loading text with animated dots */}
            <View className="flex-row items-center mb-4">
              <Text className="text-gray-700 text-lg font-semibold">
                Verifying PIN
              </Text>
              <View className="flex-row ml-1">
                <Text className="text-blue-500 text-lg font-bold animate-pulse">
                  .
                </Text>
                <Text
                  className="text-blue-500 text-lg font-bold animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                >
                  .
                </Text>
                <Text
                  className="text-blue-500 text-lg font-bold animate-pulse"
                  style={{ animationDelay: "0.6s" }}
                >
                  .
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Error Modal */}
      {error && (
        <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <Text className="text-red-600 text-center text-sm">{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
