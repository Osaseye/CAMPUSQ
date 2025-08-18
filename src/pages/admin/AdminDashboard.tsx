import { useState, useEffect } from 'react';
import { useStore } from '../../data/store';
import { useUser } from '../../context/useUser';
import { useAdmin } from '../../context/useAdmin';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCalendarAlt, FaCheck, FaTimes, FaBell, FaClock } from 'react-icons/fa';

// Main dashboard overview component
const AdminDashboard = () => {
  const { bookings, departments, markAsServed, removeBooking } = useStore();
  const { userInfo } = useUser();
  const { updateAdminStats } = useAdmin();
  const [activeTab, setActiveTab] = useState('queues');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Update admin stats on component mount - only once
  useEffect(() => {
    updateAdminStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once
  
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
  
  const handleMarkAsServed = (bookingId: string) => {
    markAsServed(bookingId);
    setNotificationMessage('Student has been marked as served');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  const handleRemoveBooking = (bookingId: string) => {
    removeBooking(bookingId);
    setNotificationMessage('Booking has been removed from queue');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  // Group bookings by department
  const bookingsByDepartment = departments.map(dept => {
    const deptBookings = bookings.filter(booking => booking.department === dept.name);
    return {
      department: dept,
      bookings: deptBookings
    };
  });
  
  return (
      <div className="container mx-auto px-4">
        <motion.div 
          className="bg-white rounded-lg shadow-md overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Notification */}
          <AnimatePresence>
            {showNotification && (
              <motion.div 
                className="bg-success-green text-white p-3 md:p-4 flex justify-between items-center text-sm md:text-base"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <FaBell className="mr-2 text-xs md:text-base" />
                  <p>{notificationMessage}</p>
                </div>
                <button onClick={() => setShowNotification(false)}>
                  <FaTimes className="text-xs md:text-base" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="bg-dark-charcoal text-white p-4 md:p-6"
            variants={itemVariants}
          >
            <h1 className="text-lg md:text-2xl font-bold flex items-center">
              <FaUser className="mr-2" /> Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-1 text-xs md:text-sm">
              {userInfo?.firstName ? `Welcome back, ${userInfo.firstName}! Manage queues and bookings` : 'Manage queues and bookings'}
            </p>
          </motion.div>
          
          {/* Tabs */}
          <motion.div 
            className="bg-gray-100 px-3 md:px-6 py-2 md:py-3 flex border-b overflow-x-auto"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => setActiveTab('queues')}
              className={`py-1.5 md:py-2 px-3 md:px-4 mr-2 rounded-t-lg font-medium text-xs md:text-sm whitespace-nowrap ${
                activeTab === 'queues'
                  ? 'bg-white text-primary-green border-b-2 border-primary-green'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center">
                <FaBell className="mr-1.5" /> 
                <span className="hidden xs:inline">Queue</span> Overview
              </div>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('bookings')}
              className={`py-1.5 md:py-2 px-3 md:px-4 rounded-t-lg font-medium text-xs md:text-sm whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-white text-primary-green border-b-2 border-primary-green'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center">
                <FaCalendarAlt className="mr-1.5" /> All Bookings
              </div>
            </motion.button>
          </motion.div>
          
          {/* Queue Overview Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'queues' && (
              <motion.div 
                className="p-3 md:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="queues-tab"
              >
                <motion.h2 
                  className="text-lg md:text-xl font-bold text-dark-charcoal mb-4 flex items-center"
                  variants={itemVariants}
                >
                  <FaBell className="mr-2 text-primary-green" />
                  Department Queues
                </motion.h2>
                
                <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {bookingsByDepartment.map(({ department, bookings }, index) => (
                    <motion.div 
                      key={department.id}
                      className="bg-white rounded-lg p-3 md:p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <h3 className="font-bold text-base md:text-lg text-dark-charcoal">{department.name}</h3>
                        <span className="bg-primary-green text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm flex items-center">
                          <FaUser className="mr-1 text-xs" />
                          {bookings.length} in queue
                        </span>
                      </div>
                      
                      {bookings.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-gray-100 -mx-3 md:mx-0">
                          <table className="min-w-full bg-white">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600 text-xs md:text-sm leading-normal">
                                <th className="py-2 md:py-3 px-2 md:px-4 text-left font-semibold">#</th>
                                <th className="py-2 md:py-3 px-2 md:px-4 text-left font-semibold">Name</th>
                                <th className="py-2 md:py-3 px-2 md:px-4 text-left font-semibold">Time</th>
                                <th className="py-2 md:py-3 px-2 md:px-4 text-right font-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-600 text-xs md:text-sm">
                              {bookings.map((booking, idx) => (
                                <motion.tr 
                                  key={booking.id} 
                                  className="border-b border-gray-200 hover:bg-gray-50"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  whileHover={{ backgroundColor: "#f9fafb" }}
                                >
                                  <td className="py-2 md:py-3 px-2 md:px-4">{booking.queueNumber}</td>
                                  <td className="py-2 md:py-3 px-2 md:px-4 font-medium">{booking.name}</td>
                                  <td className="py-2 md:py-3 px-2 md:px-4">
                                    <div className="flex items-center">
                                      <FaClock className="mr-1 text-primary-green" size={12} />
                                      {booking.timeSlot}
                                    </div>
                                  </td>
                                  <td className="py-2 md:py-3 px-2 md:px-4 text-right whitespace-nowrap">
                                    <div className="flex flex-wrap justify-end gap-1 md:gap-2">
                                      <motion.button
                                        onClick={() => handleMarkAsServed(booking.id)}
                                        className="bg-success-green hover:bg-green-600 text-white px-2 md:px-3 py-1 rounded-md text-xs inline-flex items-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <FaCheck className="mr-1" size={10} /> <span className="hidden md:inline">Serve</span>
                                      </motion.button>
                                      <motion.button
                                        onClick={() => handleRemoveBooking(booking.id)}
                                        className="bg-error-red hover:bg-red-600 text-white px-2 md:px-3 py-1 rounded-md text-xs inline-flex items-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <FaTimes className="mr-1" size={10} /> <span className="hidden md:inline">Remove</span>
                                      </motion.button>
                                    </div>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <motion.div 
                          className="bg-gray-50 rounded-lg p-4 md:p-8 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className="text-gray-500 flex items-center justify-center text-sm">
                            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            No bookings in this queue
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* All Bookings Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'bookings' && (
              <motion.div 
                className="p-3 md:p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="bookings-tab"
              >
                <motion.h2 
                  className="text-lg md:text-xl font-bold text-dark-charcoal mb-4 flex items-center"
                  variants={itemVariants}
                >
                  <FaCalendarAlt className="mr-2 text-primary-green" />
                  All Bookings
                </motion.h2>
                
                {bookings.length > 0 ? (
                  <motion.div 
                    className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200 -mx-3 md:mx-0"
                    variants={itemVariants}
                  >
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 text-xs md:text-sm leading-normal">
                          <th className="py-2 md:py-3 px-2 md:px-4 text-left font-semibold">#</th>
                          <th className="py-2 md:py-3 px-2 md:px-4 text-left font-semibold">Name</th>
                          <th className="hidden md:table-cell py-2 md:py-3 px-2 md:px-4 text-left font-semibold">Matric No</th>
                          <th className="hidden md:table-cell py-2 md:py-3 px-2 md:px-4 text-left font-semibold">Department</th>
                          <th className="py-2 md:py-3 px-2 md:px-4 text-left font-semibold">Time</th>
                          <th className="hidden sm:table-cell py-2 md:py-3 px-2 md:px-4 text-left font-semibold">Wait</th>
                          <th className="py-2 md:py-3 px-2 md:px-4 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-xs md:text-sm">
                        {bookings.map((booking, idx) => (
                          <motion.tr 
                            key={booking.id} 
                            className="border-b border-gray-200 hover:bg-gray-50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <td className="py-2 md:py-3 px-2 md:px-4">{booking.queueNumber}</td>
                            <td className="py-2 md:py-3 px-2 md:px-4 font-medium">{booking.name}</td>
                            <td className="hidden md:table-cell py-2 md:py-3 px-2 md:px-4">{booking.studentId}</td>
                            <td className="hidden md:table-cell py-2 md:py-3 px-2 md:px-4">{booking.department}</td>
                            <td className="py-2 md:py-3 px-2 md:px-4">
                              <div className="flex items-center">
                                <FaClock className="mr-1 text-primary-green" size={12} />
                                {booking.timeSlot}
                              </div>
                            </td>
                            <td className="hidden sm:table-cell py-2 md:py-3 px-2 md:px-4">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                {booking.estimatedWaitTime || "10-15 min"}
                              </span>
                            </td>
                            <td className="py-2 md:py-3 px-2 md:px-4 text-right whitespace-nowrap">
                              <div className="flex flex-wrap justify-end gap-1 md:gap-2">
                                <motion.button
                                  onClick={() => handleMarkAsServed(booking.id)}
                                  className="bg-success-green hover:bg-green-600 text-white px-2 md:px-3 py-1 rounded-md text-xs inline-flex items-center"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FaCheck className="mr-1" size={10} /> <span className="hidden md:inline">Serve</span>
                                </motion.button>
                                <motion.button
                                  onClick={() => handleRemoveBooking(booking.id)}
                                  className="bg-error-red hover:bg-red-600 text-white px-2 md:px-3 py-1 rounded-md text-xs inline-flex items-center"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FaTimes className="mr-1" size={10} /> <span className="hidden md:inline">Remove</span>
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="bg-gray-50 rounded-lg p-4 md:p-8 text-center border border-gray-200"
                    variants={itemVariants}
                  >
                    <p className="text-gray-500 flex items-center justify-center text-sm">
                      <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      No bookings available
                    </p>
                  </motion.div>
                )}
                
                {/* Summary Cards */}
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="bg-blue-50 border border-blue-200 p-3 md:p-4 rounded-lg shadow-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-xs md:text-sm font-medium">Total Bookings</p>
                        <p className="text-xl md:text-2xl font-bold text-blue-800">{bookings.length}</p>
                      </div>
                      <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-green-50 border border-green-200 p-3 md:p-4 rounded-lg shadow-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-xs md:text-sm font-medium">Active Departments</p>
                        <p className="text-xl md:text-2xl font-bold text-green-800">{departments.length}</p>
                      </div>
                      <div className="bg-green-100 p-2 md:p-3 rounded-full">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-purple-50 border border-purple-200 p-3 md:p-4 rounded-lg shadow-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-xs md:text-sm font-medium">Average Wait Time</p>
                        <p className="text-xl md:text-2xl font-bold text-purple-800">{bookings.length > 0 ? '15 min' : 'N/A'}</p>
                      </div>
                      <div className="bg-purple-100 p-2 md:p-3 rounded-full">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
  );
};

export default AdminDashboard;
