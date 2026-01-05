import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { authRouter } from '../trpc/auth.router';

// Helper to create tRPC context
const createMockContext = (user?: any) => ({
  user,
});

describe('Auth Router', () => {
  const mockJwtSecret = 'test-secret';
  const originalJwtSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = mockJwtSecret;
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalJwtSecret;
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const input = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const caller = authRouter.createCaller(createMockContext());
      const result = await caller.register(input);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(input.email);
      expect(result.user.name).toBe(input.name);
      expect(result.user).toHaveProperty('id');
      expect(result.user.role).toBe('member');

      // Verify token is valid
      const decoded = jwt.verify(result.token, mockJwtSecret) as any;
      expect(decoded.id.toString()).toBe(result.user.id.toString());
      expect(decoded.role).toBe('member');
    });

    it('should throw conflict error when user already exists', async () => {
      const input = {
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await User.create(input);

      const caller = authRouter.createCaller(createMockContext());
      
      await expect(caller.register(input)).rejects.toThrow(TRPCError);
      await expect(caller.register(input)).rejects.toMatchObject({
        code: 'CONFLICT',
        message: 'User already exists',
      });
    });

    it('should validate email format', async () => {
      const input = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      const caller = authRouter.createCaller(createMockContext());
      
      await expect(caller.register(input)).rejects.toThrow();
    });

    it('should validate password minimum length', async () => {
      const input = {
        email: 'test@example.com',
        password: '12345', // Less than 6 characters
        name: 'Test User',
      };

      const caller = authRouter.createCaller(createMockContext());
      
      await expect(caller.register(input)).rejects.toThrow();
    });

    it('should hash the password before saving', async () => {
      const input = {
        email: 'hash-test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const caller = authRouter.createCaller(createMockContext());
      await caller.register(input);

      const user = await User.findOne({ email: input.email });
      expect(user?.password).not.toBe(input.password);
      expect(user?.password).toMatch(/^\$2[aby]\$/); // bcrypt hash format
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const userData = {
        email: 'login@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await User.create(userData);

      const caller = authRouter.createCaller(createMockContext());
      const result = await caller.login({
        email: userData.email,
        password: userData.password,
      });

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
    });

    it('should throw error for non-existent user', async () => {
      const caller = authRouter.createCaller(createMockContext());
      
      await expect(
        caller.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    });

    it('should throw error for invalid password', async () => {
      const userData = {
        email: 'password-test@example.com',
        password: 'correctpassword',
        name: 'Test User',
      };

      await User.create(userData);

      const caller = authRouter.createCaller(createMockContext());
      
      await expect(
        caller.login({
          email: userData.email,
          password: 'wrongpassword',
        })
      ).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Invalid password',
      });
    });
  });

  describe('me', () => {
    it('should return current user data', async () => {
      const user = await User.create({
        email: 'me@example.com',
        password: 'password123',
        name: 'Current User',
      });

      const caller = authRouter.createCaller(
        createMockContext({ id: user._id.toString(), role: user.role })
      );
      
      const result = await caller.me();

      expect(result.email).toBe(user.email);
      expect(result.name).toBe(user.name);
      expect(result._id.toString()).toBe(user._id.toString());
      // @ts-ignore - checking that password field doesn't exist
      expect(result.password).toBeUndefined();
    });

    it('should throw error when user not found', async () => {
      const fakeUserId = '507f1f77bcf86cd799439011';
      
      const caller = authRouter.createCaller(
        createMockContext({ id: fakeUserId, role: 'member' })
      );
      
      await expect(caller.me()).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const user = await User.create({
        email: 'update@example.com',
        password: 'password123',
        name: 'Original Name',
      });

      const caller = authRouter.createCaller(
        createMockContext({ id: user._id.toString(), role: user.role })
      );

      const result = await caller.updateProfile({
        name: 'Updated Name',
        email: 'updated@example.com',
      });

      expect(result.user.name).toBe('Updated Name');
      expect(result.user.email).toBe('updated@example.com');
    });

    it('should not allow duplicate email', async () => {
      const user1 = await User.create({
        email: 'user1@example.com',
        password: 'password123',
        name: 'User 1',
      });

      const user2 = await User.create({
        email: 'user2@example.com',
        password: 'password123',
        name: 'User 2',
      });

      const caller = authRouter.createCaller(
        createMockContext({ id: user2._id.toString(), role: user2.role })
      );

      await expect(
        caller.updateProfile({
          name: 'User 2',
          email: 'user1@example.com', // Try to use user1's email
        })
      ).rejects.toMatchObject({
        code: 'CONFLICT',
        message: 'Email is already taken',
      });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const user = await User.create({
        email: 'change-pwd@example.com',
        password: 'oldpassword',
        name: 'Test User',
      });

      const caller = authRouter.createCaller(
        createMockContext({ id: user._id.toString(), role: user.role })
      );

      const result = await caller.changePassword({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      });

      expect(result.success).toBe(true);

      // Verify new password works
      const updatedUser = await User.findById(user._id);
      const isValid = await updatedUser?.comparePassword('newpassword123');
      expect(isValid).toBe(true);
    });

    it('should reject incorrect current password', async () => {
      const user = await User.create({
        email: 'wrong-pwd@example.com',
        password: 'correctpassword',
        name: 'Test User',
      });

      const caller = authRouter.createCaller(
        createMockContext({ id: user._id.toString(), role: user.role })
      );

      await expect(
        caller.changePassword({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123',
        })
      ).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Current password is incorrect',
      });
    });
  });

  describe('deleteAccount', () => {
    it('should delete account with valid password', async () => {
      const user = await User.create({
        email: 'delete@example.com',
        password: 'password123',
        name: 'Test User',
      });

      const caller = authRouter.createCaller(
        createMockContext({ id: user._id.toString(), role: user.role })
      );

      const result = await caller.deleteAccount({
        password: 'password123',
      });

      expect(result.success).toBe(true);

      // Verify user is deleted
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });

    it('should reject deletion with incorrect password', async () => {
      const user = await User.create({
        email: 'delete-fail@example.com',
        password: 'password123',
        name: 'Test User',
      });

      const caller = authRouter.createCaller(
        createMockContext({ id: user._id.toString(), role: user.role })
      );

      await expect(
        caller.deleteAccount({
          password: 'wrongpassword',
        })
      ).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'Password is incorrect',
      });

      // Verify user still exists
      const stillExists = await User.findById(user._id);
      expect(stillExists).not.toBeNull();
    });
  });

  describe('list', () => {
    it('should list all users (admin functionality)', async () => {
      await User.create([
        { email: 'user1@example.com', password: 'password123', name: 'User 1' },
        { email: 'user2@example.com', password: 'password123', name: 'User 2' },
        { email: 'user3@example.com', password: 'password123', name: 'User 3' },
      ]);

      const adminUser = await User.create({
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
      });

      const caller = authRouter.createCaller(
        createMockContext({ id: adminUser._id.toString(), role: 'admin' })
      );

      const result = await caller.list();

      expect(result.length).toBe(4);
      // @ts-ignore - checking that password field doesn't exist
      expect(result[0].password).toBeUndefined();
      
      // Verify users are sorted by name
      const names = result.map((u) => u.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });
  });
});

