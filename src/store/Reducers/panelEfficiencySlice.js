import {
  getAllPanelEfficiencies,
  insertPanelEfficiency,
  updateSolarPanelEfficiency,
} from "@/store/Actions/panelEfficiencyActions";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  data: [],
  isLoading: false,
  isPostLoading: false,
  error: false,
};
const panelEfficiencySlice = createSlice({
  name: "panelEfficiency",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(insertPanelEfficiency.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(insertPanelEfficiency.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        console.log("Panel Efficiency added");
        toast.success("Panel Efficiency Added");
      })
      .addCase(insertPanelEfficiency.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
        console.log("Error Adding Panel Efficiency");
        toast.error("Error Adding Panel Efficiency");
      })
      .addCase(getAllPanelEfficiencies.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPanelEfficiencies.fulfilled, (state, action) => {
        // JSON.parse() to convert json into a normal dict
        state.data = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllPanelEfficiencies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error("Error Fetching Operators");
      })
      .addCase(updateSolarPanelEfficiency.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(updateSolarPanelEfficiency.fulfilled, (state, action) => {
        // state.data = action.payload.data;
        state.isPostLoading = false;
        state.error = null;
        toast.success("Panel Efficiency Updated");
      })
      .addCase(updateSolarPanelEfficiency.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
        toast.error("Error updating Panel Efficiency");
      });
  },
});

export default panelEfficiencySlice.reducer;
