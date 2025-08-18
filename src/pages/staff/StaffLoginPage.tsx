import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/useUser';
import campusqLogo from '../../assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaBriefcase, FaUserTie, FaBuilding } from 'react-icons/fa';

const StaffLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Financial Aid');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  const { loginStaff } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password || !department) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Mock login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the login function from UserContext with department
      const success = await loginStaff(email, password, department);
      
      if (success) {
        navigate('/staff');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute h-96 w-96 rounded-full bg-white/10 top-1/4 -left-48 animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute h-64 w-64 rounded-full bg-white/10 bottom-1/4 -right-32 animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute h-64 w-64 -rotate-45 bg-gradient-to-r from-white/10 to-transparent top-1/4 right-1/3 animate-spin" style={{ animationDuration: '30s' }}></div>
      </div>

      <div className={`max-w-4xl w-full bg-white rounded-xl shadow-2xl relative transform transition-all duration-700 ${
        animateIn ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      }`}>
        {/* Card shine effect */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/50 via-white/0 to-blue-400/10 animate-shimmer opacity-50"></div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 bg-blue-600 rounded-l-xl hidden md:flex md:flex-col md:justify-center md:items-center">
            <div className="text-white text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
                <img 
                  src={campusqLogo} 
                  alt="CampusQ" 
                  className="h-24 mx-auto mb-4 filter drop-shadow-lg transition-transform duration-500 hover:scale-110" 
                />
              </div>
              
              <h1 className="text-4xl font-bold mb-4">Staff Portal</h1>
              <p className="text-white/80 text-lg mb-8">Manage your department queues efficiently</p>
              
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                <p className="text-white font-medium mb-3">Staff Portal Features</p>
                <ul className="space-y-2 text-sm text-white/90 text-left">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Manage department queues</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Serve students efficiently</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Track service history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Generate service reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 p-8">
            {/* Logo for mobile view */}
            <div className="mb-8 md:hidden">
              <div className="bg-blue-600 rounded-lg p-6 mb-6 flex justify-center">
                <img 
                  src={campusqLogo} 
                  alt="CampusQ" 
                  className="h-20 filter drop-shadow-lg transition-transform duration-500 hover:scale-110" 
                />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 transition-colors duration-500 text-blue-600">
                Staff Login
              </h2>
              <p className="mt-2 text-gray-600">
                Sign in to manage your department queue
              </p>
            </div>

            {errorMessage && (
              <div className="bg-error-red/10 text-error-red p-3 rounded-lg mb-6 text-sm">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="transform transition-all duration-500" style={{ transitionDelay: '150ms' }}>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                  <FaEnvelope className="text-blue-600" size={14} />
                  <span>Email or Username</span>
                </label>
                <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(37,99,235,0.2)]">
                  <input
                    type="text"
                    id="email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-l-4 border-l-blue-600 border-y-gray-300 border-r-gray-300 group-focus-within:border-blue-600 focus:outline-none transition-all duration-300 rounded-l-lg"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-blue-600/50 group-focus-within:text-blue-600 transition-colors duration-300" />
                  </div>
                </div>
              </div>
              
              <div className="transform transition-all duration-500" style={{ transitionDelay: '300ms' }}>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-gray-700 font-medium flex items-center gap-1.5">
                    <FaLock className="text-blue-600" size={14} />
                    <span>Password</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(37,99,235,0.2)]">
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-blue-600 focus:outline-none transition-all duration-300"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-blue-600/50 group-focus-within:text-blue-600 transition-colors duration-300" />
                  </div>
                </div>
              </div>
              
              <div className="transform transition-all duration-500" style={{ transitionDelay: '450ms' }}>
                <label htmlFor="department" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                  <FaBuilding className="text-blue-600" size={14} />
                  <span>Department</span>
                </label>
                <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(37,99,235,0.2)]">
                  <select
                    id="department"
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-blue-600 focus:outline-none transition-all duration-300 bg-white"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="Financial Aid">Financial Aid</option>
                    <option value="Registration">Registration</option>
                    <option value="Academic Advising">Academic Advising</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Student Affairs">Student Affairs</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-blue-600/50 group-focus-within:text-blue-600 transition-colors duration-300" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600" 
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg 
                transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl 
                transform hover:-translate-y-1 relative overflow-hidden group mt-6"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaUserTie className="mr-2" />
                )}
                {isLoading ? 'Signing In...' : 'Sign In as Staff'}
              </button>
            </form>
            
            <div className="mt-8 text-center transform transition-all duration-500" style={{ transitionDelay: '600ms' }}>
              <p className="text-gray-600">
                For student access, use the{' '}
                <Link 
                  to="/" 
                  className="text-blue-600 hover:underline font-medium inline-flex items-center transition-colors duration-300"
                >
                  Main Portal
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center transform transition-all duration-500" style={{ transitionDelay: '700ms' }}>
              <p className="text-gray-600">
                For admin access, use the{' '}
                <Link 
                  to="/login" 
                  className="text-primary-green hover:underline font-medium inline-flex items-center transition-colors duration-300"
                >
                  Admin Login
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </p>
            </div>
            
            <div className="mt-8 text-center transform transition-all duration-500" style={{ transitionDelay: '750ms' }}>
              <Link 
                to="/" 
                className="text-gray-500 hover:text-blue-600 text-sm flex items-center justify-center gap-1 mx-auto w-fit"
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

export default StaffLoginPage;
