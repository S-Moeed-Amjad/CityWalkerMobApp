import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { savePlacesToStorage } from "@/utils";

interface EventsState {
  events: any[];
  popularPlaces: any[];
  savedPlaces: any[];
  isLoading: boolean;
}

const initialState: EventsState = {
  events: [],
  popularPlaces: [],
  savedPlaces: [],
  isLoading: true,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setEvents: (state, action: PayloadAction<any[]>) => {
      state.events = action.payload;
    },
    setPopularPlaces: (state, action: PayloadAction<any[]>) => {
      state.popularPlaces = action.payload;
    },
    setSavedPlaces: (state, action: PayloadAction<any[]>) => {
      state.savedPlaces = action.payload;
      savePlacesToStorage(state.savedPlaces);
    },
    addSavedPlace: (state, action: PayloadAction<any>) => {
      state.savedPlaces.push(action.payload);
      savePlacesToStorage(state.savedPlaces);
    },
    removeSavedPlace: (state, action: PayloadAction<string>) => {
      state.savedPlaces = state.savedPlaces.filter(
        (place) => place.id !== action.payload
      );
      savePlacesToStorage(state.savedPlaces);
    },
  },
});

export const {
  setEvents,
  setPopularPlaces,
  setSavedPlaces,
  addSavedPlace,
  removeSavedPlace,
  setIsLoading,
} = eventsSlice.actions;

export default eventsSlice.reducer;
