import { API_COMMON } from "@/utils/ApiCommon";
import {
  API_ACTIONS,
  API_TYPE,
  AUTH_APIS,
  TOAST_MESSAGES,
} from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const loginData = await API_COMMON(
        API_ACTIONS.POST,
        API_TYPE.JSON,
        AUTH_APIS.LOGIN,
        data
      );
      return loginData;
    } catch (error) {
      return rejectWithValue(TOAST_MESSAGES.LOGIN.ERROR);
    }
  }
);
