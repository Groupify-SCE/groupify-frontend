import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProjectManagementPage from '../../pages/ProjectManagement.page';
import projectService from '../../services/project.service';
import algoService from '../../services/algo.service';

jest.mock('../../services/project.service');
jest.mock('../../services/algo.service');

jest.mock('../../contexts/Criteria.section', () => () => (
  <div>Criteria Tab</div>
));
jest.mock('../../contexts/Participants.section', () => () => (
  <div>Edit Participants Tab</div>
));
jest.mock('../../contexts/ParticipantsView.Section', () => () => (
  <div>View Participants Tab</div>
));

jest.mock('../../components/LoadingSpinner', () => ({ text }) => (
  <div data-testid="spinner">{text}</div>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe('ProjectManagementPage', () => {
  const mockProject = {
    _id: '123',
    user: 'u1',
    name: 'Test Project',
    participants: 10,
    registrants: 5,
    group_size: 2,
    preferences: 1,
    groups: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    projectService.get.mockResolvedValue({
      status: 200,
      json: async () => ({ response: mockProject }),
    });
  });

  const setup = () =>
    render(
      <MemoryRouter initialEntries={['/project-management/123']}>
        <Routes>
          <Route
            path="/project-management/:id"
            element={<ProjectManagementPage />}
          />
        </Routes>
      </MemoryRouter>
    );

  test('renders loading spinner initially', async () => {
    setup();
    const spinners = screen.getAllByTestId('spinner');
    expect(
      spinners.some((el) => el.textContent.includes('Loading project'))
    ).toBe(true);

    await screen.findByDisplayValue('Test Project');
  });

  test('loads project data into form', async () => {
    setup();
    expect(await screen.findByDisplayValue('Test Project')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  test('switches tabs correctly', async () => {
    setup();
    await screen.findByText('Criteria Tab');

    fireEvent.click(screen.getByRole('button', { name: 'Participants' }));
    expect(
      await screen.findByText('View Participants Tab')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Edit Participants' }));
    expect(
      await screen.findByText('Edit Participants Tab')
    ).toBeInTheDocument();
  });

  test('updates project on save click', async () => {
    projectService.update.mockResolvedValue({ status: 200 });

    setup();
    await screen.findByDisplayValue('Test Project');

    const nameInput = await screen.findByDisplayValue('Test Project');
    fireEvent.change(nameInput, { target: { value: 'Updated Project' } });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(projectService.update).toHaveBeenCalledWith(
        '123',
        'Updated Project',
        10,
        2
      );
    });
  });

  test('runs algorithm and navigates to /groups/:id on success', async () => {
    algoService.runAlgorithm.mockResolvedValue({ status: 200 });

    setup();
    await screen.findByDisplayValue('Test Project');

    fireEvent.click(screen.getByRole('button', { name: 'Create Groups' }));

    await waitFor(() => {
      expect(algoService.runAlgorithm).toHaveBeenCalledWith('123');
      expect(mockNavigate).toHaveBeenCalledWith('/groups/123');
    });
  });

  test('shows "See Groups" button if groups exist', async () => {
    projectService.get.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: { ...mockProject, groups: true } }),
    });

    setup();

    await screen.findByText('See Groups');

    fireEvent.click(screen.getByRole('button', { name: 'See Groups' }));
    expect(mockNavigate).toHaveBeenCalledWith('/groups/123');
  });
});
