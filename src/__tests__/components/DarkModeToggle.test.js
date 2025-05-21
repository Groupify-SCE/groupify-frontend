import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DarkModeToggle from '../../components/DarkModeToggle';

describe('DarkModeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  test('renders toggle button with both icons', () => {
    render(<DarkModeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(document.querySelector('.dark-mode-light')).toBeInTheDocument();
    expect(document.querySelector('.dark-mode-dark')).toBeInTheDocument();
  });

  test('toggles dark mode on click', () => {
    render(<DarkModeToggle />);
    const button = screen.getByRole('button');

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBeNull();

    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
