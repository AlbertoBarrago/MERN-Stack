import { render, screen } from '@testing-library/react';
import Register from './Register';

describe('Register Page', () => {
  it('should render the Register page with a registration form', () => {
    render(<Register />);

    // Check if the Register page contains a registration form
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });
});