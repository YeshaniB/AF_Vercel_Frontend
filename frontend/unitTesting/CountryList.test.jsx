import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/pages/Home';
import { getAllCountries } from '../src/services/api';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the API call
jest.mock('../src/services/api', () => ({
  getAllCountries: jest.fn(),
}));

// Mock the AuthContext using jest.requireActual to get React
jest.mock('../src/context/AuthContext', () => {
  const React = jest.requireActual('react');
  const mockAuthContextValue = {
    user: { username: 'testuser' }
  };
  
  return {
    __esModule: true,
    default: React.createContext(mockAuthContextValue),
    useAuth: () => mockAuthContextValue,
  };
});

const mockCountries = [
  {
    cca3: 'USA',
    name: { common: 'United States' },
    flags: { png: 'usa-flag.png' },
    population: 331002651,
    region: 'Americas',
    capital: ['Washington, D.C.'],
  },
  {
    cca3: 'FRA',
    name: { common: 'France' },
    flags: { png: 'france-flag.png' },
    population: 65273511,
    region: 'Europe',
    capital: ['Paris'],
  },
];

describe('Home Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('shows loading spinner initially', async () => {
    getAllCountries.mockResolvedValue([]);
    render(
      <Router>
        <Home />
      </Router>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays countries after loading', async () => {
    getAllCountries.mockResolvedValue(mockCountries);
    render(
      <Router>
        <Home />
      </Router>
    );
    
    expect(await screen.findByText('United States')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
  });

  it('filters countries by search term', async () => {
    getAllCountries.mockResolvedValue(mockCountries);
    render(
      <Router>
        <Home />
      </Router>
    );

    await waitFor(() => screen.getByText('France'));
    
    fireEvent.change(screen.getByPlaceholderText('Search for a country...'), {
      target: { value: 'france' }
    });

    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
  });

  it('filters countries by region', async () => {
    getAllCountries.mockResolvedValue(mockCountries);
    render(
      <Router>
        <Home />
      </Router>
    );

    await waitFor(() => screen.getByText('France'));
    
    fireEvent.change(screen.getByDisplayValue('Filter by Region'), {
      target: { value: 'Europe' }
    });

    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    getAllCountries.mockRejectedValue(new Error('API failed'));
    render(
      <Router>
        <Home />
      </Router>
    );
    
    expect(await screen.findByText(/Failed to load countries/i)).toBeInTheDocument();
  });

  it('allows a user to favorite and unfavorite a country', async () => {
    getAllCountries.mockResolvedValue(mockCountries);
    render(
      <Router>
        <Home />
      </Router>
    );

    await waitFor(() => screen.getByText('United States'));

    const favoriteButton = screen.getAllByText('Add to Favorites')[0];
    fireEvent.click(favoriteButton);

    expect(screen.getByText('Favorited')).toBeInTheDocument();

    // Unfavorite
    fireEvent.click(screen.getByText('Favorited'));
    expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
  });
});