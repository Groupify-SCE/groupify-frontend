import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ParticipantsSection from '../../contexts/Participants.section';
import projectService from '../../services/project.service';
import { confirmDialog } from 'primereact/confirmdialog';

jest.mock('../../services/project.service');
jest.mock('../../components/AddParticipantForm', () => (props) => (
  <div data-testid="add-form" onClick={() => props.onParticipantAdded()}>
    Mock Add Form
  </div>
));
jest.mock('../../components/CriteriaEditorForm', () => () => (
  <div data-testid="criteria-form">Mock Criteria Form</div>
));
jest.mock('../../components/LoadingSpinner', () => ({ text }) => (
  <div data-testid="spinner">{text}</div>
));
jest.mock('primereact/confirmdialog', () => {
  const actual = jest.requireActual('primereact/confirmdialog');
  return {
    ...actual,
    confirmDialog: jest.fn(),
    ConfirmDialog: () => <div data-testid="confirm-dialog" />,
  };
});

const mockProjectId = 'project123';
const fakeParticipants = [
  {
    _id: 'p1',
    firstName: 'Alice',
    lastName: 'Smith',
    tz: '1111',
    criteria: [],
  },
  {
    _id: 'p2',
    firstName: 'Bob',
    lastName: 'Jones',
    tz: '2222',
    criteria: [],
  },
];

const fakeCriteria = [{ _id: 'c1', name: 'Skill', range: 10 }];

describe('ParticipantsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    projectService.getAllParticipants.mockResolvedValue({
      status: 200,
      json: async () => ({ response: fakeParticipants }),
    });

    projectService.getAllCriteria.mockResolvedValue({
      status: 200,
      json: async () => ({ response: fakeCriteria }),
    });
  });

  const setup = () => {
    return render(<ParticipantsSection projectId={mockProjectId} />);
  };

  test('renders loading spinner and then participant rows', async () => {
    setup();
    expect(screen.getByTestId('spinner')).toHaveTextContent(
      'Loading participants...'
    );

    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  test('clicking Edit button opens criteria dialog', async () => {
    setup();
    const editButtons = await screen.findAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(await screen.findByTestId('criteria-form')).toBeInTheDocument();
  });

  test('calls deleteParticipant and removes row', async () => {
    projectService.deleteParticipant.mockResolvedValue({ status: 200 });

    setup();
    await screen.findByText('Alice');

    const deleteBtn = screen
      .getAllByRole('button', {
        name: '',
      })
      .find((btn) => btn.className.includes('delete-trash-button'));

    fireEvent.click(deleteBtn);

    const confirmConfig = confirmDialog.mock.calls[0][0];
    await waitFor(() => confirmConfig.accept());

    expect(projectService.deleteParticipant).toHaveBeenCalledWith(
      mockProjectId,
      'p1'
    );
  });

  test('save button calls updateAllParticipants', async () => {
    projectService.updateAllParticipants.mockResolvedValue({ status: 200 });

    setup();
    await screen.findByText('Alice');

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(projectService.updateAllParticipants).toHaveBeenCalledWith(
        mockProjectId,
        expect.any(Array)
      );
    });
  });

  test('calls fetchParticipants again when participant is added', async () => {
    setup();

    await screen.findByText('Alice');

    const initialCallCount =
      projectService.getAllParticipants.mock.calls.length;

    fireEvent.click(screen.getByTestId('add-form'));

    await waitFor(() => {
      expect(projectService.getAllParticipants).toHaveBeenCalledTimes(
        initialCallCount + 1
      );
    });
  });
});
