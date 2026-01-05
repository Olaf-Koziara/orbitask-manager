import z from "zod";

export const projectSchema = z.object({
  _id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string(),
  participants: z.array(z.string()),
});
export const projectInputSchema = projectSchema.omit({_id:true})
export const projectFiltersSchema = z
  .object({
    search: z.string().optional(),
    createdBy: z.string().optional(),
    color: z.string().optional(),
    sortBy: z
      .enum(["name", "createdAt", "updatedAt"])
      .optional()
      .default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  })
  .optional();
