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
  useSelectedProjects,
} from "@/features/tasks/stores/filters.store";
import { ChevronDown, FolderOpen } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { Project } from "../types";

interface ProjectsDropdownProps {
  currentView?: string;
}

export const ProjectsDropdown = ({ currentView }: ProjectsDropdownProps) => {
  const selectedProjects = useSelectedProjects();
  const { setSelectedProjects, addSelectedProject, removeSelectedProject } =
    useFiltersStore();
  const { projects, isLoading } = useProjects();

  const handleClearSelection = () => {
    setSelectedProjects([]);
  };

  const handleProjectToggle = (project: Project) => {
    const isSelected = selectedProjects.some((p) => p._id === project._id);
    if (isSelected) {
      removeSelectedProject(project._id);
    } else {
      addSelectedProject(project);
    }
  };

  const getDisplayText = () => {
    console.log(selectedProjects);
    if (selectedProjects.length === 0) return "All Projects";
    if (selectedProjects.length === 1) return selectedProjects[0].name;
    return `${selectedProjects.length} Projects Selected`;
  };

  return (
    <div className="flex items-center gap-2 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 ">
            <FolderOpen className="h-4 w-4" />
            <span className="text-muted-foreground ">{getDisplayText()}</span>

            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={() => setSelectedProjects([])}>
            All Projects
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {projects?.map((project: Project) => {
            const isSelected = selectedProjects.some(
              (p) => p._id === project._id
            );
            return (
              <DropdownMenuItem
                key={project._id}
                onClick={() => handleProjectToggle(project)}
                className={isSelected ? "bg-accent" : ""}
              >
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleProjectToggle(project)}
                    className="mr-2"
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
