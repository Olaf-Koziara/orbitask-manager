import { TRPCError } from '@trpc/server';
import { User } from '../models/user.model';
import { Project } from '../models/project.model';
import {
  getAccessibleProjectIds,
  hasProjectAccess,
  verifyProjectAccess,
  createTaskProjectFilter,
} from '../utils/project.utils';

describe('Project Utils', () => {
  let testUser: any;
  let adminUser: any;
  let otherUser: any;
  let ownedProject: any;
  let participantProject: any;
  let privateProject: any;

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

    // Project owned by test user
    ownedProject = await Project.create({
      name: 'Owned Project',
      color: '#FF5733',
      createdBy: testUser._id,
      participants: [],
    });

    // Project where test user is a participant
    participantProject = await Project.create({
      name: 'Participant Project',
      color: '#3498db',
      createdBy: otherUser._id,
      participants: [testUser._id],
    });

    // Project not accessible to test user
    privateProject = await Project.create({
      name: 'Private Project',
      color: '#000000',
      createdBy: otherUser._id,
      participants: [],
    });
  });

  describe('getAccessibleProjectIds', () => {
    it('should return projects owned by user', async () => {
      const projectIds = await getAccessibleProjectIds(testUser._id.toString());

      const projectIdStrings = projectIds.map((id) => id.toString());
      expect(projectIdStrings).toContain(ownedProject._id.toString());
    });

    it('should return projects where user is participant', async () => {
      const projectIds = await getAccessibleProjectIds(testUser._id.toString());

      const projectIdStrings = projectIds.map((id) => id.toString());
      expect(projectIdStrings).toContain(participantProject._id.toString());
    });

    it('should not return inaccessible projects', async () => {
      const projectIds = await getAccessibleProjectIds(testUser._id.toString());

      const projectIdStrings = projectIds.map((id) => id.toString());
      expect(projectIdStrings).not.toContain(privateProject._id.toString());
    });

    it('should return correct count of accessible projects', async () => {
      const projectIds = await getAccessibleProjectIds(testUser._id.toString());

      // Test user has access to ownedProject and participantProject
      expect(projectIds.length).toBe(2);
    });

    it('should return empty array for user with no projects', async () => {
      const newUser = await User.create({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role: 'member',
      });

      const projectIds = await getAccessibleProjectIds(newUser._id.toString());

      expect(projectIds).toEqual([]);
    });
  });

  describe('hasProjectAccess', () => {
    it('should return true for project owner', async () => {
      const hasAccess = await hasProjectAccess(
        ownedProject._id.toString(),
        testUser._id.toString(),
        testUser.role
      );

      expect(hasAccess).toBe(true);
    });

    it('should return true for project participant', async () => {
      const hasAccess = await hasProjectAccess(
        participantProject._id.toString(),
        testUser._id.toString(),
        testUser.role
      );

      expect(hasAccess).toBe(true);
    });

    it('should return false for non-accessible project', async () => {
      const hasAccess = await hasProjectAccess(
        privateProject._id.toString(),
        testUser._id.toString(),
        testUser.role
      );

      expect(hasAccess).toBe(false);
    });

    it('should return true for admin regardless of project', async () => {
      const hasAccess = await hasProjectAccess(
        privateProject._id.toString(),
        adminUser._id.toString(),
        'admin'
      );

      expect(hasAccess).toBe(true);
    });

    it('should return false for non-existent project', async () => {
      const fakeProjectId = '507f1f77bcf86cd799439011';

      const hasAccess = await hasProjectAccess(
        fakeProjectId,
        testUser._id.toString(),
        testUser.role
      );

      expect(hasAccess).toBe(false);
    });
  });

  describe('verifyProjectAccess', () => {
    it('should not throw for accessible project', async () => {
      await expect(
        verifyProjectAccess(
          ownedProject._id.toString(),
          testUser._id.toString(),
          testUser.role
        )
      ).resolves.not.toThrow();
    });

    it('should throw NOT_FOUND for non-existent project', async () => {
      const fakeProjectId = '507f1f77bcf86cd799439011';

      await expect(
        verifyProjectAccess(
          fakeProjectId,
          testUser._id.toString(),
          testUser.role
        )
      ).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Project not found',
      });
    });

    it('should throw FORBIDDEN for inaccessible project', async () => {
      await expect(
        verifyProjectAccess(
          privateProject._id.toString(),
          testUser._id.toString(),
          testUser.role
        )
      ).rejects.toMatchObject({
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this project',
      });
    });

    it('should use custom error message when provided', async () => {
      const customMessage = 'Custom access denied message';

      await expect(
        verifyProjectAccess(
          privateProject._id.toString(),
          testUser._id.toString(),
          testUser.role,
          customMessage
        )
      ).rejects.toMatchObject({
        code: 'FORBIDDEN',
        message: customMessage,
      });
    });

    it('should allow admin access to any project', async () => {
      await expect(
        verifyProjectAccess(
          privateProject._id.toString(),
          adminUser._id.toString(),
          'admin'
        )
      ).resolves.not.toThrow();
    });

    it('should allow participant access', async () => {
      await expect(
        verifyProjectAccess(
          participantProject._id.toString(),
          testUser._id.toString(),
          testUser.role
        )
      ).resolves.not.toThrow();
    });
  });

  describe('createTaskProjectFilter', () => {
    it('should create filter with accessible project IDs', async () => {
      const filter = await createTaskProjectFilter(testUser._id.toString());

      expect(filter).toHaveProperty('projectId');
      expect(filter.projectId).toHaveProperty('$in');
      
      const projectIdStrings = filter.projectId.$in.map((id: any) => id.toString());
      expect(projectIdStrings).toContain(ownedProject._id.toString());
      expect(projectIdStrings).toContain(participantProject._id.toString());
      expect(projectIdStrings).not.toContain(privateProject._id.toString());
    });

    it('should return filter with only owned projects', async () => {
      const filter = await createTaskProjectFilter(otherUser._id.toString());

      const projectIdStrings = filter.projectId.$in.map((id: any) => id.toString());
      expect(projectIdStrings).toContain(participantProject._id.toString());
      expect(projectIdStrings).toContain(privateProject._id.toString());
      expect(projectIdStrings).not.toContain(ownedProject._id.toString());
    });

    it('should return empty filter for user with no projects', async () => {
      const newUser = await User.create({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        role: 'member',
      });

      const filter = await createTaskProjectFilter(newUser._id.toString());

      expect(filter.projectId.$in).toEqual([]);
    });

    it('should include projects from both owned and participant lists', async () => {
      // Create additional projects
      await Project.create([
        {
          name: 'Another Owned',
          color: '#FF0000',
          createdBy: testUser._id,
          participants: [],
        },
        {
          name: 'Another Participant',
          color: '#00FF00',
          createdBy: otherUser._id,
          participants: [testUser._id],
        },
      ]);

      const filter = await createTaskProjectFilter(testUser._id.toString());

      expect(filter.projectId.$in.length).toBe(4);
    });
  });

  describe('Integration tests', () => {
    it('should correctly handle complex access scenarios', async () => {
      // Create a user who is both owner and participant of different projects
      const complexUser = await User.create({
        email: 'complex@example.com',
        password: 'password123',
        name: 'Complex User',
        role: 'member',
      });

      const project1 = await Project.create({
        name: 'Project 1',
        color: '#111111',
        createdBy: complexUser._id,
        participants: [testUser._id],
      });

      const project2 = await Project.create({
        name: 'Project 2',
        color: '#222222',
        createdBy: testUser._id,
        participants: [complexUser._id],
      });

      // Complex user should have access to both projects
      const hasAccess1 = await hasProjectAccess(
        project1._id.toString(),
        complexUser._id.toString(),
        complexUser.role
      );

      const hasAccess2 = await hasProjectAccess(
        project2._id.toString(),
        complexUser._id.toString(),
        complexUser.role
      );

      expect(hasAccess1).toBe(true);
      expect(hasAccess2).toBe(true);

      const projectIds = await getAccessibleProjectIds(complexUser._id.toString());
      const projectIdStrings = projectIds.map((id) => id.toString());
      
      expect(projectIdStrings).toContain(project1._id.toString());
      expect(projectIdStrings).toContain(project2._id.toString());
    });

    it('should handle admin override correctly', async () => {
      // Admin should have access to all projects
      const allProjects = await Project.find({});

      for (const project of allProjects) {
        const hasAccess = await hasProjectAccess(
          project._id.toString(),
          adminUser._id.toString(),
          'admin'
        );

        expect(hasAccess).toBe(true);
      }
    });

    it('should properly isolate user access', async () => {
      const user1 = await User.create({
        email: 'user1@example.com',
        password: 'password123',
        name: 'User 1',
        role: 'member',
      });

      const user2 = await User.create({
        email: 'user2@example.com',
        password: 'password123',
        name: 'User 2',
        role: 'member',
      });

      const user1Project = await Project.create({
        name: 'User 1 Project',
        color: '#FF0000',
        createdBy: user1._id,
        participants: [],
      });

      const user2Project = await Project.create({
        name: 'User 2 Project',
        color: '#00FF00',
        createdBy: user2._id,
        participants: [],
      });

      // User 1 should not have access to User 2's project and vice versa
      const user1HasAccessToUser2 = await hasProjectAccess(
        user2Project._id.toString(),
        user1._id.toString(),
        user1.role
      );

      const user2HasAccessToUser1 = await hasProjectAccess(
        user1Project._id.toString(),
        user2._id.toString(),
        user2.role
      );

      expect(user1HasAccessToUser2).toBe(false);
      expect(user2HasAccessToUser1).toBe(false);
    });
  });
});

