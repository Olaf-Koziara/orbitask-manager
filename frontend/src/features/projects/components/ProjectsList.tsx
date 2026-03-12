import { Button } from "@/features/shared/components/ui/button";
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
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading projects...</p>
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
          {activeFiltersCount > 0 ? (
            <>
              <p>No projects found matching your filters.</p>
              <Button
                variant="link"
                onClick={onClearAllFilters}
                className="mt-2"
              >
                Clear filters to see all projects
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-medium text-foreground">
                No projects yet
              </p>
              <p className="text-sm text-muted-foreground">
                Create your first project to get started.
              </p>
              <Button onClick={() => setOpenedProject({})} className="mt-2">
                Create Project
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>
      )}

      <ProjectFormDialog
        project={openedProject}
        open={!!openedProject}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onOpenChange={handleCloseDialog}
      />
    </div>
  );
};
