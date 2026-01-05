import { TRPCError } from '@trpc/server';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';
import { TaskModel } from '../models/task.model';
import { taskRouter } from '../trpc/task.router';

const createMockContext = (user?: any) => ({
  user,
});

describe('Task Router', () => {
  let testUser: any;
  let otherUser: any;
  let testProject: any;
  let sharedProject: any;

  beforeEach(async () => {
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'member',
    });

    otherUser = await User.create({
      email: 'other@example.com',
      password: 'password123',
      name: 'Other User',
      role: 'member',
    });

    testProject = await Project.create({
      name: 'Test Project',
      color: '#FF5733',
      createdBy: testUser._id,
      participants: [],
    });

    sharedProject = await Project.create({
      name: 'Shared Project',
      color: '#3498db',
      createdBy: testUser._id,
      participants: [otherUser._id],
    });
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo' as const,
        priority: 'medium' as const,
        projectId: testProject._id.toString(),
        createdBy: testUser._id.toString(),
        createdAt: new Date(),
      };

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.create(taskData);

      expect(result.title).toBe(taskData.title);
      expect(result.description).toBe(taskData.description);
      expect(result.status).toBe(taskData.status);
      expect(result.priority).toBe(taskData.priority);
      expect(result.createdBy._id.toString()).toBe(testUser._id.toString());
    });

    it('should create task without project', async () => {
      const taskData = {
        title: 'Personal Task',
        description: 'No project',
        status: 'todo' as const,
        priority: 'low' as const,
        createdBy: testUser._id.toString(),
        createdAt: new Date(),
      };

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.create(taskData);

      expect(result.title).toBe(taskData.title);
      expect(result.projectId).toBeUndefined();
    });

    it('should deny task creation in inaccessible project', async () => {
      const privateProject = await Project.create({
        name: 'Private Project',
        color: '#000000',
        createdBy: otherUser._id,
        participants: [],
      });

      const taskData = {
        title: 'Unauthorized Task',
        description: 'Should fail',
        status: 'todo' as const,
        priority: 'medium' as const,
        projectId: privateProject._id.toString(),
        createdBy: testUser._id.toString(),
        createdAt: new Date(),
      };

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(caller.create(taskData)).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
    });

    it('should allow task creation in shared project', async () => {
      const taskData = {
        title: 'Shared Task',
        description: 'In shared project',
        status: 'todo' as const,
        priority: 'high' as const,
        projectId: sharedProject._id.toString(),
        createdBy: otherUser._id.toString(),
        createdAt: new Date(),
      };

      const caller = taskRouter.createCaller(
        createMockContext({ id: otherUser._id.toString(), role: otherUser.role })
      );

      const result = await caller.create(taskData);

      expect(result.title).toBe(taskData.title);
      expect(result.projectId.toString()).toBe(sharedProject._id.toString());
    });
  });

  describe('get', () => {
    it('should get task by id', async () => {
      const task = await TaskModel.create({
        title: 'Get Test Task',
        status: 'todo',
        priority: 'medium',
        projectId: testProject._id,
        createdBy: testUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.get(task._id.toString());

      expect(result.title).toBe('Get Test Task');
      expect(result._id.toString()).toBe(task._id.toString());
    });

    it('should throw error for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(caller.get(fakeId)).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Task not found',
      });
    });

    it('should deny access to task in inaccessible project', async () => {
      const privateProject = await Project.create({
        name: 'Private',
        color: '#000000',
        createdBy: otherUser._id,
        participants: [],
      });

      const task = await TaskModel.create({
        title: 'Private Task',
        status: 'todo',
        priority: 'medium',
        projectId: privateProject._id,
        createdBy: otherUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(caller.get(task._id.toString())).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
    });
  });

  describe('list', () => {
    beforeEach(async () => {
      // Create test tasks
      await TaskModel.create([
        {
          title: 'Task 1',
          status: 'todo',
          priority: 'high',
          projectId: testProject._id,
          createdBy: testUser._id,
          tags: ['urgent', 'frontend'],
        },
        {
          title: 'Task 2',
          status: 'in-progress',
          priority: 'medium',
          projectId: testProject._id,
          createdBy: testUser._id,
          tags: ['backend'],
        },
        {
          title: 'Task 3',
          status: 'done',
          priority: 'low',
          projectId: sharedProject._id,
          createdBy: testUser._id,
        },
      ]);
    });

    it('should list all accessible tasks', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({});

      expect(result.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter tasks by status', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ status: 'todo' });

      expect(result.every((task) => task.status === 'todo')).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter tasks by priority', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ priority: 'high' });

      expect(result.every((task) => task.priority === 'high')).toBe(true);
    });

    it('should filter tasks by tags', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ tags: ['frontend'] });

      expect(result.some((task) => task.tags?.includes('frontend'))).toBe(true);
    });

    it('should filter tasks by project', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ projectId: testProject._id.toString() });

      expect(result.every((task) => task.projectId.toString() === testProject._id.toString())).toBe(true);
    });

    it('should search tasks by title', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ search: 'Task 1' });

      expect(result.some((task) => task.title.includes('Task 1'))).toBe(true);
    });

    it('should sort tasks by priority', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ sortBy: 'priority', sortOrder: 'desc' });

      expect(result.length).toBeGreaterThan(0);
      // First task should have higher or equal priority than the last
      const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
      const firstPriority = priorities[result[0].priority as keyof typeof priorities];
      const lastPriority = priorities[result[result.length - 1].priority as keyof typeof priorities];
      expect(firstPriority).toBeGreaterThanOrEqual(lastPriority);
    });

    it('should sort tasks by createdAt date', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ sortBy: 'createdAt', sortOrder: 'asc' });

      expect(result.length).toBeGreaterThan(0);
      // Tasks should be in ascending order by creation date
      for (let i = 1; i < result.length; i++) {
        expect(new Date(result[i].createdAt).getTime()).toBeGreaterThanOrEqual(
          new Date(result[i - 1].createdAt).getTime()
        );
      }
    });

    it('should filter by assignee "me"', async () => {
      await TaskModel.create({
        title: 'Assigned to me',
        status: 'todo',
        priority: 'medium',
        projectId: testProject._id,
        createdBy: testUser._id,
        assignee: testUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ assignee: 'me' });

      expect(result.every((task) => task.assignee?._id.toString() === testUser._id.toString())).toBe(true);
    });

    it('should only return tasks from accessible projects', async () => {
      const privateProject = await Project.create({
        name: 'Private',
        color: '#000000',
        createdBy: otherUser._id,
        participants: [],
      });

      await TaskModel.create({
        title: 'Private Task',
        status: 'todo',
        priority: 'medium',
        projectId: privateProject._id,
        createdBy: otherUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({});

      // Should not include the private task
      expect(result.every((task) => task.title !== 'Private Task')).toBe(true);
    });
  });

  describe('update', () => {
    it('should update task successfully', async () => {
      const task = await TaskModel.create({
        title: 'Original Title',
        description: 'Original Description',
        status: 'todo',
        priority: 'medium',
        projectId: testProject._id,
        createdBy: testUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.update({
        id: task._id.toString(),
        data: {
          title: 'Updated Title',
          status: 'in-progress',
          priority: 'high',
        },
      });

      expect(result.title).toBe('Updated Title');
      expect(result.status).toBe('in-progress');
      expect(result.priority).toBe('high');
    });

    it('should deny update for task in inaccessible project', async () => {
      const privateProject = await Project.create({
        name: 'Private',
        color: '#000000',
        createdBy: otherUser._id,
        participants: [],
      });

      const task = await TaskModel.create({
        title: 'Private Task',
        status: 'todo',
        priority: 'medium',
        projectId: privateProject._id,
        createdBy: otherUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(
        caller.update({
          id: task._id.toString(),
          data: { title: 'Unauthorized Update' },
        })
      ).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
    });

    it('should verify access when moving task to different project', async () => {
      const privateProject = await Project.create({
        name: 'Private',
        color: '#000000',
        createdBy: otherUser._id,
        participants: [],
      });

      const task = await TaskModel.create({
        title: 'My Task',
        status: 'todo',
        priority: 'medium',
        projectId: testProject._id,
        createdBy: testUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(
        caller.update({
          id: task._id.toString(),
          data: { projectId: privateProject._id.toString() },
        })
      ).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
    });
  });

  describe('delete', () => {
    it('should delete task successfully', async () => {
      const task = await TaskModel.create({
        title: 'To Delete',
        status: 'todo',
        priority: 'medium',
        projectId: testProject._id,
        createdBy: testUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.delete(task._id.toString());

      expect(result.success).toBe(true);

      const deletedTask = await TaskModel.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should deny deletion of task in inaccessible project', async () => {
      const privateProject = await Project.create({
        name: 'Private',
        color: '#000000',
        createdBy: otherUser._id,
        participants: [],
      });

      const task = await TaskModel.create({
        title: 'Private Task',
        status: 'todo',
        priority: 'medium',
        projectId: privateProject._id,
        createdBy: otherUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(caller.delete(task._id.toString())).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
    });
  });

  describe('getStats', () => {
    beforeEach(async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await TaskModel.create([
        {
          title: 'Completed Task',
          status: 'done',
          priority: 'medium',
          projectId: testProject._id,
          createdBy: testUser._id,
        },
        {
          title: 'In Progress Task',
          status: 'in-progress',
          priority: 'medium',
          projectId: testProject._id,
          createdBy: testUser._id,
        },
        {
          title: 'Overdue Task',
          status: 'todo',
          priority: 'high',
          projectId: testProject._id,
          createdBy: testUser._id,
          dueDate: yesterday,
        },
        {
          title: 'Todo Task',
          status: 'todo',
          priority: 'low',
          projectId: testProject._id,
          createdBy: testUser._id,
        },
      ]);
    });

    it('should return correct task statistics', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.getStats();

      expect(result.total).toBeGreaterThanOrEqual(4);
      expect(result.completed).toBeGreaterThanOrEqual(1);
      expect(result.inProgress).toBeGreaterThanOrEqual(1);
      expect(result.overdue).toBeGreaterThanOrEqual(1);
      expect(result.completionRate).toBeGreaterThanOrEqual(0);
      expect(result.completionRate).toBeLessThanOrEqual(100);
    });

    it('should calculate completion rate correctly', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.getStats();

      const expectedRate = Math.round((result.completed / result.total) * 100);
      expect(result.completionRate).toBe(expectedRate);
    });
  });

  describe('getByStatus', () => {
    beforeEach(async () => {
      await TaskModel.create([
        {
          title: 'Todo Task 1',
          status: 'todo',
          priority: 'high',
          projectId: testProject._id,
          createdBy: testUser._id,
          dueDate: new Date('2026-01-10'),
        },
        {
          title: 'Todo Task 2',
          status: 'todo',
          priority: 'medium',
          projectId: testProject._id,
          createdBy: testUser._id,
          dueDate: new Date('2026-01-15'),
        },
        {
          title: 'Done Task',
          status: 'done',
          priority: 'low',
          projectId: testProject._id,
          createdBy: testUser._id,
        },
      ]);
    });

    it('should get tasks by status', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.getByStatus('todo');

      expect(result.every((task) => task.status === 'todo')).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    it('should sort by dueDate ascending, then createdAt descending', async () => {
      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.getByStatus('todo');

      expect(result.length).toBeGreaterThanOrEqual(2);
      // Tasks with due dates should come first, sorted by dueDate
      for (let i = 1; i < result.length; i++) {
        if (result[i - 1].dueDate && result[i].dueDate) {
          expect(new Date(result[i].dueDate).getTime()).toBeGreaterThanOrEqual(
            new Date(result[i - 1].dueDate).getTime()
          );
        }
      }
    });

    it('should only return tasks from accessible projects', async () => {
      const privateProject = await Project.create({
        name: 'Private',
        color: '#000000',
        createdBy: otherUser._id,
        participants: [],
      });

      await TaskModel.create({
        title: 'Private Todo Task',
        status: 'todo',
        priority: 'medium',
        projectId: privateProject._id,
        createdBy: otherUser._id,
      });

      const caller = taskRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.getByStatus('todo');

      expect(result.every((task) => task.title !== 'Private Todo Task')).toBe(true);
    });
  });
});

