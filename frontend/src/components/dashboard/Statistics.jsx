import { useState, useEffect } from 'react';

const Statistics = ({ countriesData }) => {
  const [populationStats, setPopulationStats] = useState({
    total: 0,
    average: 0,
    top10: []
  });
  
  const [selectedMetric, setSelectedMetric] = useState('population');
  
  useEffect(() => {
    if (countriesData.length > 0) {
      // Calculate population statistics
      const totalPopulation = countriesData.reduce((sum, country) => sum + (country.population || 0), 0);
      const avgPopulation = Math.round(totalPopulation / countriesData.length);
      
      // Get top 10 countries by population
      const top10 = [...countriesData]
        .sort((a, b) => b.population - a.population)
        .slice(0, 10);
      
      setPopulationStats({
        total: totalPopulation,
        average: avgPopulation,
        top10
      });
    }
  }, [countriesData]);
  
  const formatLargeNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + ' billion';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + ' million';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + ' thousand';
    }
    return num.toString();
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">Global Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-700 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Countries</h3>
          <p className="text-2xl font-bold text-neutral-800 dark:text-white">{countriesData.length}</p>
        </div>
        
        <div className="bg-white dark:bg-neutral-700 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">World Population</h3>
          <p className="text-2xl font-bold text-neutral-800 dark:text-white">
            {formatLargeNumber(populationStats.total)}
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-700 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Average Population</h3>
          <p className="text-2xl font-bold text-neutral-800 dark:text-white">
            {formatLargeNumber(populationStats.average)}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-white">Top 10 Most Populated Countries</h3>
        
        <div className="bg-white dark:bg-neutral-700 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-600">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Population
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Region
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-700 divide-y divide-neutral-200 dark:divide-neutral-600">
                {populationStats.top10.map((country, index) => (
                  <tr key={country.cca3}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800 dark:text-white">
                      <div className="flex items-center">
                        <img 
                          src={country.flags.png} 
                          alt={`Flag of ${country.name.common}`}
                          className="w-8 h-6 object-cover mr-2" 
                        />
                        {country.name.common}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300">
                      {country.population.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300">
                      {country.region}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-white">Population Distribution by Region</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map(region => {
            const regionCountries = countriesData.filter(c => c.region === region.name);
            const regionPopulation = regionCountries.reduce((sum, c) => sum + c.population, 0);
            const countryCount = regionCountries.length;
            
            return (
              <div key={region.name} className="bg-white dark:bg-neutral-700 p-4 rounded-lg shadow">
                <h4 className="font-medium text-neutral-800 dark:text-white">{region.name}</h4>
                <p className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {formatLargeNumber(regionPopulation)}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {countryCount} countries
                </p>
                <div className="mt-2 w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{
                      width: `${(regionPopulation / populationStats.total * 100).toFixed(1)}%`,
                      backgroundColor: region.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Region definitions with colors
const regions = [
  { name: 'Africa', color: '#FCD34D' },
  { name: 'Americas', color: '#60A5FA' },
  { name: 'Asia', color: '#34D399' },
  { name: 'Europe', color: '#F87171' },
  { name: 'Oceania', color: '#A78BFA' }
];

export default Statistics;