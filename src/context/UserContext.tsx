import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

interface UserInfo {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId?: string;
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
  userQueues: Queue[];
  setUserQueues: (queues: Queue[]) => void;
  availableDepartments: Department[];
  setAvailableDepartments: (departments: Department[]) => void;
  joinQueue: (departmentId: string, queueName: string) => void;
  leaveQueue: (queueId: string) => void;
  updateQueuePositions: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
  const joinQueue = (departmentId: string, queueName: string) => {
    const department = availableDepartments.find(d => d.id === departmentId);
    if (!department) return;

    // Create a random position between 1-5
    const position = Math.floor(Math.random() * 5) + 1;
    // Create a random total between position + 3 to position + 10
    const total = position + Math.floor(Math.random() * 8) + 3;
    // Random estimated time per person between 5-15 minutes
    const estimatedTime = Math.floor(Math.random() * 11) + 5;

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
    setUserQueues(prev => prev.filter(q => q.id !== queueId));
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

  const logout = () => {
    setUserInfo({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      studentId: '',
    });
    setIsAuthenticated(false);
    setIsAdmin(false);
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
        userQueues,
        setUserQueues,
        availableDepartments,
        setAvailableDepartments,
        joinQueue,
        leaveQueue,
        updateQueuePositions,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
