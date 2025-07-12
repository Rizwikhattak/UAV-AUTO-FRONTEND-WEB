import { combineReducers } from "redux";
import authReducer from "@/store/Reducers/authSlice";
import droneReducer from "@/store/Reducers/droneSlice";
import stationReducer from "@/store/Reducers/stationSlice";
import planMissionReducer from "@/store/Reducers/planMissionSlice";
import operatorReducer from "@/store/Reducers/operatorSlice";
import geofenceReducer from "@/store/Reducers/geofenceSlice";
import missionImagesReducer from "@/store/Reducers/missionImagesSlice";
import panelEfficiencyReducer from "@/store/Reducers/panelEfficiencySlice";
import missionPanelMapReducer from "@/store/Reducers/missionPanelMapSlice";
import efficiencyReportReducer from "@/store/Reducers/efficiencyReportSlice";
import maintenanceScheduleReducer from "@/store/Reducers/maintenanceScheduleSlice";
import missionVideoReducer from "@/store/Reducers/missionVideoSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  drone: droneReducer,
  station: stationReducer,
  planMission: planMissionReducer,
  operator: operatorReducer,
  geofence: geofenceReducer,
  missionImages: missionImagesReducer,
  panelEfficiency: panelEfficiencyReducer,
  missionPanelMap: missionPanelMapReducer,
  efficiencyReport: efficiencyReportReducer,
  maintenanceSchedule: maintenanceScheduleReducer,
  missionVideo: missionVideoReducer,
});
export default rootReducer;
