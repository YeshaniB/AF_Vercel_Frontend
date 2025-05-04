import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCountries } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Galleria } from 'primereact/galleria';
import { Divider } from 'primereact/divider';
import worldAnimation from '../assets/worldanimation.gif'; // Add this animated image

const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHero, setShowHero] = useState(true);
  const { user } = useAuth();

  // Regions for dropdown
  const regions = [
    { label: 'All Regions', value: null },
    { label: 'Africa', value: 'Africa' },
    { label: 'Americas', value: 'Americas' },
    { label: 'Asia', value: 'Asia' },
    { label: 'Europe', value: 'Europe' },
    { label: 'Oceania', value: 'Oceania' }
  ];

  // Hero images for Galleria
  const heroImages = [
    {
      itemImageSrc: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      alt: 'World Travel',
      title: 'Explore the World',
      subtitle: 'Discover amazing countries and cultures'
    },
    {
      itemImageSrc: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      alt: 'Beautiful Landscapes',
      title: 'Stunning Landscapes',
      subtitle: 'Find breathtaking views across the globe'
    },
    {
      itemImageSrc: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      alt: 'Cultural Diversity',
      title: 'Cultural Diversity',
      subtitle: 'Experience the richness of world cultures'
    }
  ];

  

  const itemTemplate = (item) => {
    return (
      <div className="relative h-96">
        <img 
          src={item.itemImageSrc} 
          alt={item.alt} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center p-4">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">{item.title}</h1>
            <p className="text-2xl">{item.subtitle}</p>
            <Button 
              label="Explore Countries" 
              className="mt-6 p-button-rounded p-button-lg" 
              onClick={() => setShowHero(false)}
            />
          </div>
        </div>
      </div>
    );
  };

  // Get favorite country codes from localStorage
  const getFavorites = () => {
    if (!user) return [];
    const favorites = localStorage.getItem(`favorites_${user.username}`);
    return favorites ? JSON.parse(favorites) : [];
  };
  
  const [favorites, setFavorites] = useState(getFavorites);

  const toggleFavorite = (countryCode) => {
    if (!user) return;
    
    const currentFavorites = [...favorites];
    
    if (currentFavorites.includes(countryCode)) {
      const updatedFavorites = currentFavorites.filter(code => code !== countryCode);
      setFavorites(updatedFavorites);
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...currentFavorites, countryCode];
      setFavorites(updatedFavorites);
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(updatedFavorites));
    }
  };

  useEffect(() => {
    setFavorites(getFavorites());
  }, [user]);

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

  if (showHero) {
    return (
      <div className="home-page">
        <Galleria 
          value={heroImages} 
          item={itemTemplate} 
          circular 
          autoPlay 
          transitionInterval={5000}
          showThumbnails={false}
          showIndicators
          showItemNavigators
          className="hero-galleria"
        />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Why Explore With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg">
              <i className="text-6xl text-blue-500 mb-4">🌍</i>
              <h3 className="text-2xl font-bold mb-2">Global Coverage</h3>
              <p>Detailed information about every country in the world at your fingertips.</p>
            </Card>
            <Card className="shadow-lg">
              <i className="text-6xl text-red-500 mb-4">❤️</i>
              <h3 className="text-2xl font-bold mb-2">Save Favorites</h3>
              <p>Create your personal collection of favorite destinations.</p>
            </Card>
            <Card className="shadow-lg">
              <i className="text-6xl text-green-500 mb-4">📱</i>
              <h3 className="text-2xl font-bold mb-2">Mobile Friendly</h3>
              <p>Access our platform from anywhere on any device.</p>
            </Card>
          </div>
          <Button 
            label="Start Exploring Now" 
            icon="pi pi-arrow-right" 
            iconPos="right" 
            className="p-button-rounded p-button-lg" 
            onClick={() => setShowHero(false)}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ProgressSpinner 
          strokeWidth="4" 
          animationDuration=".5s" 
          className="w-16 h-16" 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Message 
          severity="error" 
          text={error} 
          className="w-full" 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-3/4">
          <span className="p-input-icon-left w-full">
            <input
              type="text"
              placeholder="Search countries..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </span>
        </div>
        <div className="w-full md:w-1/4">
          <Dropdown
            options={regions}
            optionLabel="label"
            placeholder="Filter by Region"
            className="w-full"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.value)}
          />
        </div>
      </div>

      <Divider />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCountries.map(country => (
          <Card 
            key={country.cca3} 
            className="shadow-lg hover:shadow-xl transition-all duration-300 border-1 surface-border"
          >
            <Link to={`/country/${country.cca3}`} className="block">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={country.flags.png} 
                  alt={`Flag of ${country.name.common}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">
                  {country.name.common}
                </h2>
                <div className="text-sm">
                  <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
                  <p><span className="font-semibold">Region:</span> {country.region}</p>
                  <p><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
                </div>
              </div>
            </Link>
            {user && (
              <div className="p-4 pt-0">
                <Button 
                  icon={`pi ${favorites.includes(country.cca3) ? 'pi-heart-fill' : 'pi-heart'}`}
                  label={favorites.includes(country.cca3) ? 'Favorited' : 'Add to Favorites'}
                  className={`p-button-sm p-button-text ${favorites.includes(country.cca3) ? 'text-red-500' : 'text-gray-600'}`}
                  onClick={() => toggleFavorite(country.cca3)}
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <i className="pi pi-search text-6xl text-gray-400 mb-4"></i>
          <h3 className="text-2xl font-bold mb-2">No Countries Found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button 
            label="Reset Filters" 
            className="p-button-outlined"
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
