import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { useProject } from "../../projects/hooks/useProject";

interface AssigneeSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  projectId?: string;
  placeholder?: string;
  allowEmpty?: boolean;
  disabled?: boolean;
}

export const AssigneeSelect = ({
  value,
  onValueChange,
  projectId,
  placeholder = "Select assignee",
  allowEmpty = true,
  disabled,
}: AssigneeSelectProps) => {
  const { participants, isLoading } = useProject({ 
    projectId, 
    enabled: !!projectId 
  });

  // If no project is selected, disable the component
  const isDisabled = disabled || !projectId;

  if (isLoading && projectId) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading participants..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={value || undefined}
      onValueChange={onValueChange}
      disabled={isDisabled}
    >
      <SelectTrigger>
        <SelectValue 
          placeholder={
            isDisabled 
              ? "Select a project first" 
              : placeholder
          } 
        />
      </SelectTrigger>
      <SelectContent>
        {allowEmpty && (
          <SelectItem value="null">
            <span className="text-muted-foreground">No assignee</span>
          </SelectItem>
        )}
        {participants.map((participant) => (
          <SelectItem key={participant._id} value={participant._id}>
            <div className="flex items-center gap-2">
              {participant.avatarUrl && (
                <img
                  src={participant.avatarUrl}
                  alt={participant.name}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <span>{participant.name || participant.email}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};