// Types are inferred from tRPC, but for reference:

export interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface PopulatedProject {
  _id: string;
  name: string;
  color: string;
  description?: string;
}

export interface TaskPopulatedResponse {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  tags: string[];
  assignee?: PopulatedUser;
  projectId?: PopulatedProject;
  createdBy: PopulatedUser;
  createdAt: Date;
  updatedAt: Date;
}
