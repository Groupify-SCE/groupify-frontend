import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDeletion from '../../components/ConfirmDeletion';

describe('ConfirmDeletion', () => {
  test('renders confirmation message and buttons', () => {
    const mockConfirm = jest.fn();
    const mockCancel = jest.fn();

    render(<ConfirmDeletion onConfirm={mockConfirm} onCancel={mockCancel} />);

    expect(
      screen.getByText(/are you sure you want to delete this project/i)
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();
  });

  test('calls onConfirm when Yes button is clicked', () => {
    const mockConfirm = jest.fn();
    const mockCancel = jest.fn();

    render(<ConfirmDeletion onConfirm={mockConfirm} onCancel={mockCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /yes/i }));

    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockCancel).not.toHaveBeenCalled();
  });

  test('calls onCancel when No button is clicked', () => {
    const mockConfirm = jest.fn();
    const mockCancel = jest.fn();

    render(<ConfirmDeletion onConfirm={mockConfirm} onCancel={mockCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /no/i }));

    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(mockConfirm).not.toHaveBeenCalled();
  });
});
