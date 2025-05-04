import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../context/AuthContext';

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock the react-router-dom hooks
const mockNavigate = jest.fn();
const mockUseLocation = {
  state: { from: { pathname: '/protected-route' } },
  pathname: '/login'
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    useAuth.mockImplementation(() => ({
      login: mockLogin
    }));
  });

  it('renders the login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText(/Note: For demo purposes/)).toBeInTheDocument();
  });

  it('shows error when submitting empty form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.submit(screen.getByRole('form'));

    expect(screen.getByText('Username and password are required')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('calls login and navigates when form is submitted with valid data', () => {
    const testData = {
      username: 'testuser',
      password: 'testpass123'
    };

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { name: 'username', value: testData.username }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password', value: testData.password }
    });

    // Submit the form
    fireEvent.submit(screen.getByRole('form'));

    // Verify the login function was called
    expect(mockLogin).toHaveBeenCalledWith({ username: testData.username });
    
    // Verify navigation to the protected route
    expect(mockNavigate).toHaveBeenCalledWith(
      mockUseLocation.state.from.pathname,
      { replace: true }
    );
  });

  it('navigates to home when no redirect location is specified', () => {
    // Override the mock to return no location state
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({
      state: null,
      pathname: '/login'
    });

    const testData = {
      username: 'testuser',
      password: 'testpass123'
    };

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Fill out and submit the form
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { name: 'username', value: testData.username }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { name: 'password', value: testData.password }
    });
    fireEvent.submit(screen.getByRole('form'));

    // Should navigate to home ('/') when no from location
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('updates form data when inputs change', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(usernameInput, { target: { name: 'username', value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'newpass' } });

    expect(usernameInput.value).toBe('newuser');
    expect(passwordInput.value).toBe('newpass');
  });

  it('contains a link to the registration page', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const registerLink = screen.getByText('Create an account');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });
});