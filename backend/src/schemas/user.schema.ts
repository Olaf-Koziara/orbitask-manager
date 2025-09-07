import z from "zod";

export const userShortSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional(),
});
