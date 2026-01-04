import { create } from "zustand";
import { Project, ProjectFilterValues } from "@/features/projects/types";

interface ProjectStore {
  projects: Project[];
  selectedProjects: Project[];
  filters: ProjectFilterValues;
  isLoading: boolean;
  error: Error | null;
  setProjects: (projects: Project[] | any[]) => void; 
  setSelectedProjects: (projects: Project[]) => void;
  addSelectedProject: (project: Project) => void;
  removeSelectedProject: (projectId: string) => void;
  setFilters: (filters: ProjectFilterValues) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useProjectsStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProjects: [],
  filters: {
    search: undefined,
    createdBy: undefined,
    color: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  setSelectedProjects: (projects) => set({ selectedProjects: projects }),
  addSelectedProject: (project) => set((state) => ({ 
    selectedProjects: [...state.selectedProjects, project] 
  })),
  removeSelectedProject: (projectId) => set((state) => ({ 
    selectedProjects: state.selectedProjects.filter(p => p._id !== projectId) 
  })),
  setFilters: (filters) => set({ filters }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));