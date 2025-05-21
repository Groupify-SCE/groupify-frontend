import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignupPage from '../../pages/Signup.page';
import authService from '../../services/auth.service';
import { StatusCodes } from 'http-status-codes';

jest.mock('../../services/auth.service');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe('SignupPage', () => {
  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Test' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'P@ssw0rd!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'P@ssw0rd!' },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form inputs and the submit button', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test('shows error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fillForm();
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'WrongPass1!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(
      await screen.findByText('Passwords do not match')
    ).toBeInTheDocument();
    expect(authService.register).not.toHaveBeenCalled();
  });

  test('submits form and navigates on successful registration', async () => {
    authService.register.mockResolvedValueOnce({
      status: StatusCodes.CREATED,
    });

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testuser',
          email: 'test@example.com',
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('shows error from server on registration failure', async () => {
    authService.register.mockResolvedValueOnce({
      status: 400,
      json: async () => ({
        response: 'User already exists',
      }),
    });

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    fillForm();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText('User already exists')).toBeInTheDocument();
  });
});
