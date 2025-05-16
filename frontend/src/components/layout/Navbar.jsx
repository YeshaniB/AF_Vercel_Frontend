import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.1,
        type: "spring", 
        stiffness: 300, 
        damping: 20
      }
    }),
    hover: { scale: 1.1 }
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: { 
      scale: 1.05, 
      textShadow: "0 0 8px rgba(255,255,255,0.3)",
      transition: { duration: 0.3 }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { 
        duration: 0.3,
        ease: "easeInOut" 
      }
    }
  };

  const themeToggleVariants = {
    light: { rotate: 0 },
    dark: { rotate: 180 },
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 text-white shadow-md"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Link to="/" className="text-2xl font-bold">Countries Explorer</Link>
        </motion.div>
        
        <div className="flex items-center">
          {/* Theme toggle button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={theme === 'dark' ? "dark" : "light"}
            variants={themeToggleVariants}
            onClick={toggleTheme} 
            className="p-2 mr-100 rounded-full bg-gray-700 focus:outline-none"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <motion.svg 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="w-6 h-6" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path>
                <path d="M10 4a6 6 0 016 6c0 1.3-.42 2.5-1.12 3.5-.28-.38-.85-.5-1.28-.25-.43.25-.55.82-.27 1.2.28.38.85.5 1.28.25.12-.07.22-.15.31-.25A8 8 0 1116 10c0 2.12-.8 4.08-2.16 5.6-.13.15-.33.4-.47.4h-6.74c-.14 0-.34-.25-.47-.4A8.06 8.06 0 014 10a6 6 0 016-6z"></path>
              </motion.svg>
            ) : (
              <motion.svg
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="w-6 h-6" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </motion.svg>
            )}
          </motion.button>
          
          {/* Mobile menu button */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="md:hidden focus:outline-none" 
            onClick={toggleMenu}
          >
            <motion.svg
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              {isMenuOpen ? (
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                />
              ) : (
                <path 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z" 
                />
              )}
            </motion.svg>
          </motion.button>
        </div>
        
        {/* Desktop navigation */}
        <ul className="hidden md:flex space-x-8">
          <motion.li
            custom={0}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Link 
              to="/" 
              className={`hover:text-blue-300 ${location.pathname === '/' ? 'text-blue-300' : ''}`}
            >
              Home
            </Link>
          </motion.li>
          <motion.li
            custom={1}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <Link 
              to="/countrylist" 
              className={`hover:text-blue-300 ${location.pathname === '/countrylist' ? 'text-blue-300' : ''}`}
            >
              Countries
            </Link>
          </motion.li>
          {user ? (
            <>
              <motion.li
                custom={2}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Link 
                  to="/favorites" 
                  className={`hover:text-blue-300 ${location.pathname === '/favorites' ? 'text-blue-300' : ''}`}
                >
                  Favorites
                </Link>
              </motion.li>
              <motion.li
                custom={3}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Link 
                  to="/dashboard" 
                  className={`hover:text-blue-300 ${location.pathname.startsWith('/dashboard') ? 'text-blue-300' : ''}`}
                >
                  Dashboard
                </Link>
              </motion.li>
              <motion.li
                custom={4}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <button onClick={handleLogout} className="hover:text-blue-300">
                  Logout ({user.username})
                </button>
              </motion.li>
            </>
          ) : (
            <>
              <motion.li
                custom={1}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Link 
                  to="/login" 
                  className={`hover:text-blue-300 ${location.pathname === '/login' ? 'text-blue-300' : ''}`}
                >
                  Login
                </Link>
              </motion.li>
              <motion.li
                custom={2}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Link 
                  to="/register" 
                  className={`hover:text-blue-300 ${location.pathname === '/register' ? 'text-blue-300' : ''}`}
                >
                  Register
                </Link>
              </motion.li>
            </>
          )}
        </ul>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-gray-800 px-4 pb-4"
          >
            <ul className="space-y-3">
              <motion.li 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link 
                  to="/" 
                  className={`block hover:text-blue-300 ${location.pathname === '/homepage' ? 'text-blue-300' : ''}`} 
                  onClick={toggleMenu}
                >
                  Home
                </Link>
              </motion.li>
              
              {user ? (
                <>
                  <motion.li
                    custom={4}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <Link 
                      to="/" 
                      className={`hover:text-blue-300 ${location.pathname === '/' ? 'text-blue-300' : ''}`}
                    >
                    Explore Countries
                    </Link>
                  </motion.li>

                  <motion.li 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link 
                      to="/favorites" 
                      className={`block hover:text-blue-300 ${location.pathname === '/favorites' ? 'text-blue-300' : ''}`} 
                      onClick={toggleMenu}
                    >
                      Favorites
                    </Link>
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link 
                      to="/dashboard" 
                      className={`block hover:text-blue-300 ${location.pathname.startsWith('/dashboard') ? 'text-blue-300' : ''}`} 
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button 
                      onClick={() => { handleLogout(); toggleMenu(); }} 
                      className="block w-full text-left hover:text-blue-300"
                    >
                      Logout ({user.username})
                    </button>
                  </motion.li>
                </>
              ) : (
                <>
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link 
                      to="/login" 
                      className={`block hover:text-blue-300 ${location.pathname === '/login' ? 'text-blue-300' : ''}`} 
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link 
                      to="/register" 
                      className={`block hover:text-blue-300 ${location.pathname === '/register' ? 'text-blue-300' : ''}`} 
                      onClick={toggleMenu}
                    >
                      Register
                    </Link>
                  </motion.li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;