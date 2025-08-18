import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useStore } from '../../data/store';
import { useUser } from '../../context/useUser';
import { FaBell, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const StatusPage = () => {
  const navigate = useNavigate();
  const { cancelBooking } = useStore();
  const { userInfo, isAuthenticated, userQueues, availableDepartments } = useUser();
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [showNotification, setShowNotification] = useState(false);

  // Get selected queue or default to first one
  const selectedQueue = selectedQueueId 
    ? userQueues.find(q => q.id === selectedQueueId)
    : userQueues[0];
  
  // Get department for this queue
  const queueDepartment = selectedQueue
    ? availableDepartments.find(d => d.id === selectedQueue.departmentId)
    : null;
  
  // Redirect to login page if not authenticated, or to booking page if no queues
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (userQueues.length === 0) {
      navigate('/booking');
    } else if (!selectedQueueId && userQueues.length > 0) {
      // Select first queue by default
      setSelectedQueueId(userQueues[0].id);
    }
  }, [isAuthenticated, userQueues, navigate, selectedQueueId]);
  
  // Calculate and set remaining time based on position and estimated time per person
  useEffect(() => {
    if (selectedQueue) {
      // Calculate based on position and estimated time per person
      const timeInSeconds = selectedQueue.currentPosition * selectedQueue.estimatedTimeMinutes * 60;
      setRemainingTime(timeInSeconds);
      
      // Show notification if you're close to your turn (3 positions or fewer)
      if (selectedQueue.currentPosition <= 3) {
        setShowNotification(true);
      }
    }
  }, [selectedQueue]);
  
  // Set up countdown timer
  useEffect(() => {
    // Start countdown timer that decreases by 1 second
    const intervalId = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Format remaining time as MM:SS or HH:MM:SS
  const formatTime = (seconds: number) => {
    if (seconds < 0) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };
  
  const handleCancelQueue = (queueId: string) => {
    // In a real app this would call an API to remove the user from the queue
    
    // First, remove from user context
    leaveQueue(queueId);
    
    // Also remove from store for dashboard sync
    cancelBooking(queueId);
    
    // Navigate to welcome page
    navigate('/welcome');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  if (!selectedQueue) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex items-center justify-center min-h-[80vh]">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-6xl mb-4 inline-block"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              🔍
            </motion.div>
            <motion.h2 
              className="text-2xl font-bold text-dark-charcoal mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              No Active Queues
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              You are not currently in any queues.
            </motion.p>
            <motion.button
              onClick={() => navigate('/booking')}
              className="bg-primary-green hover:bg-dark-green text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Join a Queue
              </span>
            </motion.button>
          </motion.div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            className="text-3xl font-bold mb-6 text-dark-charcoal"
            variants={itemVariants}
          >
            Queue Status
          </motion.h1>

          {/* Queue Selection (if the user has multiple queues) */}
          {userQueues.length > 1 && (
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-4 mb-6"
              variants={itemVariants}
            >
              <h2 className="font-semibold text-gray-700 mb-3">Select a Queue:</h2>
              <div className="flex flex-wrap gap-2">
                {userQueues.map((queue, index) => {
                  const dept = availableDepartments.find(d => d.id === queue.departmentId);
                  return (
                    <motion.button
                      key={queue.id}
                      onClick={() => setSelectedQueueId(queue.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        queue.id === selectedQueueId
                          ? 'bg-primary-green text-white shadow-md'
                          : 'bg-light-gray text-gray-700 hover:bg-gray-200'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (index * 0.05) }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {dept?.logoUrl} {queue.name}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Notification Alert */}
          <AnimatePresence>
            {showNotification && selectedQueue && selectedQueue.currentPosition <= 3 && (
              <motion.div 
                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg shadow-md"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="flex items-center">
                  <motion.div 
                    className="flex-shrink-0"
                    animate={{ rotate: [0, 15, -15, 15, -15, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatDelay: 2,
                      duration: 0.8 
                    }}
                  >
                    <FaBell className="text-yellow-400 text-xl" />
                  </motion.div>
                  <div className="ml-3">
                    <p className="font-medium text-yellow-800">
                      Almost there! You're {selectedQueue.currentPosition === 1 
                        ? "next in line" 
                        : `${selectedQueue.currentPosition} ${selectedQueue.currentPosition === 1 ? 'spot' : 'spots'} away from your turn`}!
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please make sure you're ready when your number is called.
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <motion.button
                      onClick={() => setShowNotification(false)}
                      className="text-yellow-500 hover:text-yellow-700"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTimes />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Status Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side: Queue Position */}
            <motion.div 
              className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden"
              variants={itemVariants}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-green to-dark-green text-white p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{queueDepartment?.logoUrl}</span>
                      <span>{selectedQueue.name}</span>
                    </h2>
                    <p className="text-white/80 mt-1">
                      {queueDepartment?.name}
                    </p>
                  </div>
                  <div className="bg-white/20 rounded-lg px-3 py-2 mt-3 md:mt-0">
                    <span className="text-sm font-medium">
                      Total in Queue: {selectedQueue.totalPeople}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Queue Position */}
              <div className="py-6 md:py-8 px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
                  <div className="text-center flex-1 w-full">
                    <h3 className="text-gray-500 text-base md:text-lg mb-2">Your Position</h3>
                    <div className="text-primary-green text-5xl md:text-7xl font-bold relative inline-flex items-center justify-center">
                      <div className="absolute inset-0 bg-primary-green/10 rounded-full transform scale-150 animate-pulse" style={{ animationDuration: '2s' }}></div>
                      <span className="relative z-10">{selectedQueue.currentPosition}</span>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                      {selectedQueue.currentPosition === 1 
                        ? "You're next!" 
                        : `${selectedQueue.currentPosition === 2 ? 'Almost there!' : `${selectedQueue.currentPosition - 1} people ahead of you`}`}
                    </p>
                  </div>
                  
                  <div className="h-px w-1/2 md:h-24 md:w-px bg-gray-200 my-4 md:my-0"></div>
                  
                  <div className="text-center flex-1 w-full">
                    <h3 className="text-gray-500 text-base md:text-lg mb-2">Estimated Wait</h3>
                    <div className="text-dark-charcoal text-3xl md:text-4xl font-bold">
                      <div className="inline-flex items-center justify-center w-auto h-auto bg-light-gray rounded-xl p-3 md:p-4">
                        {formatTime(remainingTime)}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                      {remainingTime > 3600 
                        ? 'Consider coming back later' 
                        : remainingTime > 900 
                          ? 'Time to grab a coffee?' 
                          : 'Please stay nearby'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 md:mt-10 pt-5 md:pt-6 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="text-gray-600 text-sm md:text-base text-center md:text-left">
                      <p className="mb-1"><strong>Average Time per Person:</strong> {selectedQueue.estimatedTimeMinutes} mins</p>
                      <p><strong>Queue Progress:</strong> {Math.round(((selectedQueue.totalPeople - selectedQueue.currentPosition) / selectedQueue.totalPeople) * 100)}% complete</p>
                    </div>
                    
                    <button
                      onClick={() => handleCancelQueue(selectedQueue.id)}
                      className="bg-white hover:bg-gray-50 text-error-red border border-error-red font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 w-full md:w-auto justify-center md:justify-start"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Leave Queue
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="bg-gray-100 h-4 w-full">
                <div 
                  className="bg-gradient-to-r from-dark-green to-primary-green h-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.round(((selectedQueue.totalPeople - selectedQueue.currentPosition) / selectedQueue.totalPeople) * 100)}%` 
                  }}
                ></div>
              </div>
            </motion.div>
            
            {/* Right Side: Info and Tips */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              {/* User Info Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-dark-charcoal mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Your Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium">{userInfo.firstName} {userInfo.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Matric Number:</span>
                    <span className="font-medium">{userInfo.studentId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-sm">{userInfo.email}</span>
                  </div>
                </div>
              </div>
              
              {/* Tips Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-lg text-dark-charcoal mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Arrive 5 minutes before your estimated time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Have your matric number ready when called</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600">Prepare any documents you might need</span>
                  </li>
                </ul>
              </div>
              
              {/* Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/welcome')}
                    className="bg-light-gray hover:bg-gray-200 text-dark-charcoal font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 w-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/booking')}
                    className="bg-primary-green hover:bg-dark-green text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 w-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Join Another Queue
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default StatusPage;
