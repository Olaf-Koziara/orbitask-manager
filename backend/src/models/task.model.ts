import mongoose from "mongoose";
import { Priority, TaskStatus } from "../types/task";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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
    ref: "User",
  },
  tags: [
    {
      type: String,
    },
  ],
  dueDate: {
    type: Date,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
taskSchema.virtual("project", {
  ref: "Project",
  localField: "projectId",
  foreignField: "_id",
  justOne: true,
});

taskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});
export const TaskModel = mongoose.model("Task", taskSchema);
