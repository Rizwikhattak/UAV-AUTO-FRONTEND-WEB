import {
  addDrone,
  deleteDrone,
  getAllDrones,
  updateDrone,
} from "@/store/Actions/droneActions";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  data: [],
  isLoading: false,
  isPostLoading: false,
  error: false,
};

const droneSlice = createSlice({
  name: "drone",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addDrone.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(addDrone.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success("Drone Added");
      })
      .addCase(addDrone.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
        toast.error("Unable to add drone");
      })
      .addCase(getAllDrones.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllDrones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        console.log("Action.payload", action.payload);
        state.data = action.payload.data;
      })
      .addCase(getAllDrones.rejected, (state, action) => {
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
      })
      .addCase(updateDrone.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteDrone.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(deleteDrone.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        
      })
      .addCase(deleteDrone.rejected, (state, action) => {
        state.isPostLoading = false;
        state.error = action.payload;
      });
  },
});

export default droneSlice.reducer;
