// app/components/Buttons/Button.tsx
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = true,
}: ButtonProps) {
  // Button size configurations
  const sizeConfig = {
    small: {
      height: "h-10", // 40px
      padding: "px-4", // 16px horizontal
      textSize: "text-sm", // 14px
    },
    medium: {
      height: "h-12", // 48px
      padding: "px-6", // 24px horizontal
      textSize: "text-base", // 16px
    },
    large: {
      height: "h-14", // 56px
      padding: "px-8", // 32px horizontal
      textSize: "text-lg", // 18px
    },
  };

  // Button variant configurations
  const variantConfig = {
    primary: {
      background: disabled ? "bg-gray-300" : "bg-blue-500",
      textColor: disabled ? "text-gray-500" : "text-white",
      border: "",
    },
    secondary: {
      background: disabled ? "bg-gray-100" : "bg-white",
      textColor: disabled ? "text-gray-400" : "text-blue-500",
      border: disabled ? "border border-gray-200" : "border border-blue-500",
    },
    outline: {
      background: "bg-transparent",
      textColor: disabled ? "text-gray-400" : "text-blue-500",
      border: disabled ? "border border-gray-200" : "border border-blue-500",
    },
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  // Combine all classes
  const buttonClasses = [
    currentSize.height,
    currentSize.padding,
    currentVariant.background,
    currentVariant.border,
    fullWidth ? "w-full" : "",
    "rounded-xl",
    "justify-center",
    "items-center",
    "flex-row",
    disabled ? "opacity-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const textClasses = [
    currentSize.textSize,
    currentVariant.textColor,
    "font-semibold",
  ].join(" ");

  return (
    <TouchableOpacity
      className={buttonClasses}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <>
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#FFFFFF" : "#10B981"}
            className="mr-2"
          />
          <Text className={textClasses}>Loading...</Text>
        </>
      ) : (
        <Text className={textClasses}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
