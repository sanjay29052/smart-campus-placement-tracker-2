import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  MessageSquare,
  X,
  Image,
  User,
  Building,
} from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

export const AdminComplaintManagement: React.FC = () => {
  const { complaints, updateComplaintStatus } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Selected complaint for resolution modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [remarks, setRemarks] = useState('');

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.ticket_no.toLowerCase().includes(search.toLowerCase()) ||
      c.student_name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCat = categoryFilter === 'All' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleOpenAction = (c: Complaint) => {
    setSelectedComplaint(c);
    setNewStatus(c.status);
    setRemarks(c.admin_remarks || '');
  };

  const handleSaveResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    updateComplaintStatus(selectedComplaint.id, newStatus, remarks);
    setSelectedComplaint(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campus Grievances & Redressal Desk</h1>
          <p className="text-xs text-slate-500">
            Review student facility complaints, inspect S3 evidence, and dispatch maintenance technicians
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold">
            {complaints.filter((c) => c.status === 'Pending').length} Pending Review
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
            {complaints.filter((c) => c.status === 'In Progress').length} In Progress
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            id="admin-complaints-search-input"
            type="text"
            placeholder="Search by ticket no, student, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              id="admin-complaints-filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
            <span>Category:</span>
            <select
              id="admin-complaints-filter-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Hostel">Hostel</option>
              <option value="Academics">Academics</option>
              <option value="Mess & Canteen">Mess & Canteen</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Transport">Transport</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Subject & Category</th>
                <th className="py-3 px-4">AWS S3 Attachment</th>
                <th className="py-3 px-4">Date Filed</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No complaints match the specified filter.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{c.ticket_no}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{c.student_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{c.student_id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 line-clamp-1">{c.subject}</div>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {c.attachment_url ? (
                        <a
                          href={c.attachment_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold text-[11px]"
                        >
                          <Image className="w-3.5 h-3.5" />
                          View S3 File
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No file</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{c.created_at}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : c.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status === 'Resolved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {c.status === 'In Progress' && <Clock className="w-3 h-3 text-blue-600" />}
                        {c.status === 'Pending' && <AlertCircle className="w-3 h-3 text-amber-600" />}
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenAction(c)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution & Status Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Ticket {selectedComplaint.ticket_no}
                </h3>
                <p className="text-xs text-slate-500">
                  By {selectedComplaint.student_name} ({selectedComplaint.student_id})
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-800">{selectedComplaint.subject}</p>
              <p className="text-slate-600 leading-relaxed">{selectedComplaint.description}</p>
              {selectedComplaint.attachment_url && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-slate-400">AWS S3 Attachment:</span>
                  <a
                    href={selectedComplaint.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    Open Photo Evidence <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveResolution} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ticket Resolution Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress (Assigned to Maintenance)</option>
                  <option value="Resolved">Resolved (Work Completed)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Remarks / Action Taken
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Electrician deployed to Hostel C. Replaced damaged circuit breaker and tested voltage."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="admin-save-resolution-btn"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm"
                >
                  Save & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
