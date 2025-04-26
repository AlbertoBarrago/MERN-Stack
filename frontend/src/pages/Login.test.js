import { render, screen } from '@testing-library/react';
import Login from './Login';

describe('Login Page', () => {
  it('should render the Login page with a login form', () => {
    render(<Login />);

    // Check if the Login page contains a login form
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
});