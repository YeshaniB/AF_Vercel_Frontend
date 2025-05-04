import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import Favorites from './Favorites';
import { useAuth } from '../context/AuthContext';
import { getAllCountries, getCountryByCode } from '../services/api';

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

describe('Favorite Countries Integration', () => {
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
    jest.clearAllMocks();
    window.localStorage.clear();
    
    // Mock useAuth
    useAuth.mockImplementation(() => ({
      user: mockUser
    }));

    // Mock API responses
    getAllCountries.mockResolvedValue(mockCountries);
    getCountryByCode.mockImplementation((code) => 
      Promise.resolve(mockCountries.find(country => country.cca3 === code))
    );
  });

  test('should add country to favorites from Home and display in Favorites', async () => {
    // Render Home component
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Wait for countries to load
    await waitFor(() => screen.getByText('United States'));

    // Click favorite button for USA
    fireEvent.click(screen.getAllByText('Add to Favorites')[0]);

    // Verify localStorage was updated
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'favorites_testuser',
      JSON.stringify(['USA'])
    );

    // Verify button text changed
    expect(screen.getAllByText('Favorited')[0]).toBeInTheDocument();

    // Now render Favorites component
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>,
      { container: document.body.appendChild(document.createElement('div')) }
    );

    // Wait for favorite country to appear
    await waitFor(() => {
      expect(screen.getAllByText('United States')[1]).toBeInTheDocument();
      expect(screen.getByText('Remove from Favorites')).toBeInTheDocument();
    });
  });

  test('should remove country from favorites and update both views', async () => {
    // Set initial favorites
    window.localStorage.setItem('favorites_testuser', JSON.stringify(['USA', 'CAN']));

    // First render Favorites component
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    // Wait for favorites to load
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    // Remove Canada from favorites
    fireEvent.click(screen.getAllByText('Remove from Favorites')[1]);

    // Verify localStorage was updated
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'favorites_testuser',
      JSON.stringify(['USA'])
    );

    // Now render Home component
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
      { container: document.body.appendChild(document.createElement('div')) }
    );

    // Wait for countries to load
    await waitFor(() => screen.getByText('Canada'));

    // Verify Canada's favorite button shows "Add to Favorites"
    expect(screen.getAllByText('Add to Favorites')[1]).toBeInTheDocument();
  });

  test('should persist favorites between sessions', async () => {
    // Set initial favorites
    window.localStorage.setItem('favorites_testuser', JSON.stringify(['USA']));

    // Render Home component
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Wait for countries to load
    await waitFor(() => screen.getByText('United States'));

    // Verify USA is marked as favorite
    expect(screen.getByText('Favorited')).toBeInTheDocument();

    // Render Favorites component
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>,
      { container: document.body.appendChild(document.createElement('div')) }
    );

    // Verify favorite appears
    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument();
    });
  });

  test('should show empty state when no favorites exist', async () => {
    // Render Favorites with no favorites
    render(
      <BrowserRouter>
        <Favorites />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("You haven't added any countries to your favorites yet.")).toBeInTheDocument();
      expect(screen.getByText('Explore Countries')).toBeInTheDocument();
    });
  });

  test('should filter favorites when searching in Home', async () => {
    // Set initial favorites
    window.localStorage.setItem('favorites_testuser', JSON.stringify(['USA', 'CAN']));

    // Render Home component
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Wait for countries to load
    await waitFor(() => screen.getByText('United States'));

    // Search for "Canada"
    fireEvent.change(screen.getByPlaceholderText('Search for a country...'), {
      target: { value: 'Canada' }
    });

    // Verify only Canada is shown
    await waitFor(() => {
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });

    // Verify Canada's favorite button is still visible
    expect(screen.getByText('Favorited')).toBeInTheDocument();
  });
});