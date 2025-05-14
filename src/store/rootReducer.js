import { combineReducers } from "redux";
import authReducer from "@/store/Reducers/authSlice";
import droneReducer from "@/store/Reducers/droneSlice";
import stationReducer from "@/store/Reducers/stationSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  drone: droneReducer,
  station: stationReducer,
});
export default rootReducer;
