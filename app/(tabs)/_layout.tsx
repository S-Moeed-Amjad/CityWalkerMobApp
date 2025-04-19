import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSelector } from "react-redux";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isLoading = useSelector((state: any) => state.events.isLoading);
  return (
    <Tabs
      screenOptions={{
        headerTitle: () => (
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 30, color: "#082d77" }}
            >
              City
            </Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 30, color: "#40bfff" }}
            >
              Walker
            </Text>
          </View>
        ), // Custom component for title
        // headerRight: () => (
        //   <IconSymbol
        //     size={38}
        //     name="circle.fill"
        //     color={Colors[colorScheme ?? "light"].icon}
        //     style={{ margin: 20 }}
        //   />
        // ), // Custom component for right side
        // headerLeft: () => <Text>left button</Text>, // Custom component for left side
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: isLoading ? false : true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",

          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore/index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="map.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="savedPlaces/index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bookmark.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account/index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
