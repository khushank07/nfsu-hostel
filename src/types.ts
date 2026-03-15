export type UserRole = 'student' | 'admin';

export interface Student {
  student_id: string;
  name: string;
  room_number: string;
  block: string;
  phone_number: string;
  password?: string;
  role: 'student';
}

export interface Admin {
  username: string;
  name: string;
  password?: string;
  role: 'admin';
}

export interface LeaveRequest {
  id: string;
  student_id: string;
  student_name: string;
  room_number: string;
  block: string;
  leave_type: 'Late Night Leave' | 'Long Leave';
  reason: string;
  from_datetime: string;
  to_datetime: string;
  contact_number: string;
  parent_contact_number: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}
