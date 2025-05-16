import React from 'react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Username and password are required');
      return;
    }
    
    login({ username: formData.username });
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" data-testid="login-form">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            data-testid="username-input"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            placeholder="******************"
            value={formData.password}
            onChange={handleChange}
            data-testid="password-input"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            data-testid="submit-button"
          >
            Sign In
          </button>
          <Link className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" to="/register">
            Create an account
          </Link>
        </div>
      </form>
      
      <p className="text-center text-gray-600 text-xs">
        Note: For demo purposes, any username and password will work.
      </p>
    </div>
  );
};

export default Login;
// import React from 'react';
// import '@testing-library/jest-dom';
// import { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';


// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Get the page user was trying to access before being redirected to login
//   const from = location.state?.from?.pathname || '/';

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');
    
//     // Simple validation
//     if (!formData.username || !formData.password) {
//       setError('Username and password are required');
//       return;
//     }
    
//     // For demonstration purposes, we're using a very simple authentication
//     // In a real app, you would call a backend API to authenticate the user
    
//     // Simulate a successful login
//     // Mock successful login with the entered username
//     login({ username: formData.username });
    
//     // Navigate to the page user was trying to access, or home if none
//     navigate(from, { replace: true });
//   };

//   return (
//     <div className="max-w-md mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
//           <p>{error}</p>
//         </div>
//       )}
      
//       <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
//             Username
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="username"
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//             Password
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="password"
//             type="password"
//             name="password"
//             placeholder="******************"
//             value={formData.password}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             type="submit"
//           >
//             Sign In
//           </button>
//           <Link className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" to="/register">
//             Create an account
//           </Link>
//         </div>
//       </form>
      
//       {/* Message for demo purposes */}
//       <p className="text-center text-gray-600 text-xs">
//         Note: For demo purposes, any username and password will work.
//       </p>
//     </div>
//   );
// };

// export default Login;