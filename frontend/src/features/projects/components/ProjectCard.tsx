import React from "react";
import { Project } from "@/features/projects/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shared/components/ui/tooltip";
import { DateService } from "@/features/shared/services/date.service";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  const titleId = `project-title-${project._id}`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 id={titleId} className="font-semibold text-lg">{project.name}</h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: project.color }}
              aria-label={`Color: ${project.color}`}
              role="img"
              // Removed tabIndex={0} to avoid nested interactive elements within button
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Color: {project.color}</p>
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
        Created: {DateService.formatShortDate(project.createdAt)}
      </div>
    </div>
  );
};
