import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardHome = ({ countriesData }) => {
  const { user } = useAuth();
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [stats, setStats] = useState({
    totalCountries: 0,
    continents: {},
    mostPopulated: null,
    leastPopulated: null
  });

  useEffect(() => {
    if (countriesData.length > 0) {
      // Get recently viewed countries from localStorage
      const viewedHistory = localStorage.getItem(`viewedCountries_${user?.username}`) || '[]';
      const viewedCountryCodes = JSON.parse(viewedHistory);
      
      // Find countries from codes
      const viewedCountries = viewedCountryCodes
        .map(code => countriesData.find(country => country.cca3 === code))
        .filter(Boolean)
        .slice(0, 5);
      
      setRecentlyViewed(viewedCountries);

      // Load favorite countries
      const favoritesData = localStorage.getItem(`favorites_${user.username}`);
      if (favoritesData) {
        const favoriteCodes = JSON.parse(favoritesData);
        const favCountries = favoriteCodes
          .map(code => countriesData.find(country => country.cca3 === code))
          .filter(Boolean);
        setFavoriteCountries(favCountries);
      }

      // Calculate stats
      const continentCounts = {};
      let mostPopulated = countriesData[0];
      let leastPopulated = countriesData[0];

      countriesData.forEach(country => {
        // Count continents
        const continent = country.region || 'Unknown';
        continentCounts[continent] = (continentCounts[continent] || 0) + 1;
        
        // Find population extremes (exclude very small countries with population < 1000)
        if (country.population > mostPopulated.population) {
          mostPopulated = country;
        }
        if (country.population < leastPopulated.population && country.population > 1000) {
          leastPopulated = country;
        }
      });

      setStats({
        totalCountries: countriesData.length,
        continents: continentCounts,
        mostPopulated,
        leastPopulated
      });
    }
  }, [countriesData, user]);

  const getRegionCounts = () => {
    const counts = {};
    countriesData.forEach(country => {
      const region = country.region;
      counts[region] = (counts[region] || 0) + 1;
    });
    return counts;
  };
  
  const regionCounts = getRegionCounts();

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">Total Countries</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{countriesData.length}</p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Visited</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{recentlyViewed.length}</p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300">Favorites</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{favoriteCountries.length}</p>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
          <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300">Regions</h3>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{Object.keys(regionCounts).length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently viewed countries */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 dark:text-white">Recently Viewed</h3>
          <div className="space-y-2">
            {recentlyViewed.length > 0 ? (
              recentlyViewed.slice(0, 5).map(country => (
                <Link 
                  key={country.cca3}
                  to={`/country/${country.cca3}`} 
                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <img 
                    src={country.flags.png} 
                    alt={`${country.name.common} flag`} 
                    className="w-8 h-8 object-cover rounded-sm mr-3" 
                  />
                  <span className="font-medium dark:text-white">{country.name.common}</span>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No countries viewed yet.</p>
            )}
          </div>
        </div>
        
        {/* Favorite countries */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 dark:text-white">Your Favorites</h3>
          <div className="space-y-2">
            {favoriteCountries.length > 0 ? (
              favoriteCountries.slice(0, 5).map(country => (
                <Link 
                  key={country.cca3}
                  to={`/country/${country.cca3}`} 
                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <img 
                    src={country.flags.png} 
                    alt={`${country.name.common} flag`} 
                    className="w-8 h-8 object-cover rounded-sm mr-3" 
                  />
                  <span className="font-medium dark:text-white">{country.name.common}</span>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No favorite countries yet.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Region distribution */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Region Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Object.entries(regionCounts).map(([region, count]) => (
            <div key={region} className="bg-white dark:bg-gray-700 p-3 rounded-md text-center">
              <h4 className="font-medium text-gray-700 dark:text-gray-200">{region}</h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round((count / countriesData.length) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;