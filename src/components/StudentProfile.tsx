import React from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  Heart,
  MapPin,
  Shield,
  CalendarCheck,
  Award,
  IdCard,
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentStudentProfile, currentUser, getStudentAttendanceStats } = useApp();

  const profile = currentStudentProfile || {
    student_id: currentUser?.student_id || 'STU2022001',
    name: currentUser?.name || 'Aarav Sharma',
    email: currentUser?.email || 'aarav.cse@smartcampus.edu',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    phone: '+91 98765 43210',
    cgpa: 8.85,
    section: 'A',
    guardian_name: 'Rajesh Sharma',
    guardian_phone: '+91 98765 43219',
    blood_group: 'B+',
    address: 'Block 4, Sunrise Apartments, Tech City',
    created_at: '2022-08-15',
  };

  const stats = getStudentAttendanceStats(profile.student_id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
        <p className="text-xs text-slate-500">Official college record and credentials</p>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-md shrink-0">
          {profile.name.charAt(0)}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-xs text-slate-500 font-mono">Student ID: {profile.student_id}</p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 self-center sm:self-start">
              Active Scholar
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              {profile.department}
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              {profile.year} • Sec {profile.section || 'A'}
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              CGPA: {profile.cgpa} / 10.0
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Academic Information & Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Personal Information */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Personal & Contact Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Institutional Email
              </span>
              <span className="font-medium text-slate-900">{profile.email}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
              </span>
              <span className="font-medium text-slate-900">{profile.phone}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-slate-400" /> Blood Group
              </span>
              <span className="font-medium text-slate-900">{profile.blood_group || 'O+'}</span>
            </div>

            <div className="flex items-start justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Residential Address
              </span>
              <span className="font-medium text-slate-900 text-right max-w-xs">{profile.address || 'Tech City Campus'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Admission Date
              </span>
              <span className="font-medium text-slate-900">{profile.created_at || '2022-08-15'}</span>
            </div>
          </div>
        </div>

        {/* Guardian & Emergency Details */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            Guardian & Academic Records
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Guardian Name</span>
              <span className="font-medium text-slate-900">{profile.guardian_name || 'Rajesh Sharma'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Guardian Contact</span>
              <span className="font-medium text-slate-900">{profile.guardian_phone || '+91 98765 43219'}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Attendance Percentage</span>
              <span className={`font-bold ${stats.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stats.percentage}% ({stats.present + stats.late}/{stats.total} sessions)
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Examination Eligibility</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${stats.percentage >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {stats.percentage >= 75 ? 'Eligible for Hall Ticket' : 'Attendance Shortage'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-500">Library Card Status</span>
              <span className="font-medium text-emerald-600">Active (0 dues)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Campus Identity Badge Widget */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <IdCard className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Smart Campus Digital ID</h4>
            <p className="text-xs text-slate-400">Secure Barcode & RFID Identity Linked to AWS RDS Database</p>
          </div>
        </div>

        <div className="text-center sm:text-right font-mono text-xs text-slate-300">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700">
            RFID: <span className="text-blue-400 font-bold">RFID-99482-SC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
