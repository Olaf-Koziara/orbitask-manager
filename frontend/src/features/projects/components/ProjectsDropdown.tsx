import { Button } from "@/features/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import {
  useFiltersStore,
  useSelectedProject,
} from "@/features/tasks/stores/filters.store";
import { ChevronDown, FolderOpen, X } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { Project } from "../types";

interface ProjectsDropdownProps {
  currentView?: string;
}

export const ProjectsDropdown = ({ currentView }: ProjectsDropdownProps) => {
  const selectedProject = useSelectedProject();
  const { setSelectedProject } = useFiltersStore();
  const { projects, isLoading } = useProjects();

  const handleClearSelection = () => {
    setSelectedProject(null);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            {selectedProject ? selectedProject.name : "All Projects"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => setSelectedProject(null)}>
            All Projects
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {projects?.map((project: Project) => (
            <DropdownMenuItem
              key={project._id}
              onClick={() => setSelectedProject(project)}
              className={
                selectedProject?._id === project._id ? "bg-accent" : ""
              }
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedProject && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearSelection}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
