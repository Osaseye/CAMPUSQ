import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useStore } from '../../data/store';
import { useUser } from '../../context/UserContext';
import { FaCalendarAlt, FaBuilding, FaIdCard, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { departments, addBooking } = useStore();
  const { userInfo, isAuthenticated, availableDepartments, joinQueue } = useUser();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const initialDeptId = searchParams.get('dept') || '';
  
  const [formData, setFormData] = useState({
    name: `${userInfo.firstName} ${userInfo.lastName}` || '',
    studentId: userInfo.studentId || '',
    department: initialDeptId,
    timeSlot: '',
    queueName: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    studentId: '',
    department: '',
    timeSlot: '',
    queueName: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        // Get department info
        const selectedDept = departments.find(d => d.id === formData.department);
        
        // Add booking to store for compatibility
        addBooking(formData);
        
        // Create a queue name if not provided
        const queueName = formData.queueName || 
          `${selectedDept?.name || 'Department'} Consultation`;
        
        // Add to user queues with the context
        await joinQueue(
          formData.department,
          queueName
        );
        
        // Show success message
        setShowSuccess(true);
        
        // Reset some form fields
        setFormData(prev => ({
          ...prev,
          department: '',
          timeSlot: '',
          queueName: ''
        }));
        
        // Hide success after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          // Navigate to status page after showing success
          navigate('/status');
        }, 3000);
        
      } catch (error) {
        console.error('Error joining queue:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Success Message */}
          {showSuccess && (
            <motion.div 
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-md"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-medium">Success! You've been added to the queue.</p>
              <p className="text-sm mt-1">Check your status in the dashboard.</p>
            </motion.div>
          )}
        
          {userInfo.firstName && (
            <motion.div 
              className="bg-primary-green/10 border border-primary-green/30 rounded-lg p-4 mb-6"
              variants={itemVariants}
            >
              <p className="text-dark-green font-medium">
                Welcome, <span className="font-bold">{userInfo.firstName}</span>! Ready to book your slot?
              </p>
            </motion.div>
          )}
          
          <motion.h1 
            className="text-3xl font-bold text-dark-charcoal mb-6 text-center"
            variants={itemVariants}
          >
            Book a Queue Slot
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 mb-8 text-center"
            variants={itemVariants}
          >
            Fill out the form below to secure your place in the queue.
          </motion.p>
          
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-dark-charcoal font-medium mb-2 flex items-center gap-1.5">
                <FaUser className="text-primary-green" size={14} />
                <span>Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-error-red' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent`}
                  placeholder="Enter your full name"
                  readOnly
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-primary-green/50" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">From Profile</span>
                </div>
              </div>
              {errors.name && <p className="mt-1 text-error-red text-sm">{errors.name}</p>}
            </div>
            
            {/* Student ID */}
            <div>
              <label htmlFor="studentId" className="block text-dark-charcoal font-medium mb-2 flex items-center gap-1.5">
                <FaIdCard className="text-primary-green" size={14} />
                <span>Student ID</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                    errors.studentId ? 'border-error-red' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent`}
                  placeholder="Enter your student ID"
                  readOnly
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="text-primary-green/50" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">From Profile</span>
                </div>
              </div>
              {errors.studentId && <p className="mt-1 text-error-red text-sm">{errors.studentId}</p>}
            </div>
            
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-dark-charcoal font-medium mb-2 flex items-center gap-1.5">
                <FaBuilding className="text-primary-green" size={14} />
                <span>Department</span>
              </label>
              <div className="relative">
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-3 rounded-lg border appearance-none ${
                    errors.department ? 'border-error-red' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent`}
                >
                  <option value="">Select a department</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.queueCount} {dept.queueCount === 1 ? 'queue' : 'queues'})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-primary-green/50" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.department && <p className="mt-1 text-error-red text-sm">{errors.department}</p>}
            </div>
            
            {/* Queue Name (New Field) */}
            <div>
              <label htmlFor="queueName" className="block text-dark-charcoal font-medium mb-2 flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                <span>Queue Name (Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="queueName"
                  name="queueName"
                  value={formData.queueName}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-3 rounded-lg border ${
                    errors.queueName ? 'border-error-red' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent`}
                  placeholder="e.g., Financial Aid Consultation"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-primary-green/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-gray-500 text-xs">Leave blank for default queue name.</p>
            </div>
            
            {/* Time Slot */}
            <div>
              <label htmlFor="timeSlot" className="block text-dark-charcoal font-medium mb-2 flex items-center gap-1.5">
                <FaCalendarAlt className="text-primary-green" size={14} />
                <span>Preferred Time Slot</span>
              </label>
              <div className="relative">
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className={`w-full pl-10 px-4 py-3 rounded-lg border appearance-none ${
                    errors.timeSlot ? 'border-error-red' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent`}
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-primary-green/50" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.timeSlot && <p className="mt-1 text-error-red text-sm">{errors.timeSlot}</p>}
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary-green hover:bg-dark-green text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 
                flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {isSubmitting ? 'Processing...' : 'Join Queue'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default BookingPage;
