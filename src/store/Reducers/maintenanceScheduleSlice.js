import {
  getMaintenanceSchedules,
  getPanelsReports,
} from "@/store/Actions/maintenanceScheduleActions";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  isLoading: false,
  isPostLoading: false,
  data: [],
  error: null,
};
const maintenanceScheduleSlice = createSlice({
  name: "maintenanceSchedule",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMaintenanceSchedules.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMaintenanceSchedules.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getMaintenanceSchedules.rejected, (state, action) => {
        state.data = [];
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getPanelsReports.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPanelsReports.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getPanelsReports.rejected, (state, action) => {
        state.data = [];
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});
export default maintenanceScheduleSlice.reducer;
