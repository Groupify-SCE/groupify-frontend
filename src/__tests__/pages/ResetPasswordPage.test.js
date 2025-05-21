import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPasswordPage from '../../pages/ResetPassword.page';
import authService from '../../services/auth.service';

const mockToken = 'abc123token';
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [
      {
        get: (key) => (key === 'token' ? 'abc123token' : null),
      },
    ],
  };
});

jest.mock('../../services/auth.service');

describe('ResetPasswordPage', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <ResetPasswordPage />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with both password fields', () => {
    setup();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /change password/i })
    ).toBeInTheDocument();
  });

  test('shows error when passwords do not match', async () => {
    setup();

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'P@ssw0rd1' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'DifferentPass1!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  test('submits matching passwords and navigates on success', async () => {
    authService.resetPassword.mockResolvedValueOnce({
      status: 200,
    });

    setup();

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'ValidP@ss1' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'ValidP@ss1' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith(
        mockToken,
        'ValidP@ss1',
        'ValidP@ss1'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('shows server error message when response fails', async () => {
    authService.resetPassword.mockResolvedValueOnce({
      status: 400,
      response: 'Reset token invalid or expired',
    });

    setup();

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'ValidP@ss1' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'ValidP@ss1' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    expect(
      await screen.findByText('Reset token invalid or expired')
    ).toBeInTheDocument();
  });

  test('handles thrown exception gracefully', async () => {
    authService.resetPassword.mockRejectedValueOnce(new Error('Network error'));

    setup();

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'ValidP@ss1' },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), {
      target: { value: 'ValidP@ss1' },
    });

    fireEvent.click(screen.getByRole('button', { name: /change password/i }));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalled();
    });
  });
});
