import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../../pages/Landing.page';
import projectService from '../../services/project.service';
import healthService from '../../services/health.service';

jest.mock('../../components/PerfChart', () => () => (
  <div data-testid="mock-chart" />
));

jest.mock(
  '../../components/PreferencesModal',
  () => (props) => (props.show ? <div data-testid="preferences-modal" /> : null)
);

jest.mock('../../services/project.service');
jest.mock('../../services/health.service');

describe('LandingPage', () => {
  const setup = async () => {
    healthService.waitForBackendHealth.mockResolvedValue(true);
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(
        screen.queryByText(/Connecting to backend/)
      ).not.toBeInTheDocument();
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders hero section and input field', async () => {
    await setup();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter project code…')
    ).toBeInTheDocument();
    expect(screen.getByTestId('join-button')).toBeInTheDocument();
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
  });

  test('allows typing into project code input', async () => {
    await setup();
    const input = screen.getByPlaceholderText('Enter project code…');
    fireEvent.change(input, { target: { value: 'ABC123' } });
    expect(input).toHaveValue('ABC123');
  });

  test('clicking "Create Your Project" navigates (noop in mock)', async () => {
    await setup();
    const button = screen.getByTestId('create-button');
    fireEvent.click(button);
  });

  test('clicking join with empty input does nothing', async () => {
    await setup();
    const button = screen.getByTestId('join-button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(projectService.searchProject).not.toHaveBeenCalled();
    });
  });

  test('clicking join with valid code opens modal on valid response', async () => {
    const mockProject = {
      response: {
        participants: [{ name: 'Alice', _id: '1' }],
        maxPreferences: 3,
      },
    };

    projectService.searchProject.mockResolvedValueOnce({
      status: 200,
      json: async () => mockProject,
    });

    await setup();
    const input = screen.getByPlaceholderText('Enter project code…');
    fireEvent.change(input, { target: { value: 'ABC123' } });

    const button = screen.getByTestId('join-button');
    fireEvent.click(button);

    expect(projectService.searchProject).toHaveBeenCalledWith('ABC123');

    const modal = await screen.findByTestId('preferences-modal');
    expect(modal).toBeInTheDocument();
  });

  test('renders performance charts for both algorithms', async () => {
    await setup();
    expect(await screen.findAllByTestId('mock-chart')).toHaveLength(8);
  });
});
