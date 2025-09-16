import { Button } from "@/features/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { ChevronDown, FolderOpen, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { Project } from "../types";
import { ProjectBadge } from "./ProjectBadge";

interface ProjectsDropdownProps {
  currentView?: string;
}

export const ProjectsDropdown = ({ currentView }: ProjectsDropdownProps) => {
  const { projects, isLoading, selectedProject, setSelectedProject } =
    useProjects();

  const recentProjects = projects.slice(0, 5);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={currentView === "projects" ? "default" : "ghost"}
          className="h-8 px-3"
          size="sm"
        >
          <FolderOpen className="h-4 w-4 mr-1.5" />
          {selectedProject ? (
            <ProjectBadge project={selectedProject} />
          ) : (
            "Projects"
          )}
          <ChevronDown className="h-3 w-3 ml-1.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {isLoading ? (
          <DropdownMenuItem disabled>Loading projects...</DropdownMenuItem>
        ) : recentProjects.length > 0 ? (
          <>
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              Recent Projects
            </div>
            {recentProjects.map((project: Project) => (
              <DropdownMenuItem key={project._id} className="p-0">
                <button
                  onClick={() => handleProjectSelect(project)}
                  className="flex items-center gap-3 w-full px-2 py-2 hover:bg-accent rounded-sm text-left"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {project.name}
                    </div>
                    {project.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {project.description}
                      </div>
                    )}
                  </div>
                </button>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        ) : (
          <>
            <DropdownMenuItem disabled>No projects yet</DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem className="p-0">
          <Link
            to="/projects"
            className="flex items-center gap-2 w-full px-2 py-2 hover:bg-accent rounded-sm"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="font-medium">See all projects</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0">
          <Link
            to="/projects"
            className="flex items-center gap-2 w-full px-2 py-2 hover:bg-accent rounded-sm text-primary"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">Create new project</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
