import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { useProjects } from "@/features/projects/hooks/useProjects";

interface ProjectSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  allowEmpty?: boolean;
}

export const ProjectSelect = ({
  value,
  onValueChange,
  placeholder = "Select a project",
  allowEmpty = true,
}: ProjectSelectProps) => {
  const { projects, isLoading } = useProjects();

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading projects..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={value || null}
      defaultValue={null}
      onValueChange={onValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {projects.length > 0 && allowEmpty && (
          <SelectItem value="null">
            <span className="text-muted-foreground">No project</span>
          </SelectItem>
        )}
        {projects.map((project: any) => (
          <SelectItem key={project._id} value={project._id}>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
