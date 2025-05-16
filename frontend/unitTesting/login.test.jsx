import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/Login';
import { useAuth } from '../src/context/AuthContext';

// Mock the useAuth hook
jest.mock('../src/context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock the react-router-dom hooks
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation()
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({
      state: { from: { pathname: '/protected-route' } },
      pathname: '/login'
    });
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

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByText(/note: for demo purposes/i)).toBeInTheDocument();
  });

  it('shows error when submitting empty form', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => {
      expect(screen.getByText('Username and password are required')).toBeInTheDocument();
    });
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('calls login and navigates when form is submitted with valid data', async () => {
    const testData = {
      username: 'testuser',
      password: 'testpass123'
    };

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { name: 'username', value: testData.username }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { name: 'password', value: testData.password }
    });

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ username: testData.username });
      expect(mockNavigate).toHaveBeenCalledWith(
        '/protected-route',
        { replace: true }
      );
    });
  });

  it('navigates to home when no redirect location is specified', async () => {
    mockUseLocation.mockReturnValue({
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

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { name: 'username', value: testData.username }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { name: 'password', value: testData.password }
    });
    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('updates form data when inputs change', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(usernameInput, { target: { name: 'username', value: 'newuser' } });
    fireEvent.change(passwordInput, { target: { name: 'password', value: 'newpass' } });

    expect(usernameInput).toHaveValue('newuser');
    expect(passwordInput).toHaveValue('newpass');
  });

  it('contains a link to the registration page with correct href', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const registerLink = screen.getByRole('link', { name: /create an account/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});
// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import Login from '../src/pages/Login';
// import { useAuth } from '../src/context/AuthContext';

// // Mock the useAuth hook
// jest.mock('../src/context/AuthContext', () => ({
//   useAuth: jest.fn()
// }));

// // Mock the react-router-dom hooks
// const mockNavigate = jest.fn();
// const mockUseLocation = jest.fn();

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockNavigate,
//   useLocation: () => mockUseLocation()
// }));

// describe('Login Component', () => {
//   const mockLogin = jest.fn();
  
//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockUseLocation.mockReturnValue({
//       state: { from: { pathname: '/protected-route' } },
//       pathname: '/login'
//     });
//     useAuth.mockImplementation(() => ({
//       login: mockLogin
//     }));
//   });

//   it('renders the login form correctly', () => {
//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
//     expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
//     expect(screen.getByRole('link', { name: /create an account/i })).toBeInTheDocument();
//     expect(screen.getByText(/note: for demo purposes/i)).toBeInTheDocument();
//   });

//   it('shows error when submitting empty form', async () => {
//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     fireEvent.submit(screen.getByRole('form'));

//     await waitFor(() => {
//       expect(screen.getByText('Username and password are required')).toBeInTheDocument();
//     });
//     expect(mockLogin).not.toHaveBeenCalled();
//     expect(mockNavigate).not.toHaveBeenCalled();
//   });

//   it('calls login and navigates when form is submitted with valid data', async () => {
//     const testData = {
//       username: 'testuser',
//       password: 'testpass123'
//     };

//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     fireEvent.change(screen.getByLabelText(/username/i), {
//       target: { name: 'username', value: testData.username }
//     });
//     fireEvent.change(screen.getByLabelText(/password/i), {
//       target: { name: 'password', value: testData.password }
//     });

//     fireEvent.submit(screen.getByRole('form'));

//     await waitFor(() => {
//       expect(mockLogin).toHaveBeenCalledWith({ username: testData.username });
//       expect(mockNavigate).toHaveBeenCalledWith(
//         '/protected-route',
//         { replace: true }
//       );
//     });
//   });

//   it('navigates to home when no redirect location is specified', async () => {
//     mockUseLocation.mockReturnValue({
//       state: null,
//       pathname: '/login'
//     });

//     const testData = {
//       username: 'testuser',
//       password: 'testpass123'
//     };

//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     fireEvent.change(screen.getByLabelText(/username/i), {
//       target: { name: 'username', value: testData.username }
//     });
//     fireEvent.change(screen.getByLabelText(/password/i), {
//       target: { name: 'password', value: testData.password }
//     });
//     fireEvent.submit(screen.getByRole('form'));

//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
//     });
//   });

//   it('updates form data when inputs change', () => {
//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     const usernameInput = screen.getByLabelText(/username/i);
//     const passwordInput = screen.getByLabelText(/password/i);

//     fireEvent.change(usernameInput, { target: { name: 'username', value: 'newuser' } });
//     fireEvent.change(passwordInput, { target: { name: 'password', value: 'newpass' } });

//     expect(usernameInput).toHaveValue('newuser');
//     expect(passwordInput).toHaveValue('newpass');
//   });

//   it('contains a link to the registration page with correct href', () => {
//     render(
//       <BrowserRouter>
//         <Login />
//       </BrowserRouter>
//     );

//     const registerLink = screen.getByRole('link', { name: /create an account/i });
//     expect(registerLink).toHaveAttribute('href', '/register');
//   });
// });