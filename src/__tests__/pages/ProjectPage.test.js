import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectPage from '../../pages/Project.page';
import projectService from '../../services/project.service';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../services/project.service');
jest.mock('../../components/LoadingSpinner', () => ({ text }) => (
  <div data-testid="spinner">{text}</div>
));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: actual.MemoryRouter,
  };
});

describe('ProjectPage', () => {
  const fakeProjects = [
    {
      _id: 'p1',
      name: 'Test Project 1',
      registrants: 3,
      participants: 5,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner initially', async () => {
    projectService.getAll.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: fakeProjects }),
    });

    render(
      <MemoryRouter>
        <ProjectPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('spinner')).toHaveTextContent(
      'Loading projects...'
    );

    await screen.findByDisplayValue('Test Project 1');
  });

  test('renders fetched projects', async () => {
    projectService.getAll.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: fakeProjects }),
    });

    render(
      <MemoryRouter>
        <ProjectPage />
      </MemoryRouter>
    );

    expect(
      await screen.findByDisplayValue('Test Project 1')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('3/5')).toBeInTheDocument();
  });

  test('clicking a project navigates to its management page', async () => {
    projectService.getAll.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: fakeProjects }),
    });

    render(
      <MemoryRouter>
        <ProjectPage />
      </MemoryRouter>
    );

    const card = await screen.findByText('Project Name');
    fireEvent.click(card.closest('.project-box'));

    expect(mockNavigate).toHaveBeenCalledWith('/project-management/p1');
  });

  test('adds a project when plus box is clicked', async () => {
    projectService.getAll.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: [] }),
    });

    projectService.create.mockResolvedValueOnce({ status: 200 });

    projectService.getAll.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: fakeProjects }),
    });

    render(
      <MemoryRouter>
        <ProjectPage />
      </MemoryRouter>
    );

    const addBox = await screen.findByText('+');
    fireEvent.click(addBox);

    await waitFor(() => {
      expect(projectService.create).toHaveBeenCalled();
      expect(screen.getByDisplayValue('Test Project 1')).toBeInTheDocument();
    });
  });
});
