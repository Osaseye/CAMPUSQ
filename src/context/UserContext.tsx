import { createContext, useState, useEffect, type ReactNode } from 'react';

interface UserInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId?: string; // now representing matric number in format XX/XXXX
  department?: string; // For staff members
  role?: 'student' | 'staff' | 'admin'; // User role
}

interface Queue {
  id: string;
  departmentId: string;
  name: string;
  estimatedTimeMinutes: number;
  currentPosition: number;
  totalPeople: number;
}

interface Department {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  queueCount: number;
}

interface UserContextProps {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  isStaff: boolean;
  setIsStaff: (isStaff: boolean) => void;
  userQueues: Queue[];
  setUserQueues: (queues: Queue[]) => void;
  availableDepartments: Department[];
  setAvailableDepartments: (departments: Department[]) => void;
  joinQueue: (departmentId: string, queueName: string, timeSlot?: string) => void;
  leaveQueue: (queueId: string) => void;
  updateQueuePositions: () => void;
  loginStaff: (email: string, password: string, department?: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Initial state for an unauthenticated user
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    role: 'student'
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [userQueues, setUserQueues] = useState<Queue[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([
    {
      id: 'dept-1',
      name: 'Financial Aid',
      description: 'Financial aid services and scholarship information',
      logoUrl: '💰',
      queueCount: 2
    },
    {
      id: 'dept-2',
      name: 'Registration',
      description: 'Course registration and class scheduling',
      logoUrl: '📝',
      queueCount: 3
    },
    {
      id: 'dept-3',
      name: 'Academic Advising',
      description: 'Academic guidance and program planning',
      logoUrl: '🎓',
      queueCount: 1
    },
    {
      id: 'dept-4',
      name: 'IT Support',
      description: 'Technical support for campus systems',
      logoUrl: '💻',
      queueCount: 2
    },
    {
      id: 'dept-5',
      name: 'Student Affairs',
      description: 'Housing, dining, and campus life services',
      logoUrl: '🏠',
      queueCount: 2
    },
  ]);

  // Mock user queues for demonstration
  useEffect(() => {
    if (isAuthenticated) {
      setUserQueues([
        {
          id: 'q1',
          departmentId: 'dept-1',
          name: 'Financial Aid Consultation',
          estimatedTimeMinutes: 15,
          currentPosition: 3,
          totalPeople: 8
        },
        {
          id: 'q2',
          departmentId: 'dept-4',
          name: 'Password Reset',
          estimatedTimeMinutes: 5,
          currentPosition: 1,
          totalPeople: 4
        }
      ]);
    }
  }, [isAuthenticated]);

  // Join a queue
  const joinQueue = (departmentId: string, queueName: string, timeSlot?: string) => {
    const department = availableDepartments.find(d => d.id === departmentId);
    if (!department) return;

    // Calculate position as last in queue (total + 1)
    // Base total people between 5-15
    const basePeople = Math.floor(Math.random() * 11) + 5;
    const total = basePeople;
    const position = total; // Position is last in queue
    
    // Use timeSlot to adjust estimated time if provided
    let estimatedTime = Math.floor(Math.random() * 11) + 5; // Default 5-15 minutes
    
    if (timeSlot) {
      // Parse time slot to adjust estimated time
      // Earlier slots get faster service (just for demo)
      if (timeSlot.includes('9:00') || timeSlot.includes('9:30')) {
        estimatedTime = Math.floor(Math.random() * 5) + 3; // 3-8 minutes
      } else if (timeSlot.includes('10:00') || timeSlot.includes('10:30')) {
        estimatedTime = Math.floor(Math.random() * 6) + 4; // 4-10 minutes
      } else if (timeSlot.includes('11:00') || timeSlot.includes('11:30')) {
        estimatedTime = Math.floor(Math.random() * 7) + 5; // 5-12 minutes
      } else if (timeSlot.includes('12:00') || timeSlot.includes('12:30')) {
        estimatedTime = Math.floor(Math.random() * 10) + 8; // 8-18 minutes (lunch rush)
      } else if (timeSlot.includes('1:00') || timeSlot.includes('1:30')) {
        estimatedTime = Math.floor(Math.random() * 10) + 8; // 8-18 minutes (lunch rush)
      } else {
        estimatedTime = Math.floor(Math.random() * 8) + 5; // 5-13 minutes
      }
    }

    const newQueue: Queue = {
      id: `q-${Date.now()}`,
      departmentId,
      name: queueName,
      estimatedTimeMinutes: estimatedTime,
      currentPosition: position,
      totalPeople: total
    };

    setUserQueues(prev => [...prev, newQueue]);
  };

  // Leave a queue
  const leaveQueue = (queueId: string) => {
    // Remove the queue from user's queues
    setUserQueues(prev => prev.filter(q => q.id !== queueId));
    
    // Also remove it from the Zustand store for dashboard sync
    // Note: In a real app, you'd make an API call here
    try {
      // We don't have direct access to store.cancelBooking here,
      // but this will be handled in StatusPage.tsx
      console.log('Queue removed:', queueId);
    } catch (error) {
      console.error('Error removing queue:', error);
    }
  };

  // Update queue positions (simulate progress)
  const updateQueuePositions = () => {
    setUserQueues(prev => prev.map(queue => {
      // Randomly decide whether to decrement position (70% chance)
      if (queue.currentPosition > 1 && Math.random() < 0.7) {
        return { 
          ...queue, 
          currentPosition: queue.currentPosition - 1 
        };
      }
      return queue;
    }));
  };

  // Set up interval to update queue positions
  useEffect(() => {
    if (!isAuthenticated || userQueues.length === 0) return;
    
    // Update queue positions every 10 seconds for demonstration
    const intervalId = setInterval(updateQueuePositions, 10000);
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, userQueues.length]);

  // Mock staff login
  const loginStaff = async (email: string, password: string, selectedDepartment?: string): Promise<boolean> => {
    // In a real app, this would make an API call to verify credentials
    // For this demo, we'll accept any email and any password
    if (email && password) {
      // Use the selected department if provided, otherwise determine from email
      const emailPrefix = email.includes('@') ? email.split('@')[0] : email;
      let department = selectedDepartment || 'Financial Aid'; // Default to selected department or Financial Aid
      
      // If no department was provided, try to guess from email
      if (!selectedDepartment) {
        if (emailPrefix.includes('finance') || emailPrefix.includes('aid')) {
          department = 'Financial Aid';
        } else if (emailPrefix.includes('reg') || emailPrefix.includes('register')) {
          department = 'Registration';
        } else if (emailPrefix.includes('advise') || emailPrefix.includes('academic')) {
          department = 'Academic Advising';
        } else if (emailPrefix.includes('it') || emailPrefix.includes('tech')) {
          department = 'IT Support';
        } else if (emailPrefix.includes('student') || emailPrefix.includes('affairs')) {
          department = 'Student Affairs';
        }
      }
      
      setUserInfo({
        username: email.split('@')[0],
        firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        lastName: 'Staff',
        email: email,
        department: department,
        role: 'staff'
      });
      
      setIsAuthenticated(true);
      setIsAdmin(false);
      setIsStaff(true);
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUserInfo({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      studentId: '',
      role: 'student'
    });
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsStaff(false);
    setUserQueues([]);
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        isAuthenticated,
        setIsAuthenticated,
        isAdmin,
        setIsAdmin,
        isStaff,
        setIsStaff,
        userQueues,
        setUserQueues,
        availableDepartments,
        setAvailableDepartments,
        joinQueue,
        leaveQueue,
        updateQueuePositions,
        loginStaff,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Export the context to be used in useUser.ts
export { UserContext };
