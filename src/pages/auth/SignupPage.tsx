import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import campusqLogo from '../../assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaUserGraduate, FaSchool } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { setUserInfo, setIsAuthenticated } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = (email: string) => {
    // Basic email validation that also checks for .edu domain
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = regex.test(email);
    
    // For mockup purposes, we'll just check if it contains .edu
    const isEducationalEmail = email.toLowerCase().includes('.edu');
    
    return isValidFormat && isEducationalEmail;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Form validation
    if (!formData.firstName || !formData.lastName || !formData.studentId || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid educational email address (.edu)');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Simulate signup process
    setLoading(true);
    
    setTimeout(() => {
      // Save user data to context
      setUserInfo({
        username: formData.firstName.toLowerCase(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        studentId: formData.studentId
      });
      
      setIsAuthenticated(true);
      setLoading(false);
      navigate('/booking');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-white flex flex-col justify-center items-center p-4 py-10 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute h-96 w-96 rounded-full bg-primary-green/10 -top-48 -right-48 animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute h-80 w-80 rounded-full bg-primary-green/10 -bottom-40 -left-40 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-[radial-gradient(#6DBE45_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute top-1/4 left-1/3 w-48 h-48 rounded-full bg-primary-green/5 animate-pulse" style={{ animationDuration: '15s' }}></div>
      </div>

      <div className={`max-w-lg w-full bg-white rounded-xl shadow-2xl p-8 relative transform transition-all duration-700 ${
        animateIn ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      }`}>
        {/* Card shine effect */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/50 via-white/0 to-primary-green/10 animate-shimmer opacity-50"></div>
        </div>
        
        {/* Logo with animation */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-green/0 via-primary-green/30 to-primary-green/0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
            <img 
              src={campusqLogo} 
              alt="CampusQ" 
              className="h-20 mx-auto mb-4 filter drop-shadow-lg transition-transform duration-500 hover:scale-110" 
            />
          </div>
          
          <h2 className="text-3xl font-bold mb-1 text-primary-green">Create Your Account</h2>
          <p className="text-gray-600 mt-2 flex items-center justify-center gap-1">
            <FaUserGraduate className="text-primary-green" />
            <span>Join CampusQ to start booking services</span>
          </p>
        </div>
        
        {error && (
          <div className="bg-error-red/10 text-error-red p-3 rounded-lg mb-6 text-sm flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="transform transition-all duration-500" style={{ transitionDelay: '100ms' }}>
              <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                <FaUser className="text-primary-green" size={14} />
                <span>First Name*</span>
              </label>
              <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                </div>
              </div>
            </div>
            
            <div className="transform transition-all duration-500" style={{ transitionDelay: '150ms' }}>
              <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                <FaUser className="text-primary-green" size={14} />
                <span>Last Name*</span>
              </label>
              <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="transform transition-all duration-500" style={{ transitionDelay: '200ms' }}>
            <label htmlFor="studentId" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
              <FaIdCard className="text-primary-green" size={14} />
              <span>Student ID*</span>
            </label>
            <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
              <input
                type="text"
                id="studentId"
                name="studentId"
                className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                placeholder="ST12345"
                value={formData.studentId}
                onChange={handleChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="bg-primary-green/10 text-primary-green text-xs font-medium px-2 py-1 rounded">
                  <FaSchool className="inline mr-1" size={12} />
                  STUDENT
                </div>
              </div>
            </div>
          </div>
          
          <div className="transform transition-all duration-500" style={{ transitionDelay: '250ms' }}>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
              <FaEnvelope className="text-primary-green" size={14} />
              <span>Email Address*</span>
            </label>
            <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
              <input
                type="email"
                id="email"
                name="email"
                className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-l-4 border-l-primary-green border-y-gray-300 border-r-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300 rounded-l-lg"
                placeholder="your.email@university.edu"
                value={formData.email}
                onChange={handleChange}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1 ml-1">
              Please use your educational (.edu) email address
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="transform transition-all duration-500" style={{ transitionDelay: '300ms' }}>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                <FaLock className="text-primary-green" size={14} />
                <span>Password*</span>
              </label>
              <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                </div>
              </div>
            </div>
            
            <div className="transform transition-all duration-500" style={{ transitionDelay: '350ms' }}>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2 flex items-center gap-1.5">
                <FaLock className="text-primary-green" size={14} />
                <span>Confirm Password*</span>
              </label>
              <div className="relative group focus-within:shadow-[0_0_0_2px_rgba(109,190,69,0.2)]">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-gray-300 group-focus-within:border-primary-green focus:outline-none transition-all duration-300"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-primary-green/50 group-focus-within:text-primary-green transition-colors duration-300" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6 transform transition-all duration-500" style={{ transitionDelay: '400ms' }}>
            <div className="flex items-center bg-primary-green/5 p-3 rounded-lg border border-primary-green/20">
              <input
                type="checkbox"
                id="terms"
                className="h-5 w-5 text-primary-green focus:ring-primary-green focus:ring-offset-0 border-gray-300 rounded transition-all duration-300"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-primary-green hover:underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-green hover:underline font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary-green hover:bg-dark-green text-white font-bold py-3.5 px-4 rounded-lg 
            transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl 
            transform hover:-translate-y-1 relative overflow-hidden group transform transition-all duration-500"
            style={{ transitionDelay: '450ms' }}
            disabled={loading}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-8 text-center transform transition-all duration-500" style={{ transitionDelay: '500ms' }}>
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-primary-green hover:underline font-medium inline-flex items-center transition-colors duration-300"
            >
              Sign In
              <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </p>
        </div>
        
        <div className="mt-8 text-center transform transition-all duration-500" style={{ transitionDelay: '550ms' }}>
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
  );
};

export default SignupPage;
