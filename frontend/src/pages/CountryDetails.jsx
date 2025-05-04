import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCountryByCode } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CountryDetails = () => {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        const countryData = await getCountryByCode(countryCode);
        setCountry(countryData);
        
        // Add to recently viewed countries
        if (user && countryData) {
          // Get current viewed countries
          const viewedHistory = localStorage.getItem(`viewedCountries_${user.username}`) || '[]';
          let viewedCountries = JSON.parse(viewedHistory);
          
          // Remove the country if it's already in the list
          viewedCountries = viewedCountries.filter(code => code !== countryCode);
          
          // Add the country to the beginning of the list
          viewedCountries.unshift(countryCode);
          
          // Keep only the 10 most recent
          viewedCountries = viewedCountries.slice(0, 10);
          
          // Save back to localStorage
          localStorage.setItem(`viewedCountries_${user.username}`, JSON.stringify(viewedCountries));
        }
      } catch (err) {
        setError('Failed to load country details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [countryCode, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 px-4 py-3 rounded" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400 px-4 py-3 rounded" role="alert">
        <p>Country not found.</p>
      </div>
    );
  }

  // Helper function to format object values to array
  const formatObjectToArray = (obj) => {
    if (!obj) return [];
    return Object.values(obj);
  };

  // Extract languages as array
  const languages = country.languages ? formatObjectToArray(country.languages) : [];
  
  // Extract currencies
  const currencies = country.currencies ? 
    Object.entries(country.currencies).map(([code, currency]) => ({
      code,
      name: currency.name,
      symbol: currency.symbol
    })) : [];

  return (
    <div className="pb-12 dark:bg-neutral-900">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center bg-white dark:bg-neutral-800 py-2 px-4 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img 
            src={country.flags.svg} 
            alt={`Flag of ${country.name.common}`}
            className="w-full shadow-lg"
            style={{ opacity: 1 }} /* Force opacity */
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-6 text-neutral-800 dark:text-white">
            {country.name.common}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="mb-2 dark:text-white"><span className="font-semibold">Official Name:</span> {country.name.official}</p>
              <p className="mb-2 dark:text-white"><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
              <p className="mb-2 dark:text-white"><span className="font-semibold">Region:</span> {country.region}</p>
              <p className="mb-2 dark:text-white"><span className="font-semibold">Sub Region:</span> {country.subregion || 'N/A'}</p>
              <p className="mb-2 dark:text-white"><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
            </div>

            <div>
              <p className="mb-2 dark:text-white"><span className="font-semibold">Top Level Domain:</span> {country.tld?.[0] || 'N/A'}</p>
              <p className="mb-2 dark:text-white">
                <span className="font-semibold">Currencies:</span>{' '}
                {currencies.length > 0 
                  ? currencies.map(c => `${c.name} (${c.symbol})`).join(', ') 
                  : 'N/A'}
              </p>
              <p className="mb-2 dark:text-white">
                <span className="font-semibold">Languages:</span>{' '}
                {languages.length > 0 ? languages.join(', ') : 'N/A'}
              </p>
            </div>
          </div>

          {country.borders && country.borders.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Border Countries:</h3>
              <div className="flex flex-wrap gap-2">
                {country.borders.map(border => (
                  <Link 
                    key={border} 
                    to={`/country/${border}`}
                    className="py-1 px-4 bg-white dark:bg-neutral-700 dark:text-white shadow-md hover:bg-gray-100 dark:hover:bg-neutral-600 text-sm rounded inline-block"
                  >
                    {border}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CountryDetails;