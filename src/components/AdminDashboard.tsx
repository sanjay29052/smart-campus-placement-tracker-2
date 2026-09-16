import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  CalendarCheck,
  AlertCircle,
  Megaphone,
  ArrowRight,
  TrendingUp,
  UserPlus,
  CheckCircle2,
  Clock,
  Building,
  Server,
  Database,
  Cloud,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    attendanceRecords,
    complaints,
    announcements,
    setCurrentPage,
  } = useApp();

  const totalStudents = students.length;
  const totalAttendance = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const overallAttendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 89;

  const pendingComplaints = complaints.filter((c) => c.status === 'Pending');
  const inProgressComplaints = complaints.filter((c) => c.status === 'In Progress');

  // Department distribution
  const deptMap: { [key: string]: number } = {};
  students.forEach((s) => {
    deptMap[s.department] = (deptMap[s.department] || 0) + 1;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Admin Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Dean & Administrative Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Smart Campus Overview</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time monitoring across MySQL RDS tables • Academic Year 2026-27
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-dash-add-student-btn"
            onClick={() => setCurrentPage('admin-students')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            Manage Students
          </button>
          <button
            id="admin-dash-mark-att-btn"
            onClick={() => setCurrentPage('admin-attendance')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
            Take Attendance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setCurrentPage('admin-students')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Total Registered Scholars</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalStudents}</span>
            <span className="text-xs text-emerald-600 font-semibold">+100% active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Persisted in MySQL `students` table</p>
        </div>

        {/* Campus Attendance Rate */}
        <div
          onClick={() => setCurrentPage('admin-attendance')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Campus Attendance Rate</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{overallAttendanceRate}%</span>
            <span className="text-xs text-slate-400">across depts</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${overallAttendanceRate}%` }}
            ></div>
          </div>
        </div>

        {/* Open Complaints */}
        <div
          onClick={() => setCurrentPage('admin-complaints')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Grievances Awaiting Action</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-700">{pendingComplaints.length}</span>
            <span className="text-xs text-slate-500">pending ({inProgressComplaints.length} active)</span>
          </div>
          <p className="text-[11px] text-amber-600 mt-3 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" /> Fast resolution required
          </p>
        </div>

        {/* Notices Active */}
        <div
          onClick={() => setCurrentPage('announcements')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Circulars Published</span>
            <Megaphone className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-700">{announcements.length}</span>
            <span className="text-xs text-slate-400">broadcasted</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Live on campus portal</p>
        </div>
      </div>

      {/* Two Column Layout: Department Distribution + Recent Pending Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Distribution */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              Enrollment by Department
            </h3>
            <span className="text-xs text-slate-400">{Object.keys(deptMap).length} Engineering Branches</span>
          </div>

          <div className="space-y-3">
            {Object.entries(deptMap).map(([dept, count]) => {
              const pct = Math.round((count / totalStudents) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{dept}</span>
                    <span className="text-slate-500 font-mono">
                      {count} scholars ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgent Grievances Queue */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Pending Grievances Queue
            </h3>
            <button
              onClick={() => setCurrentPage('admin-complaints')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Open Resolver Console
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {complaints.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">{c.ticket_no}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{c.subject}</p>
                  <p className="text-[11px] text-slate-500">
                    By {c.student_name} ({c.student_id}) • {c.category}
                  </p>
                </div>

                <button
                  onClick={() => setCurrentPage('admin-complaints')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-[11px] font-semibold text-slate-700 shrink-0"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
