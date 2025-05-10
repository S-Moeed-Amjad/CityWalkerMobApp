import {
  StyleSheet,
  Platform,
  View,
  Text,
  Alert,
  Animated,
  TouchableOpacity,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import PopularCarosel from "./components/popularList";
import EventCarosel from "./components/eventsList";
import SavedCarosel from "./components/savedList";
import { useDispatch, useSelector } from "react-redux";
import LoadPlacesOnStart from "@/app/helper";
import LoadingScreen from "./components/LoadingScreen";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserDetails } from "@/store/eventSlice";

const HomeScreen = () => {
  const popularPlacesList = useSelector(
    (state: any) => state.events.popularPlaces
  );
  const savedPlaces = useSelector((state: any) => state.events.savedPlaces);
  const router = useRouter();
  const events = useSelector((state: any) => state.events.events);
  const isLoading = useSelector((state: any) => state.events.isLoading);
  const slideAnim = useRef(new Animated.Value(100)).current; // Start 100px below

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, // Move to natural position
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const userDetails = await AsyncStorage.getItem("userDetails");

      dispatch(setUserDetails(userDetails));
      if (!token) {
        // Navigate to home or set authenticated state
        router.push("/pages/LoginScreen");
      }
    };
    checkSession();
  }, []);
  return isLoading ? (
    <>
      <LoadPlacesOnStart />
      <LoadingScreen />
    </>
  ) : (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <ThemedView style={styles.titleContainer}>
        <Animated.View style={[{ transform: [{ translateY: slideAnim }] }]}>
          <View
            style={{
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
            }}
          >
            <ThemedText type="subtitle">Popular</ThemedText>
            <TouchableOpacity
              onPress={() => {
                router.push("/explore");
              }}
            >
              <Text style={styles?.viewAll}>view all</Text>
            </TouchableOpacity>
          </View>
          {popularPlacesList?.length > 0 ? (
            <PopularCarosel data={popularPlacesList.slice(0, 6)} /> //custom component to display popular places
          ) : (
            <ThemedText
              style={{
                textAlign: "center",
              }}
              type="default"
            >
              No Popular Places Nearby
            </ThemedText>
          )}
          <ThemedView style={styles.emptyView}></ThemedView>
          <View
            style={{
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "row" /* Horizontal layout */,
              alignItems: "center",
            }}
          >
            <ThemedText type="subtitle">Events</ThemedText>
            <TouchableOpacity
              onPress={() => {
                router.push("/events");
              }}
            >
              <Text style={styles?.viewAll}>view all</Text>
            </TouchableOpacity>
          </View>
          <View>
            {events?.length > 0 ? (
              <EventCarosel //custom component to display Events nearby
                data={events.length > 0 ? events.slice(0, 6) : []}
              />
            ) : (
              <ThemedText
                style={{
                  textAlign: "center",
                }}
                type="default"
              >
                No Events Nearby
              </ThemedText>
            )}
          </View>
          <ThemedView style={styles.emptyView}></ThemedView>
          <View
            style={{
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "row" /* Horizontal layout */,
              alignItems: "center",
            }}
          >
            <ThemedText type="subtitle">Saved</ThemedText>
            <TouchableOpacity
              onPress={() => {
                router.push("/savedPlaces");
              }}
            >
              <Text style={styles?.viewAll}>view all</Text>
            </TouchableOpacity>
          </View>
          <View>
            {savedPlaces?.length > 0 ? (
              <SavedCarosel //custom component to display saved places
                data={savedPlaces.length > 0 ? savedPlaces.slice(0, 6) : []}
              />
            ) : (
              <ThemedText
                style={{
                  textAlign: "center",
                }}
                type="default"
              >
                No Saved Places
              </ThemedText>
            )}
          </View>
        </Animated.View>
      </ThemedView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  emptyView: {
    paddingTop: 30,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  viewAll: {
    color: "#40bfff",
  },
});

export default HomeScreen;
