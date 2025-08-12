import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useStore } from '../../data/store';
import { useUser } from '../../context/UserContext';

const AdminDashboard = () => {
  const { bookings, departments, markAsServed, removeBooking } = useStore();
  const { username } = useUser();
  const [activeTab, setActiveTab] = useState('queues');
  
  const handleMarkAsServed = (bookingId: string) => {
    markAsServed(bookingId);
  };
  
  const handleRemoveBooking = (bookingId: string) => {
    removeBooking(bookingId);
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-dark-charcoal text-white p-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-300 mt-1">
              {username ? `Welcome back, ${username}! Manage queues and bookings` : 'Manage queues and bookings'}
            </p>
          </div>
          
          {/* Tabs */}
          <div className="bg-gray-100 px-6 py-3 flex border-b">
            <button
              onClick={() => setActiveTab('queues')}
              className={`py-2 px-4 mr-2 rounded-t-lg font-medium ${
                activeTab === 'queues'
                  ? 'bg-white text-primary-green border-b-2 border-primary-green'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Queue Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-4 rounded-t-lg font-medium ${
                activeTab === 'bookings'
                  ? 'bg-white text-primary-green border-b-2 border-primary-green'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Bookings
            </button>
          </div>
          
          {/* Queue Overview Tab */}
          {activeTab === 'queues' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-dark-charcoal mb-4">Department Queues</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookingsByDepartment.map(({ department, bookings }) => (
                  <div 
                    key={department.id}
                    className="bg-light-gray rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg text-dark-charcoal">{department.name}</h3>
                      <span className="bg-primary-green text-white px-3 py-1 rounded-full text-sm">
                        {bookings.length} in queue
                      </span>
                    </div>
                    
                    {bookings.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                          <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                              <th className="py-3 px-4 text-left">Queue #</th>
                              <th className="py-3 px-4 text-left">Name</th>
                              <th className="py-3 px-4 text-left">Time Slot</th>
                              <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-600 text-sm">
                            {bookings.map((booking) => (
                              <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-4">{booking.queueNumber}</td>
                                <td className="py-3 px-4">{booking.name}</td>
                                <td className="py-3 px-4">{booking.timeSlot}</td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => handleMarkAsServed(booking.id)}
                                    className="bg-success-green hover:bg-green-600 text-white px-3 py-1 rounded text-xs mr-2"
                                  >
                                    Serve
                                  </button>
                                  <button
                                    onClick={() => handleRemoveBooking(booking.id)}
                                    className="bg-error-red hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No bookings in this queue</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* All Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-dark-charcoal mb-4">All Bookings</h2>
              
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-4 text-left">Queue #</th>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Student ID</th>
                        <th className="py-3 px-4 text-left">Department</th>
                        <th className="py-3 px-4 text-left">Time Slot</th>
                        <th className="py-3 px-4 text-left">Wait Time</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-3 px-4">{booking.queueNumber}</td>
                          <td className="py-3 px-4">{booking.name}</td>
                          <td className="py-3 px-4">{booking.studentId}</td>
                          <td className="py-3 px-4">{booking.department}</td>
                          <td className="py-3 px-4">{booking.timeSlot}</td>
                          <td className="py-3 px-4">{booking.estimatedWaitTime}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleMarkAsServed(booking.id)}
                              className="bg-success-green hover:bg-green-600 text-white px-3 py-1 rounded text-xs mr-2"
                            >
                              Mark as Served
                            </button>
                            <button
                              onClick={() => handleRemoveBooking(booking.id)}
                              className="bg-error-red hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-light-gray rounded-lg p-8 text-center">
                  <p className="text-gray-500">No bookings available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
