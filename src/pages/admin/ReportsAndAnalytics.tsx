 import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/useAdmin';
import { 
  FaChartLine, FaDownload, FaCalendarAlt, FaTable, 
  FaChartBar, FaChartPie, FaUsers, FaCheck, 
  FaTimes, FaRegCalendarCheck, FaRegCalendarTimes,
  FaFilter, FaFileExport, FaSearch 
} from 'react-icons/fa';

type TimeRange = 'today' | 'yesterday' | 'week' | 'month' | 'custom';
type ReportType = 'queue_activity' | 'service_time' | 'staff_performance' | 'peak_hours';
type ExportFormat = 'pdf' | 'excel' | 'csv';

const ReportsAndAnalytics = () => {
  const { reports, exportReport, generateReport } = useAdmin();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [reportType, setReportType] = useState<ReportType>('queue_activity');
  const [customDateRange, setCustomDateRange] = useState({
    from: '',
    to: '',
  });
  const [department, setDepartment] = useState('all');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [showExportOptions, setShowExportOptions] = useState(false);

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

  // Handle generating a report
  const handleGenerateReport = () => {
    setLoading(true);
    
    // In a real implementation, this would call your API/context method
    setTimeout(() => {
      generateReport({
        timeRange,
        reportType,
        department,
        customDateRange: timeRange === 'custom' ? customDateRange : undefined,
      });
      
      setLoading(false);
      
      setNotification({
        message: 'Report generated successfully',
        type: 'success'
      });
      
      setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  // Handle exporting a report
  const handleExportReport = (format: ExportFormat) => {
    setLoading(true);
    
    // In a real implementation, this would call your API/context method
    setTimeout(() => {
      exportReport({
        format,
        reportType,
        timeRange,
        department,
        customDateRange: timeRange === 'custom' ? customDateRange : undefined,
      });
      
      setLoading(false);
      setShowExportOptions(false);
      
      setNotification({
        message: `Report exported as ${format.toUpperCase()} successfully`,
        type: 'success'
      });
      
      setTimeout(() => setNotification(null), 3000);
    }, 1500);
  };

  // Get appropriate date range label
  const getDateRangeLabel = () => {
    switch (timeRange) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'Last 30 Days';
      case 'custom':
        return `${customDateRange.from} to ${customDateRange.to}`;
      default:
        return '';
    }
  };

  // Get appropriate report type label
  const getReportTypeLabel = () => {
    switch (reportType) {
      case 'queue_activity':
        return 'Queue Activity';
      case 'service_time':
        return 'Service Time Analysis';
      case 'staff_performance':
        return 'Staff Performance';
      case 'peak_hours':
        return 'Peak Hours Analysis';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-2xl font-bold text-dark-charcoal flex items-center">
              <FaChartLine className="mr-2 text-primary-green" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Generate and export reports on queue activity, service times, and more
            </p>
          </div>
        </motion.div>

        {/* Notification */}
        {notification && (
          <motion.div 
            className={`mb-6 p-4 rounded-md ${notification.type === 'success' ? 'bg-success-green/10 text-success-green border-l-4 border-success-green' : 'bg-error-red/10 text-error-red border-l-4 border-error-red'}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <FaCheck className="mr-2" />
              ) : (
                <FaTimes className="mr-2" />
              )}
              <p>{notification.message}</p>
            </div>
          </motion.div>
        )}

        {/* Report controls */}
        <motion.div 
          className="bg-light-gray p-6 rounded-lg mb-6"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold mb-4">Generate Report</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="reportType">
                Report Type
              </label>
              <select
                id="reportType"
                name="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              >
                <option value="queue_activity">Queue Activity</option>
                <option value="service_time">Service Time Analysis</option>
                <option value="staff_performance">Staff Performance</option>
                <option value="peak_hours">Peak Hours Analysis</option>
              </select>
            </div>
            
            {/* Time Range */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="timeRange">
                Time Range
              </label>
              <select
                id="timeRange"
                name="timeRange"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            {/* Department Filter */}
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="department">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Generate Button */}
            <div className="flex items-end">
              <button
                type="button"
                className="bg-primary-green hover:bg-dark-green text-white font-medium py-2 px-4 rounded flex items-center w-full justify-center"
                onClick={handleGenerateReport}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <FaChartBar className="mr-2" />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Custom Date Range */}
          {timeRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="fromDate">
                  From Date
                </label>
                <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  value={customDateRange.from}
                  onChange={(e) => setCustomDateRange({...customDateRange, from: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="toDate">
                  To Date
                </label>
                <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  value={customDateRange.to}
                  onChange={(e) => setCustomDateRange({...customDateRange, to: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Report display */}
        <motion.div 
          className="mb-6"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {getReportTypeLabel()} - {getDateRangeLabel()}
              {department !== 'all' && ` - ${department}`}
            </h2>
            
            <div className="relative">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center"
                onClick={() => setShowExportOptions(!showExportOptions)}
              >
                <FaFileExport className="mr-2" />
                Export
              </button>
              
              {showExportOptions && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
                  <ul>
                    <li>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => handleExportReport('pdf')}
                      >
                        <FaDownload className="mr-2 text-red-500" />
                        Export as PDF
                      </button>
                    </li>
                    <li>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => handleExportReport('excel')}
                      >
                        <FaDownload className="mr-2 text-green-500" />
                        Export as Excel
                      </button>
                    </li>
                    <li>
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                        onClick={() => handleExportReport('csv')}
                      >
                        <FaDownload className="mr-2 text-blue-500" />
                        Export as CSV
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Report visualization - this is just a placeholder, replace with actual charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart 1 - Queue Volume */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold mb-4 text-gray-700">Queue Volume</h3>
              <div className="h-60 flex items-center justify-center bg-gray-50 rounded">
                {/* This would be a chart component in a real app */}
                <div className="text-center">
                  <FaChartBar className="mx-auto text-4xl text-primary-green mb-2" />
                  <p className="text-gray-500">Queue Volume Chart</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center justify-between">
                  <span>Total Students Served:</span>
                  <span className="font-bold">247</span>
                </p>
                <p className="flex items-center justify-between mt-1">
                  <span>Average Per Day:</span>
                  <span className="font-bold">35.3</span>
                </p>
              </div>
            </div>
            
            {/* Chart 2 - Service Times */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold mb-4 text-gray-700">Service Times</h3>
              <div className="h-60 flex items-center justify-center bg-gray-50 rounded">
                {/* This would be a chart component in a real app */}
                <div className="text-center">
                  <FaChartPie className="mx-auto text-4xl text-blue-500 mb-2" />
                  <p className="text-gray-500">Service Times Chart</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center justify-between">
                  <span>Average Wait Time:</span>
                  <span className="font-bold">14.2 min</span>
                </p>
                <p className="flex items-center justify-between mt-1">
                  <span>Average Service Time:</span>
                  <span className="font-bold">8.7 min</span>
                </p>
              </div>
            </div>
            
            {/* Chart 3 - Daily Comparison */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold mb-4 text-gray-700">Daily Comparison</h3>
              <div className="h-60 flex items-center justify-center bg-gray-50 rounded">
                {/* This would be a chart component in a real app */}
                <div className="text-center">
                  <FaCalendarAlt className="mx-auto text-4xl text-purple-500 mb-2" />
                  <p className="text-gray-500">Daily Comparison Chart</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center justify-between">
                  <span>Busiest Day:</span>
                  <span className="font-bold">Monday</span>
                </p>
                <p className="flex items-center justify-between mt-1">
                  <span>Quietest Day:</span>
                  <span className="font-bold">Friday</span>
                </p>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-700">Detailed Data</h3>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    className="w-64 pl-8 pr-4 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-green text-sm"
                    placeholder="Search data..."
                  />
                  <FaSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
                </div>
                
                <button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded text-sm flex items-center"
                >
                  <FaFilter className="mr-1" />
                  Filter
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Department</th>
                    <th className="py-3 px-4 text-left">Total Students</th>
                    <th className="py-3 px-4 text-left">Avg. Wait Time</th>
                    <th className="py-3 px-4 text-left">Avg. Service Time</th>
                    <th className="py-3 px-4 text-left">Satisfaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">2023-05-01</td>
                    <td className="py-3 px-4">Registration</td>
                    <td className="py-3 px-4">42</td>
                    <td className="py-3 px-4">12.5 min</td>
                    <td className="py-3 px-4">8.2 min</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="ml-2 text-green-600">85%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">2023-05-02</td>
                    <td className="py-3 px-4">Financial Aid</td>
                    <td className="py-3 px-4">38</td>
                    <td className="py-3 px-4">15.3 min</td>
                    <td className="py-3 px-4">12.1 min</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '72%'}}></div>
                        </div>
                        <span className="ml-2 text-yellow-600">72%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">2023-05-03</td>
                    <td className="py-3 px-4">Academic Advising</td>
                    <td className="py-3 px-4">25</td>
                    <td className="py-3 px-4">8.7 min</td>
                    <td className="py-3 px-4">15.4 min</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                        </div>
                        <span className="ml-2 text-green-600">90%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">2023-05-04</td>
                    <td className="py-3 px-4">IT Support</td>
                    <td className="py-3 px-4">31</td>
                    <td className="py-3 px-4">5.2 min</td>
                    <td className="py-3 px-4">7.8 min</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '88%'}}></div>
                        </div>
                        <span className="ml-2 text-green-600">88%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">2023-05-05</td>
                    <td className="py-3 px-4">Student Affairs</td>
                    <td className="py-3 px-4">18</td>
                    <td className="py-3 px-4">3.5 min</td>
                    <td className="py-3 px-4">9.2 min</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
                        </div>
                        <span className="ml-2 text-green-600">95%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing 5 of 24 entries
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded text-sm flex items-center">
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  <button className="bg-primary-green text-white w-6 h-6 rounded flex items-center justify-center">1</button>
                  <button className="text-gray-700 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100">2</button>
                  <button className="text-gray-700 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100">3</button>
                  <span className="text-gray-400">...</span>
                  <button className="text-gray-700 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-100">5</button>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-3 rounded text-sm flex items-center">
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ReportsAndAnalytics;
