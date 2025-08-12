import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useStore } from '../../data/store';
import { useUser } from '../../context/UserContext';

const StatusPage = () => {
  const navigate = useNavigate();
  const { currentBooking, cancelBooking } = useStore();
  const { username, isAuthenticated } = useUser();
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds
  const [showNotification, setShowNotification] = useState(false);
  
  // Redirect to login page if not authenticated, or to booking page if no current booking
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!currentBooking) {
      navigate('/booking');
    }
  }, [isAuthenticated, currentBooking, navigate]);
  
  // Simulate countdown timer
  useEffect(() => {
    if (!currentBooking) return;
    
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    
    // Show notification when close to turn
    setTimeout(() => {
      setShowNotification(true);
    }, 5000); // Show after 5 seconds for demo
    
    return () => clearInterval(timer);
  }, [currentBooking]);
  
  // Format remaining time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleCancelBooking = () => {
    if (currentBooking) {
      cancelBooking(currentBooking.id);
      navigate('/');
    }
  };
  
  if (!currentBooking) {
    return <div>Loading...</div>;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Notification Alert */}
          {showNotification && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Almost there!</strong> You're 3 spots away from your turn!
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setShowNotification(false)}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Queue Status Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-dark-charcoal text-white p-6 text-center">
              <h2 className="text-2xl font-bold">Queue Status</h2>
              {username && (
                <p className="text-primary-green font-medium mt-1">
                  Hello {username}!
                </p>
              )}
              <p className="text-gray-300 mt-1">
                {currentBooking.department} - {currentBooking.timeSlot}
              </p>
            </div>
            
            {/* Queue Position */}
            <div className="py-12 px-6 text-center">
              <h3 className="text-gray-500 text-xl mb-2">Your Position</h3>
              <div className="text-primary-green text-7xl font-bold mb-8">
                #{currentBooking.queueNumber}
              </div>
              
              <div className="bg-light-gray rounded-lg p-6 mb-8">
                <h3 className="text-gray-700 text-xl mb-3">Estimated Wait Time</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-dark-charcoal">
                    {formatTime(remainingTime)}
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-gray-700 text-xl mb-2">Your Information</h3>
                <p className="text-gray-600">
                  <strong>Name:</strong> {currentBooking.name}
                </p>
                <p className="text-gray-600">
                  <strong>Student ID:</strong> {currentBooking.studentId}
                </p>
              </div>
              
              <button
                onClick={handleCancelBooking}
                className="bg-error-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Cancel Booking
              </button>
            </div>
          </div>
          
          {/* Tips */}
          <div className="mt-8 bg-light-gray rounded-lg p-6">
            <h3 className="font-bold text-lg text-dark-charcoal mb-3">Tips:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Keep an eye on your position in the queue</li>
              <li>Make sure to arrive 5 minutes before your estimated time</li>
              <li>Have your student ID ready when it's your turn</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StatusPage;
