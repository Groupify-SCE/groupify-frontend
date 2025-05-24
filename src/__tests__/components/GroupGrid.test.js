import React from 'react';
import { render, screen } from '@testing-library/react';
import GroupGrid from '../../components/';

describe('GroupGrid', () => {
  const groupsMock = [
    [
      {
        id: '1',
        name: 'Alice',
        tz: '123456789',
        preferences: ['2'],
      },
      {
        id: '2',
        name: 'Bob',
        tz: '987654321',
        preferences: [],
      },
    ],
    [
      {
        id: '3',
        name: 'Charlie',
        tz: '111222333',
        preferences: ['999'],
      },
    ],
  ];

  test('renders group titles and member names', () => {
    render(<GroupGrid groups={groupsMock} />);

    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Group 2')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  test('shows correct tz values for members', () => {
    render(<GroupGrid groups={groupsMock} />);

    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('987654321')).toBeInTheDocument();
    expect(screen.getByText('111222333')).toBeInTheDocument();
  });

  test('marks unmatched preferences with correct class', () => {
    const { container } = render(<GroupGrid groups={groupsMock} />);

    const unmatched = container.querySelectorAll('.member-item.unmatched');
    expect(unmatched.length).toBe(1);
    expect(container.textContent).toContain('Charlie');
  });

  test('adds .matched indicator class when preference is met', () => {
    const { container } = render(<GroupGrid groups={groupsMock} />);
    const matchedIndicators = container.querySelectorAll(
      '.status-indicator.matched'
    );
    expect(matchedIndicators.length).toBe(2);
  });

  test('adds .unmatched indicator class when preference is not met', () => {
    const { container } = render(<GroupGrid groups={groupsMock} />);
    const unmatchedIndicators = container.querySelectorAll(
      '.status-indicator.unmatched'
    );
    expect(unmatchedIndicators.length).toBe(1);
  });
});
