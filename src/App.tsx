import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { useState, useEffect } from 'react';
import campusqLogo from './assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';

// Pages
import LandingPage from './pages/landing/LandingPage';
import BookingPage from './pages/booking/BookingPage';
import StatusPage from './pages/status/StatusPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import WelcomePage from './pages/welcome/WelcomePage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth,
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useUser();
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAuth && requireAdmin && !isAdmin) {
    return <Navigate to="/welcome" replace />;
  }
  
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  
  return <>{children}</>;
};

// App Wrapper that provides context
const AppWrapper = () => {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

// Main App with routes
function AppRoutes() {
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
      
      <Router>
        <Routes>
          {/* Public Routes - accessible when logged out */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute requireAuth={false}>
                <LandingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <ProtectedRoute requireAuth={false}>
                <SignupPage />
              </ProtectedRoute>
            } 
          />
        
          {/* Authenticated User Routes */}
          <Route 
            path="/welcome" 
            element={
              <ProtectedRoute requireAuth={true}>
                <WelcomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking" 
            element={
              <ProtectedRoute requireAuth={true}>
                <BookingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/status" 
            element={
              <ProtectedRoute requireAuth={true}>
                <StatusPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

function App() {
  return <AppWrapper />;
}

export default App;
