// app/screens/OnboardingContainer.tsx
import React, { useRef, useState } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import OnboardingScreen, { onboardingData } from "./OnboardingScreen";

export default function OnboardingContainer() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();

  // Get device width for proper scrolling
  const { width: screenWidth } = Dimensions.get("window");

  // Navigate to next screen
  const goToNext = () => {
    if (currentScreen < onboardingData.length - 1) {
      const nextScreen = currentScreen + 1;
      setCurrentScreen(nextScreen);

      // Scroll to next screen
      scrollViewRef.current?.scrollTo({
        x: nextScreen * screenWidth,
        animated: true,
      });
    }
  };

  // Skip to main app
  const handleSkip = () => {
    navigation.navigate("Home" as never);
  };

  // Complete onboarding (from last screen)
  const handleGetStarted = () => {
    navigation.navigate("PhoneSignUp" as never);
  };

  // Handle manual scroll (when user swipes)
  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const screenIndex = Math.round(scrollX / screenWidth);

    if (
      screenIndex !== currentScreen &&
      screenIndex >= 0 &&
      screenIndex < onboardingData.length
    ) {
      setCurrentScreen(screenIndex);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {/* Dynamically render all screens */}
        {onboardingData.map((content, index) => (
          <View key={index} style={{ width: screenWidth }}>
            <OnboardingScreen
              content={content}
              onContinue={goToNext}
              onSkip={handleSkip}
              onGetStarted={handleGetStarted}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
