"use client";

import { z } from "zod";

export const addDroneSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Drone name must be at least 2 characters long." }),

  speed: z.string().min(1, { message: "Speed must be at least 1 km/h." }),

  flight_duration: z
    .string()
    .min(1, { message: "Flight duration must be at least 1 hour." }),

  ceiling: z
    .string()
    .min(1, { message: "Ceiling height must be at least 1 meter." }),

  fps: z.string().min(1, { message: "Camera FPS must be at least 1." }),

  station_id: z.string().min(1, { message: "Please select a station." }),

  image: z.custom(
    (val) => {
      // If empty or not provided, that's okay (optional).
      if (!val) return true;

      // If it's a File
      if (val instanceof File) return true;

      // If it's a string (existing image URL)
      if (typeof val === "string") return true;

      return false;
    },
    {
      message:
        "Please upload a valid image file or provide an existing image URL.",
    }
  ),
  // .refine((file) => file && file.size <= 2 * 1024 * 1024, {
  //   message: "Image size must be less than 2MB.",
  // })
  // .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
  //   message: "Only JPEG and PNG formats are allowed.",
  // }),
});
