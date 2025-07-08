import { z } from "zod";

export const PlanMaintenanceSchema = z.object({
  date_from_damaged: z
    .string()
    .min(1, { message: "Start date for damaged is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  date_to_damaged: z
    .string()
    .min(1, { message: "End date for damaged is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  date_from_dusty: z
    .string()
    .min(1, { message: "Start date for dusty is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  date_to_dusty: z
    .string()
    .min(1, { message: "End date for dusty is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});
