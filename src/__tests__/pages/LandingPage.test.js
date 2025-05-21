import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../../pages/Landing.page';
import projectService from '../../services/project.service';

jest.mock('../../components/PerfChart', () => () => (
  <div data-testid="mock-chart" />
));
jest.mock(
  '../../components/PreferencesModal',
  () => (props) => (props.show ? <div data-testid="preferences-modal" /> : null)
);

jest.mock('../../services/project.service');

describe('LandingPage', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders hero section and input field', () => {
    setup();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter project code…')
    ).toBeInTheDocument();
    expect(screen.getByTestId('join-button')).toBeInTheDocument();
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
  });

  test('allows typing into project code input', () => {
    setup();
    const input = screen.getByPlaceholderText('Enter project code…');
    fireEvent.change(input, { target: { value: 'ABC123' } });
    expect(input).toHaveValue('ABC123');
  });

  test('clicking "Create Your Project" navigates (noop in mock)', () => {
    setup();
    const button = screen.getByTestId('create-button');
    fireEvent.click(button);
  });

  test('clicking join with empty input does nothing', async () => {
    setup();
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

    setup();
    const input = screen.getByPlaceholderText('Enter project code…');
    fireEvent.change(input, { target: { value: 'ABC123' } });

    const button = screen.getByTestId('join-button');
    fireEvent.click(button);

    expect(projectService.searchProject).toHaveBeenCalledWith('ABC123');

    const modal = await screen.findByTestId('preferences-modal');
    expect(modal).toBeInTheDocument();
  });

  test('renders performance charts for both algorithms', async () => {
    setup();
    expect(await screen.findAllByTestId('mock-chart')).toHaveLength(8);
  });
});
