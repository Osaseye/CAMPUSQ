import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStaff } from '../../context/useStaff';
import {
  FaListUl, FaFilter, FaSearch, FaSort,
  FaCheckCircle, FaTimesCircle, FaStepForward, FaBell
} from 'react-icons/fa';

const QueueViewPage = () => {
  const {
    departmentQueue,
    isServingPaused,
    currentlyServing,
    markAsServed,
    removeFromQueue,
    skipStudent,
    callNextStudent
  } = useStaff();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('queueNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [confirmAction, setConfirmAction] = useState<{
    type: 'remove' | 'skip' | null;
    studentId: string | null;
  }>({ type: null, studentId: null });
  
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'warning';
  } | null>(null);
  
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
  
  // Filter and sort the queue
  const filteredQueue = departmentQueue
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const sortVal = sortDirection === 'asc' ? 1 : -1;
      
      if (sortBy === 'bookingTime') {
        return new Date(a.bookingTime) > new Date(b.bookingTime) ? sortVal : -sortVal;
      }
      
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name) * sortVal;
      }
      
      // Default sort by queue number
      return (a.queueNumber - b.queueNumber) * sortVal;
    });
  
  // Handle sort toggle
  const handleSortToggle = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
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
  
  // Handle call student
  const handleCallStudent = (studentId: string) => {
    if (currentlyServing) {
      showNotification('Already serving a student', 'warning');
      return;
    }
    
    callNextStudent();
    showNotification('Student called', 'success');
  };

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-charcoal flex items-center">
              <FaListUl className="mr-2 text-blue-500" />
              Department Queue
            </h1>
            <p className="text-gray-600">
              Manage students waiting for services
            </p>
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
        
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row items-center gap-3 md:gap-4">
          <div className="w-full md:flex-grow">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-9 md:pl-10 pr-4 py-1.5 md:py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="flex flex-wrap w-full md:w-auto items-center gap-2 md:gap-4">
            <div className="flex items-center min-w-[120px]">
              <span className="mr-2 text-gray-600 text-xs md:text-sm">
                <FaFilter />
              </span>
              <select
                className="border border-gray-300 rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="waiting">Waiting</option>
                <option value="serving">Serving</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>
            
            <div className="flex items-center flex-grow md:flex-grow-0">
              <span className="mr-2 text-gray-600 text-xs md:text-sm">
                <FaSort />
              </span>
              <select
                className="border border-gray-300 rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDirection(direction as 'asc' | 'desc');
                }}
              >
                <option value="queueNumber-asc">Queue # (Low to High)</option>
                <option value="queueNumber-desc">Queue # (High to Low)</option>
                <option value="bookingTime-asc">Oldest First</option>
                <option value="bookingTime-desc">Newest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
            
            <div className="ml-auto md:ml-0 text-right">
              <span className="text-gray-600 text-xs md:text-sm">
                {filteredQueue.length} student{filteredQueue.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        
        {/* Queue Table */}
        {filteredQueue.length > 0 ? (
          <>
            {/* Mobile Card View (visible on small screens) */}
            <div className="md:hidden space-y-3">
              {filteredQueue.map((student) => (
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
                        <div className="font-medium text-sm">{student.name}</div>
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
                        onClick={() => handleCallStudent(student.id)}
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
                    <th
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortToggle('queueNumber')}
                    >
                      <div className="flex items-center">
                        Queue #
                        {sortBy === 'queueNumber' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortToggle('name')}
                    >
                      <div className="flex items-center">
                        Student Name
                        {sortBy === 'name' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortToggle('bookingTime')}
                    >
                      <div className="flex items-center">
                        Booking Time
                        {sortBy === 'bookingTime' && (
                          <span className="ml-1">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
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
                  {filteredQueue.map((student) => (
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
                              onClick={() => handleCallStudent(student.id)}
                              className={`px-2 py-1 rounded-md ${
                                currentlyServing
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                              disabled={currentlyServing !== null}
                            >
                              <FaBell className="text-xs" />
                            </button>
                          )}
                          <button
                            onClick={() => handleMarkAsServed(student.id)}
                            className="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-md"
                          >
                            <FaCheckCircle className="text-xs" />
                          </button>
                          <button
                            onClick={() => setConfirmAction({ type: 'skip', studentId: student.id })}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-md"
                          >
                            <FaStepForward className="text-xs" />
                          </button>
                          <button
                            onClick={() => setConfirmAction({ type: 'remove', studentId: student.id })}
                            className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md"
                          >
                            <FaTimesCircle className="text-xs" />
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
      </motion.div>
      
      {/* Confirmation Modal */}
      {confirmAction.type && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold mb-2">
              {confirmAction.type === 'remove' ? 'Remove Student' : 'Skip Student'}
            </h3>
            <p className="mb-4 text-gray-600">
              {confirmAction.type === 'remove'
                ? 'Are you sure you want to remove this student from the queue? This action cannot be undone.'
                : 'Are you sure you want to skip this student? They will be marked as skipped in the system.'}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmAction({ type: null, studentId: null })}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded text-white ${
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

export default QueueViewPage;
