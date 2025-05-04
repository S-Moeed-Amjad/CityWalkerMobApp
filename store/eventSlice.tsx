import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { savePlacesToStorage } from "@/utils/sharedUtils";

interface EventsState {
  events: any[];
  popularPlaces: any[];
  savedPlaces: any[];
  isLoading: boolean;
  sessionToken?: string;
  userDetails?: any;
}

const initialState: EventsState = {
  events: [],
  popularPlaces: [],
  savedPlaces: [],
  isLoading: true,
  sessionToken: undefined,
  userDetails: {},
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserDetails: (state, action: PayloadAction<any>) => {
      state.userDetails = action.payload;
    },
    setSessionToken: (state, action: PayloadAction<string>) => {
      state.sessionToken = action.payload;
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
  setSessionToken,
  setUserDetails,
} = eventsSlice.actions;

export default eventsSlice.reducer;
