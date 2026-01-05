import mongoose from "mongoose";
import { PopulatedUser } from "./user";

export interface IProject {
  name: string;
  description?: string;
  color: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  participants: mongoose.Types.ObjectId[];
}

export interface IProjectDocument extends IProject, mongoose.Document {}

export interface IProjectResponse
  extends Omit<IProject, "_id" | "createdBy" | "participants"> {
  _id: mongoose.Types.ObjectId;
  createdBy: PopulatedUser;
  participants: PopulatedUser[];
}
