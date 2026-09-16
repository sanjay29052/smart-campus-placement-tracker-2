import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  Calendar,
  Building,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { AttendanceStatus } from '../types';

export const AdminAttendanceManagement: React.FC = () => {
  const { students, attendanceRecords, markAttendance } = useApp();

  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedDept, setSelectedDept] = useState<string>('Computer Science & Engineering');
  const [subject, setSubject] = useState<string>('Cloud Computing & Architecture');

  // Local state for the students in this class
  const deptStudents = students.filter((s) => s.department === selectedDept);

  // Initialize status map
  const [statusMap, setStatusMap] = useState<{ [student_id: string]: AttendanceStatus }>({});

  // Sync initial statuses when dept changes or from existing records
  React.useEffect(() => {
    const map: { [student_id: string]: AttendanceStatus } = {};
    deptStudents.forEach((s) => {
      // Check if existing record exists for this student, date, and subject
      const existing = attendanceRecords.find(
        (r) => r.student_id === s.student_id && r.date === date && r.subject === subject
      );
      map[s.student_id] = existing ? existing.status : 'Present';
    });
    setStatusMap(map);
  }, [selectedDept, date, subject, attendanceRecords]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const markAll = (status: AttendanceStatus) => {
    const updated: { [student_id: string]: AttendanceStatus } = {};
    deptStudents.forEach((s) => {
      updated[s.student_id] = status;
    });
    setStatusMap(updated);
  };

  const handleSaveAttendance = () => {
    const items = deptStudents.map((s) => ({
      student_id: s.student_id,
      status: statusMap[s.student_id] || 'Present',
    }));

    markAttendance(items, date, subject);
  };

  const presentCount = Object.values(statusMap).filter((v) => v === 'Present').length;
  const lateCount = Object.values(statusMap).filter((v) => v === 'Late').length;
  const absentCount = Object.values(statusMap).filter((v) => v === 'Absent').length;
  const total = deptStudents.length;
  const sessionPct = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Information Technology',
    'Civil Engineering',
  ];

  const subjects = [
    'Cloud Computing & Architecture',
    'Database Management Systems',
    'Operating Systems & Kernel Dev',
    'Computer Networks & Protocols',
    'Design & Analysis of Algorithms',
    'Software Engineering & DevOps',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Faculty Attendance Register</h1>
          <p className="text-xs text-slate-500">
            Batch-marking console saving composite unique keys `(student_id, date, subject)` to RDS MySQL
          </p>
        </div>

        <button
          id="admin-save-attendance-btn"
          onClick={handleSaveAttendance}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save & Commit Attendance
        </button>
      </div>

      {/* Configuration & Selection Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-blue-600" />
            Select Department
          </label>
          <select
            id="admin-att-dept-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            Subject / Lecture Module
          </label>
          <select
            id="admin-att-subject-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Session Date
          </label>
          <input
            id="admin-att-date-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Session Quick Metrics Bar */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-semibold text-slate-800">Session Breakdown:</span>
          <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
            {presentCount} Present
          </span>
          <span className="text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
            {lateCount} Late
          </span>
          <span className="text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-full">
            {absentCount} Absent
          </span>
          <span className="text-slate-500">
            Attendance Rate: <strong className="text-slate-900">{sessionPct}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium mr-1">Bulk Actions:</span>
          <button
            id="bulk-all-present-btn"
            type="button"
            onClick={() => markAll('Present')}
            className="px-2.5 py-1 text-xs rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 font-semibold transition-colors"
          >
            All Present
          </button>
          <button
            id="bulk-all-absent-btn"
            type="button"
            onClick={() => markAll('Absent')}
            className="px-2.5 py-1 text-xs rounded-lg bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 font-semibold transition-colors"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Year & Sec</th>
                <th className="py-3 px-4">Attendance Status Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No students currently enrolled in {selectedDept}.
                  </td>
                </tr>
              ) : (
                deptStudents.map((s) => {
                  const currentStatus = statusMap[s.student_id] || 'Present';
                  return (
                    <tr key={s.student_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.student_id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{s.name}</td>
                      <td className="py-3 px-4 text-slate-500">{s.year} • Sec {s.section || 'A'}</td>
                      <td className="py-3 px-4">
                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student_id, 'Present')}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student_id, 'Late')}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                              currentStatus === 'Late'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student_id, 'Absent')}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
