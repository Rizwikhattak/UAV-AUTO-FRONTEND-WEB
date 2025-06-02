import { addMissionPlan } from "@/store/Actions/planMissionActions";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  isLoading: false,
  data: [],
  error: null,
};
const planMissionSlice = createSlice({
  name: "planMission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMissionPlan.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMissionPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        toast.success("Mission plan added");
      })
      .addCase(addMissionPlan.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        toast.error("Error adding Mission plan");
      });
  },
});
export default planMissionSlice.reducer;
