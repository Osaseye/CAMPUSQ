import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useUser } from './useUser';

// Define types for student in queue
export interface QueueStudent {
  id: string;
  name: string;
  studentId: string;
  bookingTime: string;
  queueNumber: number;
  status: 'waiting' | 'serving' | 'served' | 'skipped';
}

// Define types for staff context
interface StaffContextProps {
  departmentQueue: QueueStudent[];
  isServingPaused: boolean;
  servedToday: QueueStudent[];
  currentlyServing: QueueStudent | null;
  departmentStats: {
    totalWaiting: number;
    avgWaitTime: number; // in minutes
    nextStudent: QueueStudent | null;
  };
  markAsServed: (studentId: string) => void;
  removeFromQueue: (studentId: string) => void;
  skipStudent: (studentId: string) => void;
  toggleServingStatus: () => void;
  callNextStudent: () => void;
}

// Create the context
export const StaffContext = createContext<StaffContextProps | undefined>(undefined);

// Sample mock data
const mockStudentsInQueue: QueueStudent[] = [
  {
    id: 's1',
    name: 'John Doe',
    studentId: 'ST12345',
    bookingTime: '2025-08-17T08:30:00',
    queueNumber: 1,
    status: 'waiting'
  },
  {
    id: 's2',
    name: 'Jane Smith',
    studentId: 'ST12346',
    bookingTime: '2025-08-17T08:35:00',
    queueNumber: 2,
    status: 'waiting'
  },
  {
    id: 's3',
    name: 'Ahmed Khan',
    studentId: 'ST12347',
    bookingTime: '2025-08-17T08:40:00',
    queueNumber: 3,
    status: 'waiting'
  },
  {
    id: 's4',
    name: 'Maria Garcia',
    studentId: 'ST12348',
    bookingTime: '2025-08-17T08:45:00',
    queueNumber: 4,
    status: 'waiting'
  },
  {
    id: 's5',
    name: 'David Wilson',
    studentId: 'ST12349',
    bookingTime: '2025-08-17T08:50:00',
    queueNumber: 5,
    status: 'waiting'
  }
];

const mockServedToday: QueueStudent[] = [
  {
    id: 's101',
    name: 'Olivia Johnson',
    studentId: 'ST12301',
    bookingTime: '2025-08-17T08:00:00',
    queueNumber: 1,
    status: 'served'
  },
  {
    id: 's102',
    name: 'James Brown',
    studentId: 'ST12302',
    bookingTime: '2025-08-17T08:05:00',
    queueNumber: 2,
    status: 'served'
  },
  {
    id: 's103',
    name: 'Sofia Martinez',
    studentId: 'ST12303',
    bookingTime: '2025-08-17T08:10:00',
    queueNumber: 3,
    status: 'served'
  }
];

// Create the provider component
export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const { userInfo } = useUser();
  // Use department from userInfo to filter queues in a real implementation
  const [departmentQueue, setDepartmentQueue] = useState<QueueStudent[]>(mockStudentsInQueue);
  const [servedToday, setServedToday] = useState<QueueStudent[]>(mockServedToday);
  const [isServingPaused, setIsServingPaused] = useState(false);
  const [currentlyServing, setCurrentlyServing] = useState<QueueStudent | null>(null);

  // Calculate department stats
  const departmentStats = {
    totalWaiting: departmentQueue.filter(s => s.status === 'waiting').length,
    avgWaitTime: calculateAverageWaitTime(),
    nextStudent: departmentQueue.find(s => s.status === 'waiting') || null
  };

  // Function to calculate average wait time
  function calculateAverageWaitTime(): number {
    const waitingStudents = departmentQueue.filter(s => s.status === 'waiting');
    if (waitingStudents.length === 0) return 0;
    
    const now = new Date();
    const totalWaitMinutes = waitingStudents.reduce((total, student) => {
      const bookingTime = new Date(student.bookingTime);
      const waitMinutes = Math.floor((now.getTime() - bookingTime.getTime()) / 60000);
      return total + waitMinutes;
    }, 0);
    
    return Math.round(totalWaitMinutes / waitingStudents.length);
  }

  // Mark student as served
  const markAsServed = (studentId: string) => {
    setDepartmentQueue(prev => {
      const student = prev.find(s => s.id === studentId);
      if (!student) return prev;
      
      // Add to served today list
      setServedToday(served => [
        { ...student, status: 'served' },
        ...served
      ]);
      
      // Remove from queue
      return prev.filter(s => s.id !== studentId);
    });
    
    // Reset currently serving if this was the current student
    if (currentlyServing?.id === studentId) {
      setCurrentlyServing(null);
    }
  };

  // Remove student from queue
  const removeFromQueue = (studentId: string) => {
    setDepartmentQueue(prev => prev.filter(s => s.id !== studentId));
    
    // Reset currently serving if this was the current student
    if (currentlyServing?.id === studentId) {
      setCurrentlyServing(null);
    }
  };

  // Skip student
  const skipStudent = (studentId: string) => {
    setDepartmentQueue(prev => {
      return prev.map(s => 
        s.id === studentId 
          ? { ...s, status: 'skipped' }
          : s
      );
    });
    
    // Reset currently serving if this was the current student
    if (currentlyServing?.id === studentId) {
      setCurrentlyServing(null);
    }
  };

  // Toggle serving status (pause/resume)
  const toggleServingStatus = () => {
    setIsServingPaused(prev => !prev);
  };

  // Call next student
  const callNextStudent = () => {
    const nextStudent = departmentQueue.find(s => s.status === 'waiting');
    if (nextStudent) {
      setCurrentlyServing(nextStudent);
      setDepartmentQueue(prev => {
        return prev.map(s => 
          s.id === nextStudent.id 
            ? { ...s, status: 'serving' }
            : s
        );
      });
    }
  };

  return (
    <StaffContext.Provider
      value={{
        departmentQueue,
        isServingPaused,
        servedToday,
        currentlyServing,
        departmentStats,
        markAsServed,
        removeFromQueue,
        skipStudent,
        toggleServingStatus,
        callNextStudent
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export default StaffContext;
