import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Favorites from './Favorites';
import { useAuth } from '../context/AuthContext';
import { getCountryByCode } from '../services/api';

// Mock dependencies
jest.mock('../context/AuthContext');
jest.mock('../services/api');

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => store[key] = value.toString()),
    removeItem: jest.fn((key) => delete store[key]),
    clear: jest.fn(() => store = {})
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Favorites Component', () => {
  const mockUser = { username: 'testuser' };
  const mockCountries = [
    {
      cca3: 'USA',
      name: { common: 'United States' },
      flags: { png: 'usa-flag.png' },
      population: 331000000,
      region: 'Americas',
      capital: ['Washington D.C.']
    },
    {
      cca3: 'CAN',
      name: { common: 'Canada' },
      flags: { png: 'canada-flag.png' },
      population: 38000000,
      region: 'Americas',
      capital: ['Ottawa']
    }
  ];

  beforeEach(() => {
    // Reset all mocks and localStorage
    jest.clearAllMocks();
    window.localStorage.clear();
    
    // Mock useAuth
    useAuth.mockImplementation(() => ({
      user: mockUser
    }));
  });

  it('shows loading spinner initially', () => {
    useAuth.mockImplementation(() => ({ user: mockUser }));
    
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when loading fails', async () => {
    getCountryByCode.mockRejectedValue(new Error('API Error'));
    window.localStorage.setItem(`favorites_${mockUser.username}`, JSON.stringify(['USA']));

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load favorite countries. Please try again later.')).toBeInTheDocument();
    });
  });

  it('shows empty state when no favorites exist', async () => {
    window.localStorage.setItem(`favorites_${mockUser.username}`, JSON.stringify([]));

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('You haven\'t added any countries to your favorites yet.')).toBeInTheDocument();
      expect(screen.getByText('Explore Countries')).toBeInTheDocument();
    });
  });

  it('displays favorite countries when they exist', async () => {
    window.localStorage.setItem(`favorites_${mockUser.username}`, JSON.stringify(['USA', 'CAN']));
    getCountryByCode.mockImplementation((code) => 
      Promise.resolve(mockCountries.find(country => country.cca3 === code))
    );

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Your Favorite Countries')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(screen.getAllByText('Remove from Favorites')).toHaveLength(2);
    });
  });

  it('allows removing a country from favorites', async () => {
    window.localStorage.setItem(`favorites_${mockUser.username}`, JSON.stringify(['USA', 'CAN']));
    getCountryByCode.mockImplementation((code) => 
      Promise.resolve(mockCountries.find(country => country.cca3 === code))
    );

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('United States'));

    // Click remove button for USA
    fireEvent.click(screen.getAllByText('Remove from Favorites')[0]);

    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        `favorites_${mockUser.username}`,
        JSON.stringify(['CAN'])
      );
    });
  });

  it('shows empty state when last favorite is removed', async () => {
    window.localStorage.setItem(`favorites_${mockUser.username}`, JSON.stringify(['USA']));
    getCountryByCode.mockImplementation((code) => 
      Promise.resolve(mockCountries.find(country => country.cca3 === code))
    );

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('United States'));

    // Click remove button
    fireEvent.click(screen.getByText('Remove from Favorites'));

    await waitFor(() => {
      expect(screen.getByText('You haven\'t added any countries to your favorites yet.')).toBeInTheDocument();
    });
  });

  it('does not load favorites when user is not logged in', async () => {
    useAuth.mockImplementation(() => ({ user: null }));

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('You haven\'t added any countries to your favorites yet.')).toBeInTheDocument();
      expect(getCountryByCode).not.toHaveBeenCalled();
    });
  });

  it('renders country cards with correct information', async () => {
    window.localStorage.setItem(`favorites_${mockUser.username}`, JSON.stringify(['USA']));
    getCountryByCode.mockResolvedValue(mockCountries[0]);

    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('331,000,000')).toBeInTheDocument();
      expect(screen.getByText('Americas')).toBeInTheDocument();
      expect(screen.getByText('Washington D.C.')).toBeInTheDocument();
      expect(screen.getByAltText('Flag of United States')).toBeInTheDocument();
    });
  });
});