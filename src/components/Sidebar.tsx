import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Megaphone,
  AlertCircle,
  FilePlus,
  Search,
  User,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { PageId } from '../types';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    currentPage,
    setCurrentPage,
    getStudentAttendanceStats,
    complaints,
  } = useApp();

  const role = currentUser?.role;

  const studentStats = currentUser?.student_id
    ? getStudentAttendanceStats(currentUser.student_id)
    : null;

  const pendingComplaintsCount = complaints.filter((c) => c.status === 'Pending').length;

  interface NavItem {
    id: PageId;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }

  const studentNav: NavItem[] = [
    {
      id: 'student-dashboard',
      label: 'Student Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'student-profile',
      label: 'Personal Profile',
      icon: <User className="w-4 h-4" />,
    },
    {
      id: 'attendance',
      label: 'My Attendance',
      icon: <CalendarCheck className="w-4 h-4" />,
      badge: studentStats ? `${studentStats.percentage}%` : undefined,
      badgeColor: (studentStats?.percentage || 0) >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800',
    },
    {
      id: 'announcements',
      label: 'Campus Notices',
      icon: <Megaphone className="w-4 h-4" />,
    },
    {
      id: 'complaint-submit',
      label: 'Submit Grievance',
      icon: <FilePlus className="w-4 h-4" />,
    },
    {
      id: 'complaint-track',
      label: 'Track Grievances',
      icon: <Search className="w-4 h-4" />,
    },
  ];

  const adminNav: NavItem[] = [
    {
      id: 'admin-dashboard',
      label: 'Admin Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'admin-students',
      label: 'Student Directory',
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'admin-attendance',
      label: 'Mark Attendance',
      icon: <CalendarCheck className="w-4 h-4" />,
    },
    {
      id: 'admin-complaints',
      label: 'Complaints Portal',
      icon: <AlertCircle className="w-4 h-4" />,
      badge: pendingComplaintsCount > 0 ? pendingComplaintsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'announcements',
      label: 'Post Announcements',
      icon: <Megaphone className="w-4 h-4" />,
    },
  ];

  const navItems = role === 'admin' ? adminNav : studentNav;

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 shrink-0 min-h-[calc(100vh-4.5rem)] flex flex-col justify-between p-4 border-r border-slate-800">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-xs">
            {role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{currentUser?.name || 'Guest User'}</h4>
            <p className="text-xs text-slate-400 capitalize flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              {role === 'admin' ? 'College Admin' : currentUser?.student_id || 'Student'}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            {role === 'admin' ? 'Administration' : 'Student Services'}
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Cloud Hub shortcut */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
            Architecture & Interview
          </div>
          <button
            id="sidebar-aws-hub-btn"
            onClick={() => setCurrentPage('aws-architecture')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentPage === 'aws-architecture'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-amber-300/80 hover:bg-slate-800 hover:text-amber-200'
            }`}
          >
            <Cloud className="w-4 h-4 text-amber-400" />
            <span>AWS & Flask Guide</span>
          </button>
        </div>
      </div>

      {/* Footer Cloud Infrastructure Status Card */}
      <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1.5">
        <div className="flex items-center justify-between text-slate-400 font-medium">
          <span>Infrastructure</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Healthy
          </span>
        </div>
        <div className="text-[10px] text-slate-500 space-y-0.5">
          <p>• AWS EC2: Ubuntu 22.04 LTS</p>
          <p>• AWS RDS: MySQL 8.0 Engine</p>
          <p>• AWS S3: Active Bucket</p>
        </div>
      </div>
    </aside>
  );
};
