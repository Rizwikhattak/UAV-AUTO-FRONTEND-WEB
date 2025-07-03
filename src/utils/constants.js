export const API_ACTIONS = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  PUT: "put",
  DELETE: "delete",
};
export const API_TYPE = {
  FORM: "form",
  JSON: "json",
};

export const CONSTANTS = {
  CLEAN_SOLAR_PANEL: "clean_solar_panel",
  DAMAGED_SOLAR_PANEL: "damaged_solar_panel",
  DUSTY_SOLAR_PANEL: "dusty_solar_panel",
};

export const TOAST_MESSAGES = {
  LOGIN: {
    ERROR: "Error logging in User",
  },
  GEOFENCE: {
    INSERT: {
      SUCCESS: "Geofence added successfully",
      ERROR: "Error adding geofence",
    },
    UPDATE: {
      SUCCESS: "Geofence updated successfully",
      ERROR: "Error updating geofence",
    },
    DELETE: {
      SUCCESS: "Geofence deleted successfully",
      ERROR: "Error deleting geofence",
    },
  },
  DRONE: {
    INSERT: {
      SUCCESS: "Drone added successfully",
      ERROR: "Error adding drone",
    },
    UPDATE: {
      SUCCESS: "Drone updated successfully",
      ERROR: "Error updating drone",
    },
    DELETE: {
      SUCCESS: "Drone deleted successfully",
      ERROR: "Error deleting drone",
    },
  },
  PLAN_MISSION: {
    INSERT: {
      SUCCESS: "Mission plan added successfully",
      ERROR: "Error adding mission plan",
    },
    UPDATE: {
      SUCCESS: "Mission plan updated successfully",
      ERROR: "Error updating mission plan",
    },
    DELETE: {
      SUCCESS: "Mission plan deleted successfully",
      ERROR: "Error deleting mission plan",
    },
  },
};

export const ROUTES = {
  HOME: "/home",
  ADD_DRONE: "/drone/AddDrone",
  VIEW_DRONE: "/drone/ViewDrone",
  EDIT_DRONE: "/drone/EditDrone",
  ADD_GEOFENCE: "/geofence/AddGeofence",
  VIEW_GEOFENCE: "/geofence/ViewGeofence",
  EDIT_GEOFENCE: "/geofence/EditGeofence",
  ACTIVE_MISSION_PLAN: "/missionPlan/ActiveMission",
  VIEW_MISSION_IMAGES: "/missionPlan/ViewMissionImages",
  ADD_MISSION_PLAN: "/missionPlan/AddMissionPlan",
  EDIT_MISSION_PLAN: "/missionPlan/EditMissionPlan",
  VIEW_MISSION_PLAN: "/missionPlan/ViewMissionPlan",
  VIEW_HISTORY: "/history",
  EFFICIENCY: "/efficiency",
};

export const AUTH_APIS = {
  LOGIN: "login_user",
};
export const STATION_APIS = {
  GET_STATION: "get_all_stations",
};
export const DRONE_APIS = {
  INSERT_DRONE: "insert_drone",
  GET_ALL_DRONES: "get_all_drones",
  GET_DRONE_BY_ID: "get_drone_by_id",
  DELETE_DRONE: "delete_drone_by_id",
  UPDATE_DRONE: "update_drone_by_id",
};
export const GEOFENCE_APIS = {
  INSERT_GEOFENCE: "insert_route",
  UPDATE_GEOFENCE: "update_route_by_id",
  GET_ALL_GEOFENCES: "get_all_routes_with_location_pins",
  GET_GEOFENCE_BY_ID: "get_route_by_id",
  DELETE_GEOFENCE: "delete_route_by_id",
};

export const MISSION_APIS = {
  INSERT_MISSION_PLAN: "insert_mission_plan",
  UPLOAD_MISSION_VIDEO: "upload_mission_video",
  UPDATE_MISSION_PLAN: "update_mission_plan_by_id",
  GET_ALL_MISSION_PLANS: "get_all_mission_plans",
  GET_MISSION_PLAN_BY_ID: "get_mission_plan",
  DELETE_MISSION_PLAN: "delete_mission_plan_by_id",
  GET_HISTORY: "get_all_history",
  GET_HISTORY_BY_ID: "get_history_by_id",
};

export const MISSION_IMAGES_APIS = {
  GET_MISSION_IMAGES: "get_mission_data_images",
};
export const PANEL_EFFICIENCY_APIS = {
  INSERT: "insert_solar_panel_efficiency",
  GET_ALL: "get_all_solar_panel_efficiency",
  UPDATE: "update_solar_panel_efficiency_by_id",
};
