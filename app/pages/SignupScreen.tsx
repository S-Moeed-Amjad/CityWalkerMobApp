import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { router, Stack } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");
const SignupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const skipLogin = async () => {
    const userDetails = { email: "Guest", firstName: "Guest", lastName: "" };
    await AsyncStorage.setItem("userToken", "skip-token-forlogin");
    await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));
    router.push("/(tabs)");
  };
  const handleSignup = async () => {
    if (isLoading) return;
    const isValid = validateAndSubmit();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.0.55:5500/api/auth/signup",
        {
          email,
          password,
          firstName,
          lastName,
        }
      );
      Alert.alert("Success", response.data.message);
      router.push("/pages/LoginScreen");
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.response?.data?.message || "An error occurred"
      );
    }
  };

  const validateAndSubmit = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters."
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return false;
    }
    return true;
    // If validation passes, you can call your API here
    // Example: await api.signup({ firstName, lastName, email, password })
  };
  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: "",
          headerBackTitle: "",
          headerBackButtonDisplayMode: "minimal",
          headerBackVisible: false,
        }}
      />

      <ThemedView style={styles.container}>
        <View
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
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={{
              ...styles.inputName,
              color: Colors[colorScheme ?? "dark"].text,
              borderColor: Colors[colorScheme ?? "dark"].text,
            }}
            autoCapitalize="words"
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={{
              ...styles.inputName,
              color: Colors[colorScheme ?? "dark"].text,
              borderColor: Colors[colorScheme ?? "dark"].text,
            }}
            autoCapitalize="words"
          />
        </View>
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
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={{
            ...styles.input,
            color: Colors[colorScheme ?? "dark"].text,
            borderColor: Colors[colorScheme ?? "dark"].text,
          }}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{
            ...styles.input,
            color: Colors[colorScheme ?? "dark"].text,
            borderColor: Colors[colorScheme ?? "dark"].text,
          }}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.signupButton, isLoading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              style={{
                ...styles.signupText,
                color: Colors[colorScheme === "dark" ? "light" : "dark"].text,
              }}
            >
              Sign Up
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <ThemedText style={{ marginRight: 5 }}>
            If you already have an account:
          </ThemedText>
          <TouchableOpacity
            onPress={() => {
              router.push("/pages/LoginScreen");
            }}
          >
            <ThemedText
              style={{ color: "#40bfff", textDecorationLine: "underline" }}
            >
              Login
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <ThemedText>Or</ThemedText>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <TouchableOpacity onPress={skipLogin}>
            <ThemedText
              style={{ color: "#40bfff", textDecorationLine: "underline" }}
            >
              Skip
            </ThemedText>
          </TouchableOpacity>
          <ThemedText style={{ marginRight: 5 }}> for now</ThemedText>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    minHeight: "100%",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  inputName: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    width: width * 0.44,
    borderRadius: 5,
  },
  signupButton: {
    backgroundColor: "#40bfff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  signupText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
