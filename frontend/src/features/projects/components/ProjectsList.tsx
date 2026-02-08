import { Button } from "@/features/shared/components/ui/button";
import { Skeleton } from "@/features/shared/components/ui/skeleton";
import React, { useCallback } from "react";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { Project, ProjectFormValues } from "@/features/projects/types";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { ProjectFormDialog } from "@/features/projects/components/ProjectFormDialog";

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
  activeFiltersCount: number;
  onRefresh: () => void;
  onClearAllFilters: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  isLoading,
  activeFiltersCount,
  onRefresh,
  onClearAllFilters,
}) => {
  const { createProject, updateProject, deleteProject } = useProjects();
  const [openedProject, setOpenedProject] = React.useState<Project | null>(
    null
  );

  const handleProjectClick = useCallback((project: Project) => {
    setOpenedProject(project);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenedProject(null);
  }, []);

  const handleSubmit = (formData: ProjectFormValues) => {
    if (openedProject && openedProject._id) {
      // Update existing project
      updateProject({ id: openedProject._id, data: formData });
    } else {
      // Create new project
      createProject(formData);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    handleCloseDialog();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
        <div className="flex space-x-2">
          <Button onClick={onRefresh} variant="outline">
            Refresh
          </Button>
          <Button onClick={() => setOpenedProject({})}>New Project</Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No projects found matching your filters.</p>
          {activeFiltersCount > 0 && (
            <Button variant="link" onClick={onClearAllFilters} className="mt-2">
              Clear filters to see all projects
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
          <ProjectFormDialog
            project={openedProject}
            open={!!openedProject}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onOpenChange={handleCloseDialog}
          />
        </>
      )}
    </div>
  );
};
