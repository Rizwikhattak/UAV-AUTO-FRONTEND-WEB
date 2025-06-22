import {
  deleteGeofence,
  getAllGeofences,
  getGeofenceById,
  insertGeofence,
  updateGeofence,
} from "@/store/Actions/geofenceActions";
import { TOAST_MESSAGES } from "@/utils/constants";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  isLoading: false,
  data: [],
  fullData: [],
  isPostLoading: false,
  error: null,
};
const geofenceSlice = createSlice({
  name: "geofence",
  initialState,
  reducers: {
    filterGeofences: (state, action) => {
      const filterValue = action.payload.toLowerCase();

      if (!filterValue.trim()) {
        // If input is empty, reset to original
        state.data = state.fullData;
      } else {
        state.data = state.fullData.filter((geofence) =>
          geofence.name.toLowerCase().includes(filterValue)
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertGeofence.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(insertGeofence.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.GEOFENCE.INSERT.SUCCESS);
      })
      .addCase(insertGeofence.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error(TOAST_MESSAGES.GEOFENCE.INSERT.ERROR);
      })
      .addCase(updateGeofence.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(updateGeofence.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.GEOFENCE.UPDATE.SUCCESS);
      })
      .addCase(updateGeofence.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error(TOAST_MESSAGES.GEOFENCE.UPDATE.ERROR);
      })
      .addCase(deleteGeofence.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(deleteGeofence.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.GEOFENCE.DELETE.SUCCESS);
      })
      .addCase(deleteGeofence.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error(TOAST_MESSAGES.GEOFENCE.DELETE.ERROR);
      })
      .addCase(getAllGeofences.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllGeofences.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fullData = action.payload.data;

        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllGeofences.rejected, (state, action) => {
        state.error = action.payload;
        state.data = [];
        state.isLoading = false;
      })
      .addCase(getGeofenceById.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGeofenceById.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fullData = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getGeofenceById.rejected, (state, action) => {
        state.error = action.payload;
        state.data = [];
        state.isLoading = false;
      });
  },
});

export const { filterGeofences } = geofenceSlice.actions;

export default geofenceSlice.reducer;
