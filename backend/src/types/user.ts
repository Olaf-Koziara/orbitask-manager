import z from 'zod';
export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'member', 'viewer']),
  avatarUrl: z.string().optional(),
});
export const createUserSchema = userSchema.omit({ role: true });
export const updateUserSchema = userSchema.partial().omit({ password: true });
export type UserType = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;