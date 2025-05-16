// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getAllCountries } from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import { Button } from 'primereact/button';
// import { Card } from 'primereact/card';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown } from 'primereact/dropdown';
// import { ProgressSpinner } from 'primereact/progressspinner';
// import { Message } from 'primereact/message';
// import { Galleria } from 'primereact/galleria';
// import { Divider } from 'primereact/divider';
// import worldAnimation from '../assets/worldanimation.gif'; // Add this animated image

// const HomePage = () => {
//   const [countries, setCountries] = useState([]);
//   const [filteredCountries, setFilteredCountries] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedRegion, setSelectedRegion] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showHero, setShowHero] = useState(true);
//   const { user } = useAuth();

//   // Regions for dropdown
//   const regions = [
//     { label: 'All Regions', value: null },
//     { label: 'Africa', value: 'Africa' },
//     { label: 'Americas', value: 'Americas' },
//     { label: 'Asia', value: 'Asia' },
//     { label: 'Europe', value: 'Europe' },
//     { label: 'Oceania', value: 'Oceania' }
//   ];

//   // Hero images for Galleria
//   const heroImages = [
//     {
//       itemImageSrc: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
//       alt: 'World Travel',
//       title: 'Explore the World',
//       subtitle: 'Discover amazing countries and cultures'
//     },
//     {
//       itemImageSrc: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
//       alt: 'Beautiful Landscapes',
//       title: 'Stunning Landscapes',
//       subtitle: 'Find breathtaking views across the globe'
//     },
//     {
//       itemImageSrc: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
//       alt: 'Cultural Diversity',
//       title: 'Cultural Diversity',
//       subtitle: 'Experience the richness of world cultures'
//     }
//   ];

  

//   const itemTemplate = (item) => {
//     return (
//       <div className="relative h-96">
//         <img 
//           src={item.itemImageSrc} 
//           alt={item.alt} 
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center p-4">
//           <div className="text-white">
//             <h1 className="text-5xl font-bold mb-4">{item.title}</h1>
//             <p className="text-2xl">{item.subtitle}</p>
//             <Button 
//               label="Explore Countries" 
//               className="mt-6 p-button-rounded p-button-lg" 
//               onClick={() => setShowHero(false)}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Get favorite country codes from localStorage
//   const getFavorites = () => {
//     if (!user) return [];
//     const favorites = localStorage.getItem(`favorites_${user.username}`);
//     return favorites ? JSON.parse(favorites) : [];
//   };
  
//   const [favorites, setFavorites] = useState(getFavorites);

//   const toggleFavorite = (countryCode) => {
//     if (!user) return;
    
//     const currentFavorites = [...favorites];
    
//     if (currentFavorites.includes(countryCode)) {
//       const updatedFavorites = currentFavorites.filter(code => code !== countryCode);
//       setFavorites(updatedFavorites);
//       localStorage.setItem(`favorites_${user.username}`, JSON.stringify(updatedFavorites));
//     } else {
//       const updatedFavorites = [...currentFavorites, countryCode];
//       setFavorites(updatedFavorites);
//       localStorage.setItem(`favorites_${user.username}`, JSON.stringify(updatedFavorites));
//     }
//   };

//   useEffect(() => {
//     setFavorites(getFavorites());
//   }, [user]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const data = await getAllCountries();
//         setCountries(data);
//         setFilteredCountries(data);
//       } catch (err) {
//         setError('Failed to load countries. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     let filtered = [...countries];
    
//     if (searchTerm) {
//       filtered = filtered.filter(country => 
//         country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     if (selectedRegion) {
//       filtered = filtered.filter(country => 
//         country.region === selectedRegion
//       );
//     }
    
//     setFilteredCountries(filtered);
//   }, [searchTerm, selectedRegion, countries]);

//   if (showHero) {
//     return (
//       <div className="home-page">
//         <Galleria 
//           value={heroImages} 
//           item={itemTemplate} 
//           circular 
//           autoPlay 
//           transitionInterval={5000}
//           showThumbnails={false}
//           showIndicators
//           showItemNavigators
//           className="hero-galleria"
//         />
//         <div className="container mx-auto px-4 py-12 text-center">
//           <h2 className="text-4xl font-bold mb-6">Why Explore With Us?</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//             <Card className="shadow-lg">
//               <i className="text-6xl text-blue-500 mb-4">🌍</i>
//               <h3 className="text-2xl font-bold mb-2">Global Coverage</h3>
//               <p>Detailed information about every country in the world at your fingertips.</p>
//             </Card>
//             <Card className="shadow-lg">
//               <i className="text-6xl text-red-500 mb-4">❤️</i>
//               <h3 className="text-2xl font-bold mb-2">Save Favorites</h3>
//               <p>Create your personal collection of favorite destinations.</p>
//             </Card>
//             <Card className="shadow-lg">
//               <i className="text-6xl text-green-500 mb-4">📱</i>
//               <h3 className="text-2xl font-bold mb-2">Mobile Friendly</h3>
//               <p>Access our platform from anywhere on any device.</p>
//             </Card>
//           </div>
//           <Button 
//             label="Start Exploring Now" 
//             icon="pi pi-arrow-right" 
//             iconPos="right" 
//             className="p-button-rounded p-button-lg" 
//             onClick={() => setShowHero(false)}
//           />
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <ProgressSpinner 
//           strokeWidth="4" 
//           animationDuration=".5s" 
//           className="w-16 h-16" 
//         />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <Message 
//           severity="error" 
//           text={error} 
//           className="w-full" 
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col md:flex-row gap-4 mb-8">
//         <div className="w-full md:w-3/4">
//           <span className="p-input-icon-left w-full">
//             <input
//               type="text"
//               placeholder="Search countries..."
//               className="w-full p-2 border border-gray-300 rounded-md"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </span>
//         </div>
//         <div className="w-full md:w-1/4">
//           <Dropdown
//             options={regions}
//             optionLabel="label"
//             placeholder="Filter by Region"
//             className="w-full"
//             value={selectedRegion}
//             onChange={(e) => setSelectedRegion(e.value)}
//           />
//         </div>
//       </div>

//       <Divider />

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredCountries.map(country => (
//           <Card 
//             key={country.cca3} 
//             className="shadow-lg hover:shadow-xl transition-all duration-300 border-1 surface-border"
//           >
//             <Link to={`/country/${country.cca3}`} className="block">
//               <div className="relative h-48 overflow-hidden">
//                 <img 
//                   src={country.flags.png} 
//                   alt={`Flag of ${country.name.common}`}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="p-4">
//                 <h2 className="text-xl font-bold mb-2">
//                   {country.name.common}
//                 </h2>
//                 <div className="text-sm">
//                   <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
//                   <p><span className="font-semibold">Region:</span> {country.region}</p>
//                   <p><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
//                 </div>
//               </div>
//             </Link>
//             {user && (
//               <div className="p-4 pt-0">
//                 <Button 
//                   icon={`pi ${favorites.includes(country.cca3) ? 'pi-heart-fill' : 'pi-heart'}`}
//                   label={favorites.includes(country.cca3) ? 'Favorited' : 'Add to Favorites'}
//                   className={`p-button-sm p-button-text ${favorites.includes(country.cca3) ? 'text-red-500' : 'text-gray-600'}`}
//                   onClick={() => toggleFavorite(country.cca3)}
//                 />
//               </div>
//             )}
//           </Card>
//         ))}
//       </div>

//       {filteredCountries.length === 0 && (
//         <div className="text-center py-12">
//           <i className="pi pi-search text-6xl text-gray-400 mb-4"></i>
//           <h3 className="text-2xl font-bold mb-2">No Countries Found</h3>
//           <p className="text-gray-600 mb-6">
//             Try adjusting your search or filter criteria
//           </p>
//           <Button 
//             label="Reset Filters" 
//             className="p-button-outlined"
//             onClick={() => {
//               setSearchTerm('');
//               setSelectedRegion(null);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCountries } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Galleria } from 'primereact/galleria';
import { Divider } from 'primereact/divider';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHero,  setShowHero] = useState(true);
  const { user } = useAuth();

  const regions = [
    { label: 'All Regions', value: null },
    { label: 'Africa', value: 'Africa' },
    { label: 'Americas', value: 'Americas' },
    { label: 'Asia', value: 'Asia' },
    { label: 'Europe', value: 'Europe' },
    { label: 'Oceania', value: 'Oceania' }
  ];

  const heroImages = [
    {
      itemImageSrc: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      alt: 'World Travel',
      title: 'Explore Our World',
      subtitle: 'Your Journey Begins Here'
    },
    {
      itemImageSrc: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80 ',
      alt: 'Beautiful Landscapes',
      title: 'Discover Beauty',
      subtitle: 'Every Corner Has a Story'
    },
    {
      itemImageSrc: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      alt: 'Cultural Diversity',
      title: 'Embrace Culture',
      subtitle: 'Connect With the World'
    }
  ];

  const navigate = useNavigate();

  const itemTemplate = (item) => {
    return (
      <div className="relative h-[90vh]">
        <img 
          src={item.itemImageSrc} 
          alt={item.alt} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 flex items-center justify-center text-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-4xl"
          >
            <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-lg">{item.title}</h1>
            <p className="text-3xl mb-8 text-gray-200">{item.subtitle}</p>
            <Button 
  label="Start Your Journey" 
  className="p-button-rounded p-button-lg bg-[#0c1a36] text-white text-xl rounded-full px-6 py-3 hover:bg-[#112142] transition-all duration-300 font-semibold tracking-wide shadow-[0_0_10px_rgba(255,255,255,0.3)]"
  onClick={() => {
    setShowHero(false);
    navigate('/countrylist');
  }}
/>
          </motion.div>
        </div>
      </div>
    );
  };

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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
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
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="container mx-auto px-4 py-16 text-center"
        >
          <h2 className="text-4xl font-bold mb-12 text-white">Why Choose Our Platform?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white"
            >
              <div className="text-6xl mb-6">🌍</div>
              <h3 className="text-2xl font-bold mb-4">Global Reach</h3>
              <p className="text-gray-300">Access detailed information about every nation on Earth.</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white"
            >
              <div className="text-6xl mb-6">❤️</div>
              <h3 className="text-2xl font-bold mb-4">Personalization</h3>
              <p className="text-gray-300">Create and manage your favorite destinations list.</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white"
            >
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Real-time Data</h3>
              <p className="text-gray-300">Stay updated with the latest country information.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <ProgressSpinner strokeWidth="4" animationDuration=".5s" className="w-16 h-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <Message severity="error" text={error} className="w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-3/4">
            <input
              type="text"
              placeholder="Search countries..."
              className="w-full p-4 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:border-white/40 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/4">
            <Dropdown
              options={regions}
              optionLabel="label"
              placeholder="Filter by Region"
              className="w-full bg-white/10 backdrop-blur-sm"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.value)}
            />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredCountries.map((country, index) => (
            <motion.div
              key={country.cca3}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/country/${country.cca3}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                  <div className="relative h-48">
                    <img 
                      src={country.flags.png} 
                      alt={`Flag of ${country.name.common}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 text-white">
                    <h2 className="text-xl font-bold mb-4">{country.name.common}</h2>
                    <div className="space-y-2 text-gray-300">
                      <p><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
                      <p><span className="font-semibold">Region:</span> {country.region}</p>
                      <p><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
                    </div>
                    {user && (
                      <Button 
                        icon={`pi ${favorites.includes(country.cca3) ? 'pi-heart-fill' : 'pi-heart'}`}
                        className={`mt-4 w-full ${favorites.includes(country.cca3) ? 'bg-red-500/20 text-red-400' : 'bg-white/20 text-white'} hover:bg-white/30`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(country.cca3);
                        }}
                      />
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredCountries.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 text-white"
          >
            <i className="pi pi-search text-6xl text-gray-400 mb-6"></i>
            <h3 className="text-3xl font-bold mb-4">No Countries Found</h3>
            <p className="text-gray-400 mb-8">Try adjusting your search or filter criteria</p>
            <Button 
              label="Reset Filters" 
              className="p-button-outlined bg-white/20 hover:bg-white/30"
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion(null);
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
