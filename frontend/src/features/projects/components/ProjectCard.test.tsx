import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { TooltipProvider } from '@/features/shared/components/ui/tooltip';

// Mock the Project type
const mockProject: any = {
  _id: '1',
  name: 'Test Project',
  color: '#ff0000',
  description: 'Test Description',
  userId: 'user1',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  createdBy: {
    _id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    avatarUrl: null
  }
};

const renderWithProviders = (ui: React.ReactElement) => {
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
  });

  it('is keyboard accessible', () => {
    const handleClick = vi.fn();
    renderWithProviders(<ProjectCard project={mockProject} onClick={handleClick} />);

    // We expect the card to be accessible via role="button"
    // Initially this will fail because role="button" is missing
    const card = screen.getByText('Test Project').closest('div.border');

    // Check for accessibility attributes
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');

    // Test keyboard interaction
    if (card) {
        fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
        expect(handleClick).toHaveBeenCalled();

        fireEvent.keyDown(card, { key: ' ', code: 'Space' });
        expect(handleClick).toHaveBeenCalledTimes(2);
    }
  });
});
