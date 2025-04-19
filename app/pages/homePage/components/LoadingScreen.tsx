import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const LoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        <Text style={{ fontWeight: "bold", fontSize: 45, color: "#082d77" }}>
          City
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 45, color: "#40bfff" }}>
          Walker
        </Text>
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: useColorScheme() ?? "light",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#4F46E5",
    fontWeight: "bold",
  },
});

export default LoadingScreen;
