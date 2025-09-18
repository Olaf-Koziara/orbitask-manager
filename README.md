# OrbiTask Manager

_A modern, full-stack task and project management application built for personal productivity optimization_

<!-- TODO: Add banner image -->

## Table of Contents

- [Introduction](#introduction)
- [Technologies & Architecture](#technologies--architecture)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Examples](#usage-examples)
- [API Documentation](#api-documentation)
- [Project Status](#project-status)
- [Contributing](#contributing)
- [License](#license)

## Introduction

OrbiTask Manager is a comprehensive task and project management application designed to enhance personal productivity through intelligent organization, visual workflows, and seamless collaboration. Built as a personal productivity tool, it combines the power of modern web technologies with an intuitive user experience to help manage tasks, projects, and team collaboration effectively.

### Project Goals

- **Personal Productivity**: Streamline task management and project planning
- **Scalable Architecture**: Built to handle growing complexity and feature requirements
- **Modern UX**: Intuitive interface with multiple viewing modes (Kanban, Calendar, List)
- **Extensibility**: Modular design for easy feature additions and customizations

## Technologies & Architecture

### Backend Stack

- **Node.js** with **TypeScript** - Type-safe server-side development
- **Express.js** - Fast, minimalist web framework
- **tRPC** - End-to-end typesafe APIs without code generation
- **MongoDB** with **Mongoose** - Flexible NoSQL database with elegant object modeling
- **JWT** - Secure authentication and authorization
- **Zod** - TypeScript-first schema validation

### Frontend Stack

- **React 18** - Modern component-based UI library
- **TypeScript** - Static type checking for better developer experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** + **Radix UI** - Accessible, customizable component library
- **React Query** - Powerful data synchronization for React
- **Zustand** - Lightweight state management
- **React Router** - Declarative routing for React

### Development & Quality Tools

- **ESLint** - Code linting and quality enforcement
- **Bun** - Fast JavaScript runtime and package manager (frontend)
- **React Hook Form** - Performant forms with easy validation
- **date-fns** - Modern JavaScript date utility library

### Why These Technologies?

**tRPC**: Chosen for its end-to-end type safety, eliminating the need for API documentation while ensuring frontend and backend stay in sync.

**MongoDB + Mongoose**: Selected for its flexibility in handling evolving data structures and its excellent JavaScript/TypeScript integration.

**Shadcn/ui + Radix**: Provides accessible, customizable components that maintain design consistency while allowing for extensive customization.

**Zustand**: Lightweight alternative to Redux that provides excellent TypeScript support with minimal boilerplate.

**Tailwind CSS**: Utility-first approach enables rapid UI development while maintaining design consistency.

## Key Features

### 🎯 Task Management

- **Multiple View Modes**: Kanban board, Calendar view, and List view
- **Priority Levels**: Low, Medium, High, and Urgent priority classification
- **Status Tracking**: Todo, In Progress, Review, and Done status workflow
- **Subtasks**: Break down complex tasks into manageable subtasks
- **Due Dates**: Set and track task deadlines
- **Tags System**: Organize and filter tasks with custom tags
- **Assignment**: Assign tasks to team members

<!-- TODO: Add task management screenshot -->

### 📊 Project Organization

- **Project Creation**: Create and organize projects with custom colors
- **Project Filtering**: Advanced filtering by creator, color, and search terms
- **Project Association**: Link tasks to specific projects
- **Project Dashboard**: Overview of project progress and statistics

<!-- TODO: Add project management screenshot -->

### 👥 User Management & Authentication

- **Secure Registration/Login**: JWT-based authentication system
- **User Profiles**: Customizable user profiles with avatar support
- **Role-based Access**: Admin, Member, and Viewer role system
- **Account Management**: Profile updates, password changes, and account deletion

### 🔔 Notification System

- **Real-time Notifications**: Stay updated on important task and project changes
- **Notification History**: Track all notifications with read/unread status
- **User-specific Notifications**: Personalized notification system

### 🎨 User Experience

- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Drag & Drop**: Intuitive task management with drag-and-drop functionality
- **Loading States**: Smooth loading indicators for better user experience
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages

## Project Structure

```
orbitask-manager/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── models/            # Mongoose data models
│   │   ├── schemas/           # Zod validation schemas
│   │   ├── trpc/             # tRPC routers and procedures
│   │   ├── types/            # TypeScript type definitions
│   │   ├── middlewares/      # Express middlewares
│   │   └── utils/            # Utility functions
│   └── package.json
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── features/         # Feature-based organization
│   │   │   ├── auth/         # Authentication features
│   │   │   ├── tasks/        # Task management features
│   │   │   ├── projects/     # Project management features
│   │   │   ├── shared/       # Shared components and utilities
│   │   │   └── user/         # User management features
│   │   ├── hooks/            # Custom React hooks
│   │   ├── libs/             # Third-party library configurations
│   │   ├── pages/            # Page components
│   │   └── utils/            # Utility functions
│   └── package.json
│
└── README.md
```

### Feature-Based Architecture

The frontend follows a feature-based architecture where each feature contains:

- **Components**: UI components specific to the feature
- **Hooks**: Custom hooks for feature logic
- **Stores**: Zustand stores for state management
- **Types**: TypeScript interfaces and types
- **API**: tRPC client calls and data fetching

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun (for frontend package management)
- MongoDB (local installation or cloud instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Olaf-Koziara/orbitask-manager.git
   cd orbitask-manager
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**

   ```bash
   cd frontend
   bun install
   ```

4. **Environment Configuration**

   Create `.env` file in the backend directory:

   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/orbitask

   # Authentication
   JWT_SECRET=your-secret-key-here

   # Server
   PORT=3001
   NODE_ENV=development
   ```

5. **Start Development Servers**

   Terminal 1 (Backend):

   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):

   ```bash
   cd frontend
   bun run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`

## Usage Examples

### Creating Your First Project

1. **Register/Login** to your account
2. **Navigate to Projects** section
3. **Click "New Project"** and fill in project details
4. **Choose a color** for easy visual identification
5. **Save** and start adding tasks to your project

### Managing Tasks with Kanban Board

![Kanban Board Example](./docs/images/kanban-example.png)

<!-- TODO: Add kanban board screenshot -->

1. **Create tasks** by clicking "Add Task" in any column
2. **Drag and drop** tasks between columns to update status
3. **Click on tasks** to edit details, add subtasks, or set due dates
4. **Filter tasks** by project, assignee, or priority
5. **Use search** to quickly find specific tasks

### In Development: Calendar View for Deadline Management

- **View tasks by due date** in an intuitive calendar layout
- **Click on dates** to create new tasks with specific due dates
- **Color-coded by priority** for quick visual assessment
- **Monthly/weekly views** for different planning perspectives

## API Documentation

The application uses tRPC for type-safe API communication. Key API routes include:

### Authentication Routes (`/auth`)

- `register` - User registration
- `login` - User authentication
- `me` - Get current user profile
- `updateProfile` - Update user information
- `changePassword` - Change user password

### Task Routes (`/tasks`)

- `create` - Create new task
- `list` - Get tasks with filtering
- `get` - Get specific task
- `update` - Update task details
- `delete` - Remove task

### Project Routes (`/projects`)

- `create` - Create new project
- `list` - Get all projects
- `update` - Update project details
- `delete` - Remove project

### Notification Routes (`/notifications`)

- `list` - Get user notifications
- `markAsRead` - Mark notification as read
- `markAllAsRead` - Mark all notifications as read

## Project Status

### Current Version: 1.0.0

**🟢 Completed Features:**

- ✅ User authentication and authorization
- ✅ Task management with CRUD operations
- ✅ Project organization and management
- ✅ Kanban board with drag-and-drop
- ✅ Responsive design

**🟡 In Development:**

- 🔄 Notification system
- 🔄 Calendar and list views
- 🔄 OpenAI integration for task suggestions
- 🔄 Advanced filtering and search
- 🔄 Real-time collaboration features
- 🔄 Mobile application

**🔴 Planned Features:**

- 📅 Recurring tasks
- 📊 Analytics and reporting
- 🔗 Third-party integrations (Google Calendar, Slack)
- 📱 Progressive Web App (PWA) features
- 🎯 Goal tracking and OKRs
- 📈 Time tracking functionality

### Known Issues

- Task drag-and-drop performance optimization needed
- Mobile responsiveness improvements in progress

## Contributing

As this is a personal productivity tool, contributions are currently limited to the project owner. However, the codebase serves as a reference for:

- Modern full-stack TypeScript development
- tRPC implementation patterns
- Feature-based frontend architecture
- MongoDB/Mongoose best practices

## Sources and Inspiration

- **Design Inspiration**: Notion, Linear, Asana
- **Architecture Patterns**: T3 Stack, Clean Architecture principles
- **UI Components**: Shadcn/ui component library
- **Best Practices**: React documentation, TypeScript handbook

## License

This project is currently private and for personal use only.

---

_Last updated: September 18, 2025_
