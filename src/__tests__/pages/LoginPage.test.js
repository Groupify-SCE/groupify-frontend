import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../pages/Login.page';
import authService from '../../services/auth.service';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../components/LoadingSpinner', () => ({ text }) => (
  <div data-testid="spinner">{text}</div>
));

jest.mock('../../services/auth.service');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/email or username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'P@ssw0rd!' },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form and links', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('successful login navigates to profile', async () => {
    authService.login.mockResolvedValueOnce({ status: StatusCodes.OK });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        identifier: 'testuser',
        password: 'P@ssw0rd!',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  test('shows error on invalid credentials', async () => {
    authService.login.mockResolvedValueOnce({
      status: 401,
      json: async () => ({ response: 'Invalid credentials' }),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  test('shows fallback error on unexpected failure', async () => {
    authService.login.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(
      await screen.findByText('An unexpected error occurred. Please try again.')
    ).toBeInTheDocument();
  });

  test('shows loading spinner while logging in', async () => {
    let resolveLogin;
    authService.login.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        })
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByTestId('spinner')).toHaveTextContent('Logging in...');

    resolveLogin({ status: StatusCodes.OK });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });
});
