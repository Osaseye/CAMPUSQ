import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import campusqLogo from '../../assets/Campusq-removebg-preview.png';
import { useUser } from '../../context/UserContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUsername, setIsAuthenticated, setIsAdmin: setContextIsAdmin } = useUser();
  
  const [email, setEmail] = useState('');
  const [username, setUsernameState] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const validateEmail = (email: string) => {
    // Basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = regex.test(email);
    
    // For admin accounts, we don't require .edu emails
    if (isAdmin) {
      return isValidFormat;
    }
    
    // For student accounts, we require .edu domain
    const isEducationalEmail = email.toLowerCase().includes('.edu');
    return isValidFormat && isEducationalEmail;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError(isAdmin 
        ? 'Please enter a valid email address' 
        : 'Please enter a valid educational email address (.edu)'
      );
      return;
    }
    
    // Simulate login process
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      
      // Save user data to context
      setUsername(username);
      setIsAuthenticated(true);
      setContextIsAdmin(isAdmin);
      
      // Route based on the selected user type
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/booking');
      }
    }, 1000);
  };

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-gradient-to-br from-dark-charcoal to-dark-green' : 'bg-light-gray'} flex flex-col justify-center items-center p-4`}>
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <img src={campusqLogo} alt="CampusQ" className="h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-dark-charcoal">
            {isAdmin ? 'Administrator Access' : 'Welcome Back'}
          </h2>
          <p className={`mt-2 ${isAdmin ? 'text-primary-green' : 'text-gray-600'}`}>
            {isAdmin ? 'Secure login for system administrators' : 'Sign in to your CampusQ account'}
          </p>
        </div>

        {/* Toggle between Student and Admin login */}
        <div className="flex justify-center mb-8 bg-light-gray rounded-lg p-1">
          <button
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-2 rounded-md text-center transition-all ${
              !isAdmin 
                ? 'bg-white text-primary-green font-medium shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-2 rounded-md text-center transition-all ${
              isAdmin 
                ? 'bg-white text-primary-green font-medium shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Administrator
          </button>
        </div>
        
        {error && (
          <div className="bg-error-red/10 text-error-red p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsernameState(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <div className={`relative ${isAdmin ? 'border-l-4 border-dark-charcoal rounded-l-lg' : ''}`}>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder={isAdmin ? "admin@university.edu" : "your.email@university.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {isAdmin && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="bg-dark-charcoal text-white text-xs font-medium px-2 py-1 rounded">
                    ADMIN
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-1">
              {isAdmin 
                ? "Administrator access requires special credentials" 
                : "Please use your educational (.edu) email address"}
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <a href="#" className="text-sm text-primary-green hover:underline">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className={`w-full ${isAdmin ? 'bg-dark-charcoal hover:bg-gray-800' : 'bg-primary-green hover:bg-dark-green'} text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Signing In...' : isAdmin ? 'Sign In as Administrator' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-green hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-500 hover:text-primary-green text-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
