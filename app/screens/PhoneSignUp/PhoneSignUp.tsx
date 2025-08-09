import Button from "@/app/components/Buttons/Button";
import { auth, functions } from "@/app/utils/configs/firebaseConfig";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { httpsCallable } from "firebase/functions";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Flag from "react-native-flags";
import { SafeAreaView } from "react-native-safe-area-context";
import countries from "world-countries";

interface PhoneSignUpScreenProps {
  onVerificationSuccess?: (userData: any) => void;
}

export default function PhoneSignUpScreen({
  onVerificationSuccess,
}: PhoneSignUpScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedCountryPhoneCode, setSelectedCountryPhoneCode] =
    useState<string>("");
  const [showCountryPickerModal, setShowCountryPickerModal] =
    useState<boolean>(false);
  const [searchCountry, setSearchedCountry] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();
  const sendVerificationCode = httpsCallable(functions, "sendVerificationCode");

  const filteredCountries = countries
    .filter(
      (country) =>
        country.name.common
          .toLowerCase()
          .includes(searchCountry.toLowerCase()) ||
        country.cca2.toLowerCase().includes(searchCountry.toLowerCase())
    )
    .sort((a, b) => a.name.common.localeCompare(b.name.common));

  function getFormattedPhoneCode(countryCode: string) {
    const country = countries.find(
      (c) => c.cca2?.toLowerCase() === countryCode?.toLowerCase()
    );
    if (!country || !country.idd.root) return "";

    const root = country.idd.root;
    const suffix = country.idd.suffixes?.[0] || "";
    return root + suffix;
  }

  // Initialize with US as default
  useMemo(() => {
    const initialCountry = countries.find((country) =>
      country.altSpellings.includes("US")
    );
    if (initialCountry) {
      setSelectedCountry(initialCountry);
      setSelectedCountryCode(initialCountry.cca2);
      setSelectedCountryPhoneCode(getFormattedPhoneCode(initialCountry.cca2));
    }
  }, []);

  const isValidForm =
    phoneNumber.length >= 10 && phoneNumber.length <= 15 && isAgreed;

  const renderCountryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setSelectedCountry(item);
        setSelectedCountryCode(item.cca2);
        setSelectedCountryPhoneCode(getFormattedPhoneCode(item.cca2));
        setShowCountryPickerModal(false);
        setSearchedCountry("");
      }}
    >
      <Flag code={item.cca2} size={24} />
      <Text style={styles.countryName}>{item.name.common}</Text>
      <Text style={styles.countryCode}>{getFormattedPhoneCode(item.cca2)}</Text>
    </TouchableOpacity>
  );

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }

    if (!isAgreed) {
      Alert.alert("Error", "Please agree to the Terms & Conditions");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
      const fullPhoneNumber = `${selectedCountryPhoneCode}${cleanPhoneNumber}`;

      const result: any = await sendVerificationCode({
        phoneNumber: fullPhoneNumber,
      });

      if (result.data.success) {
        Alert.alert("Success", "Verification code sent to your phone!");
        (navigation as any).navigate("OTPVerification" as never, {
          phoneNumber: fullPhoneNumber,
          countryCode: selectedCountryPhoneCode,
        });
      } else {
        throw new Error(result.data.message || "Failed to send code");
      }
    } catch (err: any) {
      console.error("Send code error:", err);
      setError(err.message || "Failed to send verification code");
      Alert.alert("Error", err.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="flex-row items-center p-6 pb-0">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View className="flex-1 px-6 pt-4">
          {/* Title */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Join RoadRescue Today ✨
            </Text>
            <Text className="text-base text-gray-600 leading-6">
              Let's get started! Enter your phone number to create your
              RoadRescue account.
            </Text>
          </View>

          {/* Phone Input */}
          <View className="mb-6">
            <Text className="text-base font-medium text-gray-900 mb-3">
              Phone Number
            </Text>

            <View className="flex-row border border-gray-200 rounded-xl overflow-hidden">
              {/* Country Selector */}
              <TouchableOpacity
                className="flex-row items-center px-4 py-4 bg-gray-50 border-r border-gray-200"
                onPress={() => setShowCountryPickerModal(true)}
              >
                {selectedCountry ? (
                  <>
                    <Flag code={selectedCountryCode} size={24} />
                    <Text className="text-base font-medium text-gray-700 ml-1">
                      {selectedCountryPhoneCode}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text className="text-lg mr-2">🇺🇸</Text>
                    <Text className="text-base font-medium text-gray-700 mr-1">
                      +1
                    </Text>
                    <Text className="text-gray-400">▼</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Phone Input */}
              <TextInput
                className="flex-1 px-4 py-4 text-base text-gray-900"
                placeholder="Phone Number"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
          </View>

          {/* Terms Checkbox */}
          <TouchableOpacity
            onPress={() => setIsAgreed(!isAgreed)}
            className="flex-row items-start mb-8"
          >
            <View
              className={`w-5 h-5 mr-3 mt-0.5 border-2 rounded ${
                isAgreed
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-gray-300"
              } items-center justify-center`}
            >
              {isAgreed && (
                <Text className="text-white text-xs font-bold">✓</Text>
              )}
            </View>
            <Text className="text-sm text-gray-700 flex-1 leading-5">
              I agree to RoadRescue{" "}
              <Text className="text-emerald-600 font-medium">
                Terms & Conditions
              </Text>
              .
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          {/* <View className="flex-row justify-center mb-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity>
              <Text className="text-emerald-600 font-medium">Sign in</Text>
            </TouchableOpacity>
          </View> */}

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          )}

          <View className="flex-1" />

          {/* Send Button */}
          <View className="pb-6">
            <Button
              title={loading ? "Sending..." : "Send Verification Code"}
              onPress={handleSendCode}
              disabled={!isValidForm || loading}
            />
          </View>
        </View>

        {/* Country Picker Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCountryPickerModal}
          onRequestClose={() => setShowCountryPickerModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setShowCountryPickerModal(false);
                    setSearchedCountry("");
                  }}
                >
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                value={searchCountry}
                onChangeText={setSearchedCountry}
              />

              <FlatList
                data={filteredCountries}
                keyExtractor={(item) => item.cca2}
                renderItem={renderCountryItem}
                style={styles.countriesList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    margin: 20,
    maxHeight: "80%",
    width: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
  searchInput: {
    margin: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  countriesList: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  countryName: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  countryCode: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});
