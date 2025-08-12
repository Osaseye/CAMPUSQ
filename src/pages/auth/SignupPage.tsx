import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import campusqLogo from '../../assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';

const SignupPage = () => {
  const navigate = useNavigate();
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
      setLoading(false);
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-light-gray flex flex-col justify-center items-center p-4 py-10">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <img src={campusqLogo} alt="CampusQ" className="h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-dark-charcoal">Create Account</h2>
          <p className="text-gray-600 mt-2">Join CampusQ to start booking services</p>
        </div>
        
        {error && (
          <div className="bg-error-red/10 text-error-red p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="studentId" className="block text-gray-700 font-medium mb-2">
              Student ID*
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              placeholder="ST12345"
              value={formData.studentId}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              placeholder="your.email@university.edu"
              value={formData.email}
              onChange={handleChange}
            />
            <p className="text-gray-500 text-xs mt-1">
              Please use your educational (.edu) email address
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password*
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm Password*
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-primary-green hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary-green hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary-green hover:bg-dark-green text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-green hover:underline font-medium">
              Sign In
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

export default SignupPage;
