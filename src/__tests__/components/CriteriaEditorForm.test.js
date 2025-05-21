import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CriteriaEditorForm from '../../components/CriteriaEditorForm';
import projectService from '../../services/project.service';

jest.mock('../../services/project.service', () => ({
  getAllCriteria: jest.fn(),
  getParticipantCriteria: jest.fn(),
  submitParticipantCriteria: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockParticipant = {
  _id: 'user1',
  projectId: 'project123',
};

const mockCriteriaDefs = [
  { _id: 'c1', name: 'Skill', range: 10 },
  { _id: 'c2', name: 'Experience', range: 5 },
];

const mockCriteriaValues = {
  response: [
    { criterion: 'c1', value: 7 },
    { criterion: 'c2', value: 3 },
  ],
};

describe('CriteriaEditorForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner initially', async () => {
    projectService.getAllCriteria.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: mockCriteriaDefs }),
    });

    projectService.getParticipantCriteria.mockResolvedValueOnce(
      mockCriteriaValues
    );

    render(<CriteriaEditorForm participant={mockParticipant} />);

    expect(screen.getByText(/loading criteria data/i)).toBeInTheDocument();

    await screen.findByDisplayValue('7');
  });

  test('renders criteria fields with preloaded values and submits', async () => {
    projectService.getParticipantCriteria.mockResolvedValueOnce(
      mockCriteriaValues
    );
    projectService.submitParticipantCriteria.mockResolvedValueOnce({});

    const mockOnSave = jest.fn();
    const mockOnClose = jest.fn();

    render(
      <CriteriaEditorForm
        participant={mockParticipant}
        preloadedCriteria={mockCriteriaDefs}
        onSave={mockOnSave}
        onClose={mockOnClose}
      />
    );

    await screen.findByDisplayValue('7');
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();

    fireEvent.change(screen.getByDisplayValue('7'), {
      target: { value: '8' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(projectService.submitParticipantCriteria).toHaveBeenCalledWith(
        'user1',
        { c1: '8', c2: 3 }
      );
    });

    expect(mockOnSave).toHaveBeenCalledWith({ c1: '8', c2: 3 });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('renders fallback message when no criteria are found', async () => {
    projectService.getAllCriteria.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: [] }),
    });

    projectService.getParticipantCriteria.mockResolvedValueOnce({
      response: [],
    });

    render(<CriteriaEditorForm participant={mockParticipant} />);

    await screen.findByText(/no criteria found/i);
  });

  test('handles missing participant gracefully', async () => {
    render(<CriteriaEditorForm participant={null} />);
    expect(await screen.findByText(/no criteria found/i)).toBeInTheDocument();
  });

  test('shows toast on criteria save failure', async () => {
    projectService.getParticipantCriteria.mockResolvedValueOnce(
      mockCriteriaValues
    );
    projectService.submitParticipantCriteria.mockRejectedValueOnce(
      new Error('fail')
    );

    render(
      <CriteriaEditorForm
        participant={mockParticipant}
        preloadedCriteria={mockCriteriaDefs}
      />
    );

    await screen.findByDisplayValue('7');

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(projectService.submitParticipantCriteria).toHaveBeenCalled();
    });

    expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
      'Failed to save criteria'
    );
  });
});
