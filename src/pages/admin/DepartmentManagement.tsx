import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/layout/AdminLayout';
import { useAdmin } from '../../context/useAdmin';
import { FaBuilding, FaPlus, FaEdit, FaTrash, FaExclamationCircle, FaCheck } from 'react-icons/fa';

const DepartmentManagement = () => {
  const { staffMembers } = useAdmin();
  const [departments, setDepartments] = useState([
    {
      id: 'dept-1',
      name: 'Financial Aid',
      description: 'Financial aid services and scholarship information',
      logoUrl: '💰',
      staffCount: staffMembers.filter(s => s.department === 'Financial Aid').length
    },
    {
      id: 'dept-2',
      name: 'Registration',
      description: 'Course registration and class scheduling',
      logoUrl: '📝',
      staffCount: staffMembers.filter(s => s.department === 'Registration').length
    },
    {
      id: 'dept-3',
      name: 'Academic Advising',
      description: 'Academic guidance and program planning',
      logoUrl: '🎓',
      staffCount: staffMembers.filter(s => s.department === 'Academic Advising').length
    },
    {
      id: 'dept-4',
      name: 'IT Support',
      description: 'Technical support for campus systems',
      logoUrl: '💻',
      staffCount: staffMembers.filter(s => s.department === 'IT Support').length
    },
    {
      id: 'dept-5',
      name: 'Student Affairs',
      description: 'Housing, dining, and campus life services',
      logoUrl: '🏠',
      staffCount: staffMembers.filter(s => s.department === 'Student Affairs').length
    },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDept, setEditingDept] = useState<null | string>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '🏢',
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState<null | string>(null);
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

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle add department
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDept = {
      id: `dept-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      logoUrl: formData.logoUrl,
      staffCount: 0
    };
    
    setDepartments([...departments, newDept]);
    setFormData({ name: '', description: '', logoUrl: '🏢' });
    setShowAddForm(false);
    
    setNotification({
      message: `Department "${formData.name}" has been added successfully.`,
      type: 'success'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle edit department
  const handleEditDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    
    setDepartments(departments.map(dept => 
      dept.id === editingDept
        ? { 
            ...dept, 
            name: formData.name, 
            description: formData.description, 
            logoUrl: formData.logoUrl 
          }
        : dept
    ));
    
    setEditingDept(null);
    setFormData({ name: '', description: '', logoUrl: '🏢' });
    
    setNotification({
      message: `Department "${formData.name}" has been updated successfully.`,
      type: 'success'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  // Set up edit form
  const startEditing = (dept: any) => {
    setEditingDept(dept.id);
    setFormData({
      name: dept.name,
      description: dept.description,
      logoUrl: dept.logoUrl,
    });
  };

  // Handle delete department
  const handleDeleteDepartment = (id: string) => {
    const deptToDelete = departments.find(dept => dept.id === id);
    
    setDepartments(departments.filter(dept => dept.id !== id));
    setShowConfirmDelete(null);
    
    setNotification({
      message: `Department "${deptToDelete?.name}" has been deleted.`,
      type: 'success'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };

  // Cancel add/edit
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingDept(null);
    setFormData({ name: '', description: '', logoUrl: '🏢' });
  };

  // List of emojis for department icons
  const emojiOptions = [
    '🏢', '🏫', '🎓', '📚', '💰', '💻', '📊', '🏥', '🛏️', '🏆',
    '🍽️', '📝', '🔬', '🎭', '🎨', '📱', '🔧', '🚌', '🤝', '🧠'
  ];

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
          className="flex flex-wrap justify-between items-center gap-3 mb-4 md:mb-6"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-dark-charcoal flex items-center">
              <FaBuilding className="mr-2 text-primary-green" />
              Department Management
            </h1>
            <p className="text-gray-600 mt-1 text-xs md:text-sm">
              Add, edit, or remove departments in the CampusQ system
            </p>
          </div>
          
          {!showAddForm && !editingDept && (
            <motion.button
              className="bg-primary-green hover:bg-dark-green text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded flex items-center text-xs md:text-sm"
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus className="mr-1 md:mr-2" />
              Add Department
            </motion.button>
          )}
        </motion.div>
        
        {/* Notification */}
        {notification && (
          <motion.div 
            className={`mb-4 md:mb-6 p-3 md:p-4 rounded-md text-xs md:text-sm ${notification.type === 'success' ? 'bg-success-green/10 text-success-green border-l-4 border-success-green' : 'bg-error-red/10 text-error-red border-l-4 border-error-red'}`}
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
        
        {/* Add/Edit Department Form */}
        {(showAddForm || editingDept) && (
          <motion.div 
            className="bg-light-gray p-6 rounded-lg mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">
              {editingDept ? 'Edit Department' : 'Add New Department'}
            </h2>
            
            <form onSubmit={editingDept ? handleEditDepartment : handleAddDepartment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                      Department Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                      placeholder="e.g., Financial Aid"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                      placeholder="Brief description of this department"
                      rows={3}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">
                    Department Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        className={`h-12 w-12 text-2xl rounded-md flex items-center justify-center ${
                          formData.logoUrl === emoji
                            ? 'bg-primary-green/20 border-2 border-primary-green'
                            : 'bg-white border border-gray-300 hover:bg-light-gray'
                        }`}
                        onClick={() => setFormData({ ...formData, logoUrl: emoji })}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <div className="bg-white border border-gray-300 rounded-md p-4 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-3xl mb-2">{formData.logoUrl}</div>
                      <div className="text-sm font-medium">
                        {formData.name || 'Department Name'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-green hover:bg-dark-green text-white font-medium py-2 px-4 rounded"
                >
                  {editingDept ? 'Save Changes' : 'Add Department'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Department List */}
        <div>
          <motion.div 
            className="overflow-x-auto"
            variants={itemVariants}
          >
            <table className="min-w-full bg-white text-xs md:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left">Icon</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left">Department</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left">Description</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-left">Staff</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departments.map((dept, index) => (
                  <motion.tr 
                    key={dept.id}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-light-gray flex items-center justify-center text-xl md:text-2xl">
                        {dept.logoUrl}
                      </div>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 font-medium">{dept.name}</td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-gray-600 max-w-xs truncate">
                      {dept.description}
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4">
                      <span className="bg-primary-green/10 text-primary-green px-2 py-1 rounded">
                        {dept.staffCount} staff
                      </span>
                    </td>
                    <td className="py-2 md:py-3 px-2 md:px-4 text-right">
                      <div className="flex justify-end space-x-1 md:space-x-2">
                        <motion.button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => startEditing(dept)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit Department"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => setShowConfirmDelete(dept.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete Department"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                      {/* Confirmation dialog */}
                      {showConfirmDelete === dept.id && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-2">
                          <motion.div 
                            className="bg-white rounded-lg p-4 md:p-6 max-w-xs md:max-w-md w-full mx-2"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4">Confirm Delete</h3>
                            <p className="mb-4 md:mb-6 text-xs md:text-base">
                              Are you sure you want to delete the department "{dept.name}"? 
                              This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-2 md:space-x-3">
                              <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-1.5 md:py-2 px-3 md:px-4 rounded text-xs md:text-sm"
                                onClick={() => setShowConfirmDelete(null)}
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-error-red hover:bg-red-700 text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded text-xs md:text-sm"
                                onClick={() => handleDeleteDepartment(dept.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          
          {departments.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FaBuilding className="mx-auto text-2xl md:text-3xl text-gray-300 mb-2" />
              <p className="text-gray-500 text-xs md:text-base">No departments found</p>
              <button
                className="mt-4 bg-primary-green hover:bg-dark-green text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded inline-flex items-center text-xs md:text-sm"
                onClick={() => setShowAddForm(true)}
              >
                <FaPlus className="mr-2" />
                Add Department
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DepartmentManagement;
