import { addMissionPlan } from "@/Store/Actions/planMissionActions";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  loading: false,
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
        state.loading = true;
        state.error = null;
      })
      .addCase(addMissionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        toast.success("Mission plan added");
      })
      .addCase(addMissionPlan.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        toast.error("Error adding Mission plan");
      });
  },
});
export default planMissionSlice.reducer;
