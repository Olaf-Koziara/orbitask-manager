import React from "react";
import { Project } from "@/features/projects/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shared/components/ui/tooltip";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  return (
    <div
      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg">{project.name}</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: project.color }}
              aria-label="Project color"
              role="img"
              tabIndex={0}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Project color</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {project.description && (
        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
      )}

      <div className="text-xs text-gray-500">
        Created by: {project.createdBy?.name || "Unknown"}
      </div>

      <div className="text-xs text-gray-500">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
