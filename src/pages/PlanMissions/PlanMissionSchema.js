// missionSchema.js
import { z } from "zod";

export const addMissionSchema = z.object({
  name: z.string().min(2, "Mission name must be at least 2 characters long."),
  departure_station_id: z.string().min(1, "Please select a departure station."),
  landing_station_id: z.string().min(1, "Please select a landing station."),
  start_date: z.string().min(1, "Start date is required."),
  start_time: z.string().min(1, "Start time is required."),
  drone_id: z.string().min(1, "Please select a drone."),
  operator_id: z.string().min(1, "Please assign an operator."),
});
