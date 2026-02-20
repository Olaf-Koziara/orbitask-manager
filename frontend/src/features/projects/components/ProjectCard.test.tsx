import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/features/projects/types';
import { vi, describe, it, expect } from 'vitest';
import { TooltipProvider } from '@/features/shared/components/ui/tooltip';

const mockProject = {
  _id: '1',
  name: 'Test Project',
  color: '#ff0000',
  description: 'Test Description',
  userId: 'user1',
  createdAt: new Date('2023-01-01').toISOString(),
  updatedAt: new Date('2023-01-01').toISOString(),
  createdBy: {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: null,
    role: 'member'
  }
} as unknown as Project;

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <TooltipProvider>
      {ui}
    </TooltipProvider>
  );
};

describe('ProjectCard', () => {
  it('renders project details correctly', () => {
    renderWithProviders(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-labelledby', `project-title-${mockProject._id}`);
  });

  it('is keyboard accessible', () => {
    const handleClick = vi.fn();
    renderWithProviders(<ProjectCard project={mockProject} onClick={handleClick} />);

    const card = screen.getByRole('button');

    expect(card).toHaveAttribute('tabIndex', '0');

    // Simulate keyboard events
    if (card) {
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalled();

      fireEvent.keyDown(card, { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(2);
    }
  });
});
