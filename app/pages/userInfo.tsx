import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useSelector } from "react-redux";

const UserDetails = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userDetails");
    router.push("/pages/LoginScreen");
  };

  const user = JSON.parse(
    useSelector((state: any) => state.events.userDetails)
  );

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: "Profile",
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
          headerBackVisible: true,
        }}
      />
      <ThemedView style={styles.container}>
        <ThemedView
          style={{
            ...styles.card,
            backgroundColor: Colors[colorScheme ?? "dark"].background,
          }}
        >
          <ThemedText type="title" style={styles.title}>
            User Profile
          </ThemedText>
          <ThemedView style={styles.infoRow}>
            <Text
              style={{
                ...styles.label,
                color: Colors[colorScheme ?? "dark"].text,
              }}
            >
              First Name:
            </Text>
            <Text
              style={{
                ...styles.value,
                color: Colors[colorScheme ?? "dark"].text,
              }}
            >
              {user?.firstName}
            </Text>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <Text
              style={{
                ...styles.label,
                color: Colors[colorScheme ?? "dark"].text,
              }}
            >
              Last Name:
            </Text>
            <Text
              style={{
                ...styles.value,
                color: Colors[colorScheme ?? "dark"].text,
              }}
            >
              {user?.lastName}
            </Text>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <Text
              style={{
                ...styles.label,
                color: Colors[colorScheme ?? "dark"].text,
              }}
            >
              Email:
            </Text>
            <Text
              style={{
                ...styles.value,
                color: Colors[colorScheme ?? "dark"].text,
              }}
            >
              {user?.email}
            </Text>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    minHeight: "100%",
    backgroundColor: "transparent",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#ff4d4d",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
