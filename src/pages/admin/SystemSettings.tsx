import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/useAdmin';
import { 
  FaDesktop, FaMobileAlt, FaBell, FaEnvelope, FaPalette, 
  FaFont, FaCheck, FaTimes, FaSave, FaUndo, FaCog
} from 'react-icons/fa';

const SystemSettings = () => {
  const { settings, updateSettings, resetSettings } = useAdmin();
  const [formData, setFormData] = useState({
    branding: {
      primaryColor: '#22c55e',
      secondaryColor: '#2e2e2e',
      logo: '/path/to/logo.png',
      displayName: 'CampusQ',
      showLogo: true,
      theme: 'light' as 'light' | 'dark' | 'system',
    },
    notifications: {
      email: {
        enabled: true,
        queueJoined: true,
        queueNearing: true,
        queueCompleted: true,
        dailyReport: false,
      },
      push: {
        enabled: true,
        queueJoined: true,
        queueNearing: true,
        queueCompleted: true,
      },
      sms: {
        enabled: false,
        queueJoined: false,
        queueNearing: true,
        queueCompleted: false,
      },
    },
    system: {
      language: 'en' as 'en' | 'fr' | 'es',
      timeFormat: '12h' as '12h' | '24h',
      dateFormat: 'MM/DD/YYYY' as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD',
      timezone: 'UTC' as string,
      maxQueuesPerDepartment: 3,
      autoQueueReset: true,
      resetTime: '00:00',
    },
  });
  
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'branding' | 'notifications' | 'system'>('branding');
  const [hasChanges, setHasChanges] = useState(false);
  
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
  
  // Load settings from context when component mounts
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);
  
  // Check for changes
  useEffect(() => {
    if (settings) {
      setHasChanges(JSON.stringify(settings) !== JSON.stringify(formData));
    }
  }, [formData, settings]);
  
  // Handle input changes
  const handleChange = (section: keyof typeof formData, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (section: keyof typeof formData, subsection: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: !prev[section][subsection][field]
        }
      }
    }));
  };
  
  // Handle direct changes (no subsection)
  const handleDirectChange = (section: keyof typeof formData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  // Handle color changes
  const handleColorChange = (color: string) => {
    setFormData(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        primaryColor: color
      }
    }));
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    updateSettings(formData);
    
    setNotification({
      message: 'Settings saved successfully',
      type: 'success'
    });
    
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Handle reset settings
  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      resetSettings();
      
      setNotification({
        message: 'Settings have been reset to default',
        type: 'success'
      });
      
      setTimeout(() => setNotification(null), 3000);
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
              <FaCog className="mr-2 text-primary-green" />
              System Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Configure branding, notifications, and system preferences
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded flex items-center"
              onClick={handleResetSettings}
              disabled={!hasChanges}
            >
              <FaUndo className="mr-2" />
              Reset to Default
            </button>
            <button
              className={`${hasChanges ? 'bg-primary-green hover:bg-dark-green' : 'bg-gray-300 cursor-not-allowed'} text-white font-medium py-2 px-4 rounded flex items-center`}
              onClick={handleSaveSettings}
              disabled={!hasChanges}
            >
              <FaSave className="mr-2" />
              Save Changes
            </button>
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
        
        {/* Settings navigation */}
        <motion.div 
          className="flex border-b border-gray-200 mb-6"
          variants={itemVariants}
        >
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'branding' ? 'border-b-2 border-primary-green text-primary-green' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('branding')}
          >
            <FaPalette className="inline mr-2" />
            Branding
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'notifications' ? 'border-b-2 border-primary-green text-primary-green' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell className="inline mr-2" />
            Notifications
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm ${activeTab === 'system' ? 'border-b-2 border-primary-green text-primary-green' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('system')}
          >
            <FaCog className="inline mr-2" />
            System
          </button>
        </motion.div>
        
        {/* Branding Settings */}
        {activeTab === 'branding' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Visual Identity</h3>
                
                <div className="space-y-4">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={formData.branding.primaryColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-10 h-10 border-0 p-0 rounded-md mr-3"
                      />
                      <input
                        type="text"
                        value={formData.branding.primaryColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-32 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                      />
                      <div className="ml-3 flex items-center">
                        <span 
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: formData.branding.primaryColor }}
                        ></span>
                        <span className="ml-2 text-sm text-gray-600">Preview</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Secondary Color */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={formData.branding.secondaryColor}
                        onChange={(e) => handleDirectChange('branding', 'secondaryColor', e.target.value)}
                        className="w-10 h-10 border-0 p-0 rounded-md mr-3"
                      />
                      <input
                        type="text"
                        value={formData.branding.secondaryColor}
                        onChange={(e) => handleDirectChange('branding', 'secondaryColor', e.target.value)}
                        className="w-32 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                      />
                      <div className="ml-3 flex items-center">
                        <span 
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: formData.branding.secondaryColor }}
                        ></span>
                        <span className="ml-2 text-sm text-gray-600">Preview</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Logo Selection */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center mr-4 overflow-hidden">
                        {formData.branding.logo ? (
                          <img 
                            src={formData.branding.logo} 
                            alt="Logo preview" 
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400">No logo</span>
                        )}
                      </div>
                      <button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded"
                      >
                        Upload Logo
                      </button>
                    </div>
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        id="showLogo"
                        checked={formData.branding.showLogo}
                        onChange={() => handleDirectChange('branding', 'showLogo', !formData.branding.showLogo)}
                        className="mr-2"
                      />
                      <label htmlFor="showLogo" className="text-gray-700">
                        Display logo in application
                      </label>
                    </div>
                  </div>
                  
                  {/* Display Name */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="displayName">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      value={formData.branding.displayName}
                      onChange={(e) => handleDirectChange('branding', 'displayName', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This name will appear in the header and other key locations
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
                
                <div className="space-y-4">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="theme">
                      Application Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div 
                        className={`border rounded-lg p-3 cursor-pointer ${formData.branding.theme === 'light' ? 'border-primary-green bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleDirectChange('branding', 'theme', 'light')}
                      >
                        <div className="bg-white border border-gray-200 rounded-md h-20 mb-2 flex items-center justify-center">
                          <FaDesktop className="text-gray-400" />
                        </div>
                        <div className="text-center font-medium text-sm">Light Mode</div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-3 cursor-pointer ${formData.branding.theme === 'dark' ? 'border-primary-green bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleDirectChange('branding', 'theme', 'dark')}
                      >
                        <div className="bg-gray-800 border border-gray-700 rounded-md h-20 mb-2 flex items-center justify-center">
                          <FaDesktop className="text-gray-400" />
                        </div>
                        <div className="text-center font-medium text-sm">Dark Mode</div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-3 cursor-pointer ${formData.branding.theme === 'system' ? 'border-primary-green bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                        onClick={() => handleDirectChange('branding', 'theme', 'system')}
                      >
                        <div className="bg-gradient-to-r from-white to-gray-800 rounded-md h-20 mb-2 flex items-center justify-center">
                          <FaDesktop className="text-gray-400" />
                        </div>
                        <div className="text-center font-medium text-sm">System Preference</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Preview
                    </label>
                    <div 
                      className={`border rounded-lg overflow-hidden ${formData.branding.theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                      style={{ height: '200px' }}
                    >
                      {/* Header */}
                      <div 
                        className="h-12 px-4 flex items-center"
                        style={{ backgroundColor: formData.branding.primaryColor }}
                      >
                        <div className="font-bold text-white">{formData.branding.displayName}</div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <div 
                          className={`font-medium mb-2 ${formData.branding.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                        >
                          Sample Content
                        </div>
                        <div 
                          className={formData.branding.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                        >
                          This is how your application will appear to users.
                        </div>
                        
                        <button
                          className="mt-4 text-white font-medium py-1 px-3 rounded text-sm"
                          style={{ backgroundColor: formData.branding.primaryColor }}
                        >
                          Sample Button
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Email Notifications */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FaEnvelope className="mr-2 text-primary-green" />
                    Email Notifications
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.notifications.email.enabled}
                      onChange={() => handleCheckboxChange('notifications', 'email', 'enabled')}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                  </label>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Queue Joined</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.email.queueJoined}
                        onChange={() => handleCheckboxChange('notifications', 'email', 'queueJoined')}
                        disabled={!formData.notifications.email.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.email.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Queue Nearing</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.email.queueNearing}
                        onChange={() => handleCheckboxChange('notifications', 'email', 'queueNearing')}
                        disabled={!formData.notifications.email.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.email.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Queue Completed</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.email.queueCompleted}
                        onChange={() => handleCheckboxChange('notifications', 'email', 'queueCompleted')}
                        disabled={!formData.notifications.email.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.email.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Daily Report</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.email.dailyReport}
                        onChange={() => handleCheckboxChange('notifications', 'email', 'dailyReport')}
                        disabled={!formData.notifications.email.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.email.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Push Notifications */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FaBell className="mr-2 text-primary-green" />
                    Push Notifications
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.notifications.push.enabled}
                      onChange={() => handleCheckboxChange('notifications', 'push', 'enabled')}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                  </label>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Queue Joined</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.push.queueJoined}
                        onChange={() => handleCheckboxChange('notifications', 'push', 'queueJoined')}
                        disabled={!formData.notifications.push.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.push.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Queue Nearing</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.push.queueNearing}
                        onChange={() => handleCheckboxChange('notifications', 'push', 'queueNearing')}
                        disabled={!formData.notifications.push.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.push.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Queue Completed</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.push.queueCompleted}
                        onChange={() => handleCheckboxChange('notifications', 'push', 'queueCompleted')}
                        disabled={!formData.notifications.push.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.push.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>Push notifications are delivered to user's browser or mobile app.</p>
                </div>
              </div>
              
              {/* SMS Notifications */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <FaMobileAlt className="mr-2 text-primary-green" />
                    SMS Notifications
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.notifications.sms.enabled}
                      onChange={() => handleCheckboxChange('notifications', 'sms', 'enabled')}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-green"></div>
                  </label>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Queue Joined</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.sms.queueJoined}
                        onChange={() => handleCheckboxChange('notifications', 'sms', 'queueJoined')}
                        disabled={!formData.notifications.sms.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.sms.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Queue Nearing</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.sms.queueNearing}
                        onChange={() => handleCheckboxChange('notifications', 'sms', 'queueNearing')}
                        disabled={!formData.notifications.sms.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.sms.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700">Queue Completed</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.notifications.sms.queueCompleted}
                        onChange={() => handleCheckboxChange('notifications', 'sms', 'queueCompleted')}
                        disabled={!formData.notifications.sms.enabled}
                      />
                      <div className={`w-9 h-5 ${formData.notifications.sms.enabled ? 'bg-gray-200' : 'bg-gray-100'} rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-green peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-green`}></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>SMS notifications may incur additional costs. Make sure users have verified phone numbers.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* System Settings */}
        {activeTab === 'system' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Localization</h3>
                
                <div className="space-y-4">
                  {/* Language */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="language">
                      Language
                    </label>
                    <select
                      id="language"
                      value={formData.system.language}
                      onChange={(e) => handleDirectChange('system', 'language', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  
                  {/* Time Format */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Time Format
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="timeFormat"
                          value="12h"
                          checked={formData.system.timeFormat === '12h'}
                          onChange={() => handleDirectChange('system', 'timeFormat', '12h')}
                          className="mr-2"
                        />
                        <span>12-hour (AM/PM)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="timeFormat"
                          value="24h"
                          checked={formData.system.timeFormat === '24h'}
                          onChange={() => handleDirectChange('system', 'timeFormat', '24h')}
                          className="mr-2"
                        />
                        <span>24-hour</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Date Format */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="dateFormat">
                      Date Format
                    </label>
                    <select
                      id="dateFormat"
                      value={formData.system.dateFormat}
                      onChange={(e) => handleDirectChange('system', 'dateFormat', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.system.dateFormat === 'MM/DD/YYYY' && 'Example: 05/25/2023'}
                      {formData.system.dateFormat === 'DD/MM/YYYY' && 'Example: 25/05/2023'}
                      {formData.system.dateFormat === 'YYYY-MM-DD' && 'Example: 2023-05-25'}
                    </p>
                  </div>
                  
                  {/* Timezone */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="timezone">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      value={formData.system.timezone}
                      onChange={(e) => handleDirectChange('system', 'timezone', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                      <option value="Europe/Paris">Central European Time (CET)</option>
                      <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Queue Management</h3>
                
                <div className="space-y-4">
                  {/* Max Queues */}
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="maxQueues">
                      Maximum Queues per Department
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        id="maxQueues"
                        min="1"
                        max="10"
                        value={formData.system.maxQueuesPerDepartment}
                        onChange={(e) => handleDirectChange('system', 'maxQueuesPerDepartment', parseInt(e.target.value))}
                        className="w-24 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                      />
                      <div className="ml-3 text-sm text-gray-600">
                        Set how many separate queues each department can manage simultaneously
                      </div>
                    </div>
                  </div>
                  
                  {/* Auto Queue Reset */}
                  <div>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={formData.system.autoQueueReset}
                        onChange={() => handleDirectChange('system', 'autoQueueReset', !formData.system.autoQueueReset)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">Automatically reset queues daily</span>
                    </label>
                    
                    {formData.system.autoQueueReset && (
                      <div className="ml-6">
                        <label className="block text-gray-700 mb-2" htmlFor="resetTime">
                          Reset Time
                        </label>
                        <input
                          type="time"
                          id="resetTime"
                          value={formData.system.resetTime}
                          onChange={(e) => handleDirectChange('system', 'resetTime', e.target.value)}
                          className="w-32 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          All queues will automatically clear at this time each day
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-4 mt-8">Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded flex items-center"
                    >
                      <FaCog className="mr-2" />
                      Manage API Keys
                    </button>
                  </div>
                  
                  <div>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded flex items-center"
                    >
                      <FaCog className="mr-2" />
                      Configure Authentication
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SystemSettings;
