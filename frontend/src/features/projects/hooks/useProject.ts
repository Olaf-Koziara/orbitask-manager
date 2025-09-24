import { trpc } from "@/api/trpc";

interface UseProjectProps {
  projectId: string | undefined;
  enabled?: boolean;
}

export const useProject = ({ projectId, enabled = true }: UseProjectProps) => {
  const projectQuery = trpc.projects.get.useQuery(projectId!, {
    enabled: enabled && !!projectId,
  });

  return {
    project: projectQuery.data,
    isLoading: projectQuery.isLoading,
    error: projectQuery.error,
    participants: projectQuery.data?.participants || [],
  };
};