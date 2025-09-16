import { Project } from '@/features/projects/types';
import { TaskFilterValues } from '@/features/tasks/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FiltersStore {
  selectedProject: Project | null;
  taskFilters: TaskFilterValues;
  
  setSelectedProject: (project: Project | null) => void;
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
};

export const useFiltersStore = create<FiltersStore>()(
  devtools(
    (set) => ({
      selectedProject: null,
      taskFilters: initialFilters,

      setSelectedProject: (project) =>
        set((state) => ({
          selectedProject: project,
          taskFilters: {
            ...state.taskFilters,
            projectId: project?._id || undefined,
          },
        })),

      updateTaskFilter: (key, value) =>
        set((state) => ({
          taskFilters: {
            ...state.taskFilters,
            [key]: value,
          },
        })),

      clearFilters: () =>
        set({
          selectedProject: null,
          taskFilters: initialFilters,
        }),
    }),
    { name: 'filters' }
  )
);

// Selectors
export const useSelectedProject = () => 
  useFiltersStore(state => state.selectedProject);

export const useTaskFilters = () => 
  useFiltersStore(state => state.taskFilters);

export const useActiveFiltersCount = () =>
  useFiltersStore(state => 
    Object.values(state.taskFilters).filter(Boolean).length
  );