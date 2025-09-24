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
  useFiltersStore(state => 
    Object.entries(state.taskFilters)
      .filter(([key, value]) => value && key !== 'projectId' && key !== 'projectIds')
      .length
  );