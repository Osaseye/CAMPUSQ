import { create } from 'zustand';

export interface Booking {
  id: string;
  name: string;
  studentId: string;
  department: string;
  timeSlot: string;
  queueNumber: number;
  estimatedWaitTime: string;
}

export interface Department {
  id: string;
  name: string;
  currentQueueLength: number;
  averageWaitTime: string;
}

interface CampusQStore {
  // Dummy data
  departments: Department[];
  bookings: Booking[];
  currentBooking: Booking | null;
  
  // Actions
  addBooking: (booking: Omit<Booking, 'id' | 'queueNumber' | 'estimatedWaitTime'>) => void;
  cancelBooking: (id: string) => void;
  markAsServed: (id: string) => void;
  removeBooking: (id: string) => void;
  setCurrentBooking: (booking: Booking | null) => void;
}

// Dummy departments data
const dummyDepartments: Department[] = [
  { id: 'dept-1', name: 'Student Services', currentQueueLength: 12, averageWaitTime: '25 mins' },
  { id: 'dept-2', name: 'Financial Aid', currentQueueLength: 8, averageWaitTime: '15 mins' },
  { id: 'dept-3', name: 'Academic Advising', currentQueueLength: 5, averageWaitTime: '10 mins' },
  { id: 'dept-4', name: 'Library Services', currentQueueLength: 3, averageWaitTime: '5 mins' },
  { id: 'dept-5', name: 'IT Support', currentQueueLength: 7, averageWaitTime: '20 mins' },
];

// Dummy bookings data
const dummyBookings: Booking[] = [
  { 
    id: 'booking-1', 
    name: 'John Smith', 
    studentId: 'ST12345', 
    department: 'Student Services', 
    timeSlot: '10:00 AM', 
    queueNumber: 1, 
    estimatedWaitTime: '5 mins'
  },
  { 
    id: 'booking-2', 
    name: 'Emma Johnson', 
    studentId: 'ST23456', 
    department: 'Financial Aid', 
    timeSlot: '10:30 AM', 
    queueNumber: 2, 
    estimatedWaitTime: '10 mins'
  },
  { 
    id: 'booking-3', 
    name: 'Michael Brown', 
    studentId: 'ST34567', 
    department: 'Academic Advising', 
    timeSlot: '11:00 AM', 
    queueNumber: 3, 
    estimatedWaitTime: '15 mins'
  },
];

export const useStore = create<CampusQStore>((set) => ({
  departments: dummyDepartments,
  bookings: dummyBookings,
  currentBooking: null,
  
  addBooking: (booking) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      queueNumber: Math.floor(Math.random() * 10) + 1, // Random queue number for demo
      estimatedWaitTime: `${Math.floor(Math.random() * 30) + 5} mins`, // Random wait time for demo
    };
    
    set((state) => ({
      bookings: [...state.bookings, newBooking],
      currentBooking: newBooking,
    }));
    
    return newBooking;
  },
  
  cancelBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
      currentBooking: state.currentBooking?.id === id ? null : state.currentBooking,
    }));
  },
  
  markAsServed: (id) => {
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
    }));
  },
  
  removeBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
    }));
  },
  
  setCurrentBooking: (booking) => {
    set({ currentBooking: booking });
  },
}));
