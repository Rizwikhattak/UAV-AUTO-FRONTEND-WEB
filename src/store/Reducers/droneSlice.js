import {
  insertDrone,
  deleteDrone,
  getAllDrones,
  updateDrone,
  getDroneById,
} from "@/store/Actions/droneActions";
import { TOAST_MESSAGES } from "@/utils/constants";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  data: [],
  drone_by_id: null,
  isLoading: false,
  isPostLoading: false,
  error: false,
};

const droneSlice = createSlice({
  name: "drone",
  initialState,
  reducers: {
    filterDrones: (state, action) => {
      const { filter } = action.payload;
      if (filter === "Speed") {
        const sortedData = [...state.data].sort((a, b) => a.speed - b.speed);
        state.data = sortedData;
      } else if (filter === "Flight Duration") {
        const sortedData = [...state.data].sort(
          (a, b) => a.flight_duration - b.flight_duration
        );
        state.data = sortedData;
      } else if (filter === "Ceiling") {
        const sortedData = [...state.data].sort(
          (a, b) => a.ceiling - b.ceiling
        );
        state.data = sortedData;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertDrone.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(insertDrone.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.DRONE.INSERT.SUCCESS);
      })
      .addCase(insertDrone.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
        toast.error(TOAST_MESSAGES.DRONE.INSERT.ERROR);
      })
      .addCase(getAllDrones.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllDrones.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.isLoading = false;
        state.error = null;
        console.log("Action.payload", action.payload);
      })
      .addCase(getAllDrones.rejected, (state, action) => {
        state.data = [];
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getDroneById.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDroneById.fulfilled, (state, action) => {
        state.drone_by_id = action.payload.data;
        state.isLoading = false;
        state.error = null;
        console.log("Action.payload", action.payload);
      })
      .addCase(getDroneById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateDrone.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(updateDrone.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.DRONE.UPDATE.SUCCESS);
      })
      .addCase(updateDrone.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
        toast.success(TOAST_MESSAGES.DRONE.UPDATE.ERROR);
      })
      .addCase(deleteDrone.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(deleteDrone.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.DRONE.DELETE.SUCCESS);
      })
      .addCase(deleteDrone.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
        toast.error(TOAST_MESSAGES.DRONE.DELETE.ERROR);
      });
  },
});

export const { filterDrones } = droneSlice.actions;
export default droneSlice.reducer;
