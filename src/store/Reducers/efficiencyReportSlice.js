import { getEfficiencyReports } from "@/store/Actions/efficiencyReportActions";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  isLoading: false,
  isPostLoading: false,
  data: [],
  error: null,
};
const efficiencyReportSlice = createSlice({
  name: "efficienyReport",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEfficiencyReports.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEfficiencyReports.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getEfficiencyReports.rejected, (state, action) => {
        state.data = [];
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});
export default efficiencyReportSlice.reducer;
