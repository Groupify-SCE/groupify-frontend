import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPasswordPage from '../../pages/ForgotPassword.page';
import authService from '../../services/auth.service';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock('../../services/auth.service');

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = () =>
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

  test('renders form and input field', () => {
    setup();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /request reset password/i })
    ).toBeInTheDocument();
  });

  test('submits email and navigates on success', async () => {
    authService.forgotPassword.mockResolvedValueOnce({ status: 200 });

    setup();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /request reset password/i })
    );

    await waitFor(() => {
      expect(authService.forgotPassword).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('displays backend error response if available', async () => {
    authService.forgotPassword.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ response: 'User not found' }),
    });

    setup();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /request reset password/i })
    );

    expect(await screen.findByText('User not found')).toBeInTheDocument();
  });

  test('shows fallback message if `error` field present', async () => {
    authService.forgotPassword.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ error: 'Invalid email' }),
    });

    setup();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid@' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /request reset password/i })
    );

    expect(
      await screen.findByText('Enter a valid email address')
    ).toBeInTheDocument();
  });

  test('displays generic error message on thrown exception', async () => {
    authService.forgotPassword.mockRejectedValueOnce(
      new Error('Network error')
    );

    setup();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /request reset password/i })
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/Enter a valid email address/i)
      ).not.toBeInTheDocument();
    });
  });
});
