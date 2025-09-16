import mongoose, { Schema } from 'mongoose';
import { IProjectDocument } from '../types/project';


const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  color: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model<IProjectDocument>('Project', projectSchema);
