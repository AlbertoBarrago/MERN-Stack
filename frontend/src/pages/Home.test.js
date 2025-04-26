import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home Page', () => {
  it('should render the Home page with a welcome message', () => {
    render(<Home />);

    // Check if the Home page contains a welcome message
    expect(screen.getByText(/Welcome to the Home Page/i)).toBeInTheDocument();
  });
});