import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';
import { getAllCountries } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the API call
jest.mock('../services/api', () => ({
  getAllCountries: jest.fn(),
}));

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

// Helper to render with auth context
const renderWithAuth = (ui, user = null) => {
  return render(
    <AuthContext.Provider value={{ user }}>
      <Router>
        {ui}
      </Router>
    </AuthContext.Provider>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('shows loading spinner initially', async () => {
    getAllCountries.mockResolvedValue([]);
    renderWithAuth(<Home />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // spinner div
  });

  it('displays countries after loading', async () => {
    getAllCountries.mockResolvedValue(mockCountries);
    renderWithAuth(<Home />);
    
    expect(await screen.findByText('United States')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
  });

  it('filters countries by search term', async () => {
    getAllCountries.mockResolvedValue(mockCountries);
    renderWithAuth(<Home />);

    await waitFor(() => screen.getByText('France'));
    
    fireEvent.change(screen.getByPlaceholderText('Search for a country...'), {
      target: { value: 'france' }
    });

    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
  });

  it('filters countries by region', async () => {
    getAllCountries.mockResolvedValue(mockCountries);
    renderWithAuth(<Home />);

    await waitFor(() => screen.getByText('France'));
    
    fireEvent.change(screen.getByDisplayValue('Filter by Region'), {
      target: { value: 'Europe' }
    });

    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    getAllCountries.mockRejectedValue(new Error('API failed'));
    renderWithAuth(<Home />);
    
    expect(await screen.findByText(/Failed to load countries/i)).toBeInTheDocument();
  });

  it('allows a user to favorite and unfavorite a country', async () => {
    getAllCountries.mockResolvedValue(mockCountries);
    renderWithAuth(<Home />, { username: 'testuser' });

    await waitFor(() => screen.getByText('United States'));

    const favoriteButton = screen.getAllByText('Add to Favorites')[0];
    fireEvent.click(favoriteButton);

    expect(screen.getByText('Favorited')).toBeInTheDocument();

    // Unfavorite
    fireEvent.click(screen.getByText('Favorited'));
    expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
  });
});
