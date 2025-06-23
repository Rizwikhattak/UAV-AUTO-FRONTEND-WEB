import { API_COMMON } from "@/utils/ApiCommon";
import { API_ACTIONS, API_TYPE, MISSION_IMAGES_APIS } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getMissionImages = createAsyncThunk(
  "missionImages/getMissionImages",
  async (data, { rejectWithValue }) => {
    try {
      const missionImagesData = await API_COMMON(
        API_ACTIONS.POST,
        API_TYPE.JSON,
        `${MISSION_IMAGES_APIS.GET_MISSION_IMAGES}/${data.missionVideoId}`,
        data
      );
      return missionImagesData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
