import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useStore } from '../../data/store';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCalendarAlt, FaCheck, FaTimes, FaBell, FaClock } from 'react-icons/fa';

const AdminDashboard = () => {
  const { bookings, departments, markAsServed, removeBooking } = useStore();
  const { userInfo } = useUser();
  const [activeTab, setActiveTab] = useState('queues');
   const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
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
    <AdminLayout>
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
                className="bg-success-green text-white p-4 flex justify-between items-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <FaBell className="mr-2" />
                  <p>{notificationMessage}</p>
                </div>
                <button onClick={() => setShowNotification(false)}>
                  <FaTimes />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="bg-dark-charcoal text-white p-6"
            variants={itemVariants}
          >
            <h1 className="text-2xl font-bold flex items-center">
              <FaUser className="mr-2" /> Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-1">
              {userInfo?.firstName ? `Welcome back, ${userInfo.firstName}! Manage queues and bookings` : 'Manage queues and bookings'}
            </p>
          </motion.div>
          
          {/* Tabs */}
          <motion.div 
            className="bg-gray-100 px-6 py-3 flex border-b"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => setActiveTab('queues')}
              className={`py-2 px-4 mr-2 rounded-t-lg font-medium ${
                activeTab === 'queues'
                  ? 'bg-white text-primary-green border-b-2 border-primary-green'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center">
                <FaBell className="mr-1.5" /> Queue Overview
              </div>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-4 rounded-t-lg font-medium ${
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
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="queues-tab"
              >
                <motion.h2 
                  className="text-xl font-bold text-dark-charcoal mb-4 flex items-center"
                  variants={itemVariants}
                >
                  <FaBell className="mr-2 text-primary-green" />
                  Department Queues
                </motion.h2>
                
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookingsByDepartment.map(({ department, bookings }, index) => (
                    <motion.div 
                      key={department.id}
                      className="bg-white rounded-lg p-5 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-dark-charcoal">{department.name}</h3>
                        <span className="bg-primary-green text-white px-3 py-1 rounded-full text-sm flex items-center">
                          <FaUser className="mr-1 text-xs" />
                          {bookings.length} in queue
                        </span>
                      </div>
                      
                      {bookings.length > 0 ? (
                        <div className="overflow-x-auto rounded-lg border border-gray-100">
                          <table className="min-w-full bg-white">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                                <th className="py-3 px-4 text-left font-semibold">#</th>
                                <th className="py-3 px-4 text-left font-semibold">Name</th>
                                <th className="py-3 px-4 text-left font-semibold">Time</th>
                                <th className="py-3 px-4 text-right font-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                              {bookings.map((booking, idx) => (
                                <motion.tr 
                                  key={booking.id} 
                                  className="border-b border-gray-200 hover:bg-gray-50"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  whileHover={{ backgroundColor: "#f9fafb" }}
                                >
                                  <td className="py-3 px-4">{booking.queueNumber}</td>
                                  <td className="py-3 px-4 font-medium">{booking.name}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <FaClock className="mr-1 text-primary-green" size={12} />
                                      {booking.timeSlot}
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <motion.button
                                      onClick={() => handleMarkAsServed(booking.id)}
                                      className="bg-success-green hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs mr-2 inline-flex items-center"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <FaCheck className="mr-1" /> Serve
                                    </motion.button>
                                    <motion.button
                                      onClick={() => handleRemoveBooking(booking.id)}
                                      className="bg-error-red hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs inline-flex items-center"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <FaTimes className="mr-1" /> Remove
                                    </motion.button>
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <motion.div 
                          className="bg-gray-50 rounded-lg p-8 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className="text-gray-500 flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="bookings-tab"
              >
                <motion.h2 
                  className="text-xl font-bold text-dark-charcoal mb-4 flex items-center"
                  variants={itemVariants}
                >
                  <FaCalendarAlt className="mr-2 text-primary-green" />
                  All Bookings
                </motion.h2>
                
                {bookings.length > 0 ? (
                  <motion.div 
                    className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200"
                    variants={itemVariants}
                  >
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                          <th className="py-3 px-4 text-left font-semibold">#</th>
                          <th className="py-3 px-4 text-left font-semibold">Name</th>
                          <th className="py-3 px-4 text-left font-semibold">Student ID</th>
                          <th className="py-3 px-4 text-left font-semibold">Department</th>
                          <th className="py-3 px-4 text-left font-semibold">Time</th>
                          <th className="py-3 px-4 text-left font-semibold">Wait</th>
                          <th className="py-3 px-4 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm">
                        {bookings.map((booking, idx) => (
                          <motion.tr 
                            key={booking.id} 
                            className="border-b border-gray-200 hover:bg-gray-50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <td className="py-3 px-4">{booking.queueNumber}</td>
                            <td className="py-3 px-4 font-medium">{booking.name}</td>
                            <td className="py-3 px-4">{booking.studentId}</td>
                            <td className="py-3 px-4">{booking.department}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <FaClock className="mr-1 text-primary-green" size={12} />
                                {booking.timeSlot}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                {booking.estimatedWaitTime || "10-15 min"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <motion.button
                                onClick={() => handleMarkAsServed(booking.id)}
                                className="bg-success-green hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs mr-2 inline-flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaCheck className="mr-1" /> Serve
                              </motion.button>
                              <motion.button
                                onClick={() => handleRemoveBooking(booking.id)}
                                className="bg-error-red hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs inline-flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTimes className="mr-1" /> Remove
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200"
                    variants={itemVariants}
                  >
                    <p className="text-gray-500 flex items-center justify-center">
                      <svg className="w-6 h-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      No bookings available
                    </p>
                  </motion.div>
                )}
                
                {/* Summary Cards */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Bookings</p>
                        <p className="text-2xl font-bold text-blue-800">{bookings.length}</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Active Departments</p>
                        <p className="text-2xl font-bold text-green-800">{departments.length}</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-purple-50 border border-purple-200 p-4 rounded-lg shadow-sm"
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Average Wait Time</p>
                        <p className="text-2xl font-bold text-purple-800">{bookings.length > 0 ? '15 min' : 'N/A'}</p>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-full">
                        <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </AdminLayout>
  );
};

export default AdminDashboard;
