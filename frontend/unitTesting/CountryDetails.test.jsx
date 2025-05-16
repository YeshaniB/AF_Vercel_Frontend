import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CountryDetails from '../src/pages/CountryDetails';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as api from '../src/services/api';
import * as AuthContext from '../src/context/AuthContext';

// Mock useNavigate and useParams from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ countryCode: 'USA' }),
  useNavigate: () => mockedNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Spy on getCountryByCode API call
jest.spyOn(api, 'getCountryByCode');

describe('CountryDetails Component', () => {
  const fakeUser = { username: 'testuser' };
  const fakeCountry = {
    name: {
      common: 'United States',
      official: 'United States of America',
    },
    population: 331000000,
    region: 'Americas',
    subregion: 'Northern America',
    capital: ['Washington D.C.'],
    tld: ['.us'],
    currencies: {
      USD: { name: 'United States dollar', symbol: '$' },
    },
    languages: {
      eng: 'English',
    },
    flags: {
      svg: 'https://flagcdn.com/us.svg',
    },
    borders: ['CAN', 'MEX'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Mock useAuth hook to always return fakeUser
    jest.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: fakeUser });
  });

  test('renders loading state initially', () => {
    api.getCountryByCode.mockReturnValue(new Promise(() => {})); // simulate loading

    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    // Check for the spinner by its distinctive class
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders error message on API failure', async () => {
    api.getCountryByCode.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    const errorMessage = await screen.findByText(/Failed to load country details/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders country data correctly', async () => {
    api.getCountryByCode.mockResolvedValue(fakeCountry);

    render(
      <MemoryRouter initialEntries={['/country/USA']}>
        <Routes>
          <Route path="/country/:countryCode" element={<CountryDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: /United States/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/United States of America/)).toBeInTheDocument();

    // Population formatted
    expect(screen.getByText(/331,000,000/)).toBeInTheDocument();

    expect(screen.getByText(/Americas/)).toBeInTheDocument();
    expect(screen.getByText(/Northern America/)).toBeInTheDocument();
    expect(screen.getByText(/Washington D.C./)).toBeInTheDocument();
    expect(screen.getByText(/\.us/)).toBeInTheDocument();

    // Currency formatted
    expect(screen.getByText(/United States dollar \(\$\)/)).toBeInTheDocument();

    expect(screen.getByText(/English/)).toBeInTheDocument();

    // Border countries
    expect(screen.getByText('CAN')).toBeInTheDocument();
    expect(screen.getByText('MEX')).toBeInTheDocument();
  });

  test('Back button triggers navigate(-1)', async () => {
    api.getCountryByCode.mockResolvedValue(fakeCountry);

    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByRole('button', { name: /back/i }));
    const backBtn = screen.getByRole('button', { name: /back/i });

    fireEvent.click(backBtn);
    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  test('adds countryCode to recently viewed countries in localStorage', async () => {
    api.getCountryByCode.mockResolvedValue(fakeCountry);

    localStorage.setItem(`viewedCountries_${fakeUser.username}`, JSON.stringify(['FRA', 'ESP']));

    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    await screen.findByRole('heading', { name: /United States/i, level: 1 });

    const stored = JSON.parse(localStorage.getItem(`viewedCountries_${fakeUser.username}`));
    expect(stored[0]).toBe('USA');
    expect(stored).toContain('FRA');
    expect(stored).toContain('ESP');
    expect(stored.length).toBeLessThanOrEqual(10);
  });

  test('does not add countryCode twice in recently viewed countries', async () => {
    api.getCountryByCode.mockResolvedValue(fakeCountry);

    localStorage.setItem(`viewedCountries_${fakeUser.username}`, JSON.stringify(['USA', 'FRA', 'ESP']));

    render(
      <MemoryRouter>
        <CountryDetails />
      </MemoryRouter>
    );

    await screen.findByRole('heading', { name: /United States/i, level: 1 });

    const stored = JSON.parse(localStorage.getItem(`viewedCountries_${fakeUser.username}`));
    expect(stored.filter(c => c === 'USA').length).toBe(1);
    expect(stored[0]).toBe('USA');
  });
});