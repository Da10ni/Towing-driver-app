import { functions } from "@/app/utils/configs/firebaseConfig";
import { httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Dashboard {}

export default function Dashboard({}: Dashboard) {
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(2500);
  const [totalRides, setTotalRides] = useState(47);
  const [isLoading, setIsLoading] = useState(false);

  // Ride Request State
  const [hasRideRequest, setHasRideRequest] = useState(false);
  const [riderName, setRiderName] = useState("Ahmed Ali");
  const [distance, setDistance] = useState("0.2km");
  const [timer, setTimer] = useState(15);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (hasRideRequest && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      // Auto decline after 15 seconds
      handleDeclineRide();
    }

    return () => clearInterval(interval);
  }, [hasRideRequest, timer]);

  // Show notification with animation
  useEffect(() => {
    if (hasRideRequest) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [hasRideRequest]);

  // Simulate incoming ride request (for testing)
  useEffect(() => {
    if (isOnline) {
      const timeout = setTimeout(() => {
        simulateRideRequest();
      }, 3000); // 3 seconds after going online

      return () => clearTimeout(timeout);
    }
  }, [isOnline]);

  const simulateRideRequest = () => {
    setHasRideRequest(true);
    setTimer(15);
    setRiderName("Ahmed Ali");
    setDistance("0.2km");
  };

  const handleAcceptRide = () => {
    setHasRideRequest(false);
    setTimer(15);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Alert.alert("Ride Accepted!", `You accepted ${riderName}'s ride request.`);
  };

  const handleDeclineRide = () => {
    // setHasRideRequest(false);
    setTimer(15);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setHasRideRequest(false);
    });
  };

  const updateDriverStatusFunction = httpsCallable(
    functions,
    "updateDriverStatus"
  );

  const toggleOnlineStatus = async () => {
    if (isOnline) {
      Alert.alert("Go Offline", "Are you sure you want to go offline?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            await updateDriverStatusInFirebase(false);
          },
        },
      ]);
    } else {
      await updateDriverStatusInFirebase(true);
    }
  };

  const updateDriverStatusInFirebase = async (newStatus: any) => {
    setIsLoading(true);

    try {
      const result = await updateDriverStatusFunction({
        driverId: "driver_001",
        status: newStatus,
      });

      console.log("✅ Firebase function result:", result.data);
      setIsOnline(newStatus);
      Alert.alert(
        "Success",
        `Driver is now ${newStatus ? "online" : "offline"}`
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to update status. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Driver Dashboard</Text>
          <Text style={styles.subtitle}>
            {isOnline ? "You're Online" : "You're Offline"}
          </Text>
        </View>

        {/* Status Toggle */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusCard,
              { backgroundColor: isOnline ? "#10B981" : "#EF4444" },
            ]}
          >
            <View style={styles.statusHeader}>
              <Text style={styles.statusText}>
                {isOnline ? "ONLINE" : "OFFLINE"}
              </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isOnline ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleOnlineStatus}
                value={isOnline}
                style={styles.switch}
              />
            </View>
            <Text style={styles.statusDescription}>
              {isOnline
                ? "You can receive ride requests"
                : "Tap to go online and start earning"}
            </Text>
          </View>
        </View>
        {/* {hasRideRequest && ( */}
        <Animated.View style={[styles.rideNotification, { opacity: fadeAnim }]}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>New Ride Request</Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{timer}s</Text>
            </View>
          </View>

          <View style={styles.riderInfo}>
            <View style={styles.riderAvatar}>
              <Text style={styles.avatarText}>{riderName.charAt(0)}</Text>
            </View>
            <View style={styles.riderDetails}>
              <Text style={styles.riderName}>{riderName}</Text>
              <Text style={styles.riderDistance}>{distance} away</Text>
            </View>
          </View>

          <View style={styles.requestActions}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={handleDeclineRide}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAcceptRide}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        {/* )} */}

        {/* Current Status */}
        <View style={styles.currentStatus}>
          <Text style={styles.statusMessage}>
            {isOnline ? "🟢 Ready to accept rides" : "🔴 Not accepting rides"}
          </Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  statusContainer: {
    marginBottom: 30,
  },
  statusCard: {
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  statusText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  statusDescription: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    flex: 0.48,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  actionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  currentStatus: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusMessage: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  rideNotification: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    borderLeftWidth: 5,
    borderLeftColor: "#10B981",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  // Header section with title and timer
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    letterSpacing: 0.5,
  },

  // Timer container
  timerContainer: {
    backgroundColor: "#EF4444",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: "center",
  },

  timerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Rider information section
  riderInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
  },

  // Rider avatar
  riderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },

  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  // Rider details
  riderDetails: {
    flex: 1,
  },

  riderName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },

  riderDistance: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },

  // Action buttons container
  requestActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  // Decline button
  declineButton: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    flex: 0.45,
    shadowColor: "#EF4444",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },

  declineButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Accept button
  acceptButton: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    flex: 0.45,
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },

  acceptButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
