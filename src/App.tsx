import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { useState, useEffect } from 'react';
import campusqLogo from './assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';

// Pages
import LandingPage from './pages/landing/LandingPage';
import BookingPage from './pages/booking/BookingPage';
import StatusPage from './pages/status/StatusPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Preloader */}
      <div className={`preloader ${!loading ? 'hidden' : ''}`}>
        <img src={campusqLogo} alt="CampusQ" className="preloader-logo" />
      </div>
      
      <UserProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          
          {/* Student Routes */}
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/status" element={<StatusPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </UserProvider>
    </>
  );
}

export default App
