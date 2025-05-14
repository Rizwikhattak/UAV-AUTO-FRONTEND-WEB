import { loginUser } from "@/store/Actions/authActions";
import { TOAST_MESSAGES } from "@/utils/constants";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
  data: [],
  isLoading: false,
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // toast.success("Drone Added");
      })
      .addCase(loginUser.rejected, (state, action) => {
        toast.error(TOAST_MESSAGES.LOGIN.ERROR);
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
