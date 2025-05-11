import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";
import axios from "axios";
import { StarRating } from "@/utils/utils";
export default function CamScanPage() {
  const colorScheme = useColorScheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<any[]>([]);
  const [placeDetail, setPlaceDetail] = useState<any>();
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const { height: screenHeight } = Dimensions.get("window");
  const makeCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("Can't open the link: " + url);
    }
  };
  const openCamera = async () => {
    setPlaceDetail(undefined);
    setLoadingData(true);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Camera access is required to take photos."
      );
      return;
    }

    const photo = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      base64: true,
      quality: 0.7,
    });
    if (!photo.canceled && photo.assets && photo.assets.length > 0) {
      const captured = photo.assets[0];
      setImageUri(captured.uri);

      if (captured.base64) {
        sendToGoogleVision(captured.base64);
      } else {
        Alert.alert("Error", "Could not get base64 image data.");
      }
    } else {
      setLoadingData(false);
    }
  };
  const getPlaceIdFromText = async (query: string) => {
    //fetch PlaceId of the place from the name
    const res = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query,
          key: process.env.EXPO_PUBLIC_API_KEY,
        },
      }
    );
    getPlaceDescription(res.data.results[0]?.place_id);
    return res.data.results[0]?.place_id;
  };
  const getPlaceDescription = async (placeId: string) => {
    //Fetch details against the placeId
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,international_phone_number,formatted_phone_number,opening_hours,rating,website,formatted_address,current_opening_hours,editorial_summary&key=${process.env.EXPO_PUBLIC_API_KEY}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.status === "OK") {
        const result = json.result;
        setPlaceDetail(result);
      } else {
        console.warn(
          "Place details fetch failed:",
          json.status,
          json.error_message
        );
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const sendToGoogleVision = async (base64?: string) => {
    //fetch name of the place
    const requestPayload = {
      requests: [
        {
          image: { content: base64 },
          features: [{ type: "LANDMARK_DETECTION", maxResults: 5 }],
        },
      ],
    };
    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${process.env.EXPO_PUBLIC_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        }
      );
      const json = await response.json();
      const landmarkAnnotations = json?.responses?.[0]?.landmarkAnnotations;
      if (Array.isArray(landmarkAnnotations)) {
        setResult(landmarkAnnotations);
        setLoadingData(false);
      } else {
        console.warn("No landmarks detected or unexpected response format.");
        setResult([]);
        setLoadingData(false);
      }
    } catch (error) {
      console.error("Vision API Error:", error);
      setLoadingData(false);
    }
  };
  useEffect(() => {
    if (result[0]?.description) {
      getPlaceIdFromText(result[0]?.description);
    }
  }, [result]);

  useEffect(() => {
    openCamera();
  }, []);
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView
          style={{ ...styles.scrollBox, minHeight: screenHeight * 0.7 }}
        >
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          {!loadingData ? (
            <ThemedView>
              {result[0]?.description ? (
                <ThemedView>
                  <ThemedView style={styles.titleContainer}>
                    <ThemedText type="default">
                      The image was found to be closest to:
                    </ThemedText>
                    <ThemedText type="title">{placeDetail?.name}</ThemedText>

                    <ThemedText type="title">About</ThemedText>
                    <StarRating rating={placeDetail?.rating ?? 0} />

                    <ThemedText type="default">
                      {placeDetail?.editorial_summary?.overview}
                    </ThemedText>

                    <ThemedText type="subtitle">Address:</ThemedText>
                    <ThemedText>{placeDetail?.formatted_address}</ThemedText>
                    <ThemedText type="subtitle">Contact:</ThemedText>
                    <TouchableOpacity
                      onPress={() =>
                        makeCall(placeDetail?.international_phone_number)
                      }
                    >
                      <ThemedText>Phone:</ThemedText>

                      <ThemedText
                        style={{
                          color: "lightblue",
                          textDecorationLine: "underline",
                        }}
                      >
                        {placeDetail?.international_phone_number ?? "N/A"}
                      </ThemedText>
                    </TouchableOpacity>
                    <ThemedText>Website:</ThemedText>
                    <TouchableOpacity
                      onPress={() => openLink(placeDetail?.website)}
                      style={styles.container}
                    >
                      <ThemedText
                        style={{
                          color: "lightblue",
                          textDecorationLine: "underline",
                        }}
                      >
                        {placeDetail?.website ?? "N/A"}
                      </ThemedText>
                    </TouchableOpacity>
                    <ThemedText type="subtitle">Timings</ThemedText>
                    {placeDetail?.opening_hours?.weekday_text?.map(
                      (item: any, index: number) => (
                        <ThemedView key={index}>
                          <ThemedText>{item}</ThemedText>
                        </ThemedView>
                      )
                    )}
                  </ThemedView>
                </ThemedView>
              ) : (
                <ThemedText>
                  {imageUri &&
                    "  Sorry we are un able to find any match for this image at the moment. Please try again from another angle"}
                </ThemedText>
              )}
            </ThemedView>
          ) : (
            <ThemedView style={styles.Loader}>
              <ActivityIndicator size="large" color="#007AFF" />
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>

      <ThemedView
        style={{
          ...styles.bottomButtonContainer,
          backgroundColor: Colors[colorScheme ?? "light"].tabIconDefault,
        }}
      >
        <TouchableOpacity onPress={openCamera}>
          <Ionicons
            name="camera"
            size={36}
            color={Colors[colorScheme ?? "light"].tabIconSelected}
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    gap: 8,
    padding: 10,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  scrollBox: {
    margin: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "transparent",
    borderRadius: 30,
    padding: 16,
    elevation: 5,
  },
  image: {
    width: "90%",
    height: 250,
    marginTop: 20,
    marginHorizontal: "5%",
    borderRadius: 12,
  },
  Loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
