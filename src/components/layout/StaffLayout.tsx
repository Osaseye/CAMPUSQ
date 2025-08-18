import { Link, useNavigate } from 'react-router-dom';
import campusqLogo from '../../assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';
import { useUser } from '../../context/useUser';
import { useState } from 'react';
import { FaBars, FaTimes, FaTachometerAlt, FaUsers, FaHistory, FaHome, FaSignOutAlt } from 'react-icons/fa';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout = ({ children }: StaffLayoutProps) => {
  const { userInfo, isAuthenticated, isStaff, logout } = useUser();
  const navigate = useNavigate();
  const displayName = userInfo?.firstName || userInfo?.username || 'Staff';
  const displayInitial = (userInfo?.firstName?.[0] || 'S').toUpperCase();
  const departmentName = userInfo?.department || 'Department';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-light-gray font-poppins flex flex-col md:flex-row">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={handleToggleSidebar}
          className="p-2 rounded-md bg-blue-500 text-white shadow-lg"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>
      
      {/* Sidebar - hidden by default on mobile, visible on toggle */}
      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transform transition-transform duration-300 ease-in-out z-20 bg-dark-charcoal text-white fixed h-screen shadow-xl w-64 md:w-64 md:static`}
      >
        <div className="p-4 flex items-center border-b border-gray-700">
          <img src={campusqLogo} alt="CampusQ Logo" className="h-8 mr-2" />
          <div>
            <h3 className="font-bold text-lg text-blue-500">CampusQ</h3>
            <p className="text-xs">Staff Portal</p>
          </div>
        </div>
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-medium text-blue-400">{departmentName}</h3>
          <p className="text-xs text-gray-400">Staff Dashboard</p>
        </div>
        <nav className="py-4 overflow-y-auto">
          <div className="px-4 py-2 text-xs text-gray-400 uppercase">Queue Management</div>
          <Link 
            to="/staff" 
            className="flex items-center px-4 py-2 text-sm hover:bg-blue-500/20 border-l-4 border-blue-500"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTachometerAlt className="mr-2" /> Dashboard
          </Link>
          <Link 
            to="/staff/queue" 
            className="flex items-center px-4 py-2 text-sm hover:bg-blue-500/20 border-l-4 border-transparent"
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers className="mr-2" /> Current Queue
          </Link>
          <Link 
            to="/staff/history" 
            className="flex items-center px-4 py-2 text-sm hover:bg-blue-500/20 border-l-4 border-transparent"
            onClick={() => setSidebarOpen(false)}
          >
            <FaHistory className="mr-2" /> Service History
          </Link>
          
          <div className="px-4 py-2 mt-6 text-xs text-gray-400 uppercase">Account</div>
          <Link 
            to="/" 
            className="flex items-center px-4 py-2 text-sm hover:bg-blue-500/20 border-l-4 border-transparent"
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome className="mr-2" /> Main Site
          </Link>
          <button 
            onClick={() => {logout(); setSidebarOpen(false);}} 
            className="w-full flex items-center text-left px-4 py-2 text-sm text-error-red hover:bg-error-red/20 border-l-4 border-transparent"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Staff Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-dark-charcoal ml-8 md:ml-0">Staff Dashboard</h1>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative hidden md:block">
                <span className="absolute right-0 top-0 h-2 w-2 bg-blue-500 rounded-full"></span>
                <span className="sr-only">Notifications</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center font-bold">
                  {displayInitial}
                </div>
                <span className="font-medium hidden md:inline">{displayName}</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-3 md:p-6 bg-light-gray">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white p-3 md:p-4 text-center text-xs md:text-sm text-gray-500 border-t">
          &copy; {new Date().getFullYear()} CampusQ. All rights reserved.
        </footer>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default StaffLayout;
