import { z } from "zod";

export const addMissionPanelMapSchema = z.object({
  solar_row: z.coerce.number().min(0, { message: "Solar row is required" }),
  solar_column: z.coerce
    .number()
    .min(0, { message: "Solar column is required" }),
  solar_watts: z.coerce.number().min(0, { message: "Solar watts is required" }),
  solar_frame_no: z.coerce.number().min(0, { message: "Frame no is required" }),
});
