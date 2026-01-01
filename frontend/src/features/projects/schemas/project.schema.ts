import z from "zod";

export const projectFormSchema = z.object({
  name: z.string().trim().nonempty("Project name is required").min(2, "Name must be at least 2 characters").max(50, 'Name must be 50 characters or less'),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  color: z.string().min(7, "Please select a color").max(7).regex(/^#[A-Fa-f0-9]{6}$/, 'Invalid color format'),
  participants: z.array(z.string()).optional().default([]),
});
