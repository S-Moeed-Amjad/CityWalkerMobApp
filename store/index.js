import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./eventSlice";

const Store = configureStore({
  reducer: {
    events: eventReducer,
  },
});

export default Store;
