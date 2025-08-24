export interface User {
  id: string;
  name: string;
  role: 'student' | 'proctor' | 'cluster_head' | 'hod' | 'principal';
  department: string;
  email?: string;
  usn?: string; // For students
  semester?: number; // For students
  section?: string; // For students
  proctorId?: string; // For students
  clusterId?: string; // For proctors
}

export interface Grievance {
  id: string;
  studentId: string;
  studentName: string;
  studentUSN: string;
  type: 'academic' | 'non-academic';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'under_review' | 'forwarded' | 'resolved' | 'rejected';
  submissionDate: string;
  lastUpdated: string;
  currentHandler: string; // ID of current handler
  handlerRole: string;
  comments?: Comment[];
  forwardHistory?: ForwardHistory[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  timestamp: string;
}

export interface ForwardHistory {
  from: string;
  fromRole: string;
  to: string;
  toRole: string;
  timestamp: string;
  reason?: string;
}

export interface LoginCredentials {
  id: string;
  password: string;
  role: string;
}

export interface Student {
  usn: string;
  name: string;
  sem: number;
  section: string;
  dept: string;
  p_id: string;
}

export interface Proctor {
  p_id: string;
  name: string;
  dept: string;
}
