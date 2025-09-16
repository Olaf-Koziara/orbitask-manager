import { Document } from 'mongodb';
import mongoose from 'mongoose';

export interface IProject  {
  name: string;
  description?: string;
  color: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


export interface IProjectDocument extends IProject, Document {}

export interface IProjectResponse extends Omit<IProject, '_id' | 'createdBy'> {
    _id: mongoose.Types.ObjectId;
    createdBy: string;
}