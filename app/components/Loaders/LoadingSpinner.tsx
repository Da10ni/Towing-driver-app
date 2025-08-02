// app/components/Loaders/LoadingSpinner.tsx
import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export default function LoadingSpinner({
  size = 40,
  color = "#FFFFFF",
}: LoadingSpinnerProps) {
  // Create animated value - this will control the rotation
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create the spinning animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1, // Rotate to 360 degrees
        duration: 1000, // Takes 1 second to complete one rotation
        easing: Easing.linear, // Constant speed rotation
        useNativeDriver: true, // Better performance
      })
    );

    // Start the animation
    spinAnimation.start();

    // Cleanup function - stops animation when component unmounts
    return () => spinAnimation.stop();
  }, [spinValue]);

  // Convert the animated value (0 to 1) into rotation degrees (0deg to 360deg)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2, // Makes it perfectly circular
        borderWidth: 3,
        borderColor: color,
        borderTopColor: "transparent", // Creates the "loading" gap
        transform: [{ rotate: spin }], // Apply the rotation animation
      }}
    />
  );
}
