import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Student,
  AttendanceRecord,
  Announcement,
  Complaint,
  PageId,
  AttendanceStatus,
  ComplaintStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_COMPLAINTS,
  generateInitialAttendance,
} from '../data/mockData';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  login: (role: 'admin' | 'student', email?: string, password?: string) => boolean;
  logout: () => void;
  quickLoginAs: (role: 'admin' | 'student') => void;
  registerStudent: (data: {
    student_id: string;
    name: string;
    email: string;
    department: string;
    year: string;
    phone: string;
    password?: string;
  }) => { success: boolean; message: string };
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (student_id: string) => void;
  attendanceRecords: AttendanceRecord[];
  markAttendance: (
    items: { student_id: string; status: AttendanceStatus }[],
    date: string,
    subject: string
  ) => void;
  announcements: Announcement[];
  addAnnouncement: (item: Omit<Announcement, 'id' | 'created_at'>) => void;
  complaints: Complaint[];
  submitComplaint: (data: {
    student_id: string;
    subject: string;
    category: any;
    description: string;
    attachment_name?: string;
    attachment_url?: string;
  }) => string;
  updateComplaintStatus: (id: number, status: ComplaintStatus, remarks?: string) => void;
  getStudentAttendanceStats: (student_id: string) => {
    total: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  currentStudentProfile: Student | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence via localStorage or defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('scms_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default to Aarav Sharma (student) for instant preview
  });

  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    const saved = localStorage.getItem('scms_current_page');
    return (saved as PageId) || 'student-dashboard';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('scms_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('scms_attendance');
    return saved ? JSON.parse(saved) : generateInitialAttendance();
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('scms_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('scms_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('scms_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('scms_current_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('scms_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('scms_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('scms_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('scms_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const login = (role: 'admin' | 'student', email?: string, password?: string): boolean => {
    if (!email) {
      // Auto login with default
      quickLoginAs(role);
      return true;
    }

    if (role === 'admin') {
      if (email.toLowerCase().includes('admin') || email === 'admin@smartcampus.edu') {
        const adminUser: User = {
          id: 1,
          name: 'Dr. Arthur Vance (Dean)',
          email: email,
          role: 'admin',
        };
        setCurrentUser(adminUser);
        setCurrentPage('admin-dashboard');
        showToast('Logged in as Administrator', 'success');
        return true;
      }
    } else {
      const studentMatch = students.find(
        (s) => s.email.toLowerCase() === email.toLowerCase() || s.student_id.toLowerCase() === email.toLowerCase()
      );
      if (studentMatch) {
        const studentUser: User = {
          id: 2,
          name: studentMatch.name,
          email: studentMatch.email,
          role: 'student',
          student_id: studentMatch.student_id,
        };
        setCurrentUser(studentUser);
        setCurrentPage('student-dashboard');
        showToast(`Welcome back, ${studentMatch.name}!`, 'success');
        return true;
      }
    }

    showToast('Invalid credentials. Please verify your email or use quick demo login.', 'error');
    return false;
  };

  const quickLoginAs = (role: 'admin' | 'student') => {
    if (role === 'admin') {
      const admin = INITIAL_USERS[0];
      setCurrentUser(admin);
      setCurrentPage('admin-dashboard');
      showToast('Switched to Admin Role (Dr. Arthur Vance)', 'info');
    } else {
      const stu = INITIAL_USERS[1];
      setCurrentUser(stu);
      setCurrentPage('student-dashboard');
      showToast('Switched to Student Role (Aarav Sharma)', 'info');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    showToast('Logged out successfully', 'info');
  };

  const registerStudent = (data: {
    student_id: string;
    name: string;
    email: string;
    department: string;
    year: string;
    phone: string;
  }) => {
    const existing = students.find(
      (s) => s.student_id.toLowerCase() === data.student_id.toLowerCase() || s.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) {
      showToast('Student ID or Email is already registered in the system.', 'error');
      return { success: false, message: 'Student ID or Email already exists' };
    }

    const newStudent: Student = {
      student_id: data.student_id.toUpperCase(),
      name: data.name,
      email: data.email.toLowerCase(),
      department: data.department,
      year: data.year,
      phone: data.phone,
      cgpa: 8.5,
      section: 'A',
      created_at: new Date().toISOString().split('T')[0],
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Create user and auto log in
    const newUser: User = {
      id: Date.now(),
      name: newStudent.name,
      email: newStudent.email,
      role: 'student',
      student_id: newStudent.student_id,
    };
    setCurrentUser(newUser);
    setCurrentPage('student-dashboard');
    showToast('Account registered successfully! Welcome to Smart Campus.', 'success');
    return { success: true, message: 'Success' };
  };

  const addStudent = (student: Student) => {
    setStudents((prev) => [student, ...prev]);
    showToast(`Student ${student.name} added to database`, 'success');
  };

  const updateStudent = (student: Student) => {
    setStudents((prev) => prev.map((s) => (s.student_id === student.student_id ? student : s)));
    showToast(`Student record for ${student.name} updated`, 'success');
  };

  const deleteStudent = (student_id: string) => {
    setStudents((prev) => prev.filter((s) => s.student_id !== student_id));
    setAttendanceRecords((prev) => prev.filter((r) => r.student_id !== student_id));
    setComplaints((prev) => prev.filter((c) => c.student_id !== student_id));
    showToast(`Student ${student_id} removed from database`, 'info');
  };

  const markAttendance = (
    items: { student_id: string; status: AttendanceStatus }[],
    date: string,
    subject: string
  ) => {
    setAttendanceRecords((prev) => {
      // Remove any existing records for this student, date, and subject
      const remaining = prev.filter(
        (r) => !(r.date === date && r.subject === subject && items.some((i) => i.student_id === r.student_id))
      );
      const newItems: AttendanceRecord[] = items.map((item, idx) => ({
        id: Date.now() + idx,
        student_id: item.student_id,
        date,
        status: item.status,
        subject,
        recorded_by: currentUser?.name || 'Administrator',
      }));
      return [...newItems, ...remaining];
    });
    showToast(`Attendance marked for ${items.length} students on ${date}`, 'success');
  };

  const addAnnouncement = (item: Omit<Announcement, 'id' | 'created_at'>) => {
    const newAnn: Announcement = {
      ...item,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Announcement published across campus portal', 'success');
  };

  const submitComplaint = (data: {
    student_id: string;
    subject: string;
    category: any;
    description: string;
    attachment_name?: string;
    attachment_url?: string;
  }) => {
    const ticketNo = `CMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const student = students.find((s) => s.student_id === data.student_id);
    const newComplaint: Complaint = {
      id: Date.now(),
      ticket_no: ticketNo,
      student_id: data.student_id,
      student_name: student?.name || currentUser?.name || 'Student',
      department: student?.department || 'General',
      subject: data.subject,
      category: data.category,
      description: data.description,
      status: 'Pending',
      attachment_name: data.attachment_name,
      attachment_url: data.attachment_url,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    showToast(`Grievance submitted successfully. Ticket ID: ${ticketNo}`, 'success');
    return ticketNo;
  };

  const updateComplaintStatus = (id: number, status: ComplaintStatus, remarks?: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              admin_remarks: remarks || c.admin_remarks,
              updated_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : c
      )
    );
    showToast(`Ticket #${id} status updated to "${status}"`, 'success');
  };

  const getStudentAttendanceStats = (student_id: string) => {
    const stuRecords = attendanceRecords.filter((r) => r.student_id === student_id);
    const total = stuRecords.length;
    const present = stuRecords.filter((r) => r.status === 'Present').length;
    const late = stuRecords.filter((r) => r.status === 'Late').length;
    const absent = stuRecords.filter((r) => r.status === 'Absent').length;
    // Late counts as attended in percentage
    const attended = present + late;
    const percentage = total > 0 ? Math.round((attended / total) * 1000) / 10 : 0;
    return { total, present, absent, late, percentage };
  };

  const currentStudentProfile = currentUser?.student_id
    ? students.find((s) => s.student_id === currentUser.student_id) || null
    : null;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentPage,
        setCurrentPage,
        login,
        logout,
        quickLoginAs,
        registerStudent,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        attendanceRecords,
        markAttendance,
        announcements,
        addAnnouncement,
        complaints,
        submitComplaint,
        updateComplaintStatus,
        getStudentAttendanceStats,
        toasts,
        showToast,
        currentStudentProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
