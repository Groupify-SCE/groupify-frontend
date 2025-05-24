import React from 'react';
import '@testing-library/jest-dom';
import { act, waitFor } from '@testing-library/react';

import { elementExists, RouterRender } from '../../utils/testHelperFunctions';

import NavBar from '../../components/NavBar';
import authService from '../../services/auth.service';

jest.mock('../../services/auth.service', () => ({
  status: jest.fn(),
  logout: jest.fn(),
}));

describe('Checks Nav Bar Buttons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Checks "Landing" exists', async () => {
    authService.status.mockResolvedValue({ status: 401 });

    await act(async () => {
      RouterRender(<NavBar />);
    });

    await waitFor(() => {
      expect(elementExists('landingNavButton')).toBe(true);
    });
  });

  test('Checks "Login" exists when user is not authenticated', async () => {
    authService.status.mockResolvedValue({ status: 401 });

    await act(async () => {
      RouterRender(<NavBar />);
    });

    await waitFor(() => {
      expect(elementExists('loginNavButton')).toBe(true);
    });
  });

  test('Checks "Signup" exists when user is not authenticated', async () => {
    authService.status.mockResolvedValue({ status: 401 });

    await act(async () => {
      RouterRender(<NavBar />);
    });

    await waitFor(() => {
      expect(elementExists('signupNavButton')).toBe(true);
    });
  });

  // Tests for elements that appear ONLY when user IS authenticated
  test('Checks "Profile" exists when user is authenticated', async () => {
    authService.status.mockResolvedValue({ status: 200 });

    await act(async () => {
      RouterRender(<NavBar />);
    });

    await waitFor(() => {
      expect(elementExists('profileNavButton')).toBe(true);
    });
  });

  test('Checks "Projects" exists when user is authenticated', async () => {
    authService.status.mockResolvedValue({ status: 200 });

    await act(async () => {
      RouterRender(<NavBar />);
    });

    await waitFor(() => {
      expect(elementExists('projectsNavButton')).toBe(true);
    });
  });

  test('Checks "Logout" exists when user is authenticated', async () => {
    authService.status.mockResolvedValue({ status: 200 });

    await act(async () => {
      RouterRender(<NavBar />);
    });

    await waitFor(() => {
      expect(elementExists('logoutNavButton')).toBe(true);
    });
  });
});
