import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GroupsPage from '../../pages/Groups.page';
import algoService from '../../services/algo.service';
import * as excelExport from '../../utils/excelExport';

jest.mock('../../services/algo.service');
jest.mock('../../components/GroupGrid', () => () => (
  <div data-testid="group-grid">Mock GroupGrid</div>
));
jest.mock('../../components/LoadingSpinner', () => ({ text }) => (
  <div data-testid="spinner">{text}</div>
));

jest.mock('../../utils/excelExport');

const mockGroups = [
  {
    name: 'Group 1',
    members: [
      { firstName: 'Alice', lastName: 'Smith' },
      { firstName: 'Bob', lastName: 'Brown' },
    ],
  },
];

describe('GroupsPage', () => {
  const setup = () =>
    render(
      <MemoryRouter initialEntries={['/groups/123']}>
        <Routes>
          <Route path="/groups/:id" element={<GroupsPage />} />
        </Routes>
      </MemoryRouter>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner initially', async () => {
    algoService.getAlgorithmResults.mockResolvedValue({
      status: 200,
      json: async () => ({ response: mockGroups }),
    });

    setup();

    expect(screen.getByTestId('spinner')).toHaveTextContent(
      'Loading groups...'
    );
    await screen.findByTestId('group-grid');
  });

  test('renders group grid after fetch', async () => {
    algoService.getAlgorithmResults.mockResolvedValue({
      status: 200,
      json: async () => ({ response: mockGroups }),
    });

    setup();

    expect(await screen.findByTestId('group-grid')).toBeInTheDocument();
  });

  test('calls exportGroupsToExcel on button click', async () => {
    algoService.getAlgorithmResults.mockResolvedValue({
      status: 200,
      json: async () => ({ response: mockGroups }),
    });

    setup();

    await screen.findByTestId('group-grid');

    const exportBtn = screen.getByRole('button', { name: /export to excel/i });
    fireEvent.click(exportBtn);

    expect(excelExport.exportGroupsToExcel).toHaveBeenCalledWith(mockGroups);
  });
});
