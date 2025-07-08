import { API_COMMON } from "@/utils/ApiCommon";
import {
  API_ACTIONS,
  API_TYPE,
  MAINTENANCE_SCHEDULE_APIS,
  MISSION_PANEL_MAP_APIS,
} from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getMaintenanceSchedules = createAsyncThunk(
  "maintenanceSchedule/getMaintenanceSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const maintenanceScheduleData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${MAINTENANCE_SCHEDULE_APIS.GET}`,
        null
      );
      return maintenanceScheduleData;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err?.message || "Error adding mission panel map");
    }
  }
);
export const getPanelsReports = createAsyncThunk(
  "maintenanceSchedule/getPanelsReports",
  async (missionId, { rejectWithValue }) => {
    try {
      const maintenanceScheduleData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${MAINTENANCE_SCHEDULE_APIS.GET_MISSION_DATA_FORSCHEDULED}/${missionId}`,
        null
      );
      return maintenanceScheduleData;
    } catch (err) {
      console.error(err);
      return rejectWithValue(err?.message || "Error adding mission panel map");
    }
  }
);
