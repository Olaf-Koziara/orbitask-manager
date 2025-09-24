import z from "zod";

export const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).optional(),
  color: z.string().min(7, "Please select a color").max(7),
  participants: z.array(z.string()).optional().default([]),
});
