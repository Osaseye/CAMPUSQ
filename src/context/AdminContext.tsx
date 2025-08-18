import { createContext, useState, type ReactNode } from 'react';
import { useStore } from '../data/store';
import { useUser } from './useUser';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'staff' | 'supervisor' | 'admin';
  isActive: boolean;
  lastActive: string;
}

interface AdminStats {
  totalStudents: number;
  todayQueues: number;
  avgWaitTime: string;
  activeStaff: number;
}

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

interface QueueEvent {
  id: string;
  type: 'join' | 'leave' | 'complete' | 'reset';
  studentName: string;
  studentId: string;
  departmentId: string;
  departmentName: string;
  timestamp: Date;
  queuePosition?: number;
}

interface ReportData {
  dailyServed: { [department: string]: number };
  avgQueueLength: { [department: string]: number };
  avgWaitTime: { [department: string]: string };
  peakHours: string[];
  topDepartments: { name: string; count: number }[];
}

interface AdminContextProps {
  staffMembers: StaffMember[];
  addStaffMember: (staff: Omit<StaffMember, 'id' | 'isActive' | 'lastActive'>) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  removeStaffMember: (id: string) => void;
  adminStats: AdminStats;
  updateAdminStats: () => void;
  queueEvents: QueueEvent[];
  addQueueEvent: (event: Omit<QueueEvent, 'id' | 'timestamp'>) => void;
  clearQueueEvents: () => void;
  resetDepartmentQueue: (departmentId: string) => void;
  reportData: ReportData;
  generateReportData: () => void;
  systemSettings: {
    notificationThreshold: number;
    brandingColor: string;
  };
  updateSystemSettings: (settings: Partial<{ notificationThreshold: number; brandingColor: string }>) => void;
  // Queue management
  activeQueues: Queue[];
  clearQueue: (queueId: string) => void;
  resetQueue: (queueId: string) => void;
  updateQueueStatus: (queueId: string, status: 'active' | 'paused' | 'closed') => void;
  reports: ReportData;
  exportReport: (options: { format: string; dateRange: string }) => void;
  generateReport: (options: { type: string; department?: string; dateRange?: string }) => void;
  settings: {
    notificationThreshold: number;
    brandingColor: string;
  };
  resetSettings: () => void;
  updateSettings: (settings: Partial<{ notificationThreshold: number; brandingColor: string }>) => void;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

// Mock queues
const mockQueues: Queue[] = [
  {
    id: 'queue-1',
    name: 'Financial Aid General Queue',
    department: 'Financial Aid',
    status: 'active',
    queueLength: 12,
    waitTime: 18,
    servedToday: 42,
    createdAt: '2025-08-17T07:30:00',
  },
  {
    id: 'queue-2',
    name: 'Registration Priority Queue',
    department: 'Registration',
    status: 'active',
    queueLength: 8,
    waitTime: 25,
    servedToday: 67,
    createdAt: '2025-08-17T07:30:00',
  },
  {
    id: 'queue-3',
    name: 'Academic Advising Queue',
    department: 'Academic Advising',
    status: 'active',
    queueLength: 5,
    waitTime: 12,
    servedToday: 31,
    createdAt: '2025-08-17T07:30:00',
  },
  {
    id: 'queue-4',
    name: 'IT Support Queue',
    department: 'IT Support',
    status: 'paused',
    queueLength: 4,
    waitTime: 8,
    servedToday: 25,
    createdAt: '2025-08-17T07:30:00',
  },
  {
    id: 'queue-5',
    name: 'Student Affairs Queue',
    department: 'Student Affairs',
    status: 'closed',
    queueLength: 0,
    waitTime: 0,
    servedToday: 19,
    createdAt: '2025-08-17T07:30:00',
  },
];

// Mock staff members
const mockStaffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    department: 'Financial Aid',
    role: 'supervisor',
    isActive: true,
    lastActive: '2025-08-17T09:30:45',
  },
  {
    id: 'staff-2',
    name: 'James Wilson',
    email: 'j.wilson@university.edu',
    department: 'Registration',
    role: 'staff',
    isActive: true,
    lastActive: '2025-08-17T10:15:22',
  },
  {
    id: 'staff-3',
    name: 'Maria Garcia',
    email: 'm.garcia@university.edu',
    department: 'Academic Advising',
    role: 'staff',
    isActive: false,
    lastActive: '2025-08-16T16:45:10',
  },
  {
    id: 'staff-4',
    name: 'Robert Chen',
    email: 'r.chen@university.edu',
    department: 'IT Support',
    role: 'staff',
    isActive: true,
    lastActive: '2025-08-17T08:05:33',
  },
  {
    id: 'staff-5',
    name: 'Admin User',
    email: 'admin@university.edu',
    department: 'System Administration',
    role: 'admin',
    isActive: true,
    lastActive: '2025-08-17T11:20:15',
  },
];

// Mock initial queue events
const mockQueueEvents: QueueEvent[] = [
  {
    id: 'event-1',
    type: 'join',
    studentName: 'Alex Thompson',
    studentId: '22/0456',
    departmentId: 'dept-1',
    departmentName: 'Financial Aid',
    timestamp: new Date('2025-08-17T09:15:00'),
    queuePosition: 4,
  },
  {
    id: 'event-2',
    type: 'complete',
    studentName: 'Jamie Rodriguez',
    studentId: '23/0789',
    departmentId: 'dept-3',
    departmentName: 'Academic Advising',
    timestamp: new Date('2025-08-17T09:30:00'),
  },
  {
    id: 'event-3',
    type: 'leave',
    studentName: 'Taylor Kim',
    studentId: '24/0123',
    departmentId: 'dept-2',
    departmentName: 'Registration',
    timestamp: new Date('2025-08-17T09:45:00'),
    queuePosition: 2,
  },
];

// Mock initial reports data
const mockReportData: ReportData = {
  dailyServed: {
    'Financial Aid': 42,
    'Registration': 67,
    'Academic Advising': 31,
    'IT Support': 25,
    'Student Affairs': 19,
  },
  avgQueueLength: {
    'Financial Aid': 8,
    'Registration': 12,
    'Academic Advising': 5,
    'IT Support': 4,
    'Student Affairs': 3,
  },
  avgWaitTime: {
    'Financial Aid': '18 mins',
    'Registration': '25 mins',
    'Academic Advising': '12 mins',
    'IT Support': '8 mins',
    'Student Affairs': '10 mins',
  },
  peakHours: ['10:00 AM - 11:00 AM', '1:00 PM - 2:00 PM'],
  topDepartments: [
    { name: 'Registration', count: 67 },
    { name: 'Financial Aid', count: 42 },
    { name: 'Academic Advising', count: 31 },
  ],
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { departments, bookings } = useStore();
  const { userQueues } = useUser();
  
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaffMembers);
  const [queueEvents, setQueueEvents] = useState<QueueEvent[]>(mockQueueEvents);
  const [reportData, setReportData] = useState<ReportData>(mockReportData);
  const [activeQueues, setActiveQueues] = useState<Queue[]>(mockQueues);
  const [systemSettings, setSystemSettings] = useState({
    notificationThreshold: 3, // notify students when they are 3 or fewer spots away
    brandingColor: '#166534', // primary-green color
  });
  
  // Mock admin statistics
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalStudents: 2548, // Mock total registered students
    todayQueues: bookings.length + userQueues.length,
    avgWaitTime: '15 min',
    activeStaff: staffMembers.filter(staff => staff.isActive).length,
  });
  
  // Update admin stats
  const updateAdminStats = () => {
    setAdminStats({
      totalStudents: 2548, // This would be from an API in a real app
      todayQueues: bookings.length + userQueues.length,
      avgWaitTime: calculateAverageWaitTime(),
      activeStaff: staffMembers.filter(staff => staff.isActive).length,
    });
  };
  
  // Calculate average wait time based on current bookings
  const calculateAverageWaitTime = (): string => {
    if (bookings.length === 0) return 'N/A';
    
    const totalWaitTimes = bookings.reduce((total, booking) => {
      const waitMinutes = parseInt(booking.estimatedWaitTime.split(' ')[0]);
      return total + waitMinutes;
    }, 0);
    
    return `${Math.round(totalWaitTimes / bookings.length)} min`;
  };
  
  // Add staff member
  const addStaffMember = (staff: Omit<StaffMember, 'id' | 'isActive' | 'lastActive'>) => {
    const newStaff: StaffMember = {
      ...staff,
      id: `staff-${Date.now()}`,
      isActive: false,
      lastActive: new Date().toISOString(),
    };
    
    setStaffMembers(prev => [...prev, newStaff]);
  };
  
  // Update staff member
  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaffMembers(prev => 
      prev.map(staff => staff.id === id ? { ...staff, ...updates } : staff)
    );
  };
  
  // Remove staff member
  const removeStaffMember = (id: string) => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== id));
  };
  
  // Add queue event
  const addQueueEvent = (event: Omit<QueueEvent, 'id' | 'timestamp'>) => {
    const newEvent: QueueEvent = {
      ...event,
      id: `event-${Date.now()}`,
      timestamp: new Date(),
    };
    
    setQueueEvents(prev => [newEvent, ...prev].slice(0, 100)); // Keep only last 100 events
    
    // We've removed the updateAdminStats call to prevent infinite loop
    // Instead we'll update the admin stats directly in the components that need it
  };
  
  // Clear queue events
  const clearQueueEvents = () => {
    setQueueEvents([]);
  };
  
  // Reset department queue
  const resetDepartmentQueue = (departmentId: string) => {
    // In a real app, this would make API calls
    // For our mock, just add a reset event directly
    const dept = departments.find(d => d.id === departmentId);
    if (dept) {
      const newEvent: QueueEvent = {
        id: `event-${Date.now()}`,
        type: 'reset',
        studentName: 'Admin',
        studentId: 'ADMIN',
        departmentId,
        departmentName: dept.name,
        timestamp: new Date(),
      };
      
      setQueueEvents(prev => [newEvent, ...prev].slice(0, 100));
    }
  };
  
  // Generate report data
  const generateReportData = () => {
    // In a real app, this would fetch data from an API
    // For our mock, just use random variations of the current data
    const variation = () => 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
    
    const newReportData: ReportData = {
      dailyServed: { ...mockReportData.dailyServed },
      avgQueueLength: { ...mockReportData.avgQueueLength },
      avgWaitTime: { ...mockReportData.avgWaitTime },
      peakHours: [...mockReportData.peakHours],
      topDepartments: [...mockReportData.topDepartments],
    };
    
    // Apply random variations to daily served
    Object.keys(newReportData.dailyServed).forEach(dept => {
      newReportData.dailyServed[dept] = Math.round(newReportData.dailyServed[dept] * variation());
    });
    
    // Update top departments based on new daily served numbers
    newReportData.topDepartments = Object.entries(newReportData.dailyServed)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
    
    setReportData(newReportData);
  };
  
  // Update system settings
  const updateSystemSettings = (settings: Partial<{ notificationThreshold: number; brandingColor: string }>) => {
    setSystemSettings(prev => ({ ...prev, ...settings }));
  };

  // Queue management methods
  const clearQueue = (queueId: string) => {
    // First find the queue info before updating
    const queueToUpdate = activeQueues.find(q => q.id === queueId);
    const departmentName = queueToUpdate?.department || '';
    
    setActiveQueues(prev => 
      prev.map(queue => 
        queue.id === queueId 
          ? { ...queue, queueLength: 0, waitTime: 0 } 
          : queue
      )
    );
    
    // Add event with the info we captured before updating
    const newEvent: QueueEvent = {
      id: `event-${Date.now()}`,
      type: 'reset',
      studentName: 'Admin',
      studentId: 'ADMIN',
      departmentId: queueToUpdate?.department || '',
      departmentName: departmentName,
      timestamp: new Date(),
    };
    
    setQueueEvents(prev => [newEvent, ...prev].slice(0, 100));
  };

  const resetQueue = (queueId: string) => {
    // First find the queue info before updating
    const queueToUpdate = activeQueues.find(q => q.id === queueId);
    const departmentName = queueToUpdate?.department || '';
    
    setActiveQueues(prev => 
      prev.map(queue => 
        queue.id === queueId 
          ? { ...queue, queueLength: 0, waitTime: 0, servedToday: 0 } 
          : queue
      )
    );
    
    // Add event with the info we captured before updating
    const newEvent: QueueEvent = {
      id: `event-${Date.now()}`,
      type: 'reset',
      studentName: 'Admin',
      studentId: 'ADMIN',
      departmentId: queueToUpdate?.department || '',
      departmentName: departmentName,
      timestamp: new Date(),
    };
    
    setQueueEvents(prev => [newEvent, ...prev].slice(0, 100));
  };

  const updateQueueStatus = (queueId: string, status: 'active' | 'paused' | 'closed') => {
    setActiveQueues(prev => 
      prev.map(queue => 
        queue.id === queueId 
          ? { ...queue, status } 
          : queue
      )
    );
  };

  // Mock functions for reports
  const exportReport = (options: { format: string; dateRange: string }) => {
    console.log('Exporting report with options:', options);
  };

  const generateReport = (options: { type: string; department?: string; dateRange?: string }) => {
    console.log('Generating report with options:', options);
    // In a real app, this would generate real report data
  };

  // Settings management
  const resetSettings = () => {
    setSystemSettings({
      notificationThreshold: 3,
      brandingColor: '#166534',
    });
  };
  
  return (
    <AdminContext.Provider
      value={{
        staffMembers,
        addStaffMember,
        updateStaffMember,
        removeStaffMember,
        adminStats,
        updateAdminStats,
        queueEvents,
        addQueueEvent,
        clearQueueEvents,
        resetDepartmentQueue,
        reportData,
        generateReportData,
        systemSettings,
        updateSystemSettings,
        activeQueues,
        clearQueue,
        resetQueue,
        updateQueueStatus,
        reports: reportData,
        exportReport,
        generateReport,
        settings: systemSettings,
        resetSettings,
        updateSettings: updateSystemSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext };
