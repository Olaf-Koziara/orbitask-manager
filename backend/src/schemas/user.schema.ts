import mongoose from "mongoose";
import z from "zod";

export const userShortSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  name: z.string(),
  avatarUrl: z.string().optional(),
});
