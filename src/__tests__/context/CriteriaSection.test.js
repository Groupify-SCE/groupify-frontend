import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CriteriaSection from '../../contexts/Criteria.section';
import projectService from '../../services/project.service';

jest.mock('../../services/project.service');
jest.mock('../../components/LoadingSpinner', () => ({ text }) => (
  <div data-testid="spinner">{text}</div>
));

const mockProjectId = 'abc123';

describe('CriteriaSection', () => {
  const fakeCriteria = [
    { _id: 'c1', name: 'Criterion 1', range: 10 },
    { _id: 'c2', name: 'Criterion 2', range: 50 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    projectService.getAllCriteria.mockResolvedValue({
      status: 200,
      json: async () => ({ response: fakeCriteria }),
    });
  });

  const setup = () => render(<CriteriaSection projectId={mockProjectId} />);

  test('shows loading spinner on initial mount', async () => {
    setup();
    const spinners = screen.getAllByTestId('spinner');
    expect(spinners.some((el) => el.textContent.includes('Loading'))).toBe(
      true
    );
    await screen.findByDisplayValue('Criterion 1');
  });

  test('renders fetched criteria', async () => {
    setup();
    expect(await screen.findByDisplayValue('Criterion 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Criterion 2')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox')).toHaveLength(2); // for range select
  });

  test('adds a new criterion when + is clicked', async () => {
    projectService.addCriterion.mockResolvedValue({ status: 200 });

    setup();
    const addBtn = await screen.findByText('+');
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(projectService.addCriterion).toHaveBeenCalledWith(
        mockProjectId,
        'Criterion 3'
      );
    });
  });

  test('deletes a criterion and updates the list', async () => {
    projectService.deleteCriterion.mockResolvedValue({ status: 200 });

    setup();

    const deleteButtons = await screen.findAllByRole('button');
    const deleteButton = deleteButtons.find((btn) =>
      btn.className.includes('delete-button')
    );

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(projectService.deleteCriterion).toHaveBeenCalledWith('c1');
    });
  });

  test('edits a criterion and enables save button', async () => {
    projectService.updateCriteria.mockResolvedValue({ status: 200 });

    setup();
    const input = await screen.findByDisplayValue('Criterion 1');

    fireEvent.change(input, { target: { value: 'Updated Criterion 1' } });

    const saveBtn = await screen.findByRole('button', {
      name: /save changes/i,
    });

    expect(saveBtn).toBeInTheDocument();
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(projectService.updateCriteria).toHaveBeenCalledWith(
        'c1',
        'Updated Criterion 1',
        10
      );
    });
  });

  test('shows "No criteria" message when list is empty', async () => {
    projectService.getAllCriteria.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: [] }),
    });

    setup();

    await screen.findByText(/no criteria defined yet/i);
  });
});
