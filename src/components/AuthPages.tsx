import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Building,
  Calendar,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PageId } from '../types';

interface AuthPagesProps {
  mode: 'login' | 'register' | 'admin-login';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode }) => {
  const { login, registerStudent, setCurrentPage, quickLoginAs } = useApp();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Student register specific states
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('1st Year');
  const [phone, setPhone] = useState('');

  const [formError, setFormError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Please provide both email and password.');
      return;
    }

    const role = mode === 'admin-login' ? 'admin' : 'student';
    const success = login(role, email, password);
    if (!success) {
      setFormError(
        mode === 'admin-login'
          ? 'Invalid admin credentials. Use admin@smartcampus.edu or click Demo Admin.'
          : 'Invalid credentials. Use demo email aarav.cse@smartcampus.edu or click Quick Demo.'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!studentId || !name || !email || !phone || !password) {
      setFormError('Please fill in all mandatory fields.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    const res = registerStudent({
      student_id: studentId,
      name,
      email,
      department,
      year,
      phone,
      password,
    });

    if (!res.success) {
      setFormError(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-100/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-3">
            {mode === 'admin-login' ? <ShieldCheck className="w-8 h-8 text-amber-300" /> : <GraduationCap className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === 'admin-login'
              ? 'Administrator Sign In'
              : mode === 'register'
              ? 'Create Student Account'
              : 'Sign in to Smart Campus'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'admin-login'
              ? 'Authorized faculty & administration console'
              : mode === 'register'
              ? 'Register with your college roll number and email'
              : 'Access your student dashboard, attendance, and grievances'}
          </p>
        </div>

        {/* Quick Demo Credentials Assistant Box */}
        <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-900 space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Quick Demo Fill (Instant Access)
            </span>
          </div>
          <p className="text-[11px] text-blue-700">
            For testing and interview demonstration, bypass manual typing with 1 click:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {mode === 'admin-login' ? (
              <button
                type="button"
                id="demo-fill-admin-btn"
                onClick={() => {
                  setEmail('admin@smartcampus.edu');
                  setPassword('admin@123');
                  quickLoginAs('admin');
                }}
                className="px-2.5 py-1 rounded bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors text-[11px]"
              >
                1-Click Login as Dean (Admin)
              </button>
            ) : (
              <>
                <button
                  type="button"
                  id="demo-fill-student-btn"
                  onClick={() => {
                    setEmail('aarav.cse@smartcampus.edu');
                    setPassword('student@123');
                    quickLoginAs('student');
                  }}
                  className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-[11px]"
                >
                  1-Click Login as Aarav (Student)
                </button>
                <button
                  type="button"
                  id="demo-fill-admin-switch-btn"
                  onClick={() => setCurrentPage('admin-login')}
                  className="px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-300 font-medium hover:bg-slate-50 transition-colors text-[11px]"
                >
                  Go to Admin Login
                </button>
              </>
            )}
          </div>
        </div>

        {formError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {formError}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {mode === 'register' ? (
            /* Student Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Roll / Registration ID *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="reg-student-id"
                    type="text"
                    required
                    placeholder="e.g. STU2024099"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="e.g. Sanjay Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department *
                  </label>
                  <select
                    id="reg-department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Computer Science & Engineering">Computer Science</option>
                    <option value="Electronics & Communication">Electronics & Comm.</option>
                    <option value="Mechanical Engineering">Mechanical Eng.</option>
                    <option value="Information Technology">Information Tech</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Year *
                  </label>
                  <select
                    id="reg-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="student@smartcampus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Password (min. 6 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="submit-register-btn"
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                Complete Registration
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentPage('login')}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Login Form (Student or Admin) */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {mode === 'admin-login' ? 'Admin Institutional Email' : 'Email Address or Student ID'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="login-email-input"
                    type="text"
                    required
                    placeholder={mode === 'admin-login' ? 'admin@smartcampus.edu' : 'aarav.cse@smartcampus.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="submit-login-btn"
                className={`w-full py-2.5 px-4 rounded-lg text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 ${
                  mode === 'admin-login' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {mode === 'admin-login' ? 'Sign In as Administrator' : 'Sign In to Student Portal'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                {mode === 'admin-login' ? (
                  <button
                    type="button"
                    onClick={() => setCurrentPage('login')}
                    className="text-blue-600 hover:underline"
                  >
                    Switch to Student Login
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('register')}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      New Student? Register
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage('admin-login')}
                      className="text-slate-600 hover:text-amber-700 font-medium"
                    >
                      Admin Portal →
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
