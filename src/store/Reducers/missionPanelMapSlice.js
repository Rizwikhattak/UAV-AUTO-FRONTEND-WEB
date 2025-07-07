import {
  deleteMissionPanelMap,
  getMissionPanelMaps,
  insertMissionPanelMap,
} from "@/store/Actions/missionPanelMapActions";
import { getMissionImages } from "@/store/Actions/mssionImagesAction";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  isLoading: false,
  isPostLoading: false,
  data: [],
  error: null,
};
const missionPanelMapSlice = createSlice({
  name: "missionPanelMap",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(insertMissionPanelMap.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(insertMissionPanelMap.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success("Mission panel map added successfully");
      })
      .addCase(insertMissionPanelMap.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error("Unable to add mission panel map");
      })
      .addCase(getMissionPanelMaps.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMissionPanelMaps.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getMissionPanelMaps.rejected, (state, action) => {
        state.data = [];
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(deleteMissionPanelMap.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(deleteMissionPanelMap.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success("Mission panel map deleted successfully");
      })
      .addCase(deleteMissionPanelMap.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error("Unable to delete mission panel map");
      });
  },
});
export default missionPanelMapSlice.reducer;
