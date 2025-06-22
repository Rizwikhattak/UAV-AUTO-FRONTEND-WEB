import { z } from "zod";

export const emailSchema = z
  .string()
  .email({ message: "Invalid Email Format" });
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});
