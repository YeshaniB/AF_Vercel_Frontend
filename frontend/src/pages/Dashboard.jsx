import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getAllCountries } from '../services/api';

// Dashboard components
import DashboardHome from '../components/dashboard/DashboardHome';
import WorldMap from '../components/dashboard/WorldMap';
import Statistics from '../components/dashboard/Statistics';
import Settings from '../components/dashboard/Settings';

const Dashboard = () => {
  const { user } = useAuth();
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountriesData(data);
      } catch (error) {
        console.error('Error loading countries data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get active class for navigation
  const getNavClass = ({ isActive }) => {
    return isActive 
      ? "bg-primary-600 text-white px-3 py-2 rounded-md flex items-center gap-2" 
      : "text-neutral-600 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-neutral-800 px-3 py-2 rounded-md flex items-center gap-2";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mt-1">
          Welcome back, {user?.username || 'User'}! Explore your world insights.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
            <nav className="flex flex-col space-y-1">
              <div>
                <NavLink to="/dashboard" end className={getNavClass}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>Overview</span>
                </NavLink>
              </div>
              
              <div>
                <NavLink to="/dashboard/map" className={getNavClass}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                  </svg>
                  <span>World Map</span>
                </NavLink>
              </div>
              
              <div>
                <NavLink to="/dashboard/statistics" className={getNavClass}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span>Statistics</span>
                </NavLink>
              </div>
              
              <div>
                <NavLink to="/dashboard/settings" className={getNavClass}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>Settings</span>
                </NavLink>
              </div>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
            <Routes>
              <Route index element={<DashboardHome countriesData={countriesData} />} />
              <Route path="map" element={<WorldMap countriesData={countriesData} />} />
              <Route path="statistics" element={<Statistics countriesData={countriesData} />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;