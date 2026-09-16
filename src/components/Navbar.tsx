import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Cloud,
  UserCheck,
  Shield,
  LogOut,
  Menu,
  X,
  Code2,
  FileText,
  User as UserIcon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentPage,
    setCurrentPage,
    logout,
    quickLoginAs,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top AWS Cloud Status Banner for Freshers / Interviewers */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AWS EC2 & RDS Active
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">MySQL 8.0 Connected</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">AWS S3 Bucket: smart-campus-attachments-prod</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden lg:inline">Role Switcher:</span>
          <button
            id="quick-switch-student"
            onClick={() => quickLoginAs('student')}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              currentUser?.role === 'student'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Student View
          </button>
          <button
            id="quick-switch-admin"
            onClick={() => quickLoginAs('admin')}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              currentUser?.role === 'admin'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Shield className="w-3 h-3" />
            Admin View
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentPage(currentUser?.role === 'admin' ? 'admin-dashboard' : currentUser?.role === 'student' ? 'student-dashboard' : 'home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight">Smart Campus</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  Cloud Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Academic & Facility Monitoring System</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-home-btn"
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview
            </button>
            <button
              id="nav-announcements-btn"
              onClick={() => setCurrentPage('announcements')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'announcements' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Announcements
            </button>
            {currentUser?.role === 'student' && (
              <>
                <button
                  id="nav-student-dash-btn"
                  onClick={() => setCurrentPage('student-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'student-dashboard' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  id="nav-student-attendance-btn"
                  onClick={() => setCurrentPage('attendance')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'attendance' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Attendance
                </button>
                <button
                  id="nav-student-complaint-btn"
                  onClick={() => setCurrentPage('complaint-track')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'complaint-track' || currentPage === 'complaint-submit' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Complaints
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <button
                  id="nav-admin-dash-btn"
                  onClick={() => setCurrentPage('admin-dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'admin-dashboard' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Admin Console
                </button>
                <button
                  id="nav-admin-students-btn"
                  onClick={() => setCurrentPage('admin-students')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'admin-students' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Students
                </button>
                <button
                  id="nav-admin-attendance-btn"
                  onClick={() => setCurrentPage('admin-attendance')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'admin-attendance' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Attendance
                </button>
                <button
                  id="nav-admin-complaints-btn"
                  onClick={() => setCurrentPage('admin-complaints')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 'admin-complaints' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Complaints
                </button>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="open-aws-architecture-btn"
              onClick={() => setCurrentPage('aws-architecture')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all shadow-xs ${
                currentPage === 'aws-architecture'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white hover:bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              <Cloud className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">AWS & Flask Code</span>
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded text-[10px]">Resume Prep</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 ml-2">
                <div
                  onClick={() => setCurrentPage(currentUser.role === 'admin' ? 'admin-dashboard' : 'student-profile')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
                  title="View Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight">{currentUser.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{currentUser.role}</p>
                  </div>
                </div>

                <button
                  id="user-logout-btn"
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => setCurrentPage('login')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => setCurrentPage('register')}
                  className="px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
          >
            Overview
          </button>
          <button
            onClick={() => { setCurrentPage('announcements'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
          >
            Campus Announcements
          </button>
          {currentUser?.role === 'student' && (
            <>
              <button
                onClick={() => { setCurrentPage('student-dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Student Dashboard
              </button>
              <button
                onClick={() => { setCurrentPage('student-profile'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                My Profile
              </button>
              <button
                onClick={() => { setCurrentPage('attendance'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Attendance Log
              </button>
              <button
                onClick={() => { setCurrentPage('complaint-submit'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Submit Complaint
              </button>
              <button
                onClick={() => { setCurrentPage('complaint-track'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Track Complaints
              </button>
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <button
                onClick={() => { setCurrentPage('admin-dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Admin Dashboard
              </button>
              <button
                onClick={() => { setCurrentPage('admin-students'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Student Directory
              </button>
              <button
                onClick={() => { setCurrentPage('admin-attendance'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Manage Attendance
              </button>
              <button
                onClick={() => { setCurrentPage('admin-complaints'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                Manage Complaints
              </button>
            </>
          )}

          <button
            onClick={() => { setCurrentPage('aws-architecture'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-amber-800 bg-amber-50"
          >
            AWS Architecture & Interview Prep
          </button>
        </div>
      )}
    </header>
  );
};
