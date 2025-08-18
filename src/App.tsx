import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { useUser } from './context/useUser';
import { AdminProvider } from './context/AdminContext';
import { StaffProvider } from './context/StaffContext';
import { useState, useEffect } from 'react';
import campusqLogo from './assets/Professional__CampusQ__Logo_with_Fresh_Aesthetic-removebg-preview.png';

// Pages
import LandingPage from './pages/landing/LandingPage';
import BookingPage from './pages/booking/BookingPage';
import StatusPage from './pages/status/StatusPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import QueueMonitoring from './pages/admin/QueueMonitoring';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import StaffManagement from './pages/admin/StaffManagement';
import ReportsAndAnalytics from './pages/admin/ReportsAndAnalytics';
import SystemSettings from './pages/admin/SystemSettings';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import WelcomePage from './pages/welcome/WelcomePage';
import AdminLayout from './components/layout/AdminLayout';
import StaffLayout from './components/layout/StaffLayout';
import StaffLoginPage from './pages/staff/StaffLoginPage';
import StaffDashboard from './pages/staff/StaffDashboard';
import QueueViewPage from './pages/staff/QueueViewPage';
import ServiceHistoryPage from './pages/staff/ServiceHistoryPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth: boolean;
  requireAdmin?: boolean;
  requireStaff?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth,
  requireAdmin = false,
  requireStaff = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isStaff } = useUser();
  
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAuth && requireAdmin && !isAdmin) {
    return <Navigate to="/welcome" replace />;
  }
  
  if (requireAuth && requireStaff && !isStaff) {
    return <Navigate to="/staff/login" replace />;
  }
  
  if (!requireAuth && isAuthenticated) {
    // Redirect users based on role
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    } else if (isStaff) {
      return <Navigate to="/staff" replace />;
    } else {
      return <Navigate to="/welcome" replace />;
    }
  }
  
  return <>{children}</>;
};

// App Wrapper that provides context
const AppWrapper = () => {
  return (
    <UserProvider>
      <AdminProvider>
        <StaffProvider>
          <AppRoutes />
        </StaffProvider>
      </AdminProvider>
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
          <Route 
            path="/forgot-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <ForgotPasswordPage />
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
          
          {/* Admin Routes - No longer protected */}
          <Route 
            path="/admin" 
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/queues" 
            element={
              <AdminLayout>
                <QueueMonitoring />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/departments" 
            element={
              <AdminLayout>
                <DepartmentManagement />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/staff" 
            element={
              <AdminLayout>
                <StaffManagement />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <AdminLayout>
                <ReportsAndAnalytics />
              </AdminLayout>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <AdminLayout>
                <SystemSettings />
              </AdminLayout>
            } 
          />
          
          {/* Staff Routes */}
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route path="/staff" element={<StaffLayout><StaffDashboard /></StaffLayout>} />
          <Route path="/staff/queue" element={<StaffLayout><QueueViewPage /></StaffLayout>} />
          <Route path="/staff/history" element={<StaffLayout><ServiceHistoryPage /></StaffLayout>} />
          
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
