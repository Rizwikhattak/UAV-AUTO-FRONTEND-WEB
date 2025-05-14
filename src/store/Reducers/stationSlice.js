import { getAllStations } from "@/store/Actions/stationActions";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  data: [],
  isLoading: false,
  error: null,
};

export const stationSlice = createSlice({
  name: "station",
  initialState,
  reducers: {}, // Removed `getAllStations` because it was unused
  extraReducers: (builder) => {
    builder
      .addCase(getAllStations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllStations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
      })
      .addCase(getAllStations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default stationSlice.reducer;
