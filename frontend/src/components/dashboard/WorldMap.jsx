import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorldMap = ({ countriesData }) => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('');
  
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  
  // Simple implementation without actual map visualization
  // In a real app, you would use a library like react-simple-maps or Leaflet
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">World Map View</h2>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedRegion('')}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedRegion === '' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-neutral-700 dark:text-neutral-200'
            }`}
          >
            All Regions
          </button>
          
          {regions.map(region => (
            <button 
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedRegion === region 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-neutral-700 dark:text-neutral-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
      
      {/* Interactive region display - simplified version */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {countriesData
          .filter(country => selectedRegion ? country.region === selectedRegion : true)
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .slice(0, 20)
          .map(country => (
            <div 
              key={country.cca3}
              className="bg-white dark:bg-neutral-700 p-4 rounded-md shadow hover:shadow-md cursor-pointer transition-shadow flex items-center"
              onClick={() => navigate(`/country/${country.cca3}`)}
            >
              <img 
                src={country.flags.png} 
                alt={`Flag of ${country.name.common}`} 
                className="w-12 h-8 object-cover mr-4 rounded shadow-sm"
              />
              <div>
                <h3 className="font-medium text-neutral-800 dark:text-white">{country.name.common}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{country.region} • {country.subregion}</p>
              </div>
            </div>
          ))
        }
      </div>
      
      <p className="mt-8 text-sm text-center text-neutral-500 dark:text-neutral-400">
        Note: In a production application, this would be an interactive map visualization.
        <br />Click on any country to view its details.
      </p>
    </div>
  );
};

export default WorldMap;