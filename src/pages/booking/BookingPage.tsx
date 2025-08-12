import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useStore } from '../../data/store';
import { useUser } from '../../context/UserContext';

const BookingPage = () => {
  const navigate = useNavigate();
  const { departments, addBooking } = useStore();
  const { username, isAuthenticated } = useUser();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const [formData, setFormData] = useState({
    name: username || '',
    studentId: '',
    department: '',
    timeSlot: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    studentId: '',
    department: '',
    timeSlot: '',
  });
  
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    setErrors({
      ...errors,
      [name]: '',
    });
  };
  
  const validate = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
      isValid = false;
    }
    
    if (!formData.department) {
      newErrors.department = 'Please select a department';
      isValid = false;
    }
    
    if (!formData.timeSlot) {
      newErrors.timeSlot = 'Please select a time slot';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Add booking to store
      addBooking(formData);
      
      // Navigate to status page
      navigate('/status');
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          {username && (
            <div className="bg-primary-green/10 border border-primary-green/30 rounded-lg p-4 mb-6">
              <p className="text-dark-green font-medium">
                Welcome, <span className="font-bold">{username}</span>! Ready to book your slot?
              </p>
            </div>
          )}
          
          <h1 className="text-3xl font-bold text-dark-charcoal mb-6 text-center">Book a Slot</h1>
          
          <p className="text-gray-600 mb-8 text-center">
            Fill out the form below to secure your place in the queue.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-dark-charcoal font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.name ? 'border-error-red' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-green`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-error-red text-sm">{errors.name}</p>}
            </div>
            
            {/* Student ID */}
            <div>
              <label htmlFor="studentId" className="block text-dark-charcoal font-medium mb-2">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.studentId ? 'border-error-red' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-green`}
                placeholder="Enter your student ID"
              />
              {errors.studentId && <p className="mt-1 text-error-red text-sm">{errors.studentId}</p>}
            </div>
            
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-dark-charcoal font-medium mb-2">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.department ? 'border-error-red' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-green`}
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name} (Current Queue: {dept.currentQueueLength})
                  </option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-error-red text-sm">{errors.department}</p>}
            </div>
            
            {/* Time Slot */}
            <div>
              <label htmlFor="timeSlot" className="block text-dark-charcoal font-medium mb-2">
                Preferred Time Slot
              </label>
              <select
                id="timeSlot"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.timeSlot ? 'border-error-red' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary-green`}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.timeSlot && <p className="mt-1 text-error-red text-sm">{errors.timeSlot}</p>}
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary-green hover:bg-dark-green text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
