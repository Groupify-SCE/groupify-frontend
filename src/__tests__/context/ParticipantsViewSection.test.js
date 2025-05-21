import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from '@testing-library/react';
import ParticipantsViewSection from '../../contexts/ParticipantsView.Section';
import projectService from '../../services/project.service';

jest.mock('../../services/project.service');
jest.mock('../../components/LoadingSpinner', () => ({ text }) => (
  <div data-testid="spinner">{text}</div>
));

const mockProjectId = 'project123';
const mockParticipants = [
  {
    _id: 'p1',
    firstName: 'Alice',
    lastName: 'Smith',
    tz: '123',
    preferences: ['1'],
  },
  {
    _id: 'p2',
    firstName: 'Bob',
    lastName: 'Brown',
    tz: '456',
    preferences: [],
  },
];

describe('ParticipantsViewSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    projectService.getAllParticipants.mockResolvedValue({
      status: 200,
      json: async () => ({ response: mockParticipants }),
    });
  });

  const setup = () =>
    render(<ParticipantsViewSection projectId={mockProjectId} />);

  test('shows loading spinner initially', () => {
    setup();
    expect(screen.getByTestId('spinner')).toHaveTextContent(
      'Loading participants...'
    );
  });

  test('renders participants after load', async () => {
    render(<ParticipantsViewSection projectId="project123" />);

    const alice = await screen.findByText('Alice');
    const bob = screen.getByText('Bob');

    const aliceRow = alice.closest('tr');
    const bobRow = bob.closest('tr');

    expect(within(aliceRow).getByText('✔')).toBeInTheDocument();
    expect(within(bobRow).getByText('✔')).toBeInTheDocument();
  });

  test('refreshes participants on button click', async () => {
    setup();
    await screen.findByText('Alice');

    fireEvent.click(screen.getByRole('button', { name: /refresh list/i }));

    await waitFor(() => {
      expect(projectService.getAllParticipants).toHaveBeenCalledTimes(2);
    });
  });

  test('does not show refresh button when no participants', async () => {
    projectService.getAllParticipants.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: [] }),
    });

    setup();

    expect(
      await screen.findByText(/no participants found/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /refresh list/i })
    ).not.toBeInTheDocument();
  });
});
