import React from "react";
import { Project } from "../types";

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
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg">{project.name}</h3>
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: project.color }}
        />
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
