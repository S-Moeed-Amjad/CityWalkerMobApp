// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addSavedPlace, removeSavedPlace } from "./store/eventSlice";
import { useDispatch } from "react-redux";
import { Alert, View } from "react-native";
import * as Location from "expo-location";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faStar as fullStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";

import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
const STORAGE_KEY = "saved_places";

const savePlacesToStorage = async (places: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  } catch (error) {
    console.error("Failed to save places:", error);
  }
};

const getPlacesFromStorage = async (): Promise<any[] | null> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error("Failed to load places:", error);
    return null;
  }
};
const getDateRangeForMonth = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed (Jan = 0)
  const monthName = today.toLocaleString("default", { month: "long" });

  // Today
  const todayStr = today.toISOString().split("T")[0];

  // End of the current month
  const endOfMonth = new Date(year, month + 1, 0);
  const endOfMonthStr = endOfMonth.toISOString().split("T")[0];

  return {
    today: todayStr,
    endOfMonth: endOfMonthStr,
    currentMonth: monthName,
  };
};

const fetchLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    return loc?.coords;
  } catch (error) {
    console.error(error);
  }
};
const useSavePlaceActions = () => {
  const dispatch = useDispatch();

  const savePlace = (place: any) => {
    dispatch(addSavedPlace(place));
  };

  const unsavePlace = (placeId: any) => {
    dispatch(removeSavedPlace(placeId));
  };

  return { savePlace, unsavePlace };
};
const StarRating = ({
  rating,
  maxStars = 5,
  size = 20,
}: {
  rating: number;
  maxStars?: number;
  size?: number;
}) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      stars.push({
        key: i,
        icon: fullStar,
        size: { size },
        color: "#FFD700",
      });
    } else if (rating >= i - 1) {
      stars.push({
        key: i,
        icon: faStarHalfStroke,
        size: { size },
        color: "#FFD700",
      });
    } else {
      stars.push({
        key: i,
        icon: emptyStar,
        size: { size },
        color: "#FFD700",
      });
    }
  }

  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {stars?.map((item: any) => {
        return (
          <FontAwesomeIcon
            key={item?.key}
            icon={item?.icon}
            size={size}
            color={item?.color}
          />
        );
      })}
    </View>
  );
};
export {
  savePlacesToStorage,
  getPlacesFromStorage,
  getDateRangeForMonth,
  fetchLocation,
  useSavePlaceActions,
  StarRating,
};
