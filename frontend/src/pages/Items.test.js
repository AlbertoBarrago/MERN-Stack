import { render, screen } from '@testing-library/react';
import Items from './Items';

describe('Items Page', () => {
  it('should render the Items page with a list of items', () => {
    render(<Items />);

    // Check if the Items page contains a placeholder for items
    expect(screen.getByText(/Items List/i)).toBeInTheDocument();
  });
});