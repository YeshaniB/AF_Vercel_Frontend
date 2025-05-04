import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCountries } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  // Get favorite country codes from localStorage
  const getFavorites = () => {
    if (!user) return [];
    const favorites = localStorage.getItem(`favorites_${user.username}`);
    return favorites ? JSON.parse(favorites) : [];
  };
  
  const [favorites, setFavorites] = useState(getFavorites);

  // Add the toggleFavorite function
  const toggleFavorite = (countryCode) => {
    if (!user) return;
    
    // Get current favorites
    const currentFavorites = [...favorites];
    
    if (currentFavorites.includes(countryCode)) {
      // Remove from favorites if already in favorites
      const updatedFavorites = currentFavorites.filter(code => code !== countryCode);
      setFavorites(updatedFavorites);
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(updatedFavorites));
    } else {
      // Add to favorites
      const updatedFavorites = [...currentFavorites, countryCode];
      setFavorites(updatedFavorites);
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(updatedFavorites));
    }
  };

  // Update favorites when user changes
  useEffect(() => {
    setFavorites(getFavorites());
  }, [user]);

  // Fetch all countries when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
      } catch (err) {
        setError('Failed to load countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter countries based on search term and region
  useEffect(() => {
    let filtered = [...countries];
    
    if (searchTerm) {
      filtered = filtered.filter(country => 
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRegion) {
      filtered = filtered.filter(country => 
        country.region === selectedRegion
      );
    }
    
    setFilteredCountries(filtered);
  }, [searchTerm, selectedRegion, countries]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-16 w-16 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Explore Countries</h1>
      
      {/* Search and filter section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-2/3">
          <input
            type="text"
            placeholder="Search for a country..."
            className="w-full p-3 border rounded shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder-neutral-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/3">
          <select
            className="w-full p-3 border rounded shadow-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">Filter by Region</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>
      </div>

      {/* Countries grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredCountries.map(country => (
          <div 
            key={country.cca3} 
            className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            style={{ opacity: 1 }} /* Force opacity */
          >
            <Link to={`/country/${country.cca3}`} className="block">
              <img 
                src={country.flags.png} 
                alt={`Flag of ${country.name.common}`}
                className="w-full h-48 object-cover"
                style={{ opacity: 1 }} /* Force opacity */
              />
              <div className="p-4">
                <h2 className="font-bold text-xl mb-2 text-neutral-800 dark:text-white">
                  {country.name.common}
                </h2>
                <div className="text-neutral-700 dark:text-neutral-300">
                  <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
                  <p><span className="font-semibold">Region:</span> {country.region}</p>
                  <p><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
                </div>
              </div>
            </Link>
            {user && (
              <div className="px-4 pb-4">
                <button 
                  onClick={() => toggleFavorite(country.cca3)}
                  className={`flex items-center ${
                    favorites.includes(country.cca3) 
                      ? 'text-yellow-500' 
                      : 'text-gray-400 dark:text-gray-300'
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-1" 
                    fill={favorites.includes(country.cca3) ? "currentColor" : "none"} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                    />
                  </svg>
                  {favorites.includes(country.cca3) ? 'Favorited' : 'Add to Favorites'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg dark:text-gray-400">
            No countries found. Try a different search term or filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;