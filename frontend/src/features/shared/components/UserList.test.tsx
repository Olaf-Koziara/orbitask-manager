import { render, screen } from '@testing-library/react';
import { UserList } from './UserList';
import { vi, describe, it, expect } from 'vitest';

// Mock trpc
vi.mock('@/api/trpc', () => ({
  trpc: {
    auth: {
      list: {
        useQuery: vi.fn(() => ({
          data: [
            { _id: '1', name: 'User One', email: 'user1@example.com', role: 'user' },
            { _id: '2', name: 'User Two', email: 'user2@example.com', role: 'admin' },
          ],
          isLoading: false,
          error: null,
        })),
      },
    },
  },
}));

// Mock auth store
vi.mock('@/features/auth/stores/auth.store', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: '99', name: 'Current User', email: 'current@example.com', role: 'admin' },
  })),
}));

describe('UserList', () => {
  it('renders users with associated labels for checkboxes', () => {
    render(<UserList selectedUsers={[]} onSelectionChange={() => {}} />);

    // Check if checkbox is accessible by name (proving label association)
    // Note: Radix Checkbox might render a hidden input or button.
    // Testing library should find it if labelled correctly.
    // However, Radix UI Checkbox puts the ID on the button.

    // Let's verify presence of label and connection explicitly first
    const label = screen.getByText('User One').closest('label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'user-1');

    // Also verify the checkbox has the matching id
    // We can try to get by role. If not working due to Radix internals in JSDOM, we can look by ID.
    // Ideally getByLabelText should work.

    const checkbox = screen.getByLabelText(/User One/i);
    expect(checkbox).toBeInTheDocument();
  });
});
