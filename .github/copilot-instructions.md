---
description: Development guide for Orbitask - a full-stack task management application
---

# Orbitask Development Guide

## Architecture Overview

Orbitask is a full-stack TypeScript application using tRPC for end-to-end type safety, featuring a feature-based frontend architecture and MongoDB backend.

**Tech Stack:**

- Frontend: React 18 + Vite, TanStack Query, Zustand, Shadcn/UI, Tailwind
- Backend: Express + tRPC, MongoDB + Mongoose, JWT auth
- Shared: Zod schemas, SuperJSON transformer

## Feature-Based Organization

```
src/features/{feature}/
  ├── components/     # UI components specific to feature
  ├── hooks/         # React hooks for business logic
  ├── stores/        # Zustand stores for state management
  ├── types/         # TypeScript interfaces
  ├── views/         # Page-level components
  ├── schemas/       # Zod validation schemas
  └── templates/     # Layout components
```

## tRPC Integration Patterns

**Backend Router Structure:**

```typescript
// Each feature has its own router in backend/src/trpc/
export const projectRouter = router({
  create: protectedProcedure
    .input(projectSchema)
    .mutation(async ({ input, ctx }) => {
      // ctx.user available in protected procedures
    }),
  list: protectedProcedure.input(filtersSchema).query(async ({ input }) => {
    // Server-side filtering with MongoDB queries
  }),
});
```

**Frontend Usage:**

```typescript
// Use trpc hooks directly in components
const { data: projects, isLoading } = trpc.projects.list.useQuery(filters);
const createProject = trpc.projects.create.useMutation();
```

## State Management Patterns

**Zustand Stores:** Use for feature-specific state with persistence where needed

```typescript
// Pattern: features/{feature}/stores/{feature}.store.ts
export const useProjectsStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // State and actions
    }),
    { name: "projects-storage" }
  )
);
```

**React Query + tRPC:** Primary data fetching, automatic caching and invalidation

## Authentication Flow

- JWT tokens stored in localStorage via `useAuthStore`
- `PrivateRoute` component wraps protected routes
- Backend uses `isAuthenticated` and `isAdmin` middleware
- Auth headers automatically added in tRPC client configuration

## Component Patterns

**Shadcn/UI Integration:** All UI components in `src/features/shared/components/ui/`

- Import from `@/features/shared/components/ui/{component}`
- Extend with `className` prop using `cn()` utility
- Use Radix primitives with Tailwind styling

**Dialog/Form Pattern:**

```typescript
// Common pattern for forms in dialogs
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>{trigger}</DialogTrigger>
  <DialogContent>
    <Form onSubmit={handleSubmit}>{/* Form fields */}</Form>
  </DialogContent>
</Dialog>
```

## Development Workflow

**Running the Application:**

```bash
# Backend (http://localhost:5000)
cd backend && npm run dev

# Frontend (http://localhost:8080)
cd frontend && npm run dev
```

**Type Safety:** Changes to backend schemas automatically propagate to frontend via shared tRPC types

**Filtering Pattern:** Complex filters use dedicated hooks (see `useProjectFilters`) with debouncing for search inputs

## Error Handling

- `ErrorBoundary` wraps the entire app for React errors
- tRPC errors automatically typed and handled in UI
- Toast notifications via Sonner and custom `useToast` hook

## Import Conventions

- Use `@/` alias for src directory imports
- Absolute imports: `@/features/auth/hooks/useAuth`
- UI components: `@/features/shared/components/ui/{component}`
- Utils: `@/features/shared/utils` for `cn()` helper

## Hook Patterns

**Custom Hooks for Business Logic:**

```typescript
// Pattern: features/{feature}/hooks/use{Feature}.ts
export const useProjects = ({ filters, enabledFilters = true }) => {
  const {
    data: projects,
    isLoading,
    error,
  } = trpc.projects.list.useQuery(filters, { enabled: enabledFilters });
  return { projects, isLoading, error };
};
```

**Filter Hooks with Debouncing:**

```typescript
// Dedicated filter hooks for complex filtering UIs
const { projectFiltersValues, updateFilter, clearAllFilters } =
  useProjectFilters();
// Automatically debounces search inputs, manages filter options
```

## Styling Conventions

- Tailwind classes for styling, CSS variables for theming
- `cn()` utility for conditional classes: `cn("base-class", condition && "conditional-class")`
- Dark/light theme support via `next-themes`
- Gradient utilities: `text-gradient`, `bg-gradient-primary`
