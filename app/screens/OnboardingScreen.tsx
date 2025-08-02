// app/screens/OnboardingScreen.tsx
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Buttons/Button";

// Interface for screen content
export interface OnboardingContent {
  title: string;
  description: string;
  imageUrl: string;
  currentStep: number; // 0, 1, or 2
  totalSteps: number; // Always 3
  isLastScreen: boolean;
}

// Data array - Driver App onboarding content
export const onboardingData: OnboardingContent[] = [
  // Screen 1 - Job Acceptance
  {
    title: "Job Acceptance - Be Ready for Every Call",
    description:
      "As a driver, you're always ready to respond to new jobs. Accept emergency towing requests and start your shift right away. Stay connected to the system to never miss a job.",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1681821679118-bb069eeb2d98?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpdmVyfGVufDB8fDB8fHww",
    currentStep: 0,
    totalSteps: 3,
    isLastScreen: false,
  },

  // Screen 2 - Navigation and Route Management
  {
    title: "Navigation - Get to the Scene Fast",
    description:
      "Navigate easily to the scene using optimized routes. Our in-app GPS ensures you're taking the fastest, safest path to your destination for every job.",
    imageUrl:
      "https://media.istockphoto.com/id/2198562665/photo/crowdsourced-taxi-driver-talking-to-a-passenger-in-the-back-seat.webp?a=1&b=1&s=612x612&w=0&k=20&c=gpgYaFHz-EQshzYpJlB-VgBvKWubYVHkGiwi0Ci_-Bk=",
    currentStep: 1,
    totalSteps: 3,
    isLastScreen: false,
  },

  // Screen 3 - Payment and Ratings
  {
    title: "Payment & Ratings - Get Paid and Receive Feedback",
    description:
      "After each successful job, receive your payment directly through the app. Collect ratings from customers to improve your service and grow your career.",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661714065634-e6430d1f2ff7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGRyaXZlcnxlbnwwfHwwfHx8MA%3D%3D",
    currentStep: 2,
    totalSteps: 3,
    isLastScreen: true,
  },
];

interface OnboardingScreenProps {
  content: OnboardingContent;
  onContinue: () => void;
  onSkip: () => void;
  onGetStarted?: () => void; // Only for last screen
}

export default function OnboardingScreen({
  content,
  onContinue,
  onSkip,
  onGetStarted,
}: OnboardingScreenProps) {
  // Generate pagination dots dynamically
  const renderPaginationDots = () => {
    const dots = [];
    for (let i = 0; i < content.totalSteps; i++) {
      const isActive = i === content.currentStep;
      dots.push(
        <View
          key={i}
          className={` ${
            isActive ? "w-8 h-2 bg-blue-500" : "w-2 h-2  bg-gray-300"
          } rounded-full`}
        />
      );
    }
    return dots;
  };

  // Handle button press - different for last screen
  const handleMainButtonPress = () => {
    if (content.isLastScreen && onGetStarted) {
      onGetStarted();
    } else {
      onContinue();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" backgroundColor="#FFFFFF" />

      {/* Skip Button */}
      <View className="flex-row justify-end p-6">
        <Button
          title="Skip"
          variant="outline"
          size="small"
          fullWidth={false}
          onPress={onSkip}
        />
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6">
        {/* Image Section */}
        <View className="flex-1 justify-center items-center">
          <Image
            source={{ uri: content.imageUrl }}
            className="w-80 h-80 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Text Content */}
        <View className="pb-8">
          <Text className="text-3xl font-bold text-gray-800 text-center mb-4">
            {content.title}
          </Text>
          <Text className="text-base text-gray-600 text-center leading-6 mb-8">
            {content.description}
          </Text>

          {/* Dynamic Pagination Dots */}
          <View className="flex-row justify-center space-x-2 gap-2 mb-8">
            {renderPaginationDots()}
          </View>

          {/* Dynamic Button */}
          <Button
            title={content.isLastScreen ? "Let's Get Started" : "Continue"}
            onPress={handleMainButtonPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
