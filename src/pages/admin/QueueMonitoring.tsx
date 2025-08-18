import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/useAdmin';
import {
  FaListUl, FaUsers, FaSync, FaUsersCog, FaTrash, FaCheck,
  FaFilter, FaSearch, FaSort, FaSortAmountDown, FaSortAmountUp,
  FaCheckCircle, FaClock, FaExclamationCircle, FaMinusCircle,
  FaEye, FaEdit
} from 'react-icons/fa';

// Define interface for queue
interface Queue {
  id: string;
  name: string;
  department: string;
  status: 'active' | 'paused' | 'closed';
  queueLength: number;
  waitTime: number;
  servedToday: number;
  createdAt: string;
}

const QueueMonitoring = () => {
  const { activeQueues, clearQueue, resetQueue, updateQueueStatus } = useAdmin();
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState<'waitTime' | 'queueLength' | 'department' | 'name'>('waitTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ action: 'clear' | 'reset' | null, queueId: string | null }>({
    action: null,
    queueId: null
  });
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

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

  // Simulated departments - in a real app, these would come from your context
  const departments = [
    'Financial Aid',
    'Registration',
    'Academic Advising',
    'IT Support',
    'Student Affairs',
  ];

  // Queue status options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'closed', label: 'Closed' },
  ];

  // Handle sort
  const handleSort = (field: 'waitTime' | 'queueLength' | 'department' | 'name') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for metrics
    }
  };

  // Handle clear queue
  const handleClearQueue = (queueId: string) => {
    clearQueue(queueId);
    setConfirmAction({ action: null, queueId: null });
    
    setNotification({
      message: 'Queue cleared successfully',
      type: 'success'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle reset queue
  const handleResetQueue = (queueId: string) => {
    resetQueue(queueId);
    setConfirmAction({ action: null, queueId: null });
    
    setNotification({
      message: 'Queue reset successfully',
      type: 'success'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle toggle queue status
  const handleToggleQueueStatus = (queueId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateQueueStatus(queueId, newStatus);
    
    setNotification({
      message: `Queue ${newStatus === 'active' ? 'activated' : 'paused'} successfully`,
      type: 'success'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter and sort queues
  const filteredQueues = activeQueues
    .filter((queue) => {
      const matchesSearch = searchTerm === '' || 
        queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        queue.department.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesDepartment = filterDepartment === 'all' || 
        queue.department === filterDepartment;
        
      const matchesStatus = filterStatus === 'all' || 
        queue.status === filterStatus;
        
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === 'waitTime' || sortField === 'queueLength') {
        return sortDirection === 'asc' 
          ? a[sortField] - b[sortField] 
          : b[sortField] - a[sortField];
      } else {
        const compareA = a[sortField].toLowerCase();
        const compareB = b[sortField].toLowerCase();
        
        return sortDirection === 'asc'
          ? compareA.localeCompare(compareB)
          : compareB.localeCompare(compareA);
      }
    });

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <FaCheckCircle className="text-success-green" />;
      case 'paused':
        return <FaClock className="text-yellow-500" />;
      case 'closed':
        return <FaMinusCircle className="text-gray-500" />;
      default:
        return <FaExclamationCircle className="text-error-red" />;
    }
  };

  // Get wait time color
  const getWaitTimeColor = (minutes: number) => {
    if (minutes < 10) return 'text-success-green';
    if (minutes < 20) return 'text-yellow-500';
    return 'text-error-red';
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-3 md:py-6">
      <motion.div 
        className="bg-white rounded-lg shadow-md p-3 md:p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section */}
        <motion.div 
          className="flex justify-between items-center mb-4 md:mb-6"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-dark-charcoal flex items-center">
              <FaListUl className="mr-2 text-primary-green" />
              Queue Monitoring
            </h1>
            <p className="text-gray-600 mt-1 text-xs md:text-sm">
              Monitor and manage active queues across all departments
            </p>
          </div>
        </motion.div>
        
        {/* Notification */}
        {notification && (
          <motion.div 
            className={`mb-4 md:mb-6 p-3 md:p-4 rounded-md text-sm md:text-base ${notification.type === 'success' ? 'bg-success-green/10 text-success-green border-l-4 border-success-green' : 'bg-error-red/10 text-error-red border-l-4 border-error-red'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <FaCheck className="mr-2 text-xs md:text-base" />
              ) : (
                <FaExclamationCircle className="mr-2 text-xs md:text-base" />
              )}
              <p>{notification.message}</p>
            </div>
          </motion.div>
        )}
        
        {/* Filters and Search */}
        <motion.div 
          className="mb-4 md:mb-6 space-y-3 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-3"
          variants={itemVariants}
        >
          <div className="w-full md:flex-grow">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-8 md:pl-10 pr-4 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-green"
                placeholder="Search queues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs md:text-base" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex items-center flex-grow md:flex-grow-0">
              <span className="mr-2 text-gray-600 hidden md:block">
                <FaFilter />
              </span>
              <select
                className="border border-gray-300 rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-green flex-grow md:flex-grow-0"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center flex-grow md:flex-grow-0">
              <select
                className="border border-gray-300 rounded px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-green w-full"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <span className="text-gray-600 text-xs md:text-sm">
              {filteredQueues.length} queue{filteredQueues.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </motion.div>
        
        {/* Queue List */}
        <motion.div 
          className="mb-6"
          variants={itemVariants}
        >
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white text-xs md:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <span className="whitespace-nowrap">Queue Name</span>
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? (
                          <FaSortAmountUp className="ml-1 text-primary-green" />
                        ) : (
                          <FaSortAmountDown className="ml-1 text-primary-green" />
                        )
                      ) : (
                        <FaSort className="ml-1 text-gray-300" />
                      )}
                    </div>
                  </th>
                  <th className="hidden md:table-cell py-2 md:py-3 px-2 md:px-4 text-left">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('department')}
                    >
                      <span>Department</span>
                      {sortField === 'department' ? (
                        sortDirection === 'asc' ? (
                          <FaSortAmountUp className="ml-1 text-primary-green" />
                        ) : (
                          <FaSortAmountDown className="ml-1 text-primary-green" />
                        )
                      ) : (
                        <FaSort className="ml-1 text-gray-300" />
                      )}
                    </div>
                  </th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left">Status</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-right">
                    <div
                      className="flex items-center justify-end cursor-pointer"
                      onClick={() => handleSort('queueLength')}
                    >
                      <span className="whitespace-nowrap">Queue</span>
                      {sortField === 'queueLength' ? (
                        sortDirection === 'asc' ? (
                          <FaSortAmountUp className="ml-1 text-primary-green" />
                        ) : (
                          <FaSortAmountDown className="ml-1 text-primary-green" />
                        )
                      ) : (
                        <FaSort className="ml-1 text-gray-300" />
                      )}
                    </div>
                  </th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-right">
                    <div
                      className="flex items-center justify-end cursor-pointer"
                      onClick={() => handleSort('waitTime')}
                    >
                      <span className="whitespace-nowrap hidden sm:inline">Avg. Wait</span>
                      <span className="whitespace-nowrap sm:hidden">Wait</span>
                      {sortField === 'waitTime' ? (
                        sortDirection === 'asc' ? (
                          <FaSortAmountUp className="ml-1 text-primary-green" />
                        ) : (
                          <FaSortAmountDown className="ml-1 text-primary-green" />
                        )
                      ) : (
                        <FaSort className="ml-1 text-gray-300" />
                      )}
                    </div>
                  </th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQueues.map((queue: Queue, index: number) => (
                  <motion.tr 
                    key={queue.id}
                    className={`hover:bg-gray-50 ${selectedQueue === queue.id ? 'bg-primary-green/5 border-l-4 border-primary-green' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedQueue(selectedQueue === queue.id ? null : queue.id)}
                  >
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <div className="font-medium text-gray-900">{queue.name}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">ID: {queue.id}</div>
                    </td>
                    <td className="hidden md:table-cell py-2 md:py-3 px-2 md:px-4">{queue.department}</td>
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <div className="flex items-center">
                        {getStatusIcon(queue.status)}
                        <span className="ml-1 md:ml-2 capitalize hidden xs:inline">
                          {queue.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-right">
                      <span className={`font-bold ${queue.queueLength > 10 ? 'text-error-red' : queue.queueLength > 5 ? 'text-yellow-500' : 'text-success-green'}`}>
                        {queue.queueLength}
                      </span>
                      <span className="text-gray-500 ml-1 hidden sm:inline">students</span>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-right">
                      <span className={`font-bold ${getWaitTimeColor(queue.waitTime)}`}>
                        {queue.waitTime}
                      </span>
                      <span className="text-gray-500 ml-1">min</span>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-right">
                      <div className="flex justify-end space-x-1 md:space-x-2">
                        <motion.button
                          className="text-blue-600 hover:text-blue-800 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="View Details"
                        >
                          <FaEye size={14} />
                        </motion.button>
                        <motion.button
                          className={`${queue.status === 'active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-success-green hover:text-dark-green'} p-1`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleQueueStatus(queue.id, queue.status);
                          }}
                          title={queue.status === 'active' ? 'Pause Queue' : 'Activate Queue'}
                        >
                          <FaEdit size={14} />
                        </motion.button>
                        <motion.button
                          className="text-red-600 hover:text-red-800 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmAction({ action: 'clear', queueId: queue.id });
                          }}
                          title="Clear Queue"
                        >
                          <FaTrash size={14} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredQueues.length === 0 && (
            <div className="text-center py-6 md:py-8 bg-gray-50 rounded-lg">
              <FaListUl className="mx-auto text-2xl md:text-3xl text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm md:text-base">No active queues found</p>
              <p className="text-gray-400 text-xs md:text-sm mt-1">Adjust your filters to see more queues</p>
            </div>
          )}
        </motion.div>
        
        {/* Queue Details */}
        {selectedQueue && (
          <motion.div
            className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {/* Find the selected queue */}
              {(() => {
              const queue = activeQueues.find((q) => q.id === selectedQueue);
              if (!queue) return null;
                            return (
                <div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                    <h2 className="text-lg md:text-xl font-bold">{queue.name} Queue Details</h2>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                      <button
                        className={`${queue.status === 'active' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-success-green hover:bg-dark-green'} text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded text-xs md:text-sm flex items-center`}
                        onClick={() => handleToggleQueueStatus(queue.id, queue.status)}
                      >
                        {queue.status === 'active' ? (
                          <>
                            <FaClock className="mr-1 md:mr-2" />
                            Pause Queue
                          </>
                        ) : (
                          <>
                            <FaCheckCircle className="mr-1 md:mr-2" />
                            Activate Queue
                          </>
                        )}
                      </button>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded text-xs md:text-sm flex items-center"
                        onClick={() => setConfirmAction({ action: 'reset', queueId: queue.id })}
                      >
                        <FaSync className="mr-1 md:mr-2" />
                        Reset Queue
                      </button>
                      <button
                        className="bg-error-red hover:bg-red-700 text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded text-xs md:text-sm flex items-center"
                        onClick={() => setConfirmAction({ action: 'clear', queueId: queue.id })}
                      >
                        <FaTrash className="mr-1 md:mr-2" />
                        Clear Queue
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Queue Stats */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-700 mb-3">Queue Stats</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Length:</span>
                          <span className="font-bold">{queue.queueLength} students</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Wait Time:</span>
                          <span className="font-bold">{queue.waitTime} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-bold capitalize ${
                            queue.status === 'active' ? 'text-success-green' :
                            queue.status === 'paused' ? 'text-yellow-500' : 'text-gray-500'
                          }`}>{queue.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created At:</span>
                          <span className="font-bold">{queue.createdAt}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Served Today:</span>
                          <span className="font-bold">{queue.servedToday} students</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Current Students */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm col-span-2">
                      <h3 className="font-bold text-gray-700 mb-3">Current Students in Queue</h3>
                      <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
                        <table className="min-w-full text-xs md:text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="py-1.5 md:py-2 px-2 md:px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                              <th className="py-1.5 md:py-2 px-2 md:px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="hidden sm:table-cell py-1.5 md:py-2 px-2 md:px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matric No</th>
                              <th className="py-1.5 md:py-2 px-2 md:px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait</th>
                              <th className="py-1.5 md:py-2 px-2 md:px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {/* Mock data - in a real app, this would come from your state */}
                            {[1, 2, 3].map((_, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-1.5 md:py-2 px-2 md:px-3">{index + 1}</td>
                                <td className="py-1.5 md:py-2 px-2 md:px-3">Student Name {index + 1}</td>
                                <td className="hidden sm:table-cell py-1.5 md:py-2 px-2 md:px-3">MT-2023{100 + index}</td>
                                <td className="py-1.5 md:py-2 px-2 md:px-3">{(index + 1) * 5} min</td>
                                <td className="py-1.5 md:py-2 px-2 md:px-3 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button className="text-blue-600 hover:text-blue-800 text-xs md:text-sm px-2 py-0.5 bg-blue-50 rounded">
                                      Call
                                    </button>
                                    <button className="text-red-600 hover:text-red-800 text-xs md:text-sm px-2 py-0.5 bg-red-50 rounded">
                                      Remove
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Additional Queue Controls */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-1 px-3 rounded text-sm flex items-center"
                        >
                          <FaUsersCog className="mr-1" />
                          Assign Staff
                        </button>
                        <button
                          className="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-1 px-3 rounded text-sm flex items-center"
                        >
                          <FaUsers className="mr-1" />
                          View All History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
        
        {/* Summary Metrics */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          variants={itemVariants}
        >
          <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-green-100 text-success-green mr-3 md:mr-4">
                <FaUsers className="text-xs md:text-base" />
              </div>
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Total Students</p>
                <p className="font-bold text-lg md:text-xl">128</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-blue-100 text-blue-600 mr-3 md:mr-4">
                <FaListUl className="text-xs md:text-base" />
              </div>
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Active Queues</p>
                <p className="font-bold text-lg md:text-xl">{filteredQueues.filter((q: Queue) => q.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3 md:mr-4">
                <FaClock className="text-xs md:text-base" />
              </div>
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Avg Wait Time</p>
                <p className="font-bold text-lg md:text-xl">
                  {filteredQueues.length > 0 
                    ? Math.round(filteredQueues.reduce((sum: number, q: Queue) => sum + q.waitTime, 0) / filteredQueues.length) 
                    : 0} min
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 md:p-3 rounded-full bg-green-100 text-success-green mr-3 md:mr-4">
                <FaCheck className="text-xs md:text-base" />
              </div>
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Served Today</p>
                <p className="font-bold text-lg md:text-xl">
                  {filteredQueues.reduce((sum: number, q: Queue) => sum + (q.servedToday || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Confirmation dialog */}
      {confirmAction.action && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 md:px-0">
          <motion.div 
            className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
              {confirmAction.action === 'clear' ? 'Clear Queue' : 'Reset Queue'}
            </h3>
            <p className="mb-4 md:mb-6 text-sm md:text-base">
              {confirmAction.action === 'clear' 
                ? 'Are you sure you want to clear this queue? All students will be removed and this action cannot be undone.' 
                : 'Are you sure you want to reset this queue? This will clear current data but keep the queue structure intact.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-1.5 md:py-2 px-3 md:px-4 rounded text-sm"
                onClick={() => setConfirmAction({ action: null, queueId: null })}
              >
                Cancel
              </button>
              <button
                className="bg-error-red hover:bg-red-700 text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded text-sm"
                onClick={() => {
                  if (confirmAction.action === 'clear' && confirmAction.queueId) {
                    handleClearQueue(confirmAction.queueId);
                  } else if (confirmAction.action === 'reset' && confirmAction.queueId) {
                    handleResetQueue(confirmAction.queueId);
                  }
                }}
              >
                {confirmAction.action === 'clear' ? 'Clear Queue' : 'Reset Queue'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QueueMonitoring;
