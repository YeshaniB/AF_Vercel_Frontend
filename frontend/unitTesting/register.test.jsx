import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';
import Register from '../src/pages/Register';

// Mock the useAuth hook
jest.mock('../src/context/AuthContext');

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: jest.fn().mockImplementation(({ children }) => children),
}));

describe('Register Component', () => {
  const mockRegister = jest.fn();
  
  beforeEach(() => {
    useAuth.mockReturnValue({
      register: mockRegister,
    });
    mockNavigate.mockClear();
    mockRegister.mockClear();
  });

  it('renders the registration form', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    expect(screen.getByText(/Create an Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
  });

  it('updates form data when inputs change', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm Password');

    fireEvent.change(usernameInput, { target: { name: 'username', value: 'testuser' } });
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { name: 'confirmPassword', value: 'password123' } });

    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('shows error when required fields are missing', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();
  });

  it('shows error when passwords do not match', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { name: 'username', value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { name: 'confirmPassword', value: 'different' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it('shows error when password is too short', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { name: 'username', value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'short' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { name: 'confirmPassword', value: 'short' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('calls register and navigates on successful submission', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { name: 'username', value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { name: 'confirmPassword', value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(mockRegister).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com'
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('clears previous errors on new submission attempt', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    // First submit with errors
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();

    // Fill in form correctly
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { name: 'username', value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { name: 'email', value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { name: 'confirmPassword', value: 'password123' } });
    
    // Submit again
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Error should be gone (not in document)
    expect(screen.queryByText(/All fields are required/i)).not.toBeInTheDocument();
  });
});