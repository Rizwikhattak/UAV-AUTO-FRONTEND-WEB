import { z } from "zod";

/**
 * Accepts numbers **or** strings like "75" or "75%"
 * → Coerces to a number
 * → Ensures 0 ≤ value ≤ 100
 */
const percent = z
  .union([
    z.number(),
    z.string().regex(/^\d{1,3}(\.\d+)?%?$/), // 0-100 with optional “%”
  ])
  .transform((v) =>
    typeof v === "string" ? parseFloat(v.replace("%", "")) : v
  )
  .refine((v) => v >= 0 && v <= 100, {
    message: "Percentage must be between 0 and 100.",
  });

export const efficiencySchema = z.object({
  clean: percent,
  dusty: percent,
  damaged: percent,
});
