export type UserRole = 'admin' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  student_id?: string;
}

export interface Student {
  student_id: string;
  name: string;
  email: string;
  department: string;
  year: string; // e.g. "1st Year", "2nd Year", "3rd Year", "4th Year"
  phone: string;
  cgpa?: number;
  section?: string;
  guardian_name?: string;
  guardian_phone?: string;
  blood_group?: string;
  address?: string;
  created_at?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export interface AttendanceRecord {
  id: number;
  student_id: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  subject?: string;
  recorded_by?: string;
}

export type AnnouncementPriority = 'normal' | 'important' | 'urgent';

export interface Announcement {
  id: number;
  title: string;
  description: string;
  department: string; // "All" or specific like "Computer Science"
  priority: AnnouncementPriority;
  author: string;
  created_at: string;
  pinned?: boolean;
}

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
export type ComplaintCategory = 'Academics' | 'Hostel' | 'Infrastructure' | 'Mess & Canteen' | 'Laboratory' | 'Transport' | 'Library' | 'Other';

export interface Complaint {
  id: number;
  ticket_no: string; // e.g., "CMP-2024-101"
  student_id: string;
  student_name: string;
  department: string;
  subject: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  attachment_url?: string;
  attachment_name?: string;
  created_at: string;
  updated_at: string;
  admin_remarks?: string;
}

export type PageId =
  | 'home'
  | 'login'
  | 'register'
  | 'admin-login'
  | 'student-dashboard'
  | 'admin-dashboard'
  | 'student-profile'
  | 'attendance'
  | 'announcements'
  | 'complaint-submit'
  | 'complaint-track'
  | 'admin-students'
  | 'admin-attendance'
  | 'admin-complaints'
  | 'aws-architecture';

export interface CodeFile {
  filename: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export interface InterviewQA {
  id: number;
  question: string;
  category: 'System Architecture' | 'Flask & REST APIs' | 'MySQL & DB Design' | 'AWS Cloud Deployment' | 'Security & Best Practices';
  answer: string;
  keyPoints: string[];
}
