import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddParticipantForm from '../../components/AddParticipantForm';
import projectService from '../../services/project.service';
import { StatusCodes } from 'http-status-codes';
import { ToastContainer } from 'react-toastify';

jest.mock('../../services/project.service');

describe('AddParticipantForm', () => {
  const mockProjectId = 'proj123';
  const mockOnAdded = jest.fn();

  const setup = () =>
    render(
      <>
        <AddParticipantForm
          projectId={mockProjectId}
          onParticipantAdded={mockOnAdded}
        />
        <ToastContainer />
      </>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form inputs and button', () => {
    setup();

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ID')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add participant/i })
    ).toBeInTheDocument();
  });

  test('shows error when submitting empty form', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /add participant/i }));

    await waitFor(() => {
      expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
    });
  });

  test('calls addParticipant and onParticipantAdded on success', async () => {
    projectService.addParticipant.mockResolvedValueOnce({
      status: StatusCodes.OK,
      json: async () => ({ response: 'Participant added' }),
    });

    setup();

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'Alice' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Smith' },
    });
    fireEvent.change(screen.getByPlaceholderText('ID'), {
      target: { value: '123456789' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add participant/i }));

    await waitFor(() => {
      expect(projectService.addParticipant).toHaveBeenCalledWith(
        mockProjectId,
        'Alice',
        'Smith',
        '123456789'
      );
      expect(mockOnAdded).toHaveBeenCalled();
    });
  });

  test('shows error when addParticipant fails', async () => {
    projectService.addParticipant.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ response: 'Duplicate ID' }),
    });

    setup();

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'Bob' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Brown' },
    });
    fireEvent.change(screen.getByPlaceholderText('ID'), {
      target: { value: '111111111' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add participant/i }));

    await waitFor(() => {
      expect(projectService.addParticipant).toHaveBeenCalled();
      expect(screen.getByText(/duplicate id/i)).toBeInTheDocument();
    });
  });

  test('handles unexpected errors gracefully', async () => {
    projectService.addParticipant.mockRejectedValueOnce(
      new Error('Server is down')
    );

    setup();

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'Eve' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('ID'), {
      target: { value: '999999999' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add participant/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
