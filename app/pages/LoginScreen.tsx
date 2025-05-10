import React, { useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Stack, useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width } = Dimensions.get("window");
import { API_URL } from "@env";
const LoginScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const skipLogin = async () => {
    const userDetails = { email: "Guest", firstName: "Guest", lastName: "" };
    await AsyncStorage.setItem("userToken", "skip-token-forlogin");
    await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));
    router.push("/(tabs)");
  };
  const handleLogin = async () => {
    if (loading) return;
    const isValid = validateAndSubmit();
    if (!isValid) return;
    console.log("env", API_URL);

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      const userDetails = response.data.userDetails;

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));

      Alert.alert("Login Successfull");
      router.push("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "An error occurred"
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const colorScheme = useColorScheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateAndSubmit = () => {
    if (!email || !password) {
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

    return true;
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
        <TouchableOpacity //forgot password
          onPress={() => {
            router.push("/pages/forgotPassword");
          }}
        >
          <ThemedText
            style={{ color: "#40bfff", textDecorationLine: "underline" }}
          >
            Forgot Password
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity //login button
          style={[styles.signupButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              style={{
                ...styles.signupText,
                color: Colors[colorScheme === "dark" ? "light" : "dark"].text,
              }}
            >
              Login
            </Text>
          )}
        </TouchableOpacity>
        <View //redirect to signup
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
        <View //skip
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

export default LoginScreen;

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
