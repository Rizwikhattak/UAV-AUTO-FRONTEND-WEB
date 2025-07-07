import { API_COMMON } from "@/utils/ApiCommon";
import {
  API_ACTIONS,
  API_TYPE,
  MISSION_PANEL_MAP_APIS,
} from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const insertMissionPanelMap = createAsyncThunk(
  "missionPanelMap/insertMissionPanelMap",
  async (data, { rejectWithValue }) => {
    try {
      const missionPanelMapData = await API_COMMON(
        API_ACTIONS.POST,
        API_TYPE.JSON,
        MISSION_PANEL_MAP_APIS.INSERT,
        data
      );
      return missionPanelMapData;
    } catch (err) {
      consol.error(err);
      return rejectWithValue(err?.message || "Error adding mission panel map");
    }
  }
);
export const getMissionPanelMaps = createAsyncThunk(
  "missionPanelMap/getMissionPanelMaps",
  async (missionPlannerId, { rejectWithValue }) => {
    try {
      const missionPanelMapData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${MISSION_PANEL_MAP_APIS.GET}/${missionPlannerId}`,
        null
      );
      return missionPanelMapData;
    } catch (err) {
      consol.error(err);
      return rejectWithValue(err?.message || "Error adding mission panel map");
    }
  }
);
export const deleteMissionPanelMap = createAsyncThunk(
  "missionPanelMap/deleteMissionPanelMap",
  async (panelId, { rejectWithValue }) => {
    try {
      const missionPanelMapData = await API_COMMON(
        API_ACTIONS.DELETE,
        API_TYPE.JSON,
        `${MISSION_PANEL_MAP_APIS.DELETE}/${panelId}`,
        null
      );
      return missionPanelMapData;
    } catch (err) {
      consol.error(err);
      return rejectWithValue(err?.message || "Error adding mission panel map");
    }
  }
);
