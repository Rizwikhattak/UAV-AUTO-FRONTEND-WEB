import { API_COMMON } from "@/utils/ApiCommon";
import { API_ACTIONS, API_TYPE, DRONE_APIS } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const insertDrone = createAsyncThunk(
  "drones/insertDrone",
  async (data, { rejectWithValue }) => {
    try {
      const droneData = await API_COMMON(
        API_ACTIONS.POST,
        API_TYPE.FORM,
        DRONE_APIS.INSERT_DRONE,
        data
      );
      return droneData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding drone");
    }
  }
);

export const getAllDrones = createAsyncThunk(
  "drones/getAllDrones",
  async (_, { rejectWithValue }) => {
    try {
      const droneData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        DRONE_APIS.GET_ALL_DRONES,
        null
      );
      return droneData;
    } catch (error) {
      return rejectWithValue(error.message || "Error Retrieving drones");
    }
  }
);
export const getDroneById = createAsyncThunk(
  "drones/getDroneById",
  async (id, { rejectWithValue }) => {
    try {
      const droneData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${DRONE_APIS.GET_DRONE_BY_ID}/${id}`,
        null
      );
      return droneData;
    } catch (error) {
      return rejectWithValue(error.message || "Error Retrieving drones");
    }
  }
);
export const updateDrone = createAsyncThunk(
  "drones/UpdateDrone",
  async (data, { rejectWithValue }) => {
    try {
      const droneData = await API_COMMON(
        API_ACTIONS.PUT,
        API_TYPE.FORM,
        `${DRONE_APIS.UPDATE_DRONE}/${data.id}`,
        data.formData
      );
      return droneData;
    } catch (error) {
      return rejectWithValue(error?.message || "Error updating drone");
    }
  }
);
export const deleteDrone = createAsyncThunk(
  "drones/DeleteDrone",
  async (id, { rejectWithValue }) => {
    try {
      const droneData = await API_COMMON(
        API_ACTIONS.DELETE,
        API_TYPE.JSON,
        `${DRONE_APIS.DELETE_DRONE}/${id}`,
        null
      );
      return droneData;
    } catch (error) {
      return rejectWithValue(error?.message || "Error deleting drone");
    }
  }
);
