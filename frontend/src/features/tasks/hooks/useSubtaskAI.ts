import { trpc } from "@/api/trpc";
import { useState } from "react";

export function useSubtaskAI(form: any) {
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);
  const [subtaskError, setSubtaskError] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const splitTask = async () => {
    setLoadingSubtasks(true);
    setSubtaskError(null);
    try {
      const title = form.getValues("title");
      const description = form.getValues("description");
      const subtasks = await utils.client.tasks.generateSubtasks.mutate({
        title,
        description,
      });
      setLoadingSubtasks(false);
      return subtasks;
    } catch (err) {
      setSubtaskError("Failed to generate subtasks. Please try again.");
      setLoadingSubtasks(false);
      return [];
    }
  };

  return { loadingSubtasks, subtaskError, splitTask };
}
