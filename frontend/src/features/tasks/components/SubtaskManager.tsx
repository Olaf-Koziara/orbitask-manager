import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import React from "react";

interface SubtaskManagerProps {
  subtasks: string[];
  setSubtasks: (subs: string[]) => void;
  subtaskInput: string;
  setSubtaskInput: (val: string) => void;
  loadingSubtasks: boolean;
  subtaskError: string | null;
  onSplitTask: () => void;
  form: any;
}

export const SubtaskManager: React.FC<SubtaskManagerProps> = ({
  subtasks,
  setSubtasks,
  subtaskInput,
  setSubtaskInput,
  loadingSubtasks,
  subtaskError,
  onSplitTask,
  form,
}) => {
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={onSplitTask}
        disabled={loadingSubtasks}
      >
        {loadingSubtasks
          ? "Splitting into subtasks..."
          : "Suggest Subtasks with AI"}
      </Button>
      {subtaskError && (
        <div className="text-red-500 text-sm">{subtaskError}</div>
      )}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Add subtask manually"
          value={subtaskInput}
          onChange={(e) => setSubtaskInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && subtaskInput.trim()) {
              const newSub = subtaskInput.trim();
              setSubtasks([...subtasks, newSub]);
              form.setValue("subtasks", [...subtasks, newSub]);
              setSubtaskInput("");
              e.preventDefault();
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (subtaskInput.trim()) {
              const newSub = subtaskInput.trim();
              setSubtasks([...subtasks, newSub]);
              form.setValue("subtasks", [...subtasks, newSub]);
              setSubtaskInput("");
            }
          }}
        >
          Add
        </Button>
      </div>
      {subtasks.length > 0 && (
        <ul className="list-disc pl-6 space-y-1 bg-muted/50 rounded p-3">
          {subtasks.map((sub, i) => (
            <li key={i} className="flex items-center justify-between">
              <span>{sub}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  const updated = subtasks.filter((_, idx) => idx !== i);
                  setSubtasks(updated);
                  form.setValue("subtasks", updated);
                }}
                aria-label="Remove subtask"
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
