import { Button } from "@/features/shared/components/ui/button";
import { Calendar } from "@/features/shared/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { cn } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { ProjectSelect } from "../../projects/components/ProjectSelect";
import { taskFormSchema } from "../schemas/task.schema";
import { useSelectedProjects } from "../stores/filters.store";
import {
  Priority,
  Task,
  TaskFormInputValues,
  TaskFormValues,
  TaskStatus,
} from "../types";

interface TaskFormProps {
  onSubmit: (data: TaskFormValues) => void;
  onUpdate?: (taskId: string, data: TaskFormValues) => void;
  task?: Task;
  initialData?: Partial<TaskFormInputValues>;
  submitLabel?: string;
}

/**
 * Render a task creation/edit form bound to the taskFormSchema and submit/update callbacks.
 *
 * The form initializes values from `task`, `initialData`, or the first selected project; validates
 * and transforms input via `taskFormSchema`; calls `onUpdate(task._id, data)` when editing and a
 * `task` is present, otherwise calls `onSubmit(data)` for creation. After successful creation the
 * form is reset.
 *
 * @param onSubmit - Callback invoked with validated task data when creating a new task
 * @param onUpdate - Optional callback invoked with a task id and validated data when editing
 * @param task - Optional existing task used to populate the form for editing
 * @param initialData - Optional partial initial values used when no `task` field is present
 * @param submitLabel - Optional label to show on the submit button; defaults to "Update Task" when editing or "Create Task" when creating
 * @returns A JSX element rendering the task form
 */
export function TaskForm({
  onSubmit,
  onUpdate,
  task,
  initialData,
  submitLabel,
}: TaskFormProps) {
  const isEditing = !!task;
  const selectedProjects = useSelectedProjects();
  const selectedProject =
    selectedProjects.length > 0 ? selectedProjects[0] : null;
  const initialFormValues = {
    title: task?.title ?? initialData?.title ?? "",
    description: task?.description ?? initialData?.description ?? "",
    status: task?.status ?? initialData?.status ?? TaskStatus.TODO,
    priority: task?.priority ?? initialData?.priority ?? Priority.MEDIUM,
    dueDate: task?.dueDate
      ? new Date(task.dueDate)
      : initialData?.dueDate
      ? new Date(initialData.dueDate)
      : undefined,
    projectId:
      task?.projectId ?? initialData?.projectId ?? selectedProject?._id,
    tags: Array.isArray(task?.tags) ? task.tags.join(", ") : initialData?.tags,
  };

  const form = useForm<TaskFormInputValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialFormValues,
  });

  const handleSubmit = (data: TaskFormInputValues) => {
    // Parse przez schemat żeby otrzymać transformowane dane
    const transformedData = taskFormSchema.parse(data);

    if (isEditing && onUpdate && task) {
      onUpdate(task._id, transformedData);
    } else {
      onSubmit(transformedData);
    }

    if (!isEditing) {
      form.reset();
    }
  };

  const defaultSubmitLabel = isEditing ? "Update Task" : "Create Task";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(TaskStatus).map((key) => (
                      <SelectItem key={key} value={TaskStatus[key]}>
                        {TaskStatus[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(Priority).map((key) => (
                      <SelectItem key={key} value={Priority[key]}>
                        {Priority[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Enter tags (comma-separated)" {...field} />
              </FormControl>
              <FormDescription>
                Separate tags with commas (e.g., "feature, bug, urgent")
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <FormControl>
                <ProjectSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a project"
                  allowEmpty
                />
              </FormControl>
              <FormDescription>
                Assign this task to a project (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {submitLabel || defaultSubmitLabel}
        </Button>
      </form>
    </Form>
  );
}
