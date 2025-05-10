import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Validation", "Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/auth/forgetpassword`, {
        email,
        newPassword,
      });

      Alert.alert("Password Reset Successfull", response?.data?.message);
      router.push("/pages/LoginScreen");
    } catch (error: any) {
      Alert.alert(
        "Failed to reset password",
        error.response?.data?.message || "An error occurred"
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
          headerBackVisible: true,
        }}
      />

      <ThemedView style={styles.container}>
        <View //header logo
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 100,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 50, color: "#082d77" }}>
            City
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 50, color: "#40bfff" }}>
            Walker
          </Text>
        </View>
        <ThemedText style={styles.title} type="title">
          Forgot Password
        </ThemedText>
        <ThemedText style={styles.subtitle} type="default">
          Enter your registered email & New Password.
        </ThemedText>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            ...styles.input,
            color: Colors[colorScheme ?? "dark"].text,
            borderColor: Colors[colorScheme ?? "dark"].text,
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          style={{
            ...styles.input,
            color: Colors[colorScheme ?? "dark"].text,
            borderColor: Colors[colorScheme ?? "dark"].text,
          }}
          secureTextEntry
        />

        <TouchableOpacity //submit button
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              style={{
                ...styles.buttonText,
                color: Colors[colorScheme === "dark" ? "light" : "dark"].text,
              }}
            >
              Submit
            </Text>
          )}
        </TouchableOpacity>
        <View //redirect to sign up
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <ThemedText style={{ marginRight: 5 }}>
            If you dont have an account:
          </ThemedText>
          <TouchableOpacity
            onPress={() => {
              router.push("/pages/SignupScreen");
            }}
          >
            <ThemedText
              style={{ color: "#40bfff", textDecorationLine: "underline" }}
            >
              Sign Up
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#40bfff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
