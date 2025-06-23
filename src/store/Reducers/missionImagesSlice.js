import { getMissionImages } from "@/store/Actions/mssionImagesAction";
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoading: false,
  isPostLoading: false,
  data: [],
  error: null,
};
const missionImagesSlice = createSlice({
  name: "missionImages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMissionImages.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMissionImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload?.data || [];
        state.error = null;
      })
      .addCase(getMissionImages.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});
export default missionImagesSlice.reducer;
