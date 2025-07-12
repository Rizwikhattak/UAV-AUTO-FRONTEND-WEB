// missionSchema.js
import { z } from "zod";

export const addMissionSchema = z.object({
  name: z.string().min(2, "Mission name must be at least 2 characters long."),
  time: z.date({
    required_error: "Start date & time is required.",
    invalid_type_error: "Please select a valid date and time.",
  }),
  // drone_id: z.coerce.string().min(1, "Please select a drone."),
  geofence_id: z.coerce.string().min(1, "Please select a geofence."),
});
// export const addMissionSchema = z.object({
//   name: z.string().min(2, "Mission name must be at least 2 characters long."),
//   time: z.date({
//     required_error: "Start date & time is required.",
//     invalid_type_error: "Please select a valid date and time.",
//   }),
//   drone_id: z.coerce.string().min(1, "Please select a drone."),
//   geofence_id: z.array(z.string()).nonempty("Select at least one geofence"),
// });
