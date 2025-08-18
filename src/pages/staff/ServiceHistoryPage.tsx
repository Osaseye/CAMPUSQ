import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStaff } from '../../context/useStaff';
import {
  FaHistory, FaFilter, FaSearch, FaSort,
  FaFileExport, FaCalendarAlt, FaPrint
} from 'react-icons/fa';

const ServiceHistoryPage = () => {
  const { servedToday } = useStaff();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('bookingTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
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
  
  // Filter and sort the history
  const filteredHistory = servedToday
    .filter((student) => {
      return (
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
  
  // Handle export (mock function)
  const handleExport = () => {
    alert('Exporting records...');
    // In a real app, this would trigger a download
  };
  
  // Handle print (mock function)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-dark-charcoal flex items-center">
              <FaHistory className="mr-2 text-blue-500" />
              Service History
            </h1>
            <p className="text-sm text-gray-600">
              Records of students served today
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center text-sm"
            >
              <FaFileExport className="mr-1 md:mr-2" />
              <span className="hidden xs:inline">Export</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center text-sm"
            >
              <FaPrint className="mr-1 md:mr-2" />
              <span className="hidden xs:inline">Print</span>
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row flex-wrap gap-3 md:gap-4">
          <div className="w-full md:flex-grow">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-4 items-center w-full md:w-auto">
            <div className="flex items-center flex-1 md:flex-auto">
              <span className="mr-2 text-gray-600">
                <FaCalendarAlt />
              </span>
              <select
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="flex items-center flex-1 md:flex-auto">
              <span className="mr-2 text-gray-600">
                <FaSort />
              </span>
              <select
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortBy(field);
                  setSortDirection(direction as 'asc' | 'desc');
                }}
              >
                <option value="bookingTime-desc">Time (Newest)</option>
                <option value="bookingTime-asc">Time (Oldest)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="queueNumber-asc">Queue # (Low-High)</option>
                <option value="queueNumber-desc">Queue # (High-Low)</option>
              </select>
            </div>
          </div>
          
          <div className="text-gray-600 text-sm mt-1 md:mt-0 ml-auto">
            {filteredHistory.length} record{filteredHistory.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {/* Service History Table */}
        {filteredHistory.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredHistory.map((student) => (
                <div key={student.id} className="border rounded-lg overflow-hidden shadow-sm bg-white">
                  <div className="p-3 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 h-8 w-8 rounded-full flex items-center justify-center text-green-700 font-bold">
                        {student.queueNumber}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.studentId}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                      Served
                    </span>
                  </div>
                  <div className="p-3 text-xs bg-gray-50">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500 block">Booking Time:</span>
                        <span className="font-medium">{formatDate(student.bookingTime)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Served At:</span>
                        <span className="font-medium">{formatDate(new Date().toISOString())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop Table View */}
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
                      Service Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Served At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredHistory.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
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
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Served
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {/* In a real app, you would store and display the actual served timestamp */}
                          {formatDate(new Date().toISOString())}
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
            <p className="text-sm md:text-base text-gray-500">No service records found</p>
          </div>
        )}
        
        {/* Service Metrics */}
        <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-100">
            <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2">Total Served Today</h3>
            <p className="text-xl md:text-3xl font-bold">{servedToday.length}</p>
          </div>
          
          <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-100">
            <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2">Average Service Time</h3>
            <p className="text-xl md:text-3xl font-bold">5.2 min</p>
          </div>
          
          <div className="col-span-2 md:col-span-1 bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-100">
            <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1 md:mb-2">Peak Service Hour</h3>
            <p className="text-xl md:text-3xl font-bold">10:00 AM</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceHistoryPage;
