import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Download,
  AlertTriangle,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { AttendanceStatus } from '../types';

export const StudentAttendance: React.FC = () => {
  const { currentUser, attendanceRecords, getStudentAttendanceStats } = useApp();

  const studentId = currentUser?.student_id || 'STU2022001';
  const stats = getStudentAttendanceStats(studentId);

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Filter records
  const myRecords = attendanceRecords.filter((r) => r.student_id === studentId);

  const subjects = Array.from(new Set(myRecords.map((r) => r.subject || 'General Lecture')));

  const filteredRecords = myRecords.filter((r) => {
    const matchesSub = selectedSubject === 'All' || r.subject === selectedSubject;
    const matchesStat = selectedStatus === 'All' || r.status === selectedStatus;
    return matchesSub && matchesStat;
  });

  const isSafe = stats.percentage >= 75;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Log & Records</h1>
          <p className="text-xs text-slate-500">
            Student: <span className="font-semibold text-slate-700">{studentId}</span> • Automated session-by-session sync
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start sm:self-auto px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          Download Statement (PDF)
        </button>
      </div>

      {/* Analytics Summary Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Progress Gauge */}
        <div className="md:col-span-1 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isSafe ? 'text-emerald-500' : 'text-rose-500'}
                strokeDasharray={`${stats.percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-xl font-extrabold ${isSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
                {stats.percentage}%
              </span>
              <span className="text-[9px] text-slate-400 font-medium">ATTENDANCE</span>
            </div>
          </div>
          <span className={`mt-2 text-xs font-semibold ${isSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isSafe ? 'Criteria Satisfied' : 'Action Required'}
          </span>
        </div>

        {/* Detailed counts */}
        <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs text-slate-500 block mb-1">Total Classes</span>
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            <span className="text-[10px] text-slate-400 block mt-1">Conducted sessions</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
            <span className="text-xs text-emerald-800 block mb-1">Present</span>
            <span className="text-2xl font-bold text-emerald-700">{stats.present}</span>
            <span className="text-[10px] text-emerald-600 block mt-1">Full credit</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-xs text-amber-800 block mb-1">Late Marked</span>
            <span className="text-2xl font-bold text-amber-700">{stats.late}</span>
            <span className="text-[10px] text-amber-600 block mt-1">Within grace period</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/60">
            <span className="text-xs text-rose-800 block mb-1">Absent</span>
            <span className="text-2xl font-bold text-rose-700">{stats.absent}</span>
            <span className="text-[10px] text-rose-600 block mt-1">Missed sessions</span>
          </div>
        </div>
      </div>

      {/* Filters & Daily Attendance Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Daily Attendance Log</h3>
            <span className="text-xs text-slate-500">({filteredRecords.length} records)</span>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Subject:</span>
              <select
                id="filter-subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-transparent text-slate-800 font-medium focus:outline-none"
              >
                <option value="All">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200">
              <span>Status:</span>
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-slate-800 font-medium focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Subject / Course</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No attendance records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-800 font-medium">{r.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.subject || 'Core Lecture'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          r.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'Late'
                            ? 'bg-amber-100 text-amber-800'
                            : r.status === 'Leave'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.status === 'Present' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {r.status === 'Late' && <Clock className="w-3 h-3 text-amber-600" />}
                        {r.status === 'Absent' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{r.recorded_by || 'Faculty Console'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
