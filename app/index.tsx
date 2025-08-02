// app/index.tsx
import React from "react";
import { useNavigation } from "@react-navigation/native";
import WelcomeScreen from "./screens/splashScreens/welcomeScreen";

export default function Index() {
  const navigation = useNavigation();

  const handleComplete = () => {
    // Navigate to onboarding screen after welcome screen completes
    navigation.navigate("Onboarding" as never);
  };

  return <WelcomeScreen onComplete={handleComplete} />;
}
