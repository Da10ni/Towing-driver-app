import "@/global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./index";
import OnboardingContainer from "./screens/OnboardingContainer";
import OTPVerificationWrapper from "./screens/OTPVerificationWrapper";
import PhoneSignUpWrapper from "./screens/PhoneSignUpWrapper";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
          title: "Welcome",
        }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingContainer}
        options={{
          headerShown: false,
          title: "Onboarding",
        }}
      />
      <Stack.Screen
        name="PhoneSignUp"
        component={PhoneSignUpWrapper}
        options={{
          headerShown: false,
          title: "Onboarding",
        }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationWrapper}
        options={{
          headerShown: false,
          title: "Onboarding",
        }}
      />
      {/* <Stack.Screen
        name="Home"
        component={() => (
          <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-2xl font-bold text-blue-600 mb-4">
              🎉 Welcome to GoRide!
            </Text>
            <Text className="text-gray-600 text-center px-8">
              Main app content will go here. You've completed the onboarding
              flow!
            </Text>
          </View>
        )}
        options={{
          headerShown: false,
          title: "Home",
        }}
      /> */}
    </Stack.Navigator>
  );
}
