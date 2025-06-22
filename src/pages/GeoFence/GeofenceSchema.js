"use client";

import { z } from "zod";

export const geofenceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Geofence name must be at least 2 characters long." })
    .max(50, { message: "Geofence name must not exceed 50 characters." }),
  rows: z.coerce.number().min(1, { message: "Enter valid no. of rows" }),
  columns: z.coerce.number().min(1, { message: "Enter valid no. of columns" }),

  stationPins: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
        id: z.string().optional(),
      })
    )
    .min(1, { message: "At least one station pin must be set." }),

  routePins: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
        id: z.string().optional(),
      })
    )
    .min(1, { message: "At least one geofencing point must be added." }),
});
