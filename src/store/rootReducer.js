import { combineReducers } from "redux";
import authReducer from "@/store/Reducers/authSlice";
import droneReducer from "@/store/Reducers/droneSlice";
import stationReducer from "@/store/Reducers/stationSlice";
import planMissionReducer from "@/store/Reducers/planMissionSlice";
import operatorReducer from "@/store/Reducers/operatorSlice";
import geofenceReducer from "@/store/Reducers/geofenceSlice";
import missionImagesReducer from "@/store/Reducers/missionImagesSlice";
import panelEfficiencyReducer from "@/store/Reducers/panelEfficiencySlice";
const rootReducer = combineReducers({
  auth: authReducer,
  drone: droneReducer,
  station: stationReducer,
  planMission: planMissionReducer,
  operator: operatorReducer,
  geofence: geofenceReducer,
  missionImages: missionImagesReducer,
  panelEfficiency: panelEfficiencyReducer,
});
export default rootReducer;
