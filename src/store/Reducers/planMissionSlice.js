import {
  deleteMissionPlan,
  getAllMissionPlans,
  getMissionHistory,
  getMissionHistoryById,
  getMissionPlanById,
  handleMissionAbort,
  initializeDrones,
  insertMissionPlan,
  updateMissionPlan,
  uploadMissionVideo,
} from "@/store/Actions/planMissionActions";
import { TOAST_MESSAGES } from "@/utils/constants";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
const initialState = {
  isLoading: false,
  isPostLoading: false,
  data: [],
  fullData: [],
  error: null,
};
const planMissionSlice = createSlice({
  name: "planMission",
  initialState,
  reducers: {
    filterMissions(state, action) {
      const filterValue = action.payload.filter?.toLowerCase() || "";
      if (filterValue) {
        state.data = state.fullData.filter((mission) =>
          mission.name.toLowerCase().includes(filterValue)
        );
      } else {
        // Reset to the original unfiltered list
        state.data = state.fullData;
      }
    },
    filterAscDesc: (state, action) => {
      const { filter } = action.payload;
      if (filter === "Completed") {
        const sortedData = state.fullData.filter(
          (mission) => mission.status === "completed"
        );
        state.data = sortedData;
      } else if (filter === "Aborted") {
        const sortedData = state.fullData.filter(
          (mission) => mission.status === "aborted"
        );
        state.data = sortedData;
      } else {
        const sortedData = state.fullData;
        state.data = sortedData;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertMissionPlan.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(insertMissionPlan.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.PLAN_MISSION.INSERT.SUCCESS);
      })
      .addCase(insertMissionPlan.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error(TOAST_MESSAGES.PLAN_MISSION.INSERT.ERROR);
      })
      .addCase(initializeDrones.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(initializeDrones.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.isPostLoading = false;
        state.error = null;
        state.data = action.payload.data;
        toast.success(TOAST_MESSAGES.PLAN_MISSION.INITIATE_DRONES.SUCCESS);
      })
      .addCase(initializeDrones.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error(TOAST_MESSAGES.PLAN_MISSION.INITIATE_DRONES.ERROR);
      })
      .addCase(handleMissionAbort.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(handleMissionAbort.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.warning(TOAST_MESSAGES.PLAN_MISSION.ABORT.SUCCESS);
      })
      .addCase(handleMissionAbort.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error(TOAST_MESSAGES.PLAN_MISSION.ABORT.ERROR);
      })
      .addCase(updateMissionPlan.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(updateMissionPlan.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.PLAN_MISSION.UPDATE.SUCCESS);
      })
      .addCase(updateMissionPlan.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error(TOAST_MESSAGES.PLAN_MISSION.UPDATE.ERROR);
      })
      .addCase(deleteMissionPlan.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(deleteMissionPlan.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.PLAN_MISSION.INSERT.SUCCESS);
      })
      .addCase(deleteMissionPlan.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error(TOAST_MESSAGES.PLAN_MISSION.INSERT.ERROR);
      })
      .addCase(getAllMissionPlans.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllMissionPlans.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fullData = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllMissionPlans.rejected, (state, action) => {
        state.error = action.payload;
        state.data = [];
        state.fullData = [];
        state.isLoading = false;
      })
      .addCase(getMissionHistory.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMissionHistory.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.fullData = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getMissionHistory.rejected, (state, action) => {
        state.error = action.payload;
        state.data = [];
        state.fullData = [];
        state.isLoading = false;
      })
      .addCase(getMissionHistoryById.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMissionHistoryById.fulfilled, (state, action) => {
        // state.data = action.payload.data;
        // state.fullData = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getMissionHistoryById.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getMissionPlanById.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMissionPlanById.fulfilled, (state, action) => {
        // state.data = action.payload.data;
        // state.fullData = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getMissionPlanById.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(uploadMissionVideo.pending, (state, action) => {
        state.isPostLoading = true;
        state.error = null;
      })
      .addCase(uploadMissionVideo.fulfilled, (state, action) => {
        state.isPostLoading = false;
        state.error = null;
        toast.success(TOAST_MESSAGES.PLAN_MISSION.INSERT.SUCCESS);
      })
      .addCase(uploadMissionVideo.rejected, (state, action) => {
        state.error = action.payload;
        state.isPostLoading = false;
        toast.error(TOAST_MESSAGES.PLAN_MISSION.INSERT.ERROR);
      });
  },
});
export const { filterMissions, filterAscDesc } = planMissionSlice.actions;
export default planMissionSlice.reducer;
