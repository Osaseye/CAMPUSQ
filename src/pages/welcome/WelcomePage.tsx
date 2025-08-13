import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { FaUser, FaIdCard, FaEnvelope, FaBell, FaClock, FaUsers, FaBuilding, FaHistory, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const WelcomePage = () => {
  const { 
    userInfo, 
    userQueues, 
    availableDepartments, 
    leaveQueue, 
    updateQueuePositions 
  } = useUser();
  const [greeting, setGreeting] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{[key: string]: number}>({});

  // Calculate time remaining for each queue
  const calculateTimeRemaining = useCallback(() => {
    const times: {[key: string]: number} = {};
    userQueues.forEach(queue => {
      times[queue.id] = queue.currentPosition * queue.estimatedTimeMinutes * 60;
    });
    setTimeLeft(times);
  }, [userQueues]);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
    
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Set up countdown timers for each queue
  useEffect(() => {
    calculateTimeRemaining();
    
    const intervalId = setInterval(() => {
      setTimeLeft(prev => {
        const updated = {...prev};
        Object.keys(updated).forEach(id => {
          if (updated[id] > 0) {
            updated[id] -= 1;
          }
        });
        return updated;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [userQueues, calculateTimeRemaining]);

  // Manual queue simulation for demo
  const simulateQueueProgress = () => {
    updateQueuePositions();
    calculateTimeRemaining();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gray to-white p-4 md:p-8">
      {/* Header with user greeting and navigation */}
      <div 
        className={`bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-all duration-700 ${
          animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-green">
              {greeting}, <span className="text-dark-charcoal">{userInfo.firstName}</span>!
            </h1>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Link 
              to="/welcome" 
              className="bg-white hover:bg-light-gray border border-gray-300 text-dark-charcoal px-4 py-2 rounded-lg shadow transition-all duration-300 flex items-center gap-2 hover:shadow-lg"
            >
              <FaUser />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/booking" 
              className="bg-primary-green hover:bg-dark-green text-white px-4 py-2 rounded-lg shadow transition-all duration-300 flex items-center gap-2 hover:shadow-lg"
            >
              <FaBell />
              <span>Join a Queue</span>
            </Link>
            <Link 
              to="/status" 
              className="bg-white hover:bg-light-gray border border-gray-300 text-dark-charcoal px-4 py-2 rounded-lg shadow transition-all duration-300 flex items-center gap-2 hover:shadow-lg"
            >
              <FaHistory />
              <span>Queue Status</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div 
          className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-700 ${
            animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          <div className="bg-gradient-to-r from-primary-green to-dark-green h-24 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
              <div className="w-20 h-20 rounded-full bg-light-gray flex items-center justify-center text-4xl font-bold text-primary-green">
                {userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)}
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-6 px-6">
            <h2 className="text-xl font-bold text-center text-dark-charcoal mb-6">
              {userInfo.firstName} {userInfo.lastName}
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <FaUser className="text-primary-green" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{userInfo.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <FaEnvelope className="text-primary-green" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userInfo.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <FaIdCard className="text-primary-green" />
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium">{userInfo.studentId || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Active Queues</p>
                  <p className="text-2xl font-bold text-primary-green">{userQueues.length}</p>
                </div>
                <Link to="/status" className="text-primary-green hover:text-dark-green hover:underline flex items-center gap-1 text-sm font-medium">
                  View Status
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Active Queues Card */}
        <div 
          className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-700 ${
            animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark-charcoal flex items-center gap-2">
                <FaBell className="text-primary-green" />
                <span>Your Active Queues</span>
              </h2>
              <span className="bg-primary-green/10 text-primary-green text-sm font-medium px-2 py-1 rounded">
                {userQueues.length} Active
              </span>
            </div>

            {userQueues.length > 0 ? (
              <div className="space-y-4">
                {userQueues.map((queue) => {
                  // Find department for this queue
                  const department = availableDepartments.find(d => d.id === queue.departmentId);
                  const seconds = timeLeft[queue.id] || 0;
                  const minutes = Math.floor(seconds / 60);
                  const remainingSeconds = seconds % 60;
                  const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
                  
                  return (
                    <div 
                      key={queue.id}
                      className="bg-light-gray/50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center text-xl">
                            {department?.logoUrl || '📋'}
                          </div>
                          <div>
                            <h3 className="font-medium text-dark-charcoal">{queue.name}</h3>
                            <p className="text-sm text-gray-600">{department?.name}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => leaveQueue(queue.id)}
                          className="text-error-red hover:bg-red-50 p-1.5 rounded-full transition-colors"
                          title="Leave Queue"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white p-2 rounded">
                          <p className="text-xs text-gray-500">Position</p>
                          <p className="font-bold text-dark-charcoal">{queue.currentPosition} / {queue.totalPeople}</p>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <p className="text-xs text-gray-500">Est. Wait</p>
                          <p className="font-bold text-primary-green">{timeString}</p>
                        </div>
                        <div className="bg-white p-2 rounded">
                          <p className="text-xs text-gray-500">Status</p>
                          <p className="font-medium text-primary-green">
                            {queue.currentPosition === 1 ? "Next" : "Active"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 h-1.5 mt-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary-green h-full transition-all duration-1000" 
                          style={{ 
                            width: `${Math.round(((queue.totalPeople - queue.currentPosition) / queue.totalPeople) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Debug button to manually progress queue (for demonstration) */}
                <div className="flex justify-center mt-2">
                  <button
                    onClick={simulateQueueProgress}
                    className="text-xs text-gray-500 flex items-center gap-1 hover:text-primary-green"
                  >
                    <FaClock size={12} />
                    <span>Simulate Queue Progress</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-light-gray/30 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2 text-gray-400">🔔</div>
                <h3 className="font-medium text-gray-700">No Active Queues</h3>
                <p className="text-gray-500 text-sm mt-1 mb-4">
                  You're not currently in any queues
                </p>
                <Link 
                  to="/booking" 
                  className="inline-block bg-primary-green hover:bg-dark-green text-white px-4 py-2 rounded-lg shadow transition-all duration-300 text-sm"
                >
                  Join a Queue
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Available Departments Card */}
        <div 
          className={`bg-white rounded-xl shadow-lg transform transition-all duration-700 ${
            animateIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '450ms' }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark-charcoal flex items-center gap-2">
                <FaBuilding className="text-primary-green" />
                <span>Available Departments</span>
              </h2>
              <span className="bg-primary-green/10 text-primary-green text-sm font-medium px-2 py-1 rounded">
                {availableDepartments.length} Total
              </span>
            </div>
            
            <div className="space-y-3">
              {availableDepartments.map((dept) => (
                <div 
                  key={dept.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-light-gray/50 transition-colors group border border-transparent hover:border-gray-200"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center text-xl">
                    {dept.logoUrl}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-dark-charcoal">{dept.name}</h3>
                    <p className="text-sm text-gray-600">{dept.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary-green">
                    <FaUsers size={14} />
                    <span className="font-medium">{dept.queueCount}</span>
                    <span className="text-sm text-gray-500">queues</span>
                  </div>
                  <Link 
                    to={`/booking?dept=${dept.id}`}
                    className="bg-white border border-primary-green text-primary-green hover:bg-primary-green hover:text-white px-3 py-1.5 rounded text-sm font-medium transition-colors duration-300 opacity-0 group-hover:opacity-100"
                  >
                    Join
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaClock />
                <span>Updated just now</span>
              </div>
              <Link to="/booking" className="text-primary-green hover:text-dark-green hover:underline flex items-center gap-1 text-sm font-medium">
                View All
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
