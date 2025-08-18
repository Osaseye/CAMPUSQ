import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import campusqLogo from '../../assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';
import { FaUser, FaLock, FaEnvelope, FaUserShield, FaUserGraduate, FaIdCard } from 'react-icons/fa';
import { useUser } from '../../context/useUser';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUserInfo, setIsAuthenticated, setIsAdmin: setContextIsAdmin } = useUser();
  
  const [email, setEmail] = useState('');
  const [username, setUsernameState] = useState('');
  const [studentId, setStudentId] = useState('');
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
    if (!username || !email || !password || (!isAdmin && !studentId)) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError(isAdmin 
        ? 'Please enter a valid email address' 
        : 'Please enter a valid educational email address (.edu)'
      );
      return;
    }
    
    // Validate matric number format for non-admin users (format: XX/XXXX)
    if (!isAdmin && (!studentId.match(/^\d{2}\/\d{4}$/))) {
      setError('Please enter a valid matric number (format: 22/0206)');
      return;
    }
    
    // Simulate login process
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      
      // Save user data to context
      setUserInfo({
        username: username,
        firstName: username, // In a real app, we would get more info from the backend
        lastName: 'User',
        email: email,
        studentId: isAdmin ? undefined : studentId || `${Math.floor(20 + Math.random() * 5)}/${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`
      });
      setIsAuthenticated(true);
      setContextIsAdmin(isAdmin);
      
      // Route based on the selected user type
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/welcome');
      }
    }, 1000);
  };

  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-charcoal to-primary-green flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        {isAdmin ? (
          // Admin background elements
          <>
            <div className="absolute h-96 w-96 rounded-full bg-white/10 top-1/4 -left-48 animate-pulse" style={{ animationDuration: '10s' }}></div>
            <div className="absolute h-64 w-64 rounded-full bg-white/10 bottom-1/4 -right-32 animate-pulse" style={{ animationDuration: '15s' }}></div>
            <div className="absolute h-64 w-64 -rotate-45 bg-gradient-to-r from-white/10 to-transparent top-1/4 right-1/3 animate-spin" style={{ animationDuration: '30s' }}></div>
          </>
        ) : (
          // Student background elements
          <>
            <div className="absolute h-96 w-96 rounded-full bg-white/10 -top-48 -right-48 animate-pulse" style={{ animationDuration: '12s' }}></div>
            <div className="absolute h-80 w-80 rounded-full bg-white/10 -bottom-40 -left-40 animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          </>
        )}
      </div>

      <div className={`max-w-4xl w-full bg-white rounded-xl shadow-2xl relative transform transition-all duration-700 ${
        animateIn ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      }`}>
        {/* Card shine effect */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/50 via-white/0 to-primary-green/10 animate-shimmer opacity-50"></div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 bg-primary-green rounded-l-xl hidden md:flex md:flex-col md:justify-center md:items-center">
            <div className="text-white text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                <img 
                  src={campusqLogo} 
                  alt="CampusQ" 
                  className="h-24 mx-auto mb-4 filter drop-shadow-lg transition-transform duration-500 hover:scale-110" 
                />
              </div>
              
              <h1 className="text-4xl font-bold mb-4">CampusQ</h1>
              <p className="text-white/80 text-lg mb-8">Streamline your campus experience with efficient queue management</p>
              
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <p className="text-white font-medium mb-3">Why Use CampusQ?</p>
                <ul className="space-y-2 text-sm text-white/90 text-left">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save time with virtual queuing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Track your position in real-time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Get notified when it's your turn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Access all campus services in one place</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 p-8">
            {/* Logo for mobile view */}
            <div className="mb-8 md:hidden">
              <div className="bg-primary-green rounded-lg p-6 mb-6 flex justify-center">
              <img 
                src={campusqLogo} 
                alt="CampusQ" 
                className="h-20 filter drop-shadow-lg transition-transform duration-500 hover:scale-110" 
              />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-2 transition-colors duration-500 ${
                isAdmin ? 'text-dark-charcoal' : 'text-primary-green'
              }`}>
                {isAdmin ? 'Administrator Access' : 'Welcome Back'}
              </h2>
              <p className={`mt-2 ${isAdmin ? 'text-primary-green' : 'text-gray-600'}`}>
                {isAdmin ? 'Secure login for system administrators' : 'Sign in to your CampusQ account'}
              </p>
            </div>

            {/* Toggle between Student and Admin login */}
            <div className="flex justify-center mb-8 bg-light-gray rounded-lg p-1 shadow-inner">
              <button
                onClick={() => setIsAdmin(false)}
                className={`flex-1 py-3 px-4 rounded-md text-center transition-all duration-300 flex items-center justify-center gap-2 ${
                  !isAdmin 
                    ? 'bg-white text-primary-green font-medium shadow-sm transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaUserGraduate className={!isAdmin ? 'text-primary-green' : 'text-gray-500'} />
                <span>Student</span>
              </button>
              <button
                onClick={() => setIsAdmin(true)}
                className={`flex-1 py-3 px-4 rounded-md text-center transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAdmin 
                    ? 'bg-white text-dark-charcoal font-medium shadow-sm transform scale-105' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaUserShield className={isAdmin ? 'text-dark-charcoal' : 'text-gray-500'} />
                <span>Administrator</span>
              </button>
            </div>
            
            {error && (
              <div className="bg-error-red/10 text-error-red p-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5 transform transition-all duration-500" style={{ transitionDelay: '150ms' }}>
                <label htmlFor="username" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                  <FaUser className="text-primary-green" size={14} />
                  <span>Username</span>
                </label>
                <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                  <input
                    type="text"
                    id="username"
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsernameState(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                  </div>
                </div>
              </div>
              
              <div className="mb-5 transform transition-all duration-500" style={{ transitionDelay: '300ms' }}>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                  <FaEnvelope className="text-primary-green" size={14} />
                  <span>Email Address</span>
                </label>
                <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-l-4 border-l-primary-green border-y-gray-300 border-r-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300 rounded-l-lg"
                    placeholder={isAdmin ? "admin@university.edu" : "your.email@university.edu"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                  </div>
                  {isAdmin && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="bg-primary-green text-white text-xs font-medium px-2 py-1 rounded">
                        ADMIN
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-1 ml-1">
                  {isAdmin 
                    ? "Administrator access requires special credentials" 
                    : "Please use your educational (.edu) email address"}
                </p>
              </div>
              
              {!isAdmin && (
                <div className="mb-5 transform transition-all duration-500" style={{ transitionDelay: '375ms' }}>
                  <label htmlFor="studentId" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                    <FaIdCard className="text-primary-green" size={14} />
                    <span>Matric Number</span>
                  </label>
                  <div className={`relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]`}>
                    <input
                      type="text"
                      id="studentId"
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300`}
                      placeholder="22/0206"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mb-5 transform transition-all duration-500" style={{ transitionDelay: '450ms' }}>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-gray-700 font-medium flex items-center gap-1.5">
                    <FaLock className="text-primary-green" size={14} />
                    <span>Password</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary-green hover:text-dark-green hover:underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                  </div>
                </div>
              </div>
          
              <button
                type="submit"
                className="w-full bg-primary-green hover:bg-dark-green text-white font-bold py-3.5 px-4 rounded-lg 
                transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl 
                transform hover:-translate-y-1 relative overflow-hidden group"
                disabled={loading}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'Signing In...' : isAdmin ? 'Sign In as Administrator' : 'Sign In'}
              </button>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-primary-green border-gray-300 rounded focus:ring-primary-green" 
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
              </div>
            </form>
            
            <div className="mt-8 text-center transform transition-all duration-500" style={{ transitionDelay: '600ms' }}>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-primary-green hover:underline font-medium inline-flex items-center transition-colors duration-300"
                >
                  Create Account
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center transform transition-all duration-500" style={{ transitionDelay: '700ms' }}>
              <p className="text-gray-600">
                Are you a staff member?{' '}
                <Link 
                  to="/staff/login" 
                  className="text-blue-500 hover:underline font-medium inline-flex items-center transition-colors duration-300"
                >
                  Staff Login
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </p>
            </div>
            
            <div className="mt-8 text-center transform transition-all duration-500" style={{ transitionDelay: '750ms' }}>
              <Link 
                to="/" 
                className="text-gray-500 hover:text-primary-green text-sm flex items-center justify-center gap-1 mx-auto w-fit"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
