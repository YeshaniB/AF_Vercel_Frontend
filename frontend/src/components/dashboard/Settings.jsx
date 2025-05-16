
import { useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showClearDataConfirm, setShowClearDataConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const handleClearData = () => {
    if (!user) return;
    
    // Clear user specific data from localStorage
    localStorage.removeItem(`favorites_${user.username}`);
    localStorage.removeItem(`viewedCountries_${user.username}`);
    
    // Show success notification
    setNotification({
      type: 'success',
      message: 'Your browsing data has been cleared successfully'
    });
    
    // Hide confirmation dialog
    setShowClearDataConfirm(false);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-neutral-800 dark:text-white">Settings</h2>
      
      {notification && (
        <div className={`mb-6 p-4 rounded-md ${
          notification.type === 'success' 
            ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300' 
            : 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">Appearance</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-800 dark:text-white">Dark Mode</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Toggle between light and dark mode
              </p>
            </div>
            <button 
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              style={{ backgroundColor: theme === 'dark' ? '#3b82f6' : '#e5e7eb' }}
              aria-pressed={theme === 'dark'}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span 
                className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                style={{ transform: theme === 'dark' ? 'translateX(1.25rem)' : 'translateX(0)' }}
              />
            </button>
          </div>
        </div>
        
        {/* Data and Privacy Section */}
        <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">Data and Privacy</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-neutral-800 dark:text-white">Local Browser Storage</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                This app stores your favorites and recently viewed countries in your browser's local storage.
              </p>
            </div>
            
            <div>
              <button
                onClick={() => setShowClearDataConfirm(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
              >
                Clear All My Data
              </button>
            </div>
          </div>
        </div>
        
        {/* Account Section */}
        <div className="bg-white dark:bg-neutral-700 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">Account</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 dark:bg-primary-900 h-10 w-10 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-medium text-neutral-800 dark:text-white">{user?.username || 'User'}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{user?.email || 'example@mail.com'}</p>
              </div>
            </div>
            
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Note: This is a demo account for presentation purposes. In a real application, you would be able to update your profile details here.
            </p>
          </div>
        </div>
      </div>
      
      {/* Clear Data Confirmation Dialog */}
      {showClearDataConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-2">Clear All Data?</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              This will remove all your favorites and browsing history. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearDataConfirm(false)}
                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;