import { Link } from 'react-router-dom';
import campusqLogo from '../../assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';
import { useUser } from '../../context/UserContext';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaChevronRight } from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { userInfo, isAuthenticated, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const displayName = userInfo?.firstName || userInfo?.username || 'User';
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('mobile-menu');
      if (mobileMenuOpen && menu && !menu.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);
  
  return (
    <div className="min-h-screen bg-light-gray font-poppins flex flex-col">
      {/* Header/Navbar */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-charcoal/95 backdrop-blur-sm shadow-lg py-2' : 'bg-dark-charcoal py-4'
      } text-white`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group z-50">
            <img 
              src={campusqLogo} 
              alt="CampusQ Logo" 
              className={`${scrolled ? 'h-10' : 'h-12'} transition-all duration-300 transform group-hover:scale-110 group-hover:brightness-110 group-hover:drop-shadow-[0_0_8px_rgba(109,190,69,0.6)]`}
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            {isAuthenticated && (
              <>
                <Link 
                  to="/booking" 
                  className="hover:text-primary-green transition-colors relative group"
                >
                  Book a Slot
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-green group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/status" 
                  className="hover:text-primary-green transition-colors relative group"
                >
                  Queue Status
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-green group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="text-white">
                  Welcome, <span className="font-semibold text-primary-green">{displayName}</span>
                </div>
                <button 
                  onClick={logout} 
                  className="text-white hover:text-primary-green transition-colors relative group"
                >
                  Logout
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-green group-hover:w-full transition-all duration-300"></span>
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-primary-green transition-colors relative group"
                >
                  Login
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-green group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-primary-green hover:bg-dark-green text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden z-50">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FaTimes size={24} className="animate-fadeIn" />
              ) : (
                <FaBars size={24} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div 
          id="mobile-menu"
          className={`fixed inset-0 bg-dark-charcoal z-40 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden flex flex-col`}
          style={{ top: '60px' }}
        >
          <div className="flex flex-col p-6 space-y-6 mt-4">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 border-b border-primary-green/30">
                  <div className="text-white text-lg">
                    Welcome, <span className="font-semibold text-primary-green">{displayName}</span>
                  </div>
                </div>
                <Link 
                  to="/booking" 
                  className="flex items-center justify-between text-white hover:text-primary-green transition-all px-4 py-3 hover:bg-primary-green/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Book a Slot</span>
                  <FaChevronRight className="opacity-70" />
                </Link>
                <Link 
                  to="/status" 
                  className="flex items-center justify-between text-white hover:text-primary-green transition-all px-4 py-3 hover:bg-primary-green/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Queue Status</span>
                  <FaChevronRight className="opacity-70" />
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-white hover:text-primary-green transition-all px-4 py-3 hover:bg-primary-green/10 rounded-lg flex items-center justify-between"
                >
                  <span>Logout</span>
                  <FaChevronRight className="opacity-70" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center justify-between text-white hover:text-primary-green transition-all px-4 py-3 hover:bg-primary-green/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Login</span>
                  <FaChevronRight className="opacity-70" />
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center justify-between bg-primary-green text-white px-4 py-3 rounded-lg hover:bg-dark-green transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Sign Up</span>
                  <FaChevronRight className="opacity-70" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20"></div>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark-charcoal text-white py-10 mt-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center mb-4 group">
                <img 
                  src={campusqLogo} 
                  alt="CampusQ Logo" 
                  className="h-10 mr-2 transition-all duration-300 group-hover:brightness-110" 
                />
                <div>
                  <h3 className="font-bold text-lg text-primary-green">CampusQ</h3>
                  <p className="text-sm">Smarter Queues, Better Campus Life</p>
                </div>
              </div>
              <p className="text-sm text-white/70 text-center md:text-left">
                The most efficient queue management system designed specifically for campus services.
              </p>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="text-primary-green font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-white/70 hover:text-primary-green transition-colors relative inline-block group">
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-green group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-white/70 hover:text-primary-green transition-colors relative inline-block group">
                    Login
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-green group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-white/70 hover:text-primary-green transition-colors relative inline-block group">
                    Sign Up
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-green group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="text-white/70 hover:text-primary-green transition-colors relative inline-block group">
                    Book a Slot
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-green group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="text-primary-green font-semibold mb-4 text-lg">Connect With Us</h4>
              <p className="text-sm text-white/70 mb-4">
                Have questions or feedback about CampusQ? We'd love to hear from you!
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <a href="#" className="text-white/70 hover:text-primary-green transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-primary-green transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-primary-green transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/70 mb-4 md:mb-0">&copy; {new Date().getFullYear()} CampusQ. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-white/70">
              <a href="#" className="hover:text-primary-green transition-colors">Privacy Policy</a>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:text-primary-green transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
