import { trpc } from "@/api/trpc";
import { useDebounce } from "@/features/shared/hooks/useDebounce";
import { prepareQueryInput } from "@/features/shared/utils";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useMemo } from "react";
import { useProjectsStore } from "../stores/projects.store";
import { ProjectFilterValues } from "../types";

interface UseProjectsProps {
  filters?: ProjectFilterValues;
  enabledFilters?: boolean;
}

export const useProjects = ({ filters, enabledFilters = true }: UseProjectsProps = {}) => {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { projects,setProjects, setLoading, setError,setSelectedProjects,selectedProjects } = useProjectsStore();
  
  const debouncedFilters = useDebounce(filters, 300);
  
  const queryInput = useMemo(() => prepareQueryInput(debouncedFilters), [debouncedFilters]);

  const projectsQuery = trpc.projects.list.useQuery(queryInput);

  useEffect(() => {
    if (projectsQuery.data) {
      setProjects(projectsQuery.data);
    }
  }, [projectsQuery.data, setProjects]);

  useEffect(() => {
    setLoading(projectsQuery.isLoading);
  }, [projectsQuery.isLoading, setLoading]);

  useEffect(() => {
    if (projectsQuery.error) {
      const error = new Error(projectsQuery.error.message || 'An error occurred');
      setError(error);
    } else {
      setError(null);
    }
  }, [projectsQuery.error, setError]);

  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      utils.projects.list.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProject = trpc.projects.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      utils.projects.list.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProject = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      utils.projects.list.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const refetch = () => {
    return projectsQuery.refetch();
  };

  return {
    // Data
    projects: projects ?? [],
    
    // State
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    selectedProjects,
    
    // Actions
    createProject: createProject.mutate,
    updateProject: updateProject.mutate,
    deleteProject: deleteProject.mutate,
    refetch,
    setSelectedProjects,
    
    // Mutation states
    isCreating: createProject.isPending,
    isUpdating: updateProject.isPending,
    isDeleting: deleteProject.isPending,
    
    // Query state
    isFetching: projectsQuery.isFetching,
    isRefetching: projectsQuery.isRefetching,
  };
};