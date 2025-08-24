// Mock data for the task management application
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'progress' | 'review' | 'done';
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  tasks: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: string;
  projectId: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'deadline_approaching' | 'task_completed' | 'project_update';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    avatar: '/api/placeholder/40/40',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@company.com',
    avatar: '/api/placeholder/40/40',
    role: 'user'
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@company.com',
    avatar: '/api/placeholder/40/40',
    role: 'user'
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    email: 'alex@company.com',
    avatar: '/api/placeholder/40/40',
    role: 'user'
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    color: '#8B5CF6',
    tasks: ['1', '2', '3', '9']
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'iOS and Android app development',
    color: '#10B981',
    tasks: ['4', '5', '6', '10']
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q4 marketing initiatives',
    color: '#F59E0B',
    tasks: ['7', '8', '11', '12']
  }
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new homepage',
    description: 'Create wireframes and mockups for the new homepage layout',
    priority: 'high',
    status: 'progress',
    assignee: '2',
    projectId: '1',
    dueDate: '2024-01-15',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10',
    tags: ['design', 'frontend']
  },
  {
    id: '2',
    title: 'Implement responsive navigation',
    description: 'Code the responsive navigation component using React',
    priority: 'medium',
    status: 'todo',
    assignee: '3',
    projectId: '1',
    dueDate: '2024-01-20',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    tags: ['frontend', 'react']
  },
  {
    id: '3',
    title: 'Set up analytics tracking',
    description: 'Integrate Google Analytics and set up conversion tracking',
    priority: 'low',
    status: 'todo',
    assignee: '4',
    projectId: '1',
    dueDate: '2024-01-25',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
    tags: ['analytics', 'tracking']
  },
  {
    id: '4',
    title: 'User authentication system',
    description: 'Build secure login and registration flow',
    priority: 'urgent',
    status: 'progress',
    assignee: '2',
    projectId: '2',
    dueDate: '2024-01-12',
    createdAt: '2023-12-20',
    updatedAt: '2024-01-08',
    tags: ['backend', 'security']
  },
  {
    id: '5',
    title: 'Push notifications',
    description: 'Implement push notification system for both platforms',
    priority: 'medium',
    status: 'review',
    assignee: '3',
    projectId: '2',
    dueDate: '2024-01-18',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-11',
    tags: ['mobile', 'notifications']
  },
  {
    id: '6',
    title: 'App store submission',
    description: 'Prepare app store listings and submit for review',
    priority: 'high',
    status: 'todo',
    assignee: '1',
    projectId: '2',
    dueDate: '2024-02-01',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-04',
    tags: ['deployment', 'app-store']
  },
  {
    id: '7',
    title: 'Social media strategy',
    description: 'Develop comprehensive social media marketing plan',
    priority: 'medium',
    status: 'done',
    assignee: '4',
    projectId: '3',
    dueDate: '2024-01-10',
    createdAt: '2023-12-15',
    updatedAt: '2024-01-09',
    tags: ['marketing', 'social-media']
  },
  {
    id: '8',
    title: 'Email campaign design',
    description: 'Create email templates for Q4 campaigns',
    priority: 'low',
    status: 'progress',
    assignee: '2',
    projectId: '3',
    dueDate: '2024-01-22',
    createdAt: '2024-01-06',
    updatedAt: '2024-01-12',
    tags: ['email', 'design']
  },
  {
    id: '9',
    title: 'Performance optimization',
    description: 'Optimize website loading speed and performance metrics',
    priority: 'high',
    status: 'todo',
    assignee: '3',
    projectId: '1',
    dueDate: '2024-01-30',
    createdAt: '2024-01-07',
    updatedAt: '2024-01-07',
    tags: ['performance', 'optimization']
  },
  {
    id: '10',
    title: 'API documentation',
    description: 'Write comprehensive API documentation for mobile app',
    priority: 'medium',
    status: 'todo',
    assignee: '1',
    projectId: '2',
    dueDate: '2024-01-28',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    tags: ['documentation', 'api']
  },
  {
    id: '11',
    title: 'Influencer partnerships',
    description: 'Identify and reach out to potential brand influencers',
    priority: 'low',
    status: 'review',
    assignee: '4',
    projectId: '3',
    dueDate: '2024-02-05',
    createdAt: '2024-01-09',
    updatedAt: '2024-01-13',
    tags: ['partnerships', 'influencers']
  },
  {
    id: '12',
    title: 'Marketing analytics setup',
    description: 'Configure marketing attribution and ROI tracking',
    priority: 'urgent',
    status: 'todo',
    assignee: '1',
    projectId: '3',
    dueDate: '2024-01-14',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    tags: ['analytics', 'marketing']
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'deadline_approaching',
    title: 'Deadline Approaching',
    message: 'User authentication system is due in 2 days',
    read: false,
    createdAt: '2024-01-11T10:00:00Z',
    taskId: '4'
  },
  {
    id: '2',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Marketing analytics setup"',
    read: false,
    createdAt: '2024-01-10T15:30:00Z',
    taskId: '12'
  },
  {
    id: '3',
    type: 'task_completed',
    title: 'Task Completed',
    message: 'Alex Rodriguez completed "Social media strategy"',
    read: true,
    createdAt: '2024-01-09T14:20:00Z',
    taskId: '7'
  }
];

// Current user (for role-based features)
export const currentUser: User = mockUsers[0]; // Sarah Johnson (Admin)

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getTasksByStatus = (status: Status): Task[] => {
  return mockTasks.filter(task => task.status === status);
};

export const getTasksByProject = (projectId: string): Task[] => {
  return mockTasks.filter(task => task.projectId === projectId);
};

export const getTasksByAssignee = (assigneeId: string): Task[] => {
  return mockTasks.filter(task => task.assignee === assigneeId);
};

export const getOverdueTasks = (): Task[] => {
  const today = new Date().toISOString().split('T')[0];
  return mockTasks.filter(task => 
    task.status !== 'done' && task.dueDate < today
  );
};

export const getTaskStats = () => {
  const total = mockTasks.length;
  const completed = mockTasks.filter(task => task.status === 'done').length;
  const inProgress = mockTasks.filter(task => task.status === 'progress').length;
  const overdue = getOverdueTasks().length;
  
  return {
    total,
    completed,
    inProgress,
    overdue,
    completionRate: Math.round((completed / total) * 100)
  };
};