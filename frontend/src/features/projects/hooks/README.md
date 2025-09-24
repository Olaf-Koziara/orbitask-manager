# Enhanced Projects Hook Documentation

## Overview

The `useProjects` hook has been completely refactored and extended to support powerful filtering, sorting, and real-time updates. The implementation follows React best practices and maintains clean, maintainable code.

## Key Features

### ✅ Filter Support

- **Search**: Filter by project name and description
- **Created By**: Filter by user who created the project
- **Color**: Filter by project color
- **Sorting**: Sort by name, creation date, or update date (ascending/descending)

### ✅ Performance Optimizations

- **Debounced filters**: Prevents excessive API calls during user input
- **Efficient re-renders**: Only updates when necessary
- **Proper dependency management**: Optimized useEffect dependencies

### ✅ Clean Architecture

- **Separation of concerns**: Dedicated filter management hook
- **Type safety**: Full TypeScript support with proper interfaces
- **Error handling**: Comprehensive error states and user feedback
- **Loading states**: Multiple loading indicators for better UX

### ✅ Backend Integration

- **Server-side filtering**: Filters applied on the backend for better performance
- **Optimized queries**: Only sends defined filter values
- **Scalable**: Ready for large datasets

## API Reference

### useProjects Hook

```typescript
const {
  // Data
  projects,

  // State
  isLoading,
  error,

  // Actions
  createProject,
  updateProject,
  deleteProject,
  refetch,

  // Mutation states
  isCreating,
  isUpdating,
  isDeleting,

  // Query state
  isFetching,
  isRefetching,
} = useProjects({
  filters?: ProjectFilterValues;
  enabledFilters?: boolean;
});
```

#### Parameters

- `filters` (optional): Filter values to apply
- `enabledFilters` (optional): Whether to enable filtering (default: true)

#### Returns

- `projects`: Array of filtered projects
- `isLoading`: Initial loading state
- `isFetching`: Whether currently fetching data
- `isRefetching`: Whether currently refetching data
- `error`: Error object if any
- `createProject`: Function to create a new project
- `updateProject`: Function to update an existing project
- `deleteProject`: Function to delete a project
- `refetch`: Function to manually refetch data
- `isCreating/isUpdating/isDeleting`: Mutation loading states

### useProjectFilters Hook

```typescript
const {
  projectFiltersValues,
  updateFilter,
  clearFilter,
  clearAllFilters,
  filterOptions,
  activeFiltersCount,
  isLoading,
} = useProjectFilters();
```

#### Returns

- `projectFiltersValues`: Current filter values
- `updateFilter`: Function to update a specific filter
- `clearFilter`: Function to clear a specific filter
- `clearAllFilters`: Function to clear all filters
- `filterOptions`: Available options for filters (users, colors, sort options)
- `activeFiltersCount`: Number of active filters
- `isLoading`: Whether filter options are loading

## Usage Examples

### Basic Usage

```typescript
import { useProjects } from "@/features/projects/hooks/useProjects";

const ProjectList = () => {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### With Filters

```typescript
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useProjectFilters } from "@/features/projects/hooks/useProjectFilters";

const ProjectsWithFilters = () => {
  const {
    projectFiltersValues,
    updateFilter,
    clearAllFilters,
    activeFiltersCount,
  } = useProjectFilters();

  const { projects, isLoading, error, refetch } = useProjects({
    filters: projectFiltersValues,
    enabledFilters: true,
  });

  return (
    <div>
      {/* Search Input */}
      <input
        value={projectFiltersValues.search || ""}
        onChange={(e) => updateFilter("search", e.target.value)}
        placeholder="Search projects..."
      />

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div>
          <span>Active filters: {activeFiltersCount}</span>
          <button onClick={clearAllFilters}>Clear All</button>
        </div>
      )}

      {/* Projects List */}
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>
          Error: {error.message}
          <button onClick={refetch}>Retry</button>
        </div>
      ) : (
        <div>
          {projects.map((project) => (
            <div key={project.id}>{project.name}</div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Advanced Filtering

```typescript
const AdvancedProjectFilters = () => {
  const { updateFilter, filterOptions } = useProjectFilters();

  return (
    <div>
      {/* Color Filter */}
      <select onChange={(e) => updateFilter("color", e.target.value)}>
        <option value="">All Colors</option>
        {filterOptions.colors.map((color) => (
          <option key={color.value} value={color.value}>
            {color.label}
          </option>
        ))}
      </select>

      {/* User Filter */}
      <select onChange={(e) => updateFilter("createdBy", e.target.value)}>
        <option value="">All Users</option>
        {filterOptions.users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Sort Options */}
      <select onChange={(e) => updateFilter("sortBy", e.target.value)}>
        <option value="createdAt">Created Date</option>
        <option value="name">Name</option>
        <option value="updatedAt">Updated Date</option>
      </select>

      <select onChange={(e) => updateFilter("sortOrder", e.target.value)}>
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>
    </div>
  );
};
```

## Type Definitions

```typescript
interface ProjectFilterValues {
  search?: string;
  createdBy?: string;
  color?: string;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

interface UseProjectsProps {
  filters?: ProjectFilterValues;
  enabledFilters?: boolean;
}
```

## Backend Support

The backend now supports the following filter parameters:

- `search`: Text search in name and description (case-insensitive)
- `createdBy`: Filter by user ID
- `color`: Exact color match
- `sortBy`: Field to sort by ('name', 'createdAt', 'updatedAt')
- `sortOrder`: Sort direction ('asc', 'desc')

## Performance Features

### Debouncing

- 300ms debounce on filter changes prevents excessive API calls
- Particularly important for search input

### Efficient Updates

- Uses `useMemo` for expensive calculations
- Proper dependency arrays in `useEffect`
- Minimal re-renders through careful state management

### Loading States

- Multiple loading indicators for different operations
- Clear distinction between initial load, refetch, and mutations

## Best Practices

1. **Always handle loading and error states**
2. **Use the debounced filters for user input**
3. **Clear filters when appropriate for better UX**
4. **Provide visual feedback for active filters**
5. **Use the refetch function for manual refresh**

## Migration Guide

If you're migrating from the old implementation:

### Before

```typescript
const { projects, isLoading } = useProjects({ projectsFilters });
```

### After

```typescript
const { projectFiltersValues } = useProjectFilters();
const { projects, isLoading } = useProjects({
  filters: projectFiltersValues,
  enabledFilters: true,
});
```

The new implementation provides much more flexibility and follows React best practices for state management and performance optimization.
