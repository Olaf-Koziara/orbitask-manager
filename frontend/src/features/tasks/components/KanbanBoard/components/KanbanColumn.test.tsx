import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import KanbanColumn from './KanbanColumn';
import { DndContext } from '@dnd-kit/core';
import { TooltipProvider } from '@/features/shared/components/ui/tooltip';

vi.mock('@/features/tasks/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  })
}));

test('renders empty state as button with dynamic aria-label', () => {
  render(
    <TooltipProvider>
      <DndContext>
        <KanbanColumn title="To Do" status="TODO" />
      </DndContext>
    </TooltipProvider>
  );

  // Actually verify both buttons with this label exist (the top one and the empty state one)
  const buttons = screen.getAllByRole('button', { name: 'Add task to To Do' });
  expect(buttons.length).toBe(2);

  // The empty state button has text 'Add task'
  expect(screen.getByText('Add task')).toBeInTheDocument();
});
