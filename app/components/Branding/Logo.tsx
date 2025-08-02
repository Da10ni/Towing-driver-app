// app/components/Branding/Logo.tsx
import React from "react";
import { View, Text } from "react-native";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  textColor?: string;
}

export default function Logo({
  size = "large",
  showText = true,
  textColor = "#FFFFFF",
}: LogoProps) {
  // Different sizes for different screens
  const logoSizes = {
    small: {
      container: 60,
      mainShape: 40,
      circleSize: 16,
      lineWidth: 12,
      lineHeight: 3,
      brandFontSize: 16,
      marginBottom: showText ? 12 : 0,
    },
    medium: {
      container: 80,
      mainShape: 52,
      circleSize: 20,
      lineWidth: 16,
      lineHeight: 4,
      brandFontSize: 20,
      marginBottom: showText ? 16 : 0,
    },
    large: {
      container: 100,
      mainShape: 64,
      circleSize: 24,
      lineWidth: 20,
      lineHeight: 4,
      brandFontSize: 24,
      marginBottom: showText ? 20 : 0,
    },
  };

  const currentSize = logoSizes[size];

  return (
    <View className="items-center">
      {/* RoadRescue Logo - Visual Design */}
      <View
        style={{
          width: currentSize.container,
          height: currentSize.container,
          marginBottom: currentSize.marginBottom,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Main Shape - Rounded Rectangle (represents road/vehicle) */}
        <View
          style={{
            width: currentSize.mainShape,
            height: currentSize.mainShape * 0.6,
            backgroundColor: textColor,
            borderRadius: currentSize.mainShape * 0.3,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Center Circle (represents rescue/help) */}
          <View
            style={{
              width: currentSize.circleSize,
              height: currentSize.circleSize,
              borderRadius: currentSize.circleSize / 2,
              borderWidth: 3,
              borderColor: "#10B981",
              backgroundColor: "transparent",
            }}
          />

          {/* Speed/Movement Lines - Left Side */}
          <View
            style={{
              position: "absolute",
              left: -currentSize.lineWidth - 4,
              alignItems: "flex-end",
            }}
          >
            <View
              style={{
                width: currentSize.lineWidth,
                height: currentSize.lineHeight,
                backgroundColor: textColor,
                borderRadius: currentSize.lineHeight / 2,
                marginBottom: 2,
              }}
            />
            <View
              style={{
                width: currentSize.lineWidth * 0.75,
                height: currentSize.lineHeight,
                backgroundColor: textColor,
                borderRadius: currentSize.lineHeight / 2,
                marginBottom: 2,
              }}
            />
            <View
              style={{
                width: currentSize.lineWidth * 0.5,
                height: currentSize.lineHeight,
                backgroundColor: textColor,
                borderRadius: currentSize.lineHeight / 2,
              }}
            />
          </View>
        </View>
      </View>

      {/* Brand Text */}
      {showText && (
        <Text
          style={{
            fontSize: currentSize.brandFontSize,
            color: textColor,
            fontWeight: "600",
            letterSpacing: 0.5,
            textAlign: "center",
          }}
        >
          RoadRescue
        </Text>
      )}
    </View>
  );
}
