import { API_COMMON } from "@/utils/ApiCommon";
import { API_ACTIONS, API_TYPE, DRONE_APIS } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addDrone = createAsyncThunk(
  "drones/AddDrone",
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
      rejectWithValue(error.response?.data || "Error adding drone");
    }
  }
);

export const getAllDrones = createAsyncThunk(
  "drones/getAllDrones",
  async (_, { rejectWithValue }) => {
    try {
      const droneData = await API_COMMON(
        "getAll",
        "json",
        "get_all_drones",
        "Error fetching drones",
        null
      );
      return droneData;
    } catch (error) {
      rejectWithValue(error.message || "Error Retrieving drones");
    }
  }
);
export const updateDrone = createAsyncThunk(
  "drones/UpdateDrone",
  async (data, { rejectWithValue }) => {
    try {
      const droneData = await ApiCommon(
        "put",
        "form",
        `update_drone_by_id/${data.get("id")}`,
        "Error updating drone",
        data
      );
      return droneData;
    } catch (error) {
      rejectWithValue(error?.message || "Error updating drone");
    }
  }
);
export const deleteDrone = createAsyncThunk(
  "drones/DeleteDrone",
  async (id, { rejectWithValue }) => {
    try {
      const droneData = await ApiCommon(
        "delete",
        "form",
        `delete_drone_by_id/${id}`,
        "Error deleting drone",
        null
      );
      return droneData;
    } catch (error) {
      rejectWithValue(error?.message || "Error deleting drone");
    }
  }
);
