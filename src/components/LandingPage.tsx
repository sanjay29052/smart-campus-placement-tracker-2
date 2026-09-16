import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Cloud,
  Database,
  Server,
  ShieldCheck,
  CalendarCheck,
  Megaphone,
  AlertCircle,
  Users,
  ArrowRight,
  CheckCircle2,
  Lock,
  HardDrive,
  FileCode,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setCurrentPage,
    students,
    attendanceRecords,
    complaints,
    announcements,
    quickLoginAs,
  } = useApp();

  const totalStudents = students.length;
  const totalAttendance = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const avgAttendance = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 89;
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
            <Cloud className="w-3.5 h-3.5" />
            Cloud-Native Architecture • AWS EC2 & RDS MySQL
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Smart Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Monitoring System</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                An integrated, cloud-deployed college management platform designed for automated student records, attendance analytics, departmental announcements, and grievance redressal backed by AWS S3.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="landing-student-login-btn"
                  onClick={() => quickLoginAs('student')}
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Launch Student Portal
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="landing-admin-login-btn"
                  onClick={() => quickLoginAs('admin')}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Admin Console
                </button>

                <button
                  id="landing-architecture-btn"
                  onClick={() => setCurrentPage('aws-architecture')}
                  className="px-4 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm font-semibold transition-all flex items-center gap-2"
                >
                  <FileCode className="w-4 h-4" />
                  Architecture & Code
                </button>
              </div>

              {/* Cloud Architecture Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1">
                    <Server className="w-3.5 h-3.5" />
                    AWS EC2
                  </div>
                  <p className="text-[11px] text-slate-400">Gunicorn WSGI & Nginx on Ubuntu</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                    <Database className="w-3.5 h-3.5" />
                    AWS RDS
                  </div>
                  <p className="text-[11px] text-slate-400">MySQL 8.0 Relational Engine</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
                    <HardDrive className="w-3.5 h-3.5" />
                    AWS S3
                  </div>
                  <p className="text-[11px] text-slate-400">Object Store for Complaint Media</p>
                </div>
              </div>
            </div>

            {/* Right Card: Live System Metrics */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-2xl backdrop-blur-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Campus Live Metrics</h3>
                    <p className="text-xs text-slate-400">Real-time synchronized across AWS</p>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                      <span>Total Students</span>
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">{totalStudents}</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Active profiles in RDS</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                      <span>Avg Attendance</span>
                      <CalendarCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">{avgAttendance}%</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Across all departments</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                      <span>Open Grievances</span>
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-amber-400">{pendingComplaints}</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Pending admin review</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                      <span>Notices Published</span>
                      <Megaphone className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-2xl font-bold text-indigo-300">{announcements.length}</div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Campus circulars</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Ready for resume presentation. Features full Flask source code, relational MySQL schemas, and interview question guides.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Functional Modules */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setCurrentPage('student-dashboard')}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Student Portal</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Personalized dashboard with timetable, course analytics, attendance percentage, and academic status.
            </p>
          </div>

          <div
            onClick={() => setCurrentPage('attendance')}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Smart Attendance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time daily logs, 75% minimum threshold warning, subject-wise breakdowns, and admin bulk marking.
            </p>
          </div>

          <div
            onClick={() => setCurrentPage('complaint-submit')}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">AWS S3 Grievances</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload photo evidence directly to AWS S3, generate ticket IDs, and track real-time resolution remarks.
            </p>
          </div>

          <div
            onClick={() => setCurrentPage('announcements')}
            className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Megaphone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Campus Bulletins</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Department-targeted circulars, exam schedules, urgent warnings, and campus hackathon alerts.
            </p>
          </div>
        </div>
      </section>

      {/* Cloud Architecture Diagram Explainer */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Cloud Deployment Flow</span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">End-to-End System Architecture</h2>
            </div>
            <button
              onClick={() => setCurrentPage('aws-architecture')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <FileCode className="w-4 h-4 text-amber-400" />
              View Flask Source & Deployment Steps
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h4 className="font-semibold text-sm text-slate-900">User / Client</h4>
              <p className="text-xs text-slate-500 mt-1">
                Responsive SPA / HTML5 / CSS3 making asynchronous REST requests
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h4 className="font-semibold text-sm text-slate-900">AWS EC2 Server</h4>
              <p className="text-xs text-slate-500 mt-1">
                Nginx reverse proxy + Gunicorn WSGI running Python Flask Blueprints
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h4 className="font-semibold text-sm text-slate-900">AWS RDS MySQL</h4>
              <p className="text-xs text-slate-500 mt-1">
                Multi-AZ Relational database storing users, students, attendance, and logs
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h4 className="font-semibold text-sm text-slate-900">AWS S3 Bucket</h4>
              <p className="text-xs text-slate-500 mt-1">
                Scalable cloud storage for complaint proof images, PDFs, and attachments
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
