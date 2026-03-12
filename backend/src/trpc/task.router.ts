import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { TaskModel } from "../models/task.model";
import {
  taskBaseSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "../schemas/task.schema";
import { TaskMongoResponse } from "../types/task";
import {
  createTaskProjectFilter,
  getAccessibleProjectIds,
  verifyProjectAccess,
} from "../utils/project.utils";
import { eventEmitter } from "./events";
import { protectedProcedure, router } from "./trpc";

const TASK_POPULATE = [
  { path: "assignee", select: "name email avatarUrl" },
  { path: "createdBy", select: "name email" },
  { path: "project", select: "name color description" },
];

export type TaskEvent = {
  type: "create" | "update" | "delete";
  projectId: string;
  taskId: string;
  data?: TaskMongoResponse;
};

export const taskRouter = router({
  create: protectedProcedure
    .input(taskBaseSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.projectId) {
        await verifyProjectAccess(
          input.projectId,
          ctx.user.id,
          ctx.user.role,
          "You do not have permission to create tasks in this project"
        );
      }

      const task = await TaskModel.create({
        ...input,
        createdBy: ctx.user.id,
      });

      const populatedTask = (await TaskModel.findById(task._id)
        .populate(TASK_POPULATE)
        .lean()) as unknown as TaskMongoResponse;

      eventEmitter.emit("taskUpdate", {
        type: "create",
        projectId: input.projectId,
        taskId: populatedTask._id.toString(),
        data: populatedTask,
      } as TaskEvent);

      return populatedTask;
    }),

  get: protectedProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const task = (await TaskModel.findById(input)
      .populate(TASK_POPULATE)
      .lean()) as TaskMongoResponse;

    if (!task) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Task not found",
      });
    }

    if (task.projectId) {
      await verifyProjectAccess(
        task.projectId.toString(),
        ctx.user.id,
        ctx.user.role,
        "You do not have permission to view this task"
      );
    }

    return task;
  }),
  list: protectedProcedure
    .input(taskQuerySchema)
    .query(async ({ input, ctx }) => {
      const baseQuery: any = await createTaskProjectFilter(ctx.user.id);

      if (input) {
        if (input.status) baseQuery.status = input.status;
        if (input.priority) baseQuery.priority = input.priority;
        if (input.assignee) baseQuery.assignee = input.assignee;
        if (input.tags?.length) baseQuery.tags = { $in: input.tags };

        if (input.projectId) {
          await verifyProjectAccess(
            input.projectId,
            ctx.user.id,
            ctx.user.role
          );
          baseQuery.projectId = input.projectId;
        } else if (input.projectIds?.length) {
          const accessibleProjectIds = await getAccessibleProjectIds(
            ctx.user.id
          );
          const filteredProjectIds = input.projectIds.filter((id) =>
            accessibleProjectIds.some(
              (accessibleId) => accessibleId.toString() === id
            )
          );
          if (filteredProjectIds.length > 0) {
            baseQuery.projectId = { $in: filteredProjectIds };
          } else {
            return [];
          }
        }

        if (input.search) {
          baseQuery.$or = [
            { title: { $regex: input.search, $options: "i" } },
            { description: { $regex: input.search, $options: "i" } },
          ];
        }
      }

      if (baseQuery.assignee === "me") {
        baseQuery.assignee = ctx.user.id;
      }

      const sortBy = input?.sortBy || "createdAt";
      const sortOrder = input?.sortOrder || "desc";
      let sort: Record<string, 1 | -1> = {};

      if (sortBy === "priority") {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const tasks = (await TaskModel.find(baseQuery)
          .populate(TASK_POPULATE)
          .lean()) as TaskMongoResponse[];

        return tasks.sort((a, b) => {
          const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return sortOrder === "asc" ? priorityA - priorityB : priorityB - priorityA;
        });
      } else {
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;
        const tasks = (await TaskModel.find(baseQuery)
          .populate(TASK_POPULATE)
          .sort(sort)
          .lean()) as TaskMongoResponse[];
        return tasks;
      }
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: updateTaskSchema }))
    .mutation(async ({ input, ctx }) => {
      const task = await TaskModel.findById(input.id);
      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      }

      if (task.projectId) {
        await verifyProjectAccess(
          task.projectId.toString(),
          ctx.user.id,
          ctx.user.role,
          "You do not have permission to update tasks in this project"
        );
      }

      if (input.data.projectId && task.projectId && input.data.projectId !== task.projectId.toString()) {
        await verifyProjectAccess(
          input.data.projectId,
          ctx.user.id,
          ctx.user.role,
          "You do not have permission to move task to the target project"
        );
      }

      const updatedTask = (await TaskModel.findByIdAndUpdate(
        input.id,
        { ...input.data, updatedAt: new Date() },
        { new: true }
      )
        .populate(TASK_POPULATE)
        .lean()) as unknown as TaskMongoResponse;

      eventEmitter.emit("taskUpdate", {
        type: "update",
        projectId: updatedTask.projectId.toString(),
        taskId: updatedTask._id.toString(),
        data: updatedTask,
      } as TaskEvent);

      return updatedTask;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const task = await TaskModel.findById(input);
      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      }

      if (task.projectId) {
        await verifyProjectAccess(
          task.projectId.toString(),
          ctx.user.id,
          ctx.user.role,
          "You do not have permission to delete tasks in this project"
        );
      }

      await TaskModel.findByIdAndDelete(input);

      eventEmitter.emit("taskUpdate", {
        type: "delete",
        projectId: task.projectId?.toString() ?? "",
        taskId: task._id.toString(),
      } as TaskEvent);

      return { success: true };
    }),

  onUpdate: protectedProcedure
    .input(z.object({ projectId: z.string().optional() }))
    .subscription(({ input, ctx }) => {
      return observable<TaskEvent>((emit) => {
        const onTaskUpdate = async (event: TaskEvent) => {
          if (input.projectId && event.projectId !== input.projectId) return;

          const accessibleProjectIds = await getAccessibleProjectIds(ctx.user.id);
          const isAccessible = accessibleProjectIds.some(
            (id) => id.toString() === event.projectId
          );

          if (isAccessible) {
            emit.next(event);
          }
        };

        eventEmitter.on("taskUpdate", onTaskUpdate);
        return () => {
          eventEmitter.off("taskUpdate", onTaskUpdate);
        };
      });
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const baseQuery = await createTaskProjectFilter(ctx.user.id);
    const [total, completed, inProgress, overdue] = await Promise.all([
      TaskModel.countDocuments(baseQuery),
      TaskModel.countDocuments({ ...baseQuery, status: "done" }),
      TaskModel.countDocuments({ ...baseQuery, status: "in-progress" }),
      TaskModel.countDocuments({
        ...baseQuery,
        status: { $ne: "done" },
        dueDate: { $lt: new Date() },
      }),
    ]);

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }),

  getByStatus: protectedProcedure
    .input(z.enum(["todo", "in-progress", "review", "done"]))
    .query(async ({ input, ctx }) => {
      const baseQuery = await createTaskProjectFilter(ctx.user.id);
      const tasks = (await TaskModel.find({ ...baseQuery, status: input })
        .populate(TASK_POPULATE)
        .sort({ dueDate: 1, createdAt: -1 })
        .lean()) as TaskMongoResponse[];

      return tasks;
    }),
});
