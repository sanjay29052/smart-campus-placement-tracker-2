import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  CalendarCheck,
  AlertCircle,
  Megaphone,
  ArrowRight,
  TrendingUp,
  FilePlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    currentStudentProfile,
    setCurrentPage,
    getStudentAttendanceStats,
    complaints,
    announcements,
  } = useApp();

  const studentId = currentUser?.student_id || 'STU2022001';
  const stats = getStudentAttendanceStats(studentId);

  const myComplaints = complaints.filter((c) => c.student_id === studentId);
  const myPendingComplaints = myComplaints.filter((c) => c.status === 'Pending' || c.status === 'In Progress');

  const isAttendanceSafe = stats.percentage >= 75;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-blue-200 text-xs font-medium">
              <span>Semester Autumn 2026</span>
              <span>•</span>
              <span>{currentStudentProfile?.department || 'Engineering'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {currentUser?.name || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90">
              Student ID: <span className="font-mono font-semibold">{studentId}</span> | Year: {currentStudentProfile?.year || '3rd Year'} | Section: {currentStudentProfile?.section || 'A'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="student-dash-attendance-btn"
              onClick={() => setCurrentPage('attendance')}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-semibold text-xs shadow-xs hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <CalendarCheck className="w-4 h-4 text-blue-700" />
              View Attendance
            </button>
            <button
              id="student-dash-complaint-btn"
              onClick={() => setCurrentPage('complaint-submit')}
              className="px-4 py-2 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-1.5"
            >
              <FilePlus className="w-4 h-4" />
              New Complaint
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Percentage Card */}
        <div
          onClick={() => setCurrentPage('attendance')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Attendance Rate</span>
            <CalendarCheck className={`w-4 h-4 ${isAttendanceSafe ? 'text-emerald-600' : 'text-rose-600'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${isAttendanceSafe ? 'text-emerald-700' : 'text-rose-700'}`}>
              {stats.percentage}%
            </span>
            <span className="text-xs text-slate-400">/ 100%</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${isAttendanceSafe ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(stats.percentage, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
            {isAttendanceSafe ? (
              <span className="text-emerald-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Eligible for End-Sem Exam (≥ 75%)
              </span>
            ) : (
              <span className="text-rose-600 flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3" /> Warning: Below 75% threshold
              </span>
            )}
          </p>
        </div>

        {/* Classes Attended Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Lectures Attended</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.present + stats.late}</span>
            <span className="text-xs text-slate-500">conducted: {stats.total}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
              {stats.present} On-time
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
              {stats.late} Late
            </span>
            <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-medium">
              {stats.absent} Absent
            </span>
          </div>
        </div>

        {/* Active Grievances Card */}
        <div
          onClick={() => setCurrentPage('complaint-track')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">My Grievances</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{myComplaints.length}</span>
            <span className="text-xs text-slate-500">tickets filed</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-amber-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {myPendingComplaints.length} In Progress / Pending
            </span>
            <span className="text-blue-600 hover:underline">Track →</span>
          </div>
        </div>

        {/* Academic Performance Card */}
        <div
          onClick={() => setCurrentPage('student-profile')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Current CGPA</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-700">
              {currentStudentProfile?.cgpa || 8.85}
            </span>
            <span className="text-xs text-slate-400">/ 10.0</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            Academic Status: <span className="font-semibold text-emerald-600">First Class with Distinction</span>
          </p>
        </div>
      </div>

      {/* Two Column Layout: Announcements + Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Latest Campus Announcements */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">Campus Notices & Circulars</h3>
            </div>
            <button
              onClick={() => setCurrentPage('announcements')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All ({announcements.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : item.priority === 'important'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.priority.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400">{item.created_at}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="text-[10px] text-slate-500 pt-1">
                  Posted by: <span className="font-medium text-slate-700">{item.author}</span> • Dept: {item.department}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: My Complaint Status Tracking */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-900">Recent Grievances</h3>
            </div>
            <button
              onClick={() => setCurrentPage('complaint-submit')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              + Submit New
            </button>
          </div>

          {myComplaints.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
              <p className="text-xs font-medium text-slate-600">No active grievances logged.</p>
              <p className="text-[11px] text-slate-400">Any issues with campus facilities can be submitted here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myComplaints.slice(0, 3).map((c) => (
                <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-blue-700">{c.ticket_no}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{c.subject}</p>
                  <p className="text-[11px] text-slate-500">{c.category} • Filed on {c.created_at}</p>
                  {c.admin_remarks && (
                    <div className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-700 mt-1">
                      <span className="font-semibold text-slate-900">Admin Remark: </span>
                      {c.admin_remarks}
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => setCurrentPage('complaint-track')}
                className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Track All My Tickets
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
