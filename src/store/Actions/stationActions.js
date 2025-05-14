import { API_COMMON } from "@/utils/ApiCommon";
import { API_ACTIONS, API_TYPE, STATION_APIS } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllStations = createAsyncThunk(
  "station/fetchStations",
  async (_, { rejectWithValue }) => {
    try {
      const stationsData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        STATION_APIS.GET_STATION,
        null
      );
      return stationsData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching stations");
    }
  }
);
