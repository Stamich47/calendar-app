import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./dataSlice";

export const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
});
