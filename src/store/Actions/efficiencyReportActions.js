import { API_COMMON } from "@/utils/ApiCommon";
import {
  API_ACTIONS,
  API_TYPE,
  EFFICIENCY_REPORT_APIS,
} from "@/utils/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getEfficiencyReports = createAsyncThunk(
  "efficienyReport/getEfficiencyReports",
  async (missionPlannerId, { rejectWithValue }) => {
    try {
      const efficienyReportData = await API_COMMON(
        API_ACTIONS.GET,
        API_TYPE.JSON,
        `${EFFICIENCY_REPORT_APIS.GET}/${missionPlannerId}`,
        null
      );
      return efficienyReportData;
    } catch (err) {
      consol.error(err);
      return rejectWithValue(err?.message || "Error adding mission panel map");
    }
  }
);
