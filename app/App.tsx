import "@/global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./index";
import OTPVerificationWrapper from "./screens/OTPVerification/OTPVerification";
import PhoneSignUpWrapper from "./screens/PhoneSignUp/PhoneSignUp";

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
    </Stack.Navigator>
  );
}
