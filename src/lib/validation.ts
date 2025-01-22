import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Cannot be empty"),
});

export const updateAdminSchema = z.object({
  role: z.enum(["User", "Admin"]),
  quota:  z.number(),
  id: z.string(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
export type UpdateAdminValues = z.infer<typeof updateAdminSchema>;
