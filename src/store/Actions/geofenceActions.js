import { API_COMMON } from "@/utils/ApiCommon";
import { API_ACTIONS, API_TYPE, GEOFENCE_APIS } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const insertGeofence = createAsyncThunk(
  "geofence/insertGeofence",
  async (data, { rejectWithValue }) => {
    try {
      const geofenceData = await API_COMMON(
        API_ACTIONS.POST,
        API_TYPE.JSON,
        GEOFENCE_APIS.INSERT_GEOFENCE,
        data
      );
      return geofenceData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error inserting geofence"
      );
    }
  }
);
export const updateGeofence = createAsyncThunk(
  "geofence/updateGeofence",
  async (data, { rejectWithValue }) => {
    try {
      const geofenceData = await API_COMMON(
        API_ACTIONS.PUT,
        API_TYPE.JSON,
        `${GEOFENCE_APIS.UPDATE_GEOFENCE}/${data.id}`,
        data
      );
      return geofenceData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error inserting geofence"
      );
    }
  }
);
export const getAllGeofences = createAsyncThunk(
  "geofence/getAllGeofences",
  async (_, { rejectWithValue }) => {
    try {
      const geofenceData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        GEOFENCE_APIS.GET_ALL_GEOFENCES,
        null
      );
      return geofenceData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching geofence");
    }
  }
);
export const getGeofenceById = createAsyncThunk(
  "geofence/getGeofenceById",
  async (id, { rejectWithValue }) => {
    try {
      const geofenceData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${GEOFENCE_APIS.GET_GEOFENCE_BY_ID}/${id}`,
        null
      );
      return geofenceData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching geofence");
    }
  }
);
export const deleteGeofence = createAsyncThunk(
  "geofence/deleteGeofence",
  async (id, { rejectWithValue }) => {
    try {
      const geofenceData = await API_COMMON(
        API_ACTIONS.DELETE,
        API_TYPE.JSON,
        `${GEOFENCE_APIS.DELETE_GEOFENCE}/${id}`,
        null
      );
      return geofenceData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching geofence");
    }
  }
);
