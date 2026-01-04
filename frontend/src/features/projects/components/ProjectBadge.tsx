import { Badge } from "@/features/shared/components/ui/badge";
import { Project } from "@/features/projects/types";

interface ProjectBadgeProps {
  project: Project;
  variant?: "default" | "outline";
  className?: string;
}

export const ProjectBadge = ({
  project,
  variant = "default",
  className,
}: ProjectBadgeProps) => {
  if (!project) return null;

  return (
    <Badge
      variant={variant}
      className={className}
      style={{
        backgroundColor: variant === "default" ? project.color : "transparent",
        borderColor: project.color,
        color: variant === "default" ? "white" : project.color,
      }}
    >
      {project.name}
    </Badge>
  );
};
