import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Statistics from '../src/components/dashboard/Statistics';

const mockCountriesData = [
  {
    cca3: 'USA',
    name: { common: 'United States' },
    population: 331000000,
    region: 'Americas',
    flags: { png: 'https://flagcdn.com/us.png' }
  },
  {
    cca3: 'CHN',
    name: { common: 'China' },
    population: 1444216107,
    region: 'Asia',
    flags: { png: 'https://flagcdn.com/cn.png' }
  },
  {
    cca3: 'IND',
    name: { common: 'India' },
    population: 1393409038,
    region: 'Asia',
    flags: { png: 'https://flagcdn.com/in.png' }
  },
  {
    cca3: 'FRA',
    name: { common: 'France' },
    population: 67390000,
    region: 'Europe',
    flags: { png: 'https://flagcdn.com/fr.png' }
  },
  {
    cca3: 'AUS',
    name: { common: 'Australia' },
    population: 25690000,
    region: 'Oceania',
    flags: { png: 'https://flagcdn.com/au.png' }
  }
];

describe('Statistics component', () => {
  test('renders heading and total countries', () => {
    render(<Statistics countriesData={mockCountriesData} />);
    
    expect(screen.getByText(/Global Statistics/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Countries/i)).toBeInTheDocument();
    expect(screen.getByText(mockCountriesData.length.toString())).toBeInTheDocument();
  });

  test('renders world population and average', async () => {
    render(<Statistics countriesData={mockCountriesData} />);
    
    const totalPopulation = mockCountriesData.reduce((sum, c) => sum + c.population, 0);
    const avgPopulation = Math.round(totalPopulation / mockCountriesData.length);
    
    expect(await screen.findByText(/World Population/i)).toBeInTheDocument();
    expect(await screen.findByText(/Average Population/i)).toBeInTheDocument();
    expect(screen.getByText(/billion|million|thousand/i)).toBeInTheDocument();
  });

  test('renders Top 10 countries table with flags', async () => {
    render(<Statistics countriesData={mockCountriesData} />);
    
    const countryRows = await screen.findAllByRole('row');
    // First row is the header, so there should be at least 2 rows
    expect(countryRows.length).toBeGreaterThan(1);
    expect(screen.getByAltText(/Flag of United States/i)).toBeInTheDocument();
    expect(screen.getByText('India')).toBeInTheDocument();
  });

  test('renders regional population bars', () => {
    render(<Statistics countriesData={mockCountriesData} />);
    
    expect(screen.getByText('Asia')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Oceania')).toBeInTheDocument();
  });
});