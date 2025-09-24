import { Project } from '@/features/projects/types';
import { TaskFilterValues } from '@/features/tasks/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FiltersStore {
  selectedProjects: Project[];
  taskFilters: TaskFilterValues;
  
  setSelectedProjects: (projects: Project[]) => void;
  addSelectedProject: (project: Project) => void;
  removeSelectedProject: (projectId: string) => void;
  updateTaskFilter: (key: keyof TaskFilterValues, value: any) => void;
  clearFilters: () => void;
}

const initialFilters: TaskFilterValues = {
  status: undefined,
  priority: undefined,
  assignee: undefined,
  tags: undefined,
  search: undefined,
  projectId: undefined,
  projectIds: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const useFiltersStore = create<FiltersStore>()(
  devtools(
    (set) => ({
      selectedProjects: [],
      taskFilters: initialFilters,

      setSelectedProjects: (projects) =>
        set((state) => ({
          selectedProjects: projects,
          taskFilters: {
            ...state.taskFilters,
            projectIds: projects.length > 0 ? projects.map(p => p._id) : undefined,
            projectId: undefined, // Clear single project filter
          },
        })),

      addSelectedProject: (project) =>
        set((state) => {
          const newProjects = [...state.selectedProjects, project];
          return {
            selectedProjects: newProjects,
            taskFilters: {
              ...state.taskFilters,
              projectIds: newProjects.map(p => p._id),
              projectId: undefined,
            },
          };
        }),

      removeSelectedProject: (projectId) =>
        set((state) => {
          const newProjects = state.selectedProjects.filter(p => p._id !== projectId);
          return {
            selectedProjects: newProjects,
            taskFilters: {
              ...state.taskFilters,
              projectIds: newProjects.length > 0 ? newProjects.map(p => p._id) : undefined,
              projectId: undefined,
            },
          };
        }),

      updateTaskFilter: (key, value) =>
        set((state) => ({
          taskFilters: {
            ...state.taskFilters,
            [key]: value,
          },
        })),

      clearFilters: () =>
        set({
          selectedProjects: [],
          taskFilters: initialFilters,
        }),
    }),
    { name: 'filters' }
  )
);

// Selectors
export const useSelectedProjects = () => 
  useFiltersStore(state => state.selectedProjects);

export const useTaskFilters = () => 
  useFiltersStore(state => state.taskFilters);

export const useActiveFiltersCount = () =>
  useFiltersStore(state => {
    const excludedFields = ['projectId', 'projectIds'];
    const defaultValues = { sortBy: 'createdAt', sortOrder: 'desc' };
    
    return Object.entries(state.taskFilters)
      .filter(([key, value]) => {
        // Don't count excluded fields as active filters
        if (excludedFields.includes(key)) return false;
        
        // Don't count default values as active filters
        if (key in defaultValues && value === defaultValues[key as keyof typeof defaultValues]) return false;
        
        return value && (typeof value !== 'string' || value.length > 0) && (!Array.isArray(value) || value.length > 0);
      })
      .length;
  });