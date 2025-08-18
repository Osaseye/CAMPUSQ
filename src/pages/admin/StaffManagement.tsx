import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/useAdmin';
import { 
  FaUsersCog, FaUserPlus, FaEdit, FaTrash, FaCheck, FaExclamationCircle, 
  FaSort, FaSearch, FaSortAlphaDown, FaSortAlphaUp, FaFilter
} from 'react-icons/fa';

const StaffManagement = () => {
  const { staffMembers, addStaffMember, updateStaffMember, removeStaffMember } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'name' | 'email' | 'department'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: 'staff' as 'staff' | 'supervisor' | 'admin',
  });
  
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
  
  // Get unique departments for filter
  const departments = Array.from(new Set(staffMembers.map(staff => staff.department)));
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle add staff member
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    
    addStaffMember(formData);
    
    setFormData({
      name: '',
      email: '',
      department: '',
      role: 'staff',
    });
    setShowAddForm(false);
    
    setNotification({
      message: `${formData.name} has been added as ${formData.role}.`,
      type: 'success'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Handle edit staff member
  const handleEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStaff) {
      updateStaffMember(editingStaff, formData);
      
      setNotification({
        message: `${formData.name}'s information has been updated.`,
        type: 'success'
      });
      
      setTimeout(() => setNotification(null), 3000);
    }
    
    setFormData({
      name: '',
      email: '',
      department: '',
      role: 'staff',
    });
    setEditingStaff(null);
  };
  
  // Start editing a staff member
  const startEditing = (staff: typeof staffMembers[0]) => {
    setEditingStaff(staff.id);
    setFormData({
      name: staff.name,
      email: staff.email,
      department: staff.department,
      role: staff.role,
    });
  };
  
  // Handle delete staff member
  const handleDeleteStaff = (id: string) => {
    const staffToDelete = staffMembers.find(s => s.id === id);
    
    removeStaffMember(id);
    setShowConfirmDelete(null);
    
    if (staffToDelete) {
      setNotification({
        message: `${staffToDelete.name} has been removed from the system.`,
        type: 'success'
      });
      
      setTimeout(() => setNotification(null), 3000);
    }
  };
  
  // Cancel add/edit
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      department: '',
      role: 'staff',
    });
  };
  
  // Handle sort
  const handleSort = (field: 'name' | 'email' | 'department') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort staff members
  const filteredStaff = staffMembers
    .filter(staff => {
      const matchesSearch = searchTerm === '' || 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesDepartment = departmentFilter === 'all' || 
        staff.department === departmentFilter;
        
      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      let compareA = a[sortField].toLowerCase();
      let compareB = b[sortField].toLowerCase();
      
      if (sortDirection === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });
  
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
              <FaUsersCog className="mr-2 text-primary-green" />
              Staff Management
            </h1>
            <p className="text-gray-600 mt-1">
              Add, edit, or remove staff members in the CampusQ system
            </p>
          </div>
          
          {!showAddForm && !editingStaff && (
            <motion.button
              className="bg-primary-green hover:bg-dark-green text-white font-medium py-2 px-4 rounded flex items-center"
              onClick={() => setShowAddForm(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUserPlus className="mr-2" />
              Add Staff Member
            </motion.button>
          )}
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
                <FaExclamationCircle className="mr-2" />
              )}
              <p>{notification.message}</p>
            </div>
          </motion.div>
        )}
        
        {/* Add/Edit Staff Form */}
        {(showAddForm || editingStaff) && (
          <motion.div 
            className="bg-light-gray p-6 rounded-lg mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">
              {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            
            <form onSubmit={editingStaff ? handleEditStaff : handleAddStaff}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    placeholder="e.g., John Smith"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    placeholder="e.g., john.smith@university.edu"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="department">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                    <option value="Financial Aid">Financial Aid</option>
                    <option value="Registration">Registration</option>
                    <option value="Academic Advising">Academic Advising</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Student Affairs">Student Affairs</option>
                    <option value="System Administration">System Administration</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    required
                  >
                    <option value="staff">Staff</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
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
                  {editingStaff ? 'Save Changes' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* Search and Filter */}
        <motion.div 
          className="mb-6 flex flex-wrap items-center gap-4"
          variants={itemVariants}
        >
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-green"
                placeholder="Search staff by name, email or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">
              <FaFilter />
            </span>
            <select
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <span className="text-gray-600 text-sm">
              {filteredStaff.length} staff member{filteredStaff.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </motion.div>
        
        {/* Staff List */}
        <div>
          <motion.div 
            className="overflow-x-auto"
            variants={itemVariants}
          >
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                          <FaSortAlphaDown className="ml-1" /> : 
                          <FaSortAlphaUp className="ml-1" />
                      )}
                      {sortField !== 'name' && <FaSort className="ml-1 text-gray-300" />}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      <span>Email</span>
                      {sortField === 'email' && (
                        sortDirection === 'asc' ? 
                          <FaSortAlphaDown className="ml-1" /> : 
                          <FaSortAlphaUp className="ml-1" />
                      )}
                      {sortField !== 'email' && <FaSort className="ml-1 text-gray-300" />}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('department')}
                  >
                    <div className="flex items-center">
                      <span>Department</span>
                      {sortField === 'department' && (
                        sortDirection === 'asc' ? 
                          <FaSortAlphaDown className="ml-1" /> : 
                          <FaSortAlphaUp className="ml-1" />
                      )}
                      {sortField !== 'department' && <FaSort className="ml-1 text-gray-300" />}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.map((staff, index) => (
                  <motion.tr 
                    key={staff.id}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="py-3 px-4 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary-green/20 text-primary-green flex items-center justify-center font-bold mr-2">
                        {staff.name.charAt(0)}
                      </div>
                      <div className="font-medium">{staff.name}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{staff.email}</td>
                    <td className="py-3 px-4">{staff.department}</td>
                    <td className="py-3 px-4">
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          staff.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : staff.role === 'supervisor'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span 
                        className={`flex items-center ${
                          staff.isActive ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        <span 
                          className={`inline-block w-2 h-2 rounded-full mr-1 ${
                            staff.isActive ? 'bg-green-600' : 'bg-gray-400'
                          }`}
                        />
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => startEditing(staff)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit Staff"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => setShowConfirmDelete(staff.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete Staff"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                      
                      {/* Confirmation dialog */}
                      {showConfirmDelete === staff.id && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                          <motion.div 
                            className="bg-white rounded-lg p-6 max-w-md mx-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                            <p className="mb-6">
                              Are you sure you want to remove {staff.name} from the system? 
                              This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                              <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                                onClick={() => setShowConfirmDelete(null)}
                              >
                                Cancel
                              </button>
                              <button
                                className="bg-error-red hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
                                onClick={() => handleDeleteStaff(staff.id)}
                              >
                                Remove
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
          
          {filteredStaff.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FaUsersCog className="mx-auto text-3xl text-gray-300 mb-2" />
              <p className="text-gray-500">No staff members found</p>
              <button
                className="mt-4 bg-primary-green hover:bg-dark-green text-white font-medium py-2 px-4 rounded inline-flex items-center"
                onClick={() => setShowAddForm(true)}
              >
                <FaUserPlus className="mr-2" />
                Add Staff Member
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StaffManagement;
