import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStaff } from '../../context/useStaff';
import { useUser } from '../../context/useUser';
import {
  FaUserCheck, FaUserClock, FaUsers, FaClock,
  FaCheckCircle, FaPauseCircle, FaTimesCircle, FaStepForward,
  FaBell, FaListUl
} from 'react-icons/fa';

const StaffDashboard = () => {
  const { userInfo } = useUser();
  const {
    departmentQueue,
    isServingPaused,
    servedToday,
    currentlyServing,
    departmentStats,
    markAsServed,
    removeFromQueue,
    skipStudent,
    toggleServingStatus,
    callNextStudent
  } = useStaff();
  
  const [confirmAction, setConfirmAction] = useState<{
    type: 'remove' | 'skip' | null;
    studentId: string | null;
  }>({ type: null, studentId: null });
  
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'warning';
  } | null>(null);
  
  const departmentName = userInfo?.department || 'Your Department';
  
  // Custom function to format date nicely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Handle confirm action
  const handleConfirmAction = () => {
    if (!confirmAction.type || !confirmAction.studentId) return;
    
    if (confirmAction.type === 'remove') {
      removeFromQueue(confirmAction.studentId);
      showNotification('Student removed from queue', 'warning');
    } else if (confirmAction.type === 'skip') {
      skipStudent(confirmAction.studentId);
      showNotification('Student skipped', 'warning');
    }
    
    setConfirmAction({ type: null, studentId: null });
  };
  
  // Show notification
  const showNotification = (message: string, type: 'success' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Handle mark as served
  const handleMarkAsServed = (studentId: string) => {
    markAsServed(studentId);
    showNotification('Student marked as served', 'success');
  };
  
  // Handle toggle serving status
  const handleToggleServingStatus = () => {
    toggleServingStatus();
    showNotification(
      isServingPaused ? 'Queue service resumed' : 'Queue service paused',
      'warning'
    );
  };
  
  // Handle call next student
  const handleCallNextStudent = () => {
    callNextStudent();
    showNotification('Next student called', 'success');
  };
  
  return (
    <div className="container mx-auto px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-dark-charcoal">
              {departmentName} Dashboard
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage your department's queue and student services
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleToggleServingStatus}
              className={`px-3 md:px-4 py-2 rounded-md flex items-center justify-center ${
                isServingPaused
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } text-sm md:text-base`}
            >
              {isServingPaused ? (
                <>
                  <FaCheckCircle className="mr-1 md:mr-2" />
                  <span className="whitespace-nowrap">Resume Serving</span>
                </>
              ) : (
                <>
                  <FaPauseCircle className="mr-1 md:mr-2" />
                  <span className="whitespace-nowrap">Pause Queue</span>
                </>
              )}
            </button>
            <button
              onClick={handleCallNextStudent}
              disabled={!departmentStats.nextStudent || currentlyServing || isServingPaused}
              className={`px-3 md:px-4 py-2 rounded-md flex items-center justify-center ${
                !departmentStats.nextStudent || currentlyServing || isServingPaused
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } text-sm md:text-base`}
            >
              <FaBell className="mr-1 md:mr-2" />
              <span className="whitespace-nowrap">Call Next Student</span>
            </button>
          </div>
        </div>
        
        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-md ${
              notification.type === 'success'
                ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                : 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-100">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-blue-100 text-blue-600 mr-2 md:mr-4">
                <FaUserClock className="text-sm md:text-base" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Waiting</p>
                <p className="text-lg md:text-2xl font-bold">{departmentStats.totalWaiting}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-100">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-green-100 text-green-600 mr-2 md:mr-4">
                <FaUserCheck className="text-sm md:text-base" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Served Today</p>
                <p className="text-lg md:text-2xl font-bold">{servedToday.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 md:p-4 border border-yellow-100">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-yellow-100 text-yellow-600 mr-2 md:mr-4">
                <FaClock className="text-sm md:text-base" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Avg. Wait</p>
                <p className="text-lg md:text-2xl font-bold">{departmentStats.avgWaitTime} min</p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg p-3 md:p-4 border ${
            isServingPaused
              ? 'bg-red-50 border-red-100'
              : 'bg-green-50 border-green-100'
          }`}>
            <div className="flex items-center">
              <div className={`p-2 md:p-3 rounded-full mr-2 md:mr-4 ${
                isServingPaused
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-600'
              }`}>
                {isServingPaused ? <FaPauseCircle className="text-sm md:text-base" /> : <FaCheckCircle className="text-sm md:text-base" />}
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Status</p>
                <p className="text-lg md:text-2xl font-bold">{isServingPaused ? 'Paused' : 'Active'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Currently Serving */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center">
            <FaUserCheck className="mr-2 text-blue-500" />
            Currently Serving
          </h2>
          
          {currentlyServing ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-lg md:text-xl font-bold">{currentlyServing.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs md:text-sm text-gray-600">
                      <span className="font-medium">Student ID:</span> {currentlyServing.studentId}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      <span className="font-medium">Queue Number:</span> {currentlyServing.queueNumber}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      <span className="font-medium">Booking Time:</span> {formatDate(currentlyServing.bookingTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleMarkAsServed(currentlyServing.id)}
                    className="px-2 md:px-4 py-1.5 md:py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center text-xs md:text-sm"
                  >
                    <FaCheckCircle className="mr-1 md:mr-2" />
                    Mark as Served
                  </button>
                  <button
                    onClick={() => setConfirmAction({ type: 'skip', studentId: currentlyServing.id })}
                    className="px-2 md:px-4 py-1.5 md:py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md flex items-center text-xs md:text-sm"
                  >
                    <FaStepForward className="mr-1 md:mr-2" />
                    Skip
                  </button>
                  <button
                    onClick={() => setConfirmAction({ type: 'remove', studentId: currentlyServing.id })}
                    className="px-2 md:px-4 py-1.5 md:py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center text-xs md:text-sm"
                  >
                    <FaTimesCircle className="mr-1 md:mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6 text-center">
              <p className="text-sm md:text-base text-gray-500">No student currently being served</p>
              {departmentStats.nextStudent && !isServingPaused && (
                <button
                  onClick={handleCallNextStudent}
                  className="mt-3 md:mt-4 px-3 md:px-4 py-1.5 md:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md inline-flex items-center text-xs md:text-sm"
                >
                  <FaBell className="mr-1 md:mr-2" />
                  Call Next Student
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Queue List */}
        <div>
          <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center">
            <FaListUl className="mr-2 text-blue-500" />
            Queue ({departmentStats.totalWaiting} waiting)
          </h2>
          
          {departmentQueue.length > 0 ? (
            <>
              {/* Mobile Card View (visible on small screens) */}
              <div className="md:hidden space-y-4">
                {departmentQueue.map((student) => (
                  <div 
                    key={student.id} 
                    className={`border rounded-lg overflow-hidden shadow-sm ${
                      student.status === 'serving' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-3 flex justify-between items-center border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 h-8 w-8 rounded-full flex items-center justify-center text-blue-700 font-bold">
                          {student.queueNumber}
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.studentId}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                        student.status === 'waiting'
                          ? 'bg-yellow-100 text-yellow-800'
                          : student.status === 'serving'
                            ? 'bg-blue-100 text-blue-800'
                            : student.status === 'skipped'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                      }`}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </div>
                    <div className="p-3 text-xs bg-gray-50">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Booking Time:</span>
                        <span className="font-medium">{formatDate(student.bookingTime)}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gray-100 flex justify-between gap-1 text-xs">
                      {student.status === 'waiting' && (
                        <button
                          onClick={() => callNextStudent()}
                          disabled={currentlyServing !== null}
                          className={`py-1 px-2 rounded ${
                            currentlyServing !== null
                              ? 'bg-gray-200 text-gray-500'
                              : 'bg-blue-100 text-blue-700'
                          } flex-1`}
                        >
                          Call
                        </button>
                      )}
                      <button
                        onClick={() => handleMarkAsServed(student.id)}
                        className="py-1 px-2 rounded bg-green-100 text-green-700 flex-1"
                      >
                        Serve
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: 'skip', studentId: student.id })}
                        className="py-1 px-2 rounded bg-yellow-100 text-yellow-700 flex-1"
                      >
                        Skip
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: 'remove', studentId: student.id })}
                        className="py-1 px-2 rounded bg-red-100 text-red-700 flex-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (hidden on small screens) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Queue #
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Time
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {departmentQueue.map((student) => (
                      <tr key={student.id} className={`hover:bg-gray-50 ${
                        student.status === 'serving' ? 'bg-blue-50' : ''
                      }`}>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.queueNumber}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {student.studentId}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(student.bookingTime)}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === 'waiting'
                              ? 'bg-yellow-100 text-yellow-800'
                              : student.status === 'serving'
                                ? 'bg-blue-100 text-blue-800'
                                : student.status === 'skipped'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                          }`}>
                            {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {student.status === 'waiting' && (
                              <button
                                onClick={() => callNextStudent()}
                                className="text-blue-600 hover:text-blue-900"
                                title="Call Student"
                                disabled={currentlyServing !== null}
                              >
                                Call
                              </button>
                            )}
                            <button
                              onClick={() => handleMarkAsServed(student.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Served"
                            >
                              Serve
                            </button>
                            <button
                              onClick={() => setConfirmAction({ type: 'skip', studentId: student.id })}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Skip Student"
                            >
                              Skip
                            </button>
                            <button
                              onClick={() => setConfirmAction({ type: 'remove', studentId: student.id })}
                              className="text-red-600 hover:text-red-900"
                              title="Remove from Queue"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6 text-center">
              <p className="text-sm md:text-base text-gray-500">No students in the queue</p>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Confirmation Modal */}
      {confirmAction.type && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md">
            <h3 className="text-base md:text-lg font-bold mb-2">
              {confirmAction.type === 'remove' ? 'Remove Student' : 'Skip Student'}
            </h3>
            <p className="mb-4 text-sm md:text-base text-gray-600">
              {confirmAction.type === 'remove'
                ? 'Are you sure you want to remove this student from the queue? This action cannot be undone.'
                : 'Are you sure you want to skip this student? They will be marked as skipped in the system.'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmAction({ type: null, studentId: null })}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-200 text-gray-800 rounded text-sm md:text-base hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded text-white text-sm md:text-base ${
                  confirmAction.type === 'remove'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
