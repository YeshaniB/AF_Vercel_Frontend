// CountryDetails.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CountryDetails from '../components/CountryDetails';
import { BrowserRouter } from 'react-router-dom';

// Mock router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ countryCode: 'LK' }),
  useNavigate: () => jest.fn(),
  Link: ({ to, children }) => <a href={to}>{children}</a>
}));

// Mock API
jest.mock('../../src/services/api', () => ({
    getCountryByCode: jest.fn()
  }));

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'testuser' }
  })
}));

import { getCountryByCode } from '../services/api';

const mockCountry = {
  name: {
    common: 'Sri Lanka',
    official: 'Democratic Socialist Republic of Sri Lanka'
  },
  flags: {
    svg: 'https://flagcdn.com/lk.svg'
  },
  population: 21413249,
  region: 'Asia',
  subregion: 'Southern Asia',
  capital: ['Sri Jayawardenepura Kotte'],
  tld: ['.lk'],
  currencies: {
    LKR: {
      name: 'Sri Lankan Rupee',
      symbol: 'Rs'
    }
  },
  languages: {
    sin: 'Sinhala',
    tam: 'Tamil'
  },
  borders: ['IND']
};

describe('CountryDetails Component', () => {
  it('renders country details after API call', async () => {
    getCountryByCode.mockResolvedValueOnce(mockCountry);

    render(
      <BrowserRouter>
        <CountryDetails />
      </BrowserRouter>
    );

    // Loader shown initially
    expect(screen.getByRole('alert')).not.toBeInTheDocument();

    // Wait for country name to appear
    await waitFor(() =>
      expect(screen.getByText('Sri Lanka')).toBeInTheDocument()
    );

    // Check if other data is shown
    expect(screen.getByText(/Democratic Socialist Republic of Sri Lanka/)).toBeInTheDocument();
    expect(screen.getByText(/21413249/)).toBeInTheDocument();
    expect(screen.getByText(/Sri Lankan Rupee \(Rs\)/)).toBeInTheDocument();
    expect(screen.getByText(/Sinhala, Tamil/)).toBeInTheDocument();
    expect(screen.getByText(/IND/)).toBeInTheDocument();
  });

  it('shows error on API failure', async () => {
    getCountryByCode.mockRejectedValueOnce(new Error('API Error'));

    render(
      <BrowserRouter>
        <CountryDetails />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText('Failed to load country details. Please try again later.')
      ).toBeInTheDocument()
    );
  });
});
