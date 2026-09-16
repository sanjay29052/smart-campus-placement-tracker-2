import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthPages } from './components/AuthPages';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentProfile } from './components/StudentProfile';
import { StudentAttendance } from './components/StudentAttendance';
import { AnnouncementsPage } from './components/AnnouncementsPage';
import { ComplaintSubmit } from './components/ComplaintSubmit';
import { ComplaintTrack } from './components/ComplaintTrack';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminStudentManagement } from './components/AdminStudentManagement';
import { AdminAttendanceManagement } from './components/AdminAttendanceManagement';
import { AdminComplaintManagement } from './components/AdminComplaintManagement';
import { CloudArchitectureHub } from './components/CloudArchitectureHub';

const MainLayout: React.FC = () => {
  const { currentPage, currentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on landing or auth pages, render without sidebar
  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  if (currentPage === 'login' || currentPage === 'register') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 flex items-center justify-center p-4">
          <AuthPages />
        </main>
      </div>
    );
  }

  // Render main dashboard frame with sidebar & top navbar
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'student-dashboard':
        return <StudentDashboard />;
      case 'student-profile':
        return <StudentProfile />;
      case 'attendance':
        return <StudentAttendance />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'complaint-submit':
        return <ComplaintSubmit />;
      case 'complaint-track':
        return <ComplaintTrack />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-students':
        return <AdminStudentManagement />;
      case 'admin-attendance':
        return <AdminAttendanceManagement />;
      case 'admin-complaints':
        return <AdminComplaintManagement />;
      case 'aws-architecture':
        return <CloudArchitectureHub />;
      default:
        return currentUser?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-white h-full shadow-2xl p-4 overflow-y-auto z-10 flex flex-col">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Navigation Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-slate-500 font-bold p-1"
                >
                  ✕
                </button>
              </div>
              <div onClick={() => setMobileMenuOpen(false)}>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
