import { API_COMMON } from "@/utils/ApiCommon";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addMissionPlan = createAsyncThunk(
  "planMission/AddMissionPlan",
  async (data, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        "post",
        "json",
        "insert_mission_plan",
        "Error adding operator",
        data
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
