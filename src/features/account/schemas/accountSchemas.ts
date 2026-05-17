import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Enter a valid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;