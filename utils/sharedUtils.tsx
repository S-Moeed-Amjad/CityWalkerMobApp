import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { setUserDetails } from "@/store/eventSlice";
import { useDispatch } from "react-redux";
const STORAGE_KEY = "saved_places";

const savePlacesToStorage = async (places: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  } catch (error) {
    console.error("Failed to save places:", error);
  }
};

export { savePlacesToStorage };
