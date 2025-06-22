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
};

export const ROUTES = {
  HOME: "/home",
  ADD_DRONE: "/drone/AddDrone",
  VIEW_DRONE: "/drone/ViewDrone",
  EDIT_DRONE: "/drone/EditDrone",
  ADD_GEOFENCE: "/geofence/AddGeofence",
  VIEW_GEOFENCE: "/geofence/ViewGeofence",
  ADD_MISSION_PLAN: "/missionPlan/AddMissionPlan",
  VIEW_MISSION_PLAN: "/missionPlan/ViewMissionPlan",
  VIEW_HISTORY: "/history",
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
  GET_ALL_GEOFENCES: "get_all_routes_with_location_pins",
  DELETE_GEOFENCE: "delete_route_by_id",
};
