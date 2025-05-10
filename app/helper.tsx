// App.tsx or RootLayout.tsx (if using Expo Router)
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setEvents,
  setSavedPlaces,
  setPopularPlaces,
  setIsLoading,
} from "@/store/eventSlice";
import { Alert } from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { getDateRangeForMonth, getPlacesFromStorage } from "@/utils/utils";
import { API_KEY } from "@env";

const LoadPlacesOnStart = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState<any>();
  const [city, setCity] = useState<any>();

  const { today, endOfMonth } = getDateRangeForMonth();
  const fetchLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc?.coords);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchNearbyPlaces = async () => {
    const url = "https://places.googleapis.com/v1/places:searchNearby?fields=*";

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": `${API_KEY}`,
    };
    const body = {
      includedTypes: ["tourist_attraction"], // add something useful
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: location?.latitude ?? 52.4826,
            longitude: location?.longitude ?? -1.8903,
          },
          radius: 5000,
        },
      },
      rankPreference: "DISTANCE", // or "DISTANCE"
    };

    try {
      const response = await axios.post(url, body, { headers });
      const places =
        response.data?.places.map((item: any) => {
          const photoRef = item?.photos?.[0]?.name; // e.g., "places/ChIJrTLr-GyuEmsRBfy61i59si0/photos/..."
          const getPhotoUrl = (photoName: string) => {
            return `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxHeightPx=400&maxWidthPx=400`;
          };
          return {
            ...item,
            title: item?.displayName.text,
            imageUrl: getPhotoUrl(photoRef),
          };
        }) || [];

      dispatch(setPopularPlaces(places));
    } catch (error: any) {
      dispatch(setPopularPlaces([]));

      Alert.alert(
        "Error",
        error.response?.data?.error?.message || error.message || "Unknown error"
      );
    }
  };
  const getCityFromLocation = async () => {
    const coords = location;
    if (!coords) return;

    const geocode = await Location.reverseGeocodeAsync(coords);

    if (geocode.length > 0) {
      const { city, region, country } = geocode[0];
      setCity(city);
      return city;
    }
  };
  const fetchNearbyEvents = async () => {
    const url = `https://www.skiddle.com/api/v1/events/search/?api_key=04231e8501c33986ba543ea271491d62&latitude=${
      location?.latitude ?? 52.4826
    }&longitude=${
      location?.longitude ?? -1.8903
    }&radius=20&order=distance&description=1&minDate=${today}&maxDate=${endOfMonth}&getDistance=1`;

    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Key": "962fa25b28msh3290e9c4805a653p1f5565jsnaf1a78dbb1e7", // ✅ Correct key
      "X-RapidAPI-Host": "facebook-events2.p.rapidapi.com",
    };

    const body = {
      //   searchTerm: city, // Keep it simple for better results
      //   minDate: today,
      //   maxDate: endOfMonth,
      //   cursor: null,
      //   locationId: null,
      //   latitude: location?.latitude ?? 52.4826,
      //   longitude: location?.longitude ?? -1.8903,
      //   radius: 20,
      //   getDistance: true,
      //   keyword: city,
    };

    try {
      const response = await axios.get(url);
      const events = response.data || [];
      dispatch(setEvents(events?.results));
      dispatch(setIsLoading(false));
    } catch (error: any) {
      dispatch(setEvents([]));
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchLocation();
    const loadData = async () => {
      const saved = await getPlacesFromStorage();
      if (saved) dispatch(setSavedPlaces(saved));
    };
    loadData();
  }, []);
  useEffect(() => {
    if (location?.latitude) {
      fetchNearbyPlaces();
      getCityFromLocation();
    }
  }, [location]);
  useEffect(() => {
    if (city) {
      fetchNearbyEvents();
    }
  }, [city]);

  return null;
};
export default LoadPlacesOnStart;
