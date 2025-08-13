import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import campusqLogo from '../../assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';
import { useUser } from '../../context/UserContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { userInfo, isAuthenticated, isAdmin, logout } = useUser();
  const navigate = useNavigate();
  const displayName = userInfo?.firstName || userInfo?.username || 'Admin';
  const displayInitial = (userInfo?.firstName?.[0] || 'A').toUpperCase();
  
  // Redirect if not authenticated as admin
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  return (
    <div className="min-h-screen bg-light-gray font-poppins flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-charcoal text-white h-screen fixed shadow-xl">
        <div className="p-4 flex items-center border-b border-gray-700">
          <img src={campusqLogo} alt="CampusQ Logo" className="h-8 mr-2" />
          <div>
            <h3 className="font-bold text-lg text-primary-green">CampusQ</h3>
            <p className="text-xs">Admin Panel</p>
          </div>
        </div>
        <nav className="py-4">
          <div className="px-4 py-2 text-xs text-gray-400 uppercase">Management</div>
          <Link 
            to="/admin" 
            className="block px-4 py-2 text-sm hover:bg-primary-green/20 border-l-4 border-primary-green"
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/queues" 
            className="block px-4 py-2 text-sm hover:bg-primary-green/20 border-l-4 border-transparent"
          >
            Queue Management
          </Link>
          <Link 
            to="/admin/departments" 
            className="block px-4 py-2 text-sm hover:bg-primary-green/20 border-l-4 border-transparent"
          >
            Departments
          </Link>
          <Link 
            to="/admin/users" 
            className="block px-4 py-2 text-sm hover:bg-primary-green/20 border-l-4 border-transparent"
          >
            Users
          </Link>
          
          <div className="px-4 py-2 mt-6 text-xs text-gray-400 uppercase">Account</div>
          <Link 
            to="/admin/settings" 
            className="block px-4 py-2 text-sm hover:bg-primary-green/20 border-l-4 border-transparent"
          >
            Settings
          </Link>
          <Link 
            to="/" 
            className="block px-4 py-2 text-sm hover:bg-primary-green/20 border-l-4 border-transparent"
          >
            Public Site
          </Link>
          <button 
            onClick={logout} 
            className="w-full text-left px-4 py-2 text-sm text-error-red hover:bg-error-red/20 border-l-4 border-transparent"
          >
            Logout
          </button>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-dark-charcoal">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="absolute right-0 top-0 h-2 w-2 bg-primary-green rounded-full"></span>
                <span className="sr-only">Notifications</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-green rounded-full text-white flex items-center justify-center font-bold">
                  {displayInitial}
                </div>
                <span className="font-medium">{displayName}</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-6 bg-light-gray">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white p-4 text-center text-sm text-gray-500 border-t">
          &copy; {new Date().getFullYear()} CampusQ. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
