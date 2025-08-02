// app/components/Layout/ScreenContainer.tsx
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: "light" | "dark" | "auto";
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export default function ScreenContainer({
  children,
  backgroundColor = "#10B981", // blue-500
  statusBarStyle = "light",
  edges = ["top", "bottom"],
}: ScreenContainerProps) {
  return (
    <>
      {/* Status Bar - Controls the phone's top bar */}
      <StatusBar style={statusBarStyle} backgroundColor={backgroundColor} />

      {/* Safe Area - Prevents content from going behind notches/home indicators */}
      <SafeAreaView style={{ flex: 1, backgroundColor }} edges={edges}>
        {/* Main Content Container */}
        <View style={{ flex: 1, backgroundColor }}>{children}</View>
      </SafeAreaView>
    </>
  );
}
