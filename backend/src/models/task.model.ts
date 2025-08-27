import mongoose from 'mongoose';
import { TaskStatus, Priority, ITask } from '../types/task';

const taskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.TODO,
  },
  priority: {
    type: String,
    enum: Object.values(Priority),
    default: Priority.MEDIUM,
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tags: [{
    type: String,
  }],
  dueDate: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
