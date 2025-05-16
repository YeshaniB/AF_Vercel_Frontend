import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCountryByCode } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Favorites = () => {
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (!user) return;
        
        // Get favorite country codes from localStorage
        const favorites = localStorage.getItem(`favorites_${user.username}`);
        const favoritesList = favorites ? JSON.parse(favorites) : [];
        
        if (favoritesList.length === 0) {
          setFavoriteCountries([]);
          setLoading(false);
          return;
        }
        
        // Fetch details for each favorite country
        const countriesPromises = favoritesList.map(code => getCountryByCode(code));
        const countriesData = await Promise.all(countriesPromises);
        
        setFavoriteCountries(countriesData);
      } catch (err) {
        setError('Failed to load favorite countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const removeFavorite = (countryCode) => {
    // Get current favorites
    const favorites = localStorage.getItem(`favorites_${user.username}`);
    let favoritesList = favorites ? JSON.parse(favorites) : [];
    
    // Remove the country from favorites
    favoritesList = favoritesList.filter(code => code !== countryCode);
    
    // Save updated favorites
    localStorage.setItem(`favorites_${user.username}`, JSON.stringify(favoritesList));
    
    // Update state
    setFavoriteCountries(prevCountries => 
      prevCountries.filter(country => country.cca3 !== countryCode)
    );
  };

  if (loading) {
    return (
      // <div className="flex justify-center items-center h-64">
      //   <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      // </div>
      <div className="flex justify-center items-center h-64">
      <div 
        className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"
        role="status"
        data-testid="loading-spinner"
      >
        <span className="sr-only">Loading...</span>
      </div>
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

  if (favoriteCountries.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Your Favorites</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">You haven't added any countries to your favorites yet.</p>
        <Link to="/" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
          Explore Countries
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Your Favorite Countries</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {favoriteCountries.map(country => (
          <div 
            key={country.cca3} 
            className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <Link to={`/country/${country.cca3}`} className="block">
            <img 
              src={country.flags.png} 
              alt={`Flag of ${country.name.common}`}
              className="w-full h-full object-cover"
              style={{ height: '160px' }} // Explicit fixed height
              loading="lazy"
            />
              <div className="p-4">
                <h2 className="font-bold text-xl mb-3 text-neutral-800 dark:text-white line-clamp-1">
                  {country.name.common}
                </h2>
                <div className="text-neutral-700 dark:text-neutral-300">
                  <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
                  <p><span className="font-semibold">Region:</span> {country.region}</p>
                  <p><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
                </div>
              </div>
            </Link>
            <div className="px-4 pb-4">
              <button 
                onClick={() => removeFavorite(country.cca3)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Remove from Favorites
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;