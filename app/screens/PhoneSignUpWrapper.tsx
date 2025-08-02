// Add this to app/screens/PhoneSignUpWrapper.tsx
import React from "react";
import { useNavigation } from "@react-navigation/native";
import PhoneSignUpScreen from "./PhoneSignUpScreen";

export default function PhoneSignUpWrapper() {
  const navigation = useNavigation();

  const handleContinue = (phoneNumber: string) => {
    // Navigate to OTP screen with phone number - Fixed syntax
    (navigation as any).navigate("OTPVerification", { phoneNumber });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return <PhoneSignUpScreen onContinue={handleContinue} onBack={handleBack} />;
}
