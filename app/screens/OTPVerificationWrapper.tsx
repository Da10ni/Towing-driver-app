// Add this to app/screens/OTPVerificationWrapper.tsx
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import OTPVerificationScreen from "./OTPVerificationScreen";

export default function OTPVerificationWrapper() {
  const navigation = useNavigation();
  const route = useRoute();

  // Get phone number from navigation params
  const phoneNumber = (route.params as any)?.phoneNumber || "+1 (555) 123-4567";

  const handleVerify = (otp: string) => {
    // Here you would normally verify OTP with backend
    console.log("Verifying OTP:", otp, "for phone:", phoneNumber);

    // For now, just log - you can add main app navigation later
    console.log("OTP Verified Successfully! Add main app navigation here.");

    // Or go back to phone signup for testing
    // navigation.navigate('PhoneSignUp' as never);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <OTPVerificationScreen
      phoneNumber={phoneNumber}
      onVerify={handleVerify}
      onBack={handleBack}
    />
  );
}
