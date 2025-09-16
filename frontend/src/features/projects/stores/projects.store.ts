import { create } from "zustand";
import { Project, ProjectFilterValues } from "../types";

interface ProjectStore {
  projects: Project[];
  selectedProject: Project | null;
  filters: ProjectFilterValues;
  isLoading: boolean;
  error: Error | null;
  setProjects: (projects: Project[] | any[]) => void; 
  setSelectedProject: (project: Project | null) => void;
  setFilters: (filters: ProjectFilterValues) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export const useProjectsStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedProject: null,
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
  setSelectedProject: (project) => set({ selectedProject: project }),
  setFilters: (filters) => set({ filters }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));