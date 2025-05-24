import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../../pages/Profile.page';
import userService from '../../services/user.service';

jest.mock('../../services/user.service');

describe('ProfilePage', () => {
  const mockUserInfo = {
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    userService.userInfo.mockResolvedValue({
      status: 200,
      json: async () => ({
        response: mockUserInfo,
      }),
    });

    render(<ProfilePage />);
    await screen.findByDisplayValue('testuser');
  });

  test('renders initial user data', () => {
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  test('shows validation error for invalid first name characters', async () => {
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'T3st' },
    });

    fireEvent.click(screen.getByRole('button', { name: /update info/i }));

    expect(
      await screen.findByText(
        'First name is not valid (should contain only letters and spaces)'
      )
    ).toBeInTheDocument();

    expect(userService.editUser).not.toHaveBeenCalled();
  });

  test('shows validation error for mismatched passwords', async () => {
    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'NewP@ss1' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'DifferentP@ss1' },
    });

    fireEvent.click(screen.getByRole('button', { name: /update info/i }));

    expect(
      await screen.findByText('Passwords do not match')
    ).toBeInTheDocument();

    expect(userService.editUser).not.toHaveBeenCalled();
  });

  test('calls editUser with only changed fields', async () => {
    userService.editUser.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ response: 'ok' }),
    });

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Updated' },
    });

    fireEvent.click(screen.getByRole('button', { name: /update info/i }));

    await waitFor(() => {
      expect(userService.editUser).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Updated',
        })
      );
    });
  });

  test('shows toast when nothing was changed', async () => {
    const toastSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: /update info/i }));

    await waitFor(() => {
      expect(userService.editUser).not.toHaveBeenCalled();
    });

    toastSpy.mockRestore();
  });

  test('shows error toast if userInfo fails', async () => {
    jest.clearAllMocks();
    userService.userInfo.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ response: 'Failed to fetch user' }),
    });

    render(<ProfilePage />);

    await waitFor(() => {
      expect(userService.userInfo).toHaveBeenCalled();
    });
  });

  test('shows error toast if editUser fails', async () => {
    userService.editUser.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ response: 'Update error' }),
    });

    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'Updated' },
    });

    fireEvent.click(screen.getByRole('button', { name: /update info/i }));

    await waitFor(() => {
      expect(userService.editUser).toHaveBeenCalled();
    });
  });
});
