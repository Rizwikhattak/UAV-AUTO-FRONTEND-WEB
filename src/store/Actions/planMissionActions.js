import { API_COMMON } from "@/utils/ApiCommon";
import { API_ACTIONS, API_TYPE, MISSION_APIS } from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const insertMissionPlan = createAsyncThunk(
  "planMission/insertMissionPlan",
  async (data, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.POST,
        API_TYPE.JSON,
        MISSION_APIS.INSERT_MISSION_PLAN,
        data
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const updateMissionPlan = createAsyncThunk(
  "planMission/updateMissionPlan",
  async (data, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.PUT,
        API_TYPE.JSON,
        `${MISSION_APIS.UPDATE_MISSION_PLAN}/${data.id}`,
        data
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const getAllMissionPlans = createAsyncThunk(
  "planMission/getAllMissionPlans",
  async (_, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        MISSION_APIS.GET_ALL_MISSION_PLANS,
        null
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const handleMissionAbort = createAsyncThunk(
  "planMission/handleMissionAbort",
  async (id, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.PUT,
        API_TYPE.JSON,
        `${MISSION_APIS.ABORT_MISSION}/${id}`,
        null
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const getMissionPlanById = createAsyncThunk(
  "planMission/getMissionPlanById",
  async (id, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${MISSION_APIS.GET_MISSION_PLAN_BY_ID}/${id}`,
        null
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const deleteMissionPlan = createAsyncThunk(
  "planMission/deleteMissionPlan",
  async (id, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.DELETE,
        API_TYPE.JSON,
        `${MISSION_APIS.DELETE_MISSION_PLAN}/${id}`,
        null
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const uploadMissionVideo = createAsyncThunk(
  "planMission/uploadMissionVideo",
  async (data, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.POST,
        API_TYPE.FORM,
        MISSION_APIS.UPLOAD_MISSION_VIDEO,
        data
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const getMissionHistory = createAsyncThunk(
  "planMission/getMissionHistory",
  async (_, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        MISSION_APIS.GET_HISTORY,
        null
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const getMissionHistoryById = createAsyncThunk(
  "planMission/getMissionHistoryById",
  async (id, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${MISSION_APIS.GET_HISTORY_BY_ID}/${id}`,
        null
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const getAllVideosFromFolder = createAsyncThunk(
  "planMission/getAllVideosFromFolder",
  async (_, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${MISSION_APIS.GET_ALL_VIDEOS_FROM_FOLDER}`,
        null
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const serveMissionVideos = createAsyncThunk(
  "planMission/serveMissionVideos",
  async (fileName, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${MISSION_APIS.SERVE_MISSION_VIDEOS}/${fileName}`,
        null
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
export const initializeDrones = createAsyncThunk(
  "planMission/initializeDrones",
  async (data, { rejectWithValue }) => {
    try {
      const planMissionData = await API_COMMON(
        API_ACTIONS.POST,
        API_TYPE.JSON,
        `${MISSION_APIS.INITIATE_DRONE}`,
        data
      );
      return planMissionData;
    } catch (err) {
      console.log("Rejected statr 1");
      return rejectWithValue(err?.message || "Error adding mission plan");
    }
  }
);
