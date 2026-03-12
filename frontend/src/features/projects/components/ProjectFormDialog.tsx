import { Button } from "@/features/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/features/shared/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { UserList } from "@/features/shared/components/UserList";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { projectFormSchema } from "@/features/projects/schemas/project.schema";
import { Project, ProjectFormValues } from "@/features/projects/types";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProjectFormValues) => void;
  onDelete?: (id: string) => void;
  project?: Project;
  isLoading?: boolean;
}

const colorOptions = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#EF4444", label: "Red" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Yellow" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#6B7280", label: "Gray" },
  { value: "#F97316", label: "Orange" },
];

export const ProjectFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  project,
  isLoading = false,
}: ProjectFormDialogProps) => {
  const isEditing = !!project && !!project._id;

  const initialFormValues = useMemo(
    () => ({
      name: project?.name ?? "",
      description: project?.description ?? "",
      color: project?.color ?? colorOptions[0].value,
      participants: project?.participants
        ? project.participants.map((p) => p._id)
        : [],
    }),
    [project]
  );

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialFormValues,
    values: open ? initialFormValues : undefined,
  });

  const handleSubmit = (data: ProjectFormValues) => {
    onSubmit(data);
    if (!isEditing) {
      form.reset();
      onOpenChange(false);
    }
  };
  const handleDelete = () => {
    if (project?._id && onDelete) {
      onDelete(project._id);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the project details below."
              : "Create a new project to organize your tasks."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className=" grid grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
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
                        <Textarea
                          placeholder="Enter project description (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 gap-2">
                          {colorOptions.map(({ value, label }) => (
                            <Tooltip key={value}>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                                    field.value === value
                                      ? "border-primary scale-110"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                  style={{ backgroundColor: value }}
                                  onClick={() => field.onChange(value)}
                                  aria-label={`Color: ${label}`}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{label}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <FormControl>
                      <UserList
                        selectedUsers={field.value || []}
                        onSelectionChange={field.onChange}
                        className="border rounded-lg p-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex md:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
