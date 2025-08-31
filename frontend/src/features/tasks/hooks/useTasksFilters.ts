import { User, Project } from '@/types/api';
import { trpc } from '@/utils/trpc';

export const useTaskFilters = () => {
  const { data: users, isLoading: isLoadingUsers } = trpc.auth.list.useQuery();
  const { data: projects, isLoading: isLoadingProjects } = trpc.projects.list.useQuery();

  return {
    users: users as User[],
    projects: projects as Project[],
    isLoading: isLoadingUsers || isLoadingProjects,
  };
};
