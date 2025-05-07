import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const { data, error } = await supabase.from("events").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
});

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearEvents: (state) => {
      state.events = []; // Clear events when the user logs out
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload; // Replace the events state with the fetched events
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
