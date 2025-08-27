export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatarUrl?: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  color: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}
