import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePoll from '../../pages/CreatePoll';
import { renderWithProviders } from '../utils/test-utils';

describe('CreatePoll Component', () => {
  it('renders create poll form', () => {
    renderWithProviders(<CreatePoll />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/add option/i)).toBeInTheDocument();
  });

  it('allows adding and removing options', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreatePoll />);

    // Add new option
    await user.click(screen.getByText(/add option/i));
    const options = screen.getAllByPlaceholderText(/option \d/i);
    expect(options).toHaveLength(3);

    // Remove option
    const removeButtons = screen.getAllByRole('button', { name: /remove option/i });
    await user.click(removeButtons[0]);
    expect(screen.getAllByPlaceholderText(/option \d/i)).toHaveLength(2);
  });

  it('validates form submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreatePoll />);

    await user.click(screen.getByRole('button', { name: /create poll/i }));
    expect(screen.getByText(/all options must be filled/i)).toBeInTheDocument();
  });
});