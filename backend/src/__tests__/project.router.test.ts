import { TRPCError } from '@trpc/server';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';
import { projectRouter } from '../trpc/project.router';

const createMockContext = (user?: any) => ({
  user,
});

describe('Project Router', () => {
  let testUser: any;
  let adminUser: any;
  let otherUser: any;

  beforeEach(async () => {
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'member',
    });

    adminUser = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      role: 'admin',
    });

    otherUser = await User.create({
      email: 'other@example.com',
      password: 'password123',
      name: 'Other User',
      role: 'member',
    });
  });

  describe('create', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
        color: '#FF5733',
        participants: [],
      };

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.create(projectData);

      expect(result).toHaveProperty('_id');
      expect(result.name).toBe(projectData.name);
      expect(result.description).toBe(projectData.description);
      expect(result.color).toBe(projectData.color);
      expect(result.createdBy._id.toString()).toBe(testUser._id.toString());
    });

    it('should create project with participants', async () => {
      const projectData = {
        name: 'Team Project',
        description: 'Collaborative project',
        color: '#3498db',
        participants: [otherUser._id.toString()],
      };

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.create(projectData);

      expect(result.participants).toHaveLength(1);
      expect(result.participants[0]._id.toString()).toBe(otherUser._id.toString());
    });

    it('should validate required fields', async () => {
      const invalidData = {
        description: 'Missing name and color',
        participants: [],
      } as any;

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(caller.create(invalidData)).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('should list projects created by user', async () => {
      await Project.create([
        {
          name: 'My Project 1',
          color: '#FF5733',
          createdBy: testUser._id,
          participants: [],
        },
        {
          name: 'My Project 2',
          color: '#3498db',
          createdBy: testUser._id,
          participants: [],
        },
      ]);

      // Create a project by another user
      await Project.create({
        name: 'Other Project',
        color: '#000000',
        createdBy: otherUser._id,
        participants: [],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({});

      expect(result).toHaveLength(2);
      expect(result.every((p) => p.createdBy._id.toString() === testUser._id.toString())).toBe(true);
    });

    it('should list projects where user is a participant', async () => {
      // Project created by other user but test user is participant
      await Project.create({
        name: 'Shared Project',
        color: '#FF5733',
        createdBy: otherUser._id,
        participants: [testUser._id],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({});

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Shared Project');
    });

    it('should filter projects by search term', async () => {
      await Project.create([
        {
          name: 'Frontend Development',
          description: 'React project',
          color: '#FF5733',
          createdBy: testUser._id,
          participants: [],
        },
        {
          name: 'Backend Development',
          description: 'Node.js project',
          color: '#3498db',
          createdBy: testUser._id,
          participants: [],
        },
      ]);

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ search: 'Frontend' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Frontend Development');
    });

    it('should filter projects by color', async () => {
      await Project.create([
        {
          name: 'Red Project',
          color: '#FF0000',
          createdBy: testUser._id,
          participants: [],
        },
        {
          name: 'Blue Project',
          color: '#0000FF',
          createdBy: testUser._id,
          participants: [],
        },
      ]);

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ color: '#FF0000' });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Red Project');
    });

    it('should sort projects by name ascending', async () => {
      await Project.create([
        { name: 'Zebra Project', color: '#000000', createdBy: testUser._id, participants: [] },
        { name: 'Alpha Project', color: '#000000', createdBy: testUser._id, participants: [] },
        { name: 'Beta Project', color: '#000000', createdBy: testUser._id, participants: [] },
      ]);

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.list({ sortBy: 'name', sortOrder: 'asc' });

      expect(result[0].name).toBe('Alpha Project');
      expect(result[1].name).toBe('Beta Project');
      expect(result[2].name).toBe('Zebra Project');
    });
  });

  describe('get', () => {
    it('should get project by id', async () => {
      const project = await Project.create({
        name: 'Get Test Project',
        color: '#FF5733',
        createdBy: testUser._id,
        participants: [],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.get(project._id.toString());

      expect(result._id.toString()).toBe(project._id.toString());
      expect(result.name).toBe('Get Test Project');
    });

    it('should throw error for non-existent project', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(caller.get(fakeId)).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Project not found',
      });
    });
  });

  describe('update', () => {
    it('should update project by owner', async () => {
      const project = await Project.create({
        name: 'Original Name',
        description: 'Original Description',
        color: '#FF5733',
        createdBy: testUser._id,
        participants: [],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.update({
        id: project._id.toString(),
        data: {
          name: 'Updated Name',
          description: 'Updated Description',
        },
      });

      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Updated Description');
    });

    it('should allow admin to update any project', async () => {
      const project = await Project.create({
        name: 'User Project',
        color: '#FF5733',
        createdBy: testUser._id,
        participants: [],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: adminUser._id.toString(), role: 'admin' })
      );

      const result = await caller.update({
        id: project._id.toString(),
        data: { name: 'Admin Updated' },
      });

      expect(result.name).toBe('Admin Updated');
    });

    it('should deny update by non-owner non-admin', async () => {
      const project = await Project.create({
        name: 'Test Project',
        color: '#FF5733',
        createdBy: testUser._id,
        participants: [],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: otherUser._id.toString(), role: 'member' })
      );

      await expect(
        caller.update({
          id: project._id.toString(),
          data: { name: 'Unauthorized Update' },
        })
      ).rejects.toMatchObject({
        code: 'FORBIDDEN',
        message: 'You do not have permission to update this project',
      });
    });

    it('should throw error for non-existent project', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(
        caller.update({
          id: fakeId,
          data: { name: 'Updated' },
        })
      ).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Project not found',
      });
    });
  });

  describe('delete', () => {
    it('should delete project by owner', async () => {
      const project = await Project.create({
        name: 'To Be Deleted',
        color: '#FF5733',
        createdBy: testUser._id,
        participants: [],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      const result = await caller.delete(project._id.toString());

      expect(result.success).toBe(true);

      // Verify project is deleted
      const deletedProject = await Project.findById(project._id);
      expect(deletedProject).toBeNull();
    });

    it('should allow admin to delete any project', async () => {
      const project = await Project.create({
        name: 'User Project',
        color: '#FF5733',
        createdBy: testUser._id,
        participants: [],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: adminUser._id.toString(), role: 'admin' })
      );

      const result = await caller.delete(project._id.toString());

      expect(result.success).toBe(true);
      const deletedProject = await Project.findById(project._id);
      expect(deletedProject).toBeNull();
    });

    it('should deny deletion by non-owner non-admin', async () => {
      const project = await Project.create({
        name: 'Test Project',
        color: '#FF5733',
        createdBy: testUser._id,
        participants: [],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: otherUser._id.toString(), role: 'member' })
      );

      await expect(caller.delete(project._id.toString())).rejects.toMatchObject({
        code: 'FORBIDDEN',
        message: 'You do not have permission to delete this project',
      });

      // Verify project still exists
      const stillExists = await Project.findById(project._id);
      expect(stillExists).not.toBeNull();
    });

    it('should throw error for non-existent project', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const caller = projectRouter.createCaller(
        createMockContext({ id: testUser._id.toString(), role: testUser.role })
      );

      await expect(caller.delete(fakeId)).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Project not found',
      });
    });
  });

  describe('access control', () => {
    it('should allow participant to view project', async () => {
      const project = await Project.create({
        name: 'Shared Project',
        color: '#FF5733',
        createdBy: testUser._id,
        participants: [otherUser._id],
      });

      const caller = projectRouter.createCaller(
        createMockContext({ id: otherUser._id.toString(), role: 'member' })
      );

      const result = await caller.get(project._id.toString());
      expect(result.name).toBe('Shared Project');
    });

    it('should not allow non-participant to update project even if they can view it', async () => {
      const project = await Project.create({
        name: 'Team Project',
        color: '#FF5733',
        createdBy: testUser._id,
        participants: [otherUser._id],
      });

      // Participant tries to update
      const caller = projectRouter.createCaller(
        createMockContext({ id: otherUser._id.toString(), role: 'member' })
      );

      await expect(
        caller.update({
          id: project._id.toString(),
          data: { name: 'Updated Name' },
        })
      ).rejects.toMatchObject({
        code: 'FORBIDDEN',
        message: 'You do not have permission to update this project',
      });
    });
  });
});

