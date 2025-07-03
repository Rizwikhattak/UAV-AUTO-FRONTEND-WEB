import { API_COMMON } from "@/utils/ApiCommon";
import {
  API_ACTIONS,
  API_TYPE,
  PANEL_EFFICIENCY_APIS,
} from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const insertPanelEfficiency = createAsyncThunk(
  "panelEfficiency/insertPanelEfficiency",
  async (data, { rejectWithValue }) => {
    try {
      const efficiencyData = await API_COMMON(
        API_ACTIONS.POST,
        API_TYPE.JSON,
        PANEL_EFFICIENCY_APIS.INSERT,
        data
      );
      return efficiencyData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error inserting panelEfficiency"
      );
    }
  }
);
export const updateSolarPanelEfficiency = createAsyncThunk(
  "panelEfficiency/updateSolarPanelEfficiency",
  async (data, { rejectWithValue }) => {
    try {
      const efficiencyData = await API_COMMON(
        API_ACTIONS.PUT,
        API_TYPE.JSON,
        `${PANEL_EFFICIENCY_APIS.UPDATE}`,
        data
      );
      return efficiencyData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error inserting panelEfficiency"
      );
    }
  }
);
export const getAllPanelEfficiencies = createAsyncThunk(
  "panelEfficiency/getAllPanelEfficiencies",
  async (_, { rejectWithValue }) => {
    try {
      const efficiencyData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        PANEL_EFFICIENCY_APIS.GET_ALL,
        null
      );
      return efficiencyData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching panelEfficiency"
      );
    }
  }
);
export const getGeofenceById = createAsyncThunk(
  "panelEfficiency/getGeofenceById",
  async (id, { rejectWithValue }) => {
    try {
      const efficiencyData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${PANEL_EFFICIENCY_APIS.GET_GEOFENCE_BY_ID}/${id}`,
        null
      );
      return efficiencyData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching panelEfficiency"
      );
    }
  }
);
export const deleteGeofence = createAsyncThunk(
  "panelEfficiency/deleteGeofence",
  async (id, { rejectWithValue }) => {
    try {
      const efficiencyData = await API_COMMON(
        API_ACTIONS.DELETE,
        API_TYPE.JSON,
        `${PANEL_EFFICIENCY_APIS.DELETE_GEOFENCE}/${id}`,
        null
      );
      return efficiencyData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching panelEfficiency"
      );
    }
  }
);
