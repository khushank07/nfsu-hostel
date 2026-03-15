import { Student, Admin, LeaveRequest, Notification } from '../types';

// Initial Mock Data
const INITIAL_STUDENT: Student = {
  student_id: 'NFSU101_1',
  name: 'Khushank',
  room_number: '101',
  block: 'A',
  phone_number: '9876543210',
  password: 'pass123',
  role: 'student'
};

const INITIAL_ADMIN: Admin = {
  username: 'warden',
  name: 'Hostel Warden',
  password: 'nfsu123',
  role: 'admin'
};

// Helper to get data from localStorage
const getStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
};

const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const store = {
  getStudents: () => getStorage<Student[]>('nfsu_students', [INITIAL_STUDENT]),
  getAdmins: () => getStorage<Admin[]>('nfsu_admins', [INITIAL_ADMIN]),
  getLeaveRequests: () => getStorage<LeaveRequest[]>('nfsu_leave_requests', []),
  getNotifications: () => getStorage<Notification[]>('nfsu_notifications', []),

  addLeaveRequest: (request: Omit<LeaveRequest, 'id'>) => {
    const requests = store.getLeaveRequests();
    const newRequest = { ...request, id: Math.random().toString(36).substr(2, 9) };
    setStorage('nfsu_leave_requests', [newRequest, ...requests]);
    return newRequest;
  },

  updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => {
    const requests = store.getLeaveRequests();
    const updated = requests.map(r => r.id === id ? { ...r, ...updates } : r);
    setStorage('nfsu_leave_requests', updated);
  },

  addNotification: (notification: Omit<Notification, 'id'>) => {
    const notifications = store.getNotifications();
    const newNotification = { ...notification, id: Math.random().toString(36).substr(2, 9) };
    setStorage('nfsu_notifications', [newNotification, ...notifications]);
    return newNotification;
  },

  markNotificationRead: (id: string) => {
    const notifications = store.getNotifications();
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setStorage('nfsu_notifications', updated);
  }
};
